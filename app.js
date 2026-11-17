/* Page d'accueil : filtres + grille */
(function () {
  const $ = (s) => document.querySelector(s);

  // Options des filtres dynamiques
  const themeSelect = $('#f-theme');
  const actionSelect = $('#f-action');
  Object.entries(THEMES)
    .sort((a, b) => a[1].label.localeCompare(b[1].label, 'fr'))
    .forEach(([code, t]) => {
      const o = document.createElement('option');
      o.value = code;
      o.textContent = t.emoji + ' ' + t.label;
      themeSelect.appendChild(o);
    });
  const actions = [...new Set(FICHES.flatMap((f) => f.actions))].sort((a, b) => a.localeCompare(b, 'fr'));
  actions.forEach((a) => {
    const o = document.createElement('option');
    o.value = a;
    o.textContent = a;
    actionSelect.appendChild(o);
  });

  const state = { theme: '', action: '', niveau: '', participants: '', q: '' };

  function matches(f) {
    if (state.theme && f.theme !== state.theme) return false;
    if (state.action && !f.actions.includes(state.action)) return false;
    if (state.niveau && f.niveau !== state.niveau) return false;
    if (state.participants) {
      const [bmin, bmax] = state.participants.split('-').map(Number);
      if (f.minP == null || f.maxP == null || f.maxP < bmin || f.minP > bmax) return false;
    }
    if (state.q) {
      const q = state.q.toLowerCase();
      const hay = (f.titre + ' ' + f.description + ' ' + f.actions.join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }

  function card(f) {
    const theme = THEMES[f.theme] || { label: f.theme, emoji: '', accent: 'ink' };
    const acc = theme.accent || 'ink';
    const a = document.createElement('a');
    a.className = 'card';
    a.href = 'fiche.html?id=' + encodeURIComponent(f.id);
    const participants = f.participants ? f.participants + ' participant·e·s' : '—';
    a.innerHTML =
      '<div class="badges">' +
      '<span class="theme-tag"><span class="dot ' + acc + '"></span>' + theme.label + '</span>' +
      (f.niveau ? '<span class="badge niveau-' + f.niveau + '">Niveau ' + f.niveau + ' · ' + f.niveauLabel + '</span>' : '') +
      '</div>' +
      '<h2><span class="hl">' + f.titre + '</span></h2>' +
      '<p class="meta">' +
      '<span>⏱ ' + (f.duree || '—') + '</span>' +
      '<span>🧰 ' + (f.preparation || '—') + '</span>' +
      '<span>👥 ' + participants + '</span>' +
      '</p>' +
      (f.actions.length ? '<div class="chips">' + f.actions.map((x) => '<span class="chip">' + x + '</span>').join('') + '</div>' : '');
    return a;
  }

  function render() {
    const grid = $('#grid');
    grid.innerHTML = '';
    const list = FICHES.filter(matches);
    list.forEach((f) => grid.appendChild(card(f)));
    $('#count').textContent = list.length + ' fiche' + (list.length > 1 ? 's' : '') + ' sur ' + FICHES.length;
    $('#empty').hidden = list.length > 0;
  }

  function bind(id, key) {
    $(id).addEventListener('change', (e) => { state[key] = e.target.value; render(); });
  }
  bind('#f-theme', 'theme');
  bind('#f-action', 'action');
  bind('#f-niveau', 'niveau');
  bind('#f-participants', 'participants');
  let timer;
  $('#f-recherche').addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.q = e.target.value.trim(); render(); }, 150);
  });
  $('#f-reset').addEventListener('click', () => {
    Object.keys(state).forEach((k) => (state[k] = ''));
    ['#f-theme', '#f-action', '#f-niveau', '#f-participants', '#f-recherche'].forEach((id) => ($(id).value = ''));
    render();
  });

  render();
})();
