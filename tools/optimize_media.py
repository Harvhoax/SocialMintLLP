"""Offline media build. Requires Pillow + ffmpeg/ffprobe; never runs on Netlify.

Original public files remain available for existing links. New page references
use content-fingerprinted files so browsers can reuse them without requests.
Run from the repository root: python tools/optimize_media.py
"""
from pathlib import Path
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor
import base64
import hashlib
import json
import re
import subprocess
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
OUTPUT = PUBLIC / 'media'
ASSETS = {}
REPORT = {'images': [], 'videos': []}


def fingerprint(folder, stem, extension, data):
    digest = hashlib.sha256(data).hexdigest()[:12]
    target = OUTPUT / folder / f'{stem}.{digest}.{extension}'
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.exists():
        target.write_bytes(data)
    return '/' + target.relative_to(PUBLIC).as_posix()


def webp(data, maximum=960, quality=77):
    image = ImageOps.exif_transpose(Image.open(BytesIO(data)))
    image.thumbnail((maximum, maximum), Image.Resampling.LANCZOS)
    if image.mode not in ('RGB', 'RGBA'):
        image = image.convert('RGBA' if 'transparency' in image.info else 'RGB')
    result = BytesIO()
    # Do not copy EXIF, GPS or other source metadata into public derivatives.
    image.save(result, 'WEBP', quality=quality, method=6)
    return result.getvalue()


images = sorted((PUBLIC / 'hero').glob('*.jpg'))
images += [PUBLIC / 'team' / name for name in ['partner-01.png', 'partner-02.jpg', 'partner-03.jpg']]
images += sorted((PUBLIC / 'reels').glob('*.jpg'))
images += [PUBLIC / 'brand/logo.png']
for source in images:
    relative = source.relative_to(PUBLIC)
    maximum = 720 if relative.parts[0] == 'hero' else 640 if relative.parts[0] == 'team' else 960
    data = webp(source.read_bytes(), maximum)
    url = fingerprint(relative.parts[0], source.stem, 'webp', data)
    ASSETS['/' + relative.as_posix()] = url
    REPORT['images'].append({'source': '/' + relative.as_posix(), 'output': url, 'before': source.stat().st_size, 'after': len(data)})


def embedded_image(match):
    return 'data:image/webp;base64,' + base64.b64encode(webp(base64.b64decode(match[1]), 640, 74)).decode()


for source in sorted((PUBLIC / 'services').glob('*.svg')):
    text = re.sub(r'data:image/(?:jpeg|png);base64,([A-Za-z0-9+/=]+)', embedded_image, source.read_text())
    data = text.encode()
    url = fingerprint('services', source.stem, 'svg', data)
    ASSETS['/' + source.relative_to(PUBLIC).as_posix()] = url
    REPORT['images'].append({'source': '/' + source.relative_to(PUBLIC).as_posix(), 'output': url, 'before': source.stat().st_size, 'after': len(data)})

for source in sorted((PUBLIC / 'fonts').glob('*.woff2')):
    ASSETS['/' + source.relative_to(PUBLIC).as_posix()] = fingerprint('fonts', source.stem, 'woff2', source.read_bytes())
font_css = (PUBLIC / 'fonts/fonts.css').read_text()
for old, new in ASSETS.items():
    font_css = font_css.replace(old, new)
ASSETS['/fonts/fonts.css'] = fingerprint('fonts', 'fonts', 'css', font_css.encode())


def preview(source):
    slug = source.stem.removesuffix('-preview')
    original = PUBLIC / 'reels' / f'{slug}.mp4'
    temporary = ROOT / '.sites-local' / 'optimized-previews' / f'{slug}.mp4'
    temporary.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(original),
        '-map', '0:v:0', '-map', '0:a:0?', '-map_metadata', '-1', '-map_chapters', '-1',
        '-vf', 'scale=640:640:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=24',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-maxrate', '360k', '-bufsize', '720k',
        '-pix_fmt', 'yuv420p', '-threads', '2', '-c:a', 'aac', '-ac', '1', '-b:a', '40k',
        '-movflags', '+faststart', str(temporary),
    ], check=True)
    info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', str(temporary)]))
    old_duration = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', str(source)]))
    duration = float(info['format']['duration'])
    assert abs(duration - old_duration) < .25, f'{slug}: full clip duration must be preserved'
    data = temporary.read_bytes()
    assert len(data) < source.stat().st_size, f'{slug}: encoding did not reduce bytes'
    url = fingerprint('reels', slug + '-sd', 'mp4', data)
    entry = {'src': url, 'bytes': len(data), 'width': info['streams'][0]['width'], 'height': info['streams'][0]['height'], 'duration': duration}
    report = {'source': '/reels/' + source.name, 'output': url, 'before': source.stat().st_size, 'after': len(data), 'duration': duration}
    print(f'{slug}: {source.stat().st_size:,} -> {len(data):,} bytes', flush=True)
    return slug, entry, report


with ThreadPoolExecutor(max_workers=2) as executor:
    encoded = list(executor.map(preview, sorted((PUBLIC / 'reels').glob('*-preview.mp4'))))
PREVIEWS = {slug: entry for slug, entry, report in encoded}
REPORT['videos'] = [report for slug, entry, report in encoded]
(ROOT / 'src/data/media-manifest.json').write_text(json.dumps({'assets': ASSETS, 'previews': PREVIEWS}, indent=2) + '\n')
(ROOT / 'tools/media-optimization-report.json').write_text(json.dumps(REPORT, indent=2) + '\n')
for category, rows in REPORT.items():
    before, after = sum(row['before'] for row in rows), sum(row['after'] for row in rows)
    print(f'{category}: {before:,} -> {after:,} bytes ({100 * (1 - after / before):.1f}% smaller)', flush=True)
