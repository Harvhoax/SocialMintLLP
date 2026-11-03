// Local-only preview of the static export. Netlify publishes out/ directly.
import {createServer} from 'node:http';
import {createReadStream, existsSync, readFileSync, statSync} from 'node:fs';
import {resolve, sep, extname} from 'node:path';

const root = resolve('out');
if (!existsSync(resolve(root, 'index.html'))) throw Error('Run npm run build before starting the static preview.');
const port = Number(process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw Error('PORT must be between 0 and 65535 (0 chooses a free port).');
const types = {'.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2', '.ttf':'font/ttf', '.mp4':'video/mp4', '.xml':'application/xml; charset=utf-8', '.txt':'text/plain; charset=utf-8', '.ico':'image/x-icon'};
const rules = [];
let current;
for (const line of readFileSync(resolve(root, '_headers'), 'utf8').split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue;
  if (!line.startsWith(' ')) { current = {path:line.trim(), headers:[]}; rules.push(current); continue; }
  const at = line.indexOf(':');
  if (at > 0 && current) current.headers.push([line.slice(0, at).trim(), line.slice(at + 1).trim()]);
}
const isFile = path => existsSync(path) && statSync(path).isFile();

const server = createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, {Allow:'GET, HEAD'}); res.end(); return; }
  let path;
  try { path = decodeURIComponent((req.url || '/').split('?')[0]); }
  catch { res.writeHead(400); res.end('Malformed URL'); return; }
  if (!path.startsWith('/') || path.includes('\\') || path.includes('\0') || path.split('/').some(part => part === '..' || part.startsWith('.')) || ['/_headers', '/_redirects'].includes(path)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  let target = resolve(root, '.' + (path === '/' ? '/index.html' : path));
  if (!target.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
  if (!isFile(target)) {
    const clean = target.replace(/[\\/]$/, '');
    if (isFile(clean + '.html')) target = clean + '.html';
  }
  let status = 200;
  if (!isFile(target)) { target = resolve(root, '404.html'); status = 404; }
  for (const rule of rules) {
    if (rule.path === path || rule.path === '/*' || (rule.path.endsWith('*') && path.startsWith(rule.path.slice(0, -1)))) {
      for (const [key, value] of rule.headers) res.setHeader(key, value);
    }
  }
  const size = statSync(target).size;
  res.setHeader('Content-Type', types[extname(target)] || 'application/octet-stream');
  res.setHeader('Cache-Control', res.getHeader('Cache-Control') || 'no-cache');
  res.setHeader('Accept-Ranges', 'bytes');
  let start = 0, end = size - 1;
  if (req.headers.range && status === 200) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    const valid = match && (match[1] || match[2]);
    if (valid) {
      start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
      end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    }
    if (!valid || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) {
      res.writeHead(416, {'Content-Range':`bytes */${size}`}); res.end(); return;
    }
    status = 206;
    res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
  }
  res.statusCode = status;
  res.setHeader('Content-Length', end - start + 1);
  if (req.method === 'HEAD') { res.end(); return; }
  const stream = createReadStream(target, {start, end});
  stream.on('error', () => res.destroy());
  res.on('close', () => stream.destroy());
  stream.pipe(res);
});
server.on('error', error => { console.error(`Static preview could not start: ${error.message}`); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`SocialMint static preview: http://localhost:${server.address().port} (local only)`));
