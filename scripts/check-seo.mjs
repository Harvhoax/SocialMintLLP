import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { isPreviewDeployment } from '../lib/deploy-context.mjs';

const media = JSON.parse(readFileSync(new URL('../data/media-manifest.json', import.meta.url), 'utf8'));
const out = join(process.cwd(), 'out');
const origin = 'https://socialmintstudio.com';
const read = path => readFileSync(join(out, path), 'utf8');
const sitemap = read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 23, 'Home, service/film directories, six services and fourteen watch pages');
assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs must be unique');
const titles = new Set();
const preview = isPreviewDeployment();
const linkGraph = new Map();
const descriptions = new Set();
let localLinks = 0;
let answerPages = 0;
let answerCount = 0;
const assets = new Set();
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
const strip = text => text.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const normalize = text => strip(text).replace(/\s+/g, ' ').trim();
const htmlFile = path => path === '/' ? 'index.html' : `${path.slice(1)}.html`;
for (const url of urls) {
  assert.equal(new URL(url).origin, origin, 'Production origin only');
  const path = new URL(url).pathname;
  const html = read(htmlFile(path));
  assert.match(html, /<html[^>]*lang="en"/);
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${path}: one main heading`);
  const title = strip(html.match(/<title>(.*?)<\/title>/s)?.[1] || '');
  assert.ok(title.length > 10, `${path}: title present`);
  assert.ok(!titles.has(title), `${path}: unique title`);
  titles.add(title);
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(match => attrs(match[0]));
  const description = meta.find(item => item.name === 'description')?.content;
  assert.ok(description?.length > 60, `${path}: meaningful description`);
  assert.ok(!descriptions.has(description), `${path}: unique description`);
  descriptions.add(description);
  const robotsMeta = meta.find(item => item.name === 'robots');
  assert.ok(robotsMeta, `${path}: explicit robots policy`);
  assert.equal(/noindex/.test(robotsMeta.content), preview, `${path}: correct environment indexing policy`);
  assert.ok(meta.some(item => item.name === 'viewport'), `${path}: responsive viewport`);
  const socialImage = meta.find(item => item.property === 'og:image')?.content;
  assert.ok(socialImage && existsSync(join(out, new URL(socialImage).pathname)), `${path}: social image exists`);
  const targets = [];
  linkGraph.set(path, targets);
  assert.equal(new URL(meta.find(item => item.property === 'og:url')?.content).href, url, `${path}: Open Graph URL`);
  assert.equal(meta.find(item => item.name === 'twitter:card')?.content, 'summary_large_image');
  const canonical = [...html.matchAll(/<link\b[^>]*>/g)].map(match => attrs(match[0])).filter(item => item.rel === 'canonical');
  assert.deepEqual(canonical.map(item => new URL(item.href).href), [url], `${path}: one self canonical`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
  assert.ok(schemas.length, `${path}: structured data exists`);
  for (const schema of schemas) assert.equal(schema['@context'], 'https://schema.org');
  const footer = html.match(/<footer\b[^>]*>(.*?)<\/footer>/s)?.[1] || '';
  assert.ok(normalize(footer).includes('SocialMint LLP'), `${path}: legal business name in footer`);
  if (path === '/' || path.startsWith('/services/')) {
    const faq = schemas.filter(schema => schema['@type'] === 'FAQPage');
    assert.equal(faq.length, 1, `${path}: one question schema`);
    assert.equal(faq[0].url, url, `${path}: question schema uses canonical URL`);
    assert.equal(faq[0].publisher['@id'], `${origin}/#organization`);
    const answers = [...html.matchAll(/<details\b([^>]*)>(.*?)<\/details>/gs)].map(match => ({
      id: attrs(match[1]).id,
      question: normalize(match[2].match(/<summary\b[^>]*>(.*?)<\/summary>/s)?.[1] || ''),
      answer: normalize(match[2].match(/<p\b[^>]*>(.*?)<\/p>/s)?.[1] || ''),
    }));
    assert.equal(answers.length, path === '/' ? 12 : 3, `${path}: complete visible answer content`);
    assert.equal(faq[0].mainEntity.length, answers.length, `${path}: no hidden schema-only answers`);
    assert.equal(new Set(answers.map(item => item.id)).size, answers.length, `${path}: unique question anchors`);
    for (const question of faq[0].mainEntity) {
      assert.equal(question['@type'], 'Question');
      assert.equal(question.acceptedAnswer['@type'], 'Answer');
      const anchor = new URL(question['@id']);
      assert.equal(`${anchor.origin}${anchor.pathname}`, url);
      const visible = answers.find(item => item.id === anchor.hash.slice(1));
      assert.ok(visible, `${path}: question has a visible anchored answer`);
      assert.equal(visible.question, question.name);
      assert.equal(visible.answer, question.acceptedAnswer.text, `${path}: schema agrees with visible answer`);
    }
    answerPages++;
    answerCount += answers.length;
  }
  for (const match of html.matchAll(/<(?:a|img|source|video)\b[^>]*>/g)) {
    const tag = attrs(match[0]);
    if (match[0].startsWith('<img')) assert.ok(Object.hasOwn(tag, 'alt'), `${path}: image has alt attribute`);
    for (const value of [tag.href, tag.src, tag.poster]) {
      if (!value?.startsWith('/') || value.startsWith('//')) continue;
      const target = new URL(value.replace(/&amp;/g, '&'), origin).pathname;
      assert.ok(existsSync(join(out, target)) || existsSync(join(out, htmlFile(target))), `${path}: unresolved local link/asset ${target}`);
      localLinks++;
      if (tag.href && urls.includes(new URL(target, origin).href)) targets.push(target);
      if (tag.src || tag.poster) assets.add(target);
    }
  }
  if (path.startsWith('/work/')) {
    assert.match(html, /<video[^>]*controls=""[^>]*preload="none"/, `${path}: native player without preload`);
    const slug = path.split('/').at(-1);
    assert.ok(html.includes(media.previews[slug].src), `${path}: stable optimized video source in HTML`);
    assert.ok(html.includes(media.assets[`/reels/${slug}.jpg`]), `${path}: optimized stable poster`);
  }
}
const reachable = new Set();
const visit = path => { if (reachable.has(path)) return; reachable.add(path); for (const target of linkGraph.get(path) || []) visit(target); };
visit('/');
for (const url of urls) assert.ok(reachable.has(new URL(url).pathname), `${url}: reachable through HTML links from home`);
assert.match(read('404.html'), /name="robots" content="noindex"/, '404 pages must not be indexed');
const home = read('index.html');
const homeGraph = JSON.parse(home.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
const org = homeGraph.find(item => item['@type'] === 'Organization');
assert.equal(org.email, 'info@socialmintstudio.com');
assert.equal(org.legalName, 'SocialMint LLP');
assert.equal(org.telephone, '+919321388129');
assert.ok(org.areaServed.some(item => item.name === 'Mumbai'));
assert.equal(homeGraph.filter(item => item['@type'] === 'Person').length, 3);
assert.equal(org.hasOfferCatalog.itemListElement.length, 6);
assert.ok(!org.address && !org.aggregateRating, 'No invented address or reviews');
assert.match(home, /<details\b[^>]*><summary>/, 'Questions use crawlable native HTML');
assert.match(home, /<noscript>/, 'Landing page remains accessible without JavaScript');
assert.equal([...sitemap.matchAll(/<video:video>/g)].length, 14, 'All watch pages have video sitemap entries');
for (const match of sitemap.matchAll(/<video:content_loc>([^<]+)<\/video:content_loc>/g)) {
  assert.ok(existsSync(join(out, new URL(match[1]).pathname)), 'Sitemap video file exists');
}
const robots = read('robots.txt');
assert.match(robots, /User-Agent: \*/i);
assert.match(robots, /Allow: \//);
assert.match(robots, /Sitemap: https:\/\/socialmintstudio\.com\/sitemap\.xml/);
assert.ok(!/Disallow: \/\s/.test(robots));
const image = readFileSync(join(out, 'social-image.png'));
assert.equal(image.subarray(1, 4).toString(), 'PNG', 'Social image is a real PNG');
assert.equal(image.readUInt32BE(16), 1200);
assert.equal(image.readUInt32BE(20), 630);
assert.equal(answerPages, 7);
assert.equal(answerCount, 30);
console.log(`SEO export checks passed: ${urls.length} pages, ${localLinks} local references, ${assets.size} media assets, 14 video sitemap entries and ${answerCount} visible/schema-matched answers across ${answerPages} pages.`);
