import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFileSync, readdirSync} from 'node:fs';
import {once} from 'node:events';
import {isPreviewDeployment} from '../src/lib/deploy-context.mjs';

const child = spawn(process.execPath, ['scripts/preview.mjs'], {env:{...process.env, PORT:'0'}, stdio:['ignore','pipe','pipe']});
let errors = '';
child.stderr.on('data', chunk => { errors += chunk; });
try {
  const base = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(Error('Preview startup timed out')), 10000);
    child.once('exit', code => { clearTimeout(timeout); reject(Error(`Preview exited ${code}: ${errors}`)); });
    child.stdout.on('data', chunk => {
      const url = String(chunk).match(/http:\/\/localhost:\d+/)?.[0];
      if (url) { clearTimeout(timeout); resolve(url); }
    });
  });
  const sitemap = readFileSync('out/sitemap.xml', 'utf8');
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  for (const path of paths) {
    const response = await fetch(base + path, {method:'HEAD'});
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.equal(response.headers.get('x-robots-tag') === 'noindex, follow', isPreviewDeployment());
  }
  assert.equal((await fetch(base + '/services/', {method:'HEAD'})).status, 200);
  let assetCount = 0;
  for (const file of readdirSync('out', {recursive:true}).filter(file => /\.(?:js|css|webp|svg|woff2|mp4)$/.test(file))) {
    const response = await fetch(base + '/' + file.replaceAll('\\', '/'), {method:'HEAD'});
    assert.equal(response.status, 200, file);
    assert.ok(Number(response.headers.get('content-length')) > 0, file);
    assetCount++;
  }
  const missing = await fetch(base + '/not-a-real-socialmint-page');
  assert.equal(missing.status, 404);
  assert.notEqual(await missing.text(), readFileSync('out/index.html', 'utf8'));
  assert.equal((await fetch(base + '/', {method:'POST'})).status, 405);
  for (const path of ['/_headers','/_redirects','/%2e%2e%2fpackage.json','/%ZZ']) {
    assert.ok([400,403].includes((await fetch(base + path)).status), path);
  }
  for (const path of ['/robots.txt','/sitemap.xml','/BingSiteAuth.xml','/287f4c0364e849b28728ce253aac965c.txt']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.equal(await response.text(), readFileSync(`out${path}`, 'utf8'));
  }
  const film = Object.values(JSON.parse(readFileSync('src/data/media-manifest.json', 'utf8')).previews)[0];
  const range = await fetch(base + film.src, {headers:{Range:'bytes=0-99'}});
  assert.equal(range.status, 206);
  assert.equal((await range.arrayBuffer()).byteLength, 100);
  assert.equal(range.headers.get('content-range'), `bytes 0-99/${film.bytes}`);
  assert.match(range.headers.get('cache-control'), /immutable/);
  const suffix = await fetch(base + film.src, {headers:{Range:'bytes=-25'}});
  assert.equal(suffix.status, 206);
  assert.equal((await suffix.arrayBuffer()).byteLength, 25);
  assert.equal(suffix.headers.get('content-range'), `bytes ${film.bytes - 25}-${film.bytes - 1}/${film.bytes}`);
  for (const value of [`bytes=${film.bytes}-`, 'bytes=50-10', 'bytes=0-1,4-5', 'bytes=-0']) {
    const invalid = await fetch(base + film.src, {headers:{Range:value}});
    assert.equal(invalid.status, 416, value);
    await invalid.body?.cancel();
  }
  console.log(`Static preview checks passed: ${paths.length} routes, ${assetCount} assets, security headers, real 404, ownership files, video ranges and invalid requests.`);
} finally {
  if (child.exitCode === null && child.signalCode === null) { const stopped = once(child, 'exit'); child.kill(); await stopped; }
}
