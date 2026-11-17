# Constitution — Utilo Web

> Principes fondamentaux du projet, appliqués par les agents Spec Kit lors de /specify, /plan, /tasks et /implement.

## Principes

1. **Statique avant tout.** Le site est 100 % statique (HTML/CSS/JS vanilla), sans framework ni backend ni clé API côté client. Toute évolution doit rester déployable sur GitHub Pages sans build.
2. **Une seule source de vérité pour les données.** Les fiches proviennent de l'API YesWiki du Ti Lab (`?api/forms/8/entries`) et sont régénérées par `build.py` → `fiches.js` / `themes.js`. Ne jamais modifier les données générées à la main.
3. **Attribution obligatoire.** Chaque page crédite le guide Utilo / Ti Lab (2021) et lie vers la fiche originale. Le site est un miroir respectueux, pas une réappropriation.
4. **Charte Ti Lab.** Palette anthracite `#3d3e40`, jaune `#ffc433`, turquoise `#3ec7c5` ; polices ABeeZee + Hind Siliguri ; design épuré (fond blanc, hairlines, titres surlignés jaune, pastilles de couleur par thème).
5. **Accessibilité et sobriété.** Labels, aria, navigation clavier, contrastes, responsive. Pas de tracking, pas de dépendance inutile.
6. **Langue.** Toute la documentation (spec, plan, tasks, code, UI) est en français.
7. **Chaque changement passe par la spec.** On modifie `spec.md` d'abord, puis `plan.md`/`tasks.md`, puis le code. Le code sans scénario EARS correspondant est une dette.

## Métriques de succès

- 55 fiches complètes et à jour, vérifiables en production.
- Site utilisable en moins d'une seconde sur connexion standard (< 250 Ko hors PDF externes).
- Aucune régression : les critères d'acceptation de `tasks.md` restent verts.
