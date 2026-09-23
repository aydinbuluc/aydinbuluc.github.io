'use strict';
(() => {
  const search = document.querySelector('#paper-search');
  if (!search) return;
  const year = document.querySelector('#paper-year');
  const papers = [...document.querySelectorAll('.publication')];
  const groups = [...document.querySelectorAll('.publication-year')];
  const count = document.querySelector('#paper-count');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').toLowerCase();
  const records = papers.map(node => ({node, text: normalize(node.textContent)}));
  document.querySelector('.publication-tools').hidden = false;
  count.hidden = false;
  const params = new URLSearchParams(window.location.search);
  search.value = params.get('search') || '';
  if ([...year.options].some(option => option.value === params.get('year'))) year.value = params.get('year');
  function filter() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let visible = 0;
    records.forEach(({node, text}) => {
      const matches = (!year.value || node.dataset.year === year.value) && terms.every(term => text.includes(term));
      node.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = `${visible} of ${papers.length} publications`;
    groups.forEach(group => {
      group.hidden = !papers.some(paper => paper.dataset.year === group.dataset.year && !paper.hidden);
    });
    document.querySelector('#no-results').hidden = visible > 0;
  }
  search.addEventListener('input', filter);
  year.addEventListener('change', filter);
  document.querySelector('#reset-filters').addEventListener('click', () => {
    search.value = ''; year.value = ''; filter(); search.focus();
  });
  filter();
})();
