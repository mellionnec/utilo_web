# PLAN — Utilo Web (site des fiches de facilitation Utilo)

> Plan technique Spec Kit correspondant à la spécification `utilo_web-spec.md`.

## Merged Requirements

Reprise des exigences EARS de la spec : 9 user stories (parcours, filtres thème/action/niveau/participants, recherche, fiche détail, assistant de recommandation, identité visuelle) et 9 exigences (5 fonctionnelles, 4 non fonctionnelles).

## Technical Approach — Point de vue architecte

Architecture **100 % statique**, sans framework ni build :

```
test_utilo/
├── index.html      — page d'accueil : filtres + grille des 55 cartes
├── fiche.html      — page de détail générique (fiche chargée via ?id=<slug>)
├── styles.css      — charte Ti Lab, design épuré, responsive, styles assistant
├── app.js          — filtres (thème, action, niveau, participants, recherche), rendu des cartes
├── assistant.js    — assistant de recommandation local (parsing FR + scoring + mini-chat)
├── fiches.js       — données : tableau des 55 fiches nettoyées
├── themes.js       — dictionnaire des 14 thèmes (libellé, emoji, description, couleur d'accent)
└── build.py        — script Python de régénération de fiches.js/themes.js depuis l'API YesWiki
```

**Décisions clés :**
- **Données embarquées** (`fiches.js`) plutôt qu'appel réseau : le site fonctionne hors-ligne côté données, pas de CORS, pas de dépendance à la disponibilité de tilab.bzh. Régénération par `build.py` (téléchargement de l'API, nettoyage YesWiki, extraction durée/préparation/participants).
- **Page détail unique** paramétrée (`fiche.html?id=…`) plutôt que 55 fichiers HTML : maintenance en un seul endroit.
- **Assets externes** : logo (hotlink tilab.bzh, `img` sans contrainte CORS), polices via Google Fonts (ABeeZee, Hind Siliguri — présentes dans la charte Ti Lab). Alternative auto-hébergée possible en copiant les woff2 dans le dépôt.
- **Assistant local** (aucune IA distante) : dictionnaire de mots-clés FR → 14 thèmes, extraction d'entités (nombre de personnes, durée en min/h), scoring pondéré des 55 fiches (thème ×5, action ×3, capacité ×4, durée ×2), top 3 rendu en mini-cartes.
- **Couleurs par thème** : alternance de 3 accents issus de la palette Ti Lab (turquoise, jaune, anthracite), appliqués en pastille (épuré) sur cartes et pages détail.

## Constraints & Assumptions

- Hébergement GitHub Pages du dépôt `mellionnec/fonds_vert`, dossier `test_utilo/` ; migration future prévue vers un dépôt dédié `utilo_web`.
- L'application GitHub connectée ne peut pas créer de dépôt ni activer Pages ; l'API REST n'est pas utilisée côté site.
- Le contenu original reste propriété du Ti Lab : liens systématiques vers les fiches et PDF originaux.
- Les fiches sans décompte de participants (ex. « Observations sur le vif ») sortent du filtre participants (comportement documenté).

## Risks & Trade-offs

| Risque | Mitigation |
|---|---|
| tilab.bzh indisponible → logo absent | Alt text présent ; possibilité d'auto-héberger le logo (binaire) |
| Fiches mises à jour côté Ti Lab | `build.py` régénère les données en une commande |
| Hotlink Google Fonts | Fallback `system-ui` si CDN indisponible |
| Assistant heuristique (pas un LLM) | Réponses restreintes à la recommandation de fiches ; chemin d'évolution : backend + API LLM |
| Duplication du contenu (droit à la copie) | Attribution systématique + mention « site miroir » en pied de page |

## Open Questions

- Migrer vers un dépôt dédié `utilo_web` (nécessite création manuelle ou permissions étendues de l'app GitHub) ?
- Auto-héberger logo et polices dans le dépôt pour une autonomie totale ?
- Brancher un vrai LLM sur l'assistant (nécessite un petit backend + clé API) ?
