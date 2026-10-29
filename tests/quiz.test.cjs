const test = require('node:test');
const assert = require('node:assert/strict');
const quiz = require('../js/quiz-model.js');
const complete = (category = 'negocio') => ({ ...quiz.initialState(), category, mold: 'Ainda não, será o primeiro pedido', flavors: ['Tradicional', 'Chocolate'], quantityMode: 'Tenho uma quantidade em mente', quantity: '50', packaging: 'Embalados individualmente, para lembrança', date: '2099-12-20', name: 'Ana & João', notes: 'Logo A&B; cores café e creme.' });

test('logo follows the requested order with quantity on its own screen', () => {
  assert.deepEqual(quiz.steps(complete()).map(s => s.key), ['category','mold','flavors','quantityMode','quantity','packaging','date','contact']);
});
test('other categories skip the mold question and all branches validate', () => {
  for (const category of quiz.categories) {
    const state = complete(category.value);
    assert.equal(quiz.steps(state).some(s => s.key === 'mold'), category.value === 'negocio');
    for (const step of quiz.steps(state)) assert.equal(quiz.validate(state, step.key), null, `${category.value}: ${step.key}`);
    assert.equal(quiz.steps(state).some(s => ['size','purpose','business'].includes(s.key)), false);
  }
});
test('multiple flavors survive WhatsApp encoding with accents and ampersands', () => {
  const state = complete();
  const url = new URL(quiz.whatsappUrl(state));
  assert.equal(url.origin + url.pathname, 'https://wa.me/5531996154698');
  assert.equal(url.searchParams.get('text'), quiz.message(state));
  assert.match(url.searchParams.get('text'), /Sabores: Tradicional, Chocolate/);
  assert.match(url.searchParams.get('text'), /Nome: Ana & João/);
  assert.match(url.searchParams.get('text'), /20\/12\/2099/);
});
test('help and specific flavors cannot be selected simultaneously', () => {
  let selected = quiz.toggleFlavor([], 'Tradicional', true);
  selected = quiz.toggleFlavor(selected, 'Chocolate', true);
  assert.deepEqual(selected, ['Tradicional', 'Chocolate']);
  selected = quiz.toggleFlavor(selected, quiz.helpFlavor, true);
  assert.deepEqual(selected, [quiz.helpFlavor]);
  selected = quiz.toggleFlavor(selected, 'Canela', true);
  assert.deepEqual(selected, ['Canela']);
  assert.ok(quiz.validate({...complete(), flavors: [quiz.helpFlavor,'Canela']}, 'flavors'));
  assert.ok(quiz.validate({...complete(), flavors: []}, 'flavors'));
});
test('changing category resets branch answers and retains contact', () => {
  const state = quiz.changeCategory(complete(), 'gramatura');
  assert.equal(state.mold, ''); assert.deepEqual(state.flavors, []); assert.equal(state.quantity, '');
  assert.equal(state.name, 'Ana & João');
  assert.ok(!quiz.message(state).includes('Molde:'));
});
test('undecided quantity skips number and hides previous numeric answer', () => {
  const state = {...complete(), quantityMode: 'Ainda não sei, preciso de ajuda'};
  assert.ok(!quiz.steps(state).some(s => s.key === 'quantity'));
  assert.match(quiz.message(state), /Quantidade: A definir com a DoSim/);
  assert.ok(!quiz.message(state).includes('50 biscoito'));
});
test('grams, gift boxes and biscuits have distinct quantity units', () => {
  assert.match(quiz.message(complete('gramatura')), /Quantidade: 50 g no total/);
  assert.match(quiz.message(complete('presenteavel')), /Quantidade: 50 caixinha/);
  assert.match(quiz.message(complete('aniversario')), /Quantidade: 50 biscoito/);
});
test('units reject fractions, invalid and empty quantities; grams allow decimals', () => {
  for (const quantity of ['', '0', '-2', '2.5', 'Infinity', 'texto', '100001']) assert.ok(quiz.validate({...complete(), quantity}, 'quantity'));
  assert.equal(quiz.validate({...complete('gramatura'), quantity:'250.5'}, 'quantity'), null);
  assert.ok(quiz.validate({...complete('gramatura'), quantity:'250.55'}, 'quantity'));
});
test('date is optional and rejects past and nonexistent dates', () => {
  assert.equal(quiz.validate({...complete(),date:''}, 'date','2026-10-28'),null);
  assert.equal(quiz.validate({...complete(),date:'2026-10-28'}, 'date','2026-10-28'),null);
  for (const date of ['2026-10-27','2027-02-30','not-a-date']) assert.ok(quiz.validate({...complete(),date},'date','2026-10-28'));
});
test('name is required; optional observations are bounded', () => {
  assert.ok(quiz.validate({...complete(),name:'   '},'contact'));
  assert.ok(quiz.validate({...complete(),notes:'a'.repeat(501)},'contact'));
  assert.equal(quiz.validate({...complete(),notes:''},'contact'),null);
});
test('legacy size and purpose values never enter the new summary', () => {
  const msg=quiz.message({...complete(),size:'6 cm',purpose:'Servir na recepção ou com o café'});
  assert.ok(!msg.includes('6 cm')); assert.ok(!msg.includes('recepção'));
});
