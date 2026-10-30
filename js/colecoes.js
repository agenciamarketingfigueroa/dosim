(() => {
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  document.querySelectorAll('[data-collection]').forEach(collection => {
    const input = collection.querySelector('[data-theme-search]');
    const cards = Array.from(collection.querySelectorAll('[data-theme-card]'));
    const count = collection.querySelector('[data-result-count]');
    const empty = collection.querySelector('[data-no-results]');
    const update = () => {
      const words = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
      let visible = 0;
      cards.forEach(card => {
        const matches = words.every(word => normalize(card.dataset.search).includes(word));
        card.hidden = !matches;
        if (matches) visible++;
      });
      count.textContent = `${visible} ${visible === 1 ? 'coleção encontrada' : 'coleções encontradas'}`;
      empty.hidden = visible !== 0;
    };
    input.addEventListener('input', update);
    collection.querySelector('[data-clear-search]').addEventListener('click', () => {
      input.value = '';
      update();
      input.focus();
    });
  });
})();
