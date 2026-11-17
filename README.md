# Utilo Web

Miroir statique des **fiches de facilitation Utilo** (Ti Lab, [tilab.bzh](https://tilab.bzh/?Utilo)) : 55 fiches consultables avec filtres par thème, action, niveau et nombre de participants, page de détail par fiche et assistant de recommandation local.

## Structure

```
index.html      Page d'accueil (filtres + recherche + assistant)
fiche.html      Page de détail d'une fiche (?id=<slug>)
styles.css      Charte Ti Lab (anthracite #3d3e40, jaune #ffc433, turquoise #3ec7c5)
app.js          Filtres, recherche, rendu des fiches
assistant.js    Assistant de recommandation (local, sans API)
fiches.js       Données générées (55 fiches) — ne pas modifier à la main
themes.js       Données générées (thématiques et couleurs)
build.py        Régénération depuis l'API YesWiki du Ti Lab
```

## Mise à jour des données

```bash
python3 build.py
```

Récupère les fiches depuis `https://tilab.bzh/?api/forms/8/entries` et régénère `fiches.js` / `themes.js`.

## Déploiement

GitHub Pages, branche `main`, racine du dépôt : https://mellionnec.github.io/utilo_web/

## Développement piloté par la spécification

Ce dépôt utilise [Spec Kit](https://github.com/github/spec-kit) : voir `.specify/README.md` et `specs/001-site-utilo/` (commandes `/specify`, `/plan`, `/tasks`, `/implement`).

## Crédits

Guide Utilo © Ti Lab (2021), https://tilab.bzh. Ce site est un miroir de consultation ; chaque fiche renvoie vers l'original.
