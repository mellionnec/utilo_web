/* Utilo Design — logique de la page : filtres, recherche, drawer, mode sombre. Vanilla JS, zéro dépendance. */
(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const grid = $("#grid"), empty = $("#empty"), stats = $("#stats");
  const search = $("#search");
  const state = { theme: "", niveau: "", part: "", q: "" };
  const ACCENT = { teal: "#3ec7c5", yellow: "#ffc433", ink: "#3d3e40" };
  const accentOf = (t) => ACCENT[(THEMES[t] && THEMES[t].accent) || "teal"];

  /* ---------- mode sombre ---------- */
  const root = document.documentElement;
  const stored = localStorage.getItem("utilo-theme");
  if (stored === "dark" || (!stored && matchMedia("(prefers-color-scheme: dark)").matches)) root.classList.add("dark");
  $("#themeToggle").addEventListener("click", () => {
    root.classList.toggle("dark");
    localStorage.setItem("utilo-theme", root.classList.contains("dark") ? "dark" : "light");
  });

  /* ---------- chips de thème ---------- */
  const themeChips = $("#themeChips");
  const mkChip = (label, value, dot) => {
    const b = document.createElement("button");
    b.className = "chip"; b.dataset.theme = value;
    b.innerHTML = (dot ? `<span class="dot" style="background:${dot}"></span>` : "") + label;
    b.addEventListener("click", () => { state.theme = state.theme === value ? "" : value; renderChips(); apply(); });
    return b;
  };
  themeChips.appendChild(mkChip("Tous les thèmes", "", null));
  Object.entries(THEMES)
    .sort((a, b) => a[1].label.localeCompare(b[1].label, "fr"))
    .forEach(([key, t]) => themeChips.appendChild(mkChip(t.label, key, accentOf(key))));

  const metaChips = $("#metaChips");
  metaChips.querySelectorAll(".chip").forEach((c) => {
    c.addEventListener("click", () => {
      if ("niveau" in c.dataset) { const v = c.dataset.niveau; state.niveau = state.niveau === v ? "" : v; if (!v) state.niveau = ""; }
      else { const v = c.dataset.part; state.part = state.part === v ? "" : v; }
      renderChips(); apply();
    });
  });

  function renderChips() {
    themeChips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.theme === state.theme));
    metaChips.querySelectorAll(".chip").forEach((c) => {
      const v = "niveau" in c.dataset ? c.dataset.niveau : c.dataset.part;
      const cur = "niveau" in c.dataset ? state.niveau : state.part;
      c.classList.toggle("active", v === cur && cur !== "");
      if (!v) c.classList.toggle("active", cur === "" || cur === "any");
    });
  }

  /* ---------- recherche ---------- */
  let tId;
  search.addEventListener("input", () => { clearTimeout(tId); tId = setTimeout(() => { state.q = search.value.trim().toLowerCase(); apply(); }, 120); });
  addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== search) { e.preventDefault(); search.focus(); }
    if (e.key === "Escape") { if (drawer.classList.contains("open")) closeDrawer(); else if (document.activeElement === search) search.blur(); }
  });
  if (matchMedia("(pointer: fine)").matches) $("#searchKbd").style.display = "";

  /* ---------- filtrage ---------- */
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function match(f) {
    if (state.theme && f.theme !== state.theme) return false;
    if (state.niveau && f.niveau !== state.niveau) return false;
    if (state.part === "small" && f.minP > 10) return false;
    if (state.part === "large" && f.maxP <= 20) return false;
    if (state.part === "any") { /* pas de filtre */ }
    if (state.q) {
      const hay = norm(f.titre + " " + f.description + " " + (f.actions || []).join(" ") + " " + ((THEMES[f.theme] || {}).label || ""));
      if (!state.q.split(/\s+/).every((w) => hay.includes(norm(w)))) return false;
    }
    return true;
  }

  /* ---------- rendu des cartes ---------- */
  function card(f) {
    const t = THEMES[f.theme] || { label: f.theme, emoji: "" };
    const c = document.createElement("article");
    c.className = "card"; c.tabIndex = 0; c.setAttribute("role", "button");
    c.style.setProperty("--dotc", accentOf(f.theme));
    c.innerHTML = `
      <div class="card-top">
        <span class="card-theme"><span class="dot"></span>${t.emoji ? t.emoji + " " : ""}${t.label}</span>
        <span class="niveau">${f.niveauLabel || ""}</span>
      </div>
      <h3>${f.titre}</h3>
      <p>${(f.description || "").replace(/<[^>]+>/g, " ").slice(0, 160)}</p>
      <div class="card-meta">
        ${(f.actions || []).slice(0, 3).map((a, i) => `<span class="tag ${i === 1 ? "yellow" : i === 2 ? "teal" : ""}">${a}</span>`).join("")}
      </div>
      <div class="card-meta">
        <span class="meta-ic">⏱ ${f.duree || "?"}</span>
        <span class="meta-ic">👥 ${f.minP}${f.maxP !== f.minP ? "–" + f.maxP : ""}</span>
      </div>`;
    c.addEventListener("click", () => openDrawer(f));
    c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDrawer(f); } });
    return c;
  }

  let cardEls = [];
  function apply() {
    const list = FICHES.filter(match);
    grid.replaceChildren();
    cardEls = list.map(card);
    cardEls.forEach((el, i) => { el.style.transitionDelay = Math.min(i * 22, 400) + "ms"; grid.appendChild(el); });
    requestAnimationFrame(() => requestAnimationFrame(() => cardEls.forEach((el) => el.classList.add("in"))));
    empty.hidden = list.length > 0;
    stats.innerHTML = `<b>${list.length}</b> fiche${list.length > 1 ? "s" : ""} sur ${FICHES.length} · ${state.theme ? THEMES[state.theme].label : "tous thèmes"}`;
  }
  $("#resetAll").addEventListener("click", () => {
    Object.assign(state, { theme: "", niveau: "", part: "", q: "" });
    search.value = ""; renderChips(); apply();
  });

  /* ---------- drawer détail ---------- */
  const drawer = $("#drawer"), backdrop = $("#backdrop"), body = $("#drawerBody");
  const list = (html) => html && html.trim() ? `<ul>${html.replace(/<\/?ul>/g, "").replace(/<li>/g, "<li>')}</ul>` : "";
  function openDrawer(f) {
    const t = THEMES[f.theme] || { label: f.theme, emoji: "" };
    body.style.setProperty("--dotc", accentOf(f.theme));
    body.innerHTML = `
      <span class="d-kicker"><span class="dot"></span>${t.emoji ? t.emoji + " " : ""}${t.label}</span>
      <h2>${f.titre}</h2>
      <div class="d-badges">
        <span class="d-badge">🎚 ${f.niveauLabel}</span>
        <span class="d-badge">⏱ ${f.duree}</span>
        <span class="d-badge">🧰 ${f.preparation}</span>
        <span class="d-badge">👥 ${f.minP}${f.maxP !== f.minP ? "–" + f.maxP : ""} pers.</span>
      </div>
      ${f.description ? `<h4>En bref</h4><p>${f.description.replace(/\n/g, "<br>")}</p>` : ""}
      ${f.materiel ? `<h4>Matériel</h4>${list(f.materiel)}` : ""}
      ${f.deroule ? `<h4>Déroulé</h4>${list(f.deroule)}` : ""}
      ${f.description3 ? `<h4>Conseils</h4>${list(f.description3)}` : ""}
      ${f.description4 ? `<h4>Variante</h4>${list(f.description4)}` : ""}
      ${f.description5 ? `<h4>Source</h4><p>${f.description5}</p>` : ""}
      <a class="cta" href="https://tilab.bzh/?${f.id}" target="_blank" rel="noopener">Voir la fiche originale ↗</a>`;
    drawer.classList.add("open"); backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    drawer.scrollTop = 0; $("#drawerClose").focus();
    history.replaceState(null, "", "#" + f.id);
  }
  function closeDrawer() {
    drawer.classList.remove("open"); backdrop.classList.remove("open");
    document.body.style.overflow = "";
    history.replaceState(null, "", location.pathname);
  }
  $("#drawerClose").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);

  /* ---------- progression + bouton haut ---------- */
  const bar = $(".progress i"), top = $("#toTop");
  addEventListener("scroll", () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100 || 0) + "%";
    top.classList.toggle("show", h.scrollTop > 600);
  }, { passive: true });
  top.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- ouverture par URL ---------- */
  renderChips(); apply();
  const hash = location.hash.slice(1);
  if (hash) { const f = FICHES.find((x) => x.id === hash); if (f) openDrawer(f); }
})();
