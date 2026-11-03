import assert from 'node:assert/strict';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';

const out = join(process.cwd(), 'out');
const manifest = JSON.parse(readFileSync('data/media-manifest.json', 'utf8'));
const read = path => readFileSync(join(out, path));
const files = readdirSync(join(out, 'media'), {recursive: true})
  .filter(path => statSync(join(out, 'media', path)).isFile());
for (const file of files) {
  const digest = createHash('sha256').update(read(`media/${file}`)).digest('hex').slice(0, 12);
  assert.ok(file.includes(`.${digest}.`), `Immutable URL must match its contents: ${file}`);
}
for (const [original, optimized] of Object.entries(manifest.assets)) {
  assert.ok(read(optimized).length > 0, `${original}: derivative exists`);
  assert.ok(optimized.startsWith('/media/'), 'Optimized assets use the immutable path');
}
assert.equal(Object.keys(manifest.previews).length, 14);
const sitemap = read('sitemap.xml').toString();
for (const [slug, preview] of Object.entries(manifest.previews)) {
  const data = read(preview.src);
  assert.equal(data.length, preview.bytes, `${slug}: manifest reflects the served file`);
  assert.ok(data.length < read(`/reels/${slug}-preview.mp4`).length, `${slug}: SD is smaller`);
  assert.ok(Math.max(preview.width, preview.height) <= 640, `${slug}: bounded SD resolution`);
  assert.ok(preview.duration > 0 && read(`/reels/${slug}.mp4`).length > 0, `${slug}: full SD and HD exist`);
  // Fast start puts metadata ahead of media so playback needn't fetch the end first.
  let at = 0, moov = -1, mdat = -1;
  while (at + 8 <= data.length) {
    const size = data.readUInt32BE(at), type = data.toString('ascii', at + 4, at + 8);
    if (type === 'moov') moov = at;
    if (type === 'mdat') mdat = at;
    assert.ok(size >= 8 && at + size <= data.length, `${slug}: valid MP4 atom size`);
    at += size;
  }
  assert.ok(moov >= 0 && mdat > moov, `${slug}: fast-start MP4`);
  assert.ok(sitemap.includes(preview.src), `${slug}: crawlers receive the smaller complete SD file`);
  const watch = read(`work/${slug}.html`).toString();
  const player = watch.match(/<video\b[^>]*>/)?.[0];
  assert.ok(player?.includes('preload="none"') && !/autoplay|loop/.test(player), `${slug}: explicit playback`);
}
const home = read('index.html').toString();
for (const [player] of home.matchAll(/<video\b[^>]*>/g)) {
  assert.ok(!/\ssrc=|autoplay|loop/.test(player), 'Gallery has no video source before interaction');
  assert.ok(player.includes('preload="none"'));
}
assert.ok(read('_headers').toString().includes('/media/*\n  Cache-Control: public, max-age=31536000, immutable'));
console.log(`Media checks passed: ${files.length} fingerprinted assets, 14 smaller fast-start SD films, click-to-play HTML and immutable caching.`);
