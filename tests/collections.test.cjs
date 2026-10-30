const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const { themes } = require('../data/colecoes.json');

function searchPage() {
  const input = { value: '', events: {}, addEventListener(type, fn) { this.events[type] = fn; }, focus() { this.focused = true; } };
  const clear = { addEventListener(type, fn) { this.click = fn; } };
  const count = {};
  const empty = { hidden: true };
  const cards = themes.map(t => ({ hidden: false, dataset: { search: [t.name, ...t.motifs, ...t.phrases].join(' ') } }));
  const fields = { '[data-theme-search]': input, '[data-result-count]': count, '[data-no-results]': empty, '[data-clear-search]': clear };
  const collection = { querySelector: s => fields[s], querySelectorAll: () => cards };
  vm.runInNewContext(fs.readFileSync(path.join(root,'js/colecoes.js'),'utf8'), { document: { querySelectorAll: () => [collection] } });
  return { input, clear, count, empty, cards, search(value) { input.value = value; input.events.input(); return cards.filter(c => !c.hidden); } };
}

test('catalog search finds accents, phrases and multiple words in any order', () => {
  const page = searchPage();
  assert.equal(page.search('  COMUNHAO  ').length, 1);
  assert.equal(page.search('mulheres feliz').length, 1);
  assert.equal(page.search('sanfona')[0].dataset.search.includes('Festa Junina'), true);
  assert.equal(page.search('psicologo-inexistente').length, 0);
  assert.equal(page.empty.hidden, false);
  assert.equal(page.count.textContent, '0 coleções encontradas');
});

test('clearing an empty search restores every theme and keyboard focus', () => {
  const page = searchPage();
  page.search('tema que não existe');
  page.clear.click();
  assert.equal(page.input.value, '');
  assert.equal(page.empty.hidden, true);
  assert.equal(page.cards.filter(c=>!c.hidden).length, themes.length);
  assert.equal(page.input.focused, true);
});

test('each theme has a specific WhatsApp brief and an honest illustration label', () => {
  for (const theme of themes) {
    const html = fs.readFileSync(path.join(root, 'colecoes', theme.id, 'index.html'), 'utf8');
    const href = html.match(/href="(https:\/\/wa\.me\/5531996154698\?text=[^"]+)"/)[1].replaceAll('&amp;', '&');
    const url = new URL(href);
    assert.ok(url.searchParams.get('text').includes(theme.name), theme.name);
    assert.ok(html.includes('Sugestão ilustrada'), theme.name);
    assert.ok(html.includes('Valores, quantidade mínima e prazo são confirmados no atendimento.'), theme.name);
  }
});
