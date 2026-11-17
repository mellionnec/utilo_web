/* Assistant Utilo — recommandation locale, sans service externe */
(function () {
  'use strict';

  var THEME_KEYWORDS = {
    se_rencontrer_differement: ['brise-glace', 'brise glace', 'glaçon', 'glace', 'se présenter', 'présentation', 'faire connaissance', 'rencontrer', 'apprendre à se'],
    federer_une_equipe: ['cohésion', 'cohesion', 'fédérer', 'fedérer', 'federer', 'équipe', 'equipe', 'lien', 'confiance', 'souder', ' groupe soudé'],
    reveiller_un_groupe: ['énergie', 'energie', 'réveiller', 'reveiller', 'bouger', 'corps', 'dynamiser', 'dynamique', 'réveiller un groupe'],
    se_reunir_autrement: ['réunion', 'reunion', 'réunir', 'reunir', 'stand-up', 'standup', 'bureau', 'matinale'],
    s_exprimer: ['parole', "s'exprimer", 'exprimer', 'expression', 'représenter', 'represente', 'voter', 'prendre la parole'],
    s_ameliorer_collectivement: ['bilan', 'rétrospective', 'retrospective', 'améliorer', 'ameliorer', 'retour sur', 'feedback', 'passé', 'expérience', 'apprentissage', 'collectivement'],
    p_reparer_une_collaboration: ['préparer', 'preparer', 'préparation', 'collaboration', 'parties prenantes', 'partenaire', 'terrain', 'avant de collaborer'],
    explorer_le_projet_en_amont: ['contexte', 'amont', 'explorer', 'défi', 'defi', 'comprendre le projet', 'parties', 'valeur', 'objectifs partagés'],
    se_projeter_planifier: ['planifier', 'planification', 'projection', 'étape', 'etape', 'ressource', 'feuille de route', 'tâche', 'tache', 'organiser le'],
    comprendre_les_beneficiaires: ['usager', 'usagers', 'bénéficiaire', 'beneficiaire', 'utilisateur', 'empathie', 'irritant', 'parcours', 'persona', 'terrain des usagers'],
    trouver_de_nouvelles_idees: ['idée', 'idee', 'idées', 'idees', 'idéation', 'ideation', 'brainstorm', 'créativité', 'creativite', 'imaginer', 'en générer'],
    passer_de_l_idee_au_concret: ['concret', 'prototype', 'prototyper', 'maquette', 'scénario', 'scenario', 'usage', 'mise en forme', 'passer au concret'],
    tester_ses_hypoteses: ['tester', 'test', 'hypothèse', 'hypothese', 'confronter', 'vérifier', 'verifier', 'focus group', 'terrain réel'],
    decider: ['décider', 'decider', 'décision', 'decision', 'choisir', 'choix', 'prioriser', 'priorité', 'arbitrer', 'trancher']
  };

  var STOP_MSGS = {
    greet: ['bonjour', 'salut', 'bonsoir', 'coucou', 'hello', 'hey'],
    help: ['aide-moi', "besoin d'aide", 'comment ça marche', 'comment ca marche', 'que peux-tu', 'que peux tu', 'que sais-tu']
  };

  function norm(s) {
    return s.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();
  }

  function parseParticipants(msg) {
    var m = msg.match(/(\d+)\s*(personnes?|participant|participants|pers\.?|gens|pax)/) ||
            msg.match(/(?:groupe|groupe de|équipe de)\s*(?:de\s*)?(\d+)/) ||
            msg.match(/(?:à|a|pour)\s*(\d+)\s*(?:personnes?|gens)/);
    return m ? parseInt(m[1], 10) : null;
  }

  function parseDuration(msg) {
    var m = msg.match(/(\d+)\s*h(?:eures?|rs?)?\s*(\d+)?/) || msg.match(/(\d+)\s*(?:min|minutes?)/);
    if (!m) return null;
    if (/h/.test(m[0])) return parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) : 0);
    return parseInt(m[1], 10);
  }

  function themeScores(msg) {
    var scores = {};
    Object.keys(THEME_KEYWORDS).forEach(function (code) {
      var s = 0;
      THEME_KEYWORDS[code].forEach(function (kw) {
        if (msg.indexOf(kw) !== -1) s += 5;
      });
      if (THEMES[code] && msg.indexOf(norm(THEMES[code].label)) !== -1) s += 6;
      if (s > 0) scores[code] = s;
    });
    return scores;
  }

  function scoreFiche(f, msg, tscores, npers, nmin) {
    var s = 0;
    if (tscores[f.theme]) s += tscores[f.theme];
    f.actions.forEach(function (a) {
      if (msg.indexOf(norm(a)) !== -1) s += 3;
    });
    if (msg.indexOf(norm(f.titre)) !== -1) s += 8;
    if (npers && f.minP != null) {
      if (npers >= f.minP && npers <= f.maxP) s += 4;
      else if (npers < f.minP && f.minP - npers <= 4) s += 1;
      else if (npers > f.maxP && npers - f.maxP <= 6) s += 1;
    }
    var m = f.duree ? f.duree.match(/(\d+)/) : null;
    if (nmin && m) {
      var d = parseInt(m[1], 10);
      var budget = /h/.test(f.duree) ? d * 60 : d;
      if (budget <= nmin) s += 2;
      else if (budget - nmin <= 30) s += 1;
      else s -= 2;
    }
    if (!f.niveau) s -= 1;
    return s;
  }

  function minToTxt(min) {
    if (min == null) return '';
    if (min >= 60 && min % 60 === 0) return (min / 60) + ' h';
    if (min >= 60) return Math.floor(min / 60) + ' h ' + (min % 60);
    return min + ' min';
  }

  function findBest(msg) {
    var npers = parseParticipants(msg);
    var nmin = parseDuration(msg);
    var tscores = themeScores(msg);
    var scored = FICHES.map(function (f) { return { f: f, s: scoreFiche(f, msg, tscores, npers, nmin) }; });
    scored.sort(function (a, b) { return b.s - a.s; });
    var best = scored.filter(function (x) { return x.s >= 3; }).slice(0, 3);
    if (!best.length && (npers || nmin)) best = scored.slice(0, 3);
    return { best: best, npers: npers, nmin: nmin, tscores: tscores };
  }

  function ficheMini(f) {
    var theme = THEMES[f.theme] || { label: f.theme, accent: 'ink' };
    var participants = f.participants ? f.participants + ' pers.' : '';
    var d = f.duree || '';
    return '<a class="as-card" href="fiche.html?id=' + encodeURIComponent(f.id) + '">' +
      '<span class="theme-tag"><span class="dot ' + (theme.accent || 'ink') + '"></span>' + theme.label + '</span>' +
      '<span class="as-title">' + f.titre + '</span>' +
      '<span class="as-meta">' + [d, participants].filter(Boolean).join(' · ') + '</span></a>';
  }

  function reply(msg) {
    var m = norm(msg);
    if (!m) return "Pose-moi ta question : contexte, nombre de participants, temps disponible… et je te propose des fiches adaptées !";
    if (STOP_MSGS.greet.some(function (g) { return m === g || m.indexOf(g) === 0; })) {
      return "Bonjour ! 👋 Je peux te recommander des fiches Utilo selon ton besoin : dis-moi l'objectif, le nombre de participants et le temps disponible. Par exemple : « brise-glace pour 12 personnes en 30 min ».";
    }
    if (STOP_MSGS.help.some(function (h) { return m.indexOf(h) !== -1; })) {
      return "Décris ta situation en langage courant : l'objectif de l'atelier (générer des idées, décider, briser la glace…), le nombre de personnes et le temps. Je cherche dans les 55 fiches et te propose les plus adaptées.";
    }
    var r = findBest(m);
    if (!r.best.length) {
      return "Je n'ai pas trouvé de fiche pour ça. Essaie de préciser l'objectif (idées, décision, brise-glace, bilan…) et le nombre de participants.";
    }
    var intro = "Voici ce que je te suggère";
    var ctx = [];
    if (r.npers) ctx.push("pour " + r.npers + " personnes");
    if (r.nmin) ctx.push("en " + minToTxt(r.nmin) + " max");
    if (ctx.length) intro += " " + ctx.join(" ");
    return intro + " :" + '<div class="as-cards">' + r.best.map(function (x) { return ficheMini(x.f); }).join('') + '</div>';
  }

  /* UI */
  var launcher = document.createElement('button');
  launcher.className = 'as-launcher';
  launcher.setAttribute('aria-label', 'Ouvrir l\'assistant Utilo');
  launcher.innerHTML = '✨';

  var panel = document.createElement('div');
  panel.className = 'as-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Assistant Utilo');
  panel.hidden = true;
  panel.innerHTML =
    '<div class="as-head"><span class="as-title-head">Assistant Utilo</span>' +
    '<button class="as-close" aria-label="Fermer">×</button></div>' +
    '<div class="as-body">' +
    '<div class="as-msg bot">Bonjour 👋 Décris ton besoin et je te recommande des fiches de facilitation adaptées.</div>' +
    '<div class="as-suggest">' +
    '<button class="as-chip">Brise-glace pour 12 personnes</button>' +
    '<button class="as-chip">Trouver des idées en 1h</button>' +
    '<button class="as-chip">Aider un groupe à décider</button>' +
    '<button class="as-chip">Faire un bilan de projet</button>' +
    '</div>' +
    '</div>' +
    '<form class="as-form"><input type="text" placeholder="Ex : atelier d\'idées pour 8 personnes en 2h" aria-label="Message à l\'assistant">' +
    '<button type="submit" aria-label="Envoyer">↑</button></form>';

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  var open = false;
  function toggle(v) {
    open = (v === undefined) ? !open : v;
    panel.hidden = !open;
    launcher.textContent = open ? '×' : '✨';
    launcher.setAttribute('aria-label', open ? 'Fermer l\'assistant Utilo' : 'Ouvrir l\'assistant Utilo');
    if (open) {
      var inp = panel.querySelector('input');
      if (inp) inp.focus();
    }
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) toggle(false);
  });
  document.addEventListener('click', function (e) {
    if (open && !panel.contains(e.target) && !launcher.contains(e.target)) toggle(false);
  });
  launcher.addEventListener('click', function () { toggle(); });
  panel.querySelector('.as-close').addEventListener('click', function () { toggle(false); });

  var body = panel.querySelector('.as-body');
  function addMsg(html, who) {
    var d = document.createElement('div');
    d.className = 'as-msg ' + who;
    d.innerHTML = html;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }
  panel.querySelectorAll('.as-suggest .as-chip').forEach(function (c) {
    c.addEventListener('click', function () {
      ask(c.textContent);
      panel.querySelector('.as-suggest').remove();
    });
  });
  panel.querySelector('.as-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = panel.querySelector('input');
    var v = input.value.trim();
    if (!v) return;
    input.value = '';
    ask(v);
  });
  function ask(v) {
    addMsg(v.replace(/</g, '&lt;'), 'user');
    setTimeout(function () { addMsg(reply(v), 'bot'); }, 350);
  }
})();
