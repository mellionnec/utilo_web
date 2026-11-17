# Utilo · Fiches de facilitation

Site statique reprenant les 55 fiches de facilitation du guide **Utilo** du réseau du [Ti Lab](https://tilab.bzh/?Utilo) (2021) : brise-glace, exercices de cohésion, ateliers d'idéation, outils de décision, etc.

## Fonctionnalités

- Page d'accueil avec filtres : **thème** (14), **action**, **niveau** (1 à 3) et **nombre de participants**, plus une recherche plein texte
- Une page de détail par fiche : description, matériel, déroulé, conseils, variantes, source, lien vers le PDF original
- 100 % statique (HTML + CSS + JS vanilla), sans dépendance ni tracking

## Mettre à jour les fiches

1. Télécharger l'export YesWiki : `curl -s "https://tilab.bzh/?api/forms/8/entries" -o entries.json`
2. Régénérer `fiches.js` / `themes.js` avec le script `build.py` (Python 3, sans dépendance)
3. Commiter et pousser

## Crédits

Contenu original : réseau Utilo / Ti Lab (Région Bretagne), guide de facilitation 2021, licence libre d'après le site source. Ce dépôt est un site miroir statique ; les fiches originales restent sur https://tilab.bzh/?Utilo.
