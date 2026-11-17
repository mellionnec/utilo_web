# TASKS — Utilo Web (site des fiches de facilitation Utilo)

> Liste des tâches Spec Kit correspondant à `utilo_web-spec.md` et `utilo_web-plan.md`.
> Coche = implémenté et vérifié en production (https://mellionnec.github.io/fonds_vert/test_utilo/).

## 1. Acquisition des données
- [x] 1.1 Identifier la source exploitable : API YesWiki `?api/forms/8/entries` (55 fiches JSON)
- [x] 1.2 Écrire `build.py` : téléchargement, nettoyage du balisage YesWiki, extraction (durée, préparation, participants, intervalle min/max), génération de `fiches.js` / `themes.js`
- [x] 1.3 Vérifier les 55 fiches (slugs uniques, thèmes rattachés, participants parsés sauf cas documenté)

## 2. Page d'accueil et filtres
- [x] 2.1 Grille de cartes responsive (titre, pastille thème, niveau, durée/préparation/participants, chips d'actions)
- [x] 2.2 Filtre **thème** (14 thèmes, tri alphabétique)
- [x] 2.3 Filtre **action** (actions distinctes issues de bf_motscles)
- [x] 2.4 Filtre **niveau** (1/2/3)
- [x] 2.5 Filtre **participants** (tranches 1-8, 9-15, 16-30, 30+, par recouvrement d'intervalles)
- [x] 2.6 Recherche plein texte tolérante (150 ms) + bouton Réinitialiser + compteur de résultats + état « aucune fiche »

## 3. Page de détail
- [x] 3.1 Page `fiche.html?id=<slug>` : description, matériel, déroulé, conseils, variantes, source
- [x] 3.2 Boutons : PDF original (tilab.bzh/files/…) et fiche originale (tilab.bzh/?<slug>)
- [x] 3.3 Suggestions « Dans le même thème » (3 fiches)
- [x] 3.4 Message « Fiche introuvable » + retour accueil

## 4. Charte graphique Ti Lab
- [x] 4.1 Palette (anthracite #3d3e40, jaune #ffc433, turquoise #3ec7c5) et fond blanc
- [x] 4.2 Polices ABeeZee + Hind Siliguri, titres surlignés en jaune
- [x] 4.3 Logo Utilo en en-tête (petit format) + pied de page
- [x] 4.4 Design épuré : hairlines, en-tête translucide sticky, boutons pilules
- [x] 4.5 Pastille de couleur par thème (turquoise/jaune/anthracite en alternance)

## 5. Assistant de recommandation
- [x] 5.1 Bouton flottant + panneau chat (design épuré)
- [x] 5.2 Parsing FR : participants, durée (min/h), mots-clés des 14 thèmes et des actions
- [x] 5.3 Scoring des 55 fiches et réponse top 3 (mini-cartes cliquables) + suggestions de questions
- [x] 5.4 Correction du bug de fermeture (`display:flex` écrasant `hidden`) : fermeture par ×, Échap et clic extérieur

## 6. Publication
- [x] 6.1 Pousser le site dans `mellionnec/fonds_vert` → dossier `test_utilo/` (GitHub Pages actif)
- [x] 6.2 Vérifier en production : 55 fiches complètes, filtres, fiches détail, assistant
- [ ] 6.3 Créer le dépôt dédié `utilo_web` et migrer (manuelle : l'app GitHub connectée n'a pas le droit de créer un dépôt)
- [ ] 6.4 Activer GitHub Pages sur le dépôt dédié (Settings → Pages → main / root)
- [ ] 6.5 Auto-héberger logo et polices (optionnel, autonomie totale)
- [ ] 6.6 Option « vrai » LLM pour l'assistant (nécessite backend + clé API)

### Critères d'acceptation (extraits)
| ID | Critère (EARS) | Statut |
|---|---|---|
| AC-1 | WHEN ouverture de l'accueil THEN 55 cartes triées alphabétiquement avec métadonnées complètes | ✅ |
| AC-2 | WHEN filtre participants = 9-15 THEN seules les fiches dont l'intervalle recouvre 9-15 | ✅ |
| AC-3 | WHEN fiche inconnue THEN message « Fiche introuvable » + lien retour | ✅ |
| AC-4 | WHEN question assistant « brise-glace pour 12 personnes en 30 min » THEN ≥ 2 fiches du thème « Se rencontrer » recommandées | ✅ |
| AC-5 | WHEN Échap ou clic extérieur THEN panneau assistant fermé | ✅ |
| AC-6 | WHEN affichage mobile THEN mise en page responsive complète | ✅ |
