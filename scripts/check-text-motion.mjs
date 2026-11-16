import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

// Render the actual components, not copies of their markup. This regression
// check catches duplicate readable text before hydration as well as escaping.
const require = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  file = resolve(file);
  if (cache.has(file)) return cache.get(file);
  const module = {exports: {}};
  cache.set(file, module.exports);
  const {outputText} = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022},
    fileName: file,
  });
  const localRequire = name => name.startsWith('@/') ? load(`src/${name.slice(2)}.ts`) : require(name);
  new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
  cache.set(file, module.exports);
  return module.exports;
}
const effects = load('src/components/ui/TextEffects.tsx');
const normalize = text => text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const cases = [
  ['StaggerText', {text: 'A fresh angle.'}, 'A fresh angle.'],
  ['VaporText', {text: 'Social media & video'}, 'Social media & video'],
  ['GhostText', {prefix: 'Let’s make ', text: 'something good.'}, 'Let’s make something good.'],
  ['LetterSwap', {text: 'Start something'}, 'Start something'],
  ['MorphText', {text: 'Posts & carousels'}, 'Posts & carousels'],
  ['VaporText', {text: '<Café> & Mumbai’s stories'}, '<Café> & Mumbai’s stories'],
];
for (const [name, props, expected] of cases) {
  const html = renderToStaticMarkup(createElement(effects[name], props));
  assert.equal(normalize(html), expected, `${name}: one readable text copy in server-rendered HTML`);
  assert.match(html, /aria-hidden="true"/, `${name}: animation remains decorative`);
}
console.log(`Text motion checks passed: ${cases.length} server-rendered text and escaping cases.`);
