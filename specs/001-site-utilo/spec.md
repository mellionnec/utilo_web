# SPEC — Utilo Web (site des fiches de facilitation Utilo)

> Retranscription Spec Kit (github/spec-kit) du site `test_utilo` hébergé sur GitHub Pages.
> Ce document décrit **ce qui est** (spécification rétrospective du site livré) ; il peut servir de base à la migration vers un dépôt dédié `utilo_web`.

## WHAT

Un site statique qui présente les 55 fiches de facilitation du guide Utilo (réseau du Ti Lab, 2021) et permet de les retrouver facilement selon ses besoins d'animation (thème, action, niveau, nombre de participants), sans service externe ni tracking.

## WHY

- Rendre les fiches Utilo accessibles et filtrables, alors que le site source (YesWiki, https://tilab.bzh/?Utilo) ne propose pas de recherche avancée par critères d'animation.
- Conserver une trace pérenne et légère (site miroir statique, GitHub Pages) d'un contenu de référence en innovation publique.
- Aider les facilitant·es à choisir rapidement un outil adapté à leur contexte.

## Sources et contraintes

- Source de données : API YesWiki `https://tilab.bzh/?api/forms/8/entries` (JSON, 55 fiches).
- Charte graphique : palette du site Ti Lab (`custom/css-presets/Ti Lab.css`) : anthracite `#3d3e40`, jaune `#ffc433`, turquoise `#3ec7c5`, gris clair `#f2f2f2`. Polices : ABeeZee (titres) et Hind Siliguri (texte).
- Logo : `https://tilab.bzh/files/Utilo_2023_10_24_Logo_Coul_20251217154511_20251217160540.png`.
- Contrainte d'hébergement : 100 % statique (HTML/CSS/JS vanilla), aucune dépendance, aucun backend, aucune clé API dans le code client.

---

## User Stories

### Story 1 — Parcourir les fiches
**En tant que** facilitant·e, **je veux** voir toutes les fiches de facilitation en une page, **afin de** me faire une idée des outils disponibles.

#### Scenario: Affichage de la liste
- **WHEN** l'utilisateur ouvre la page d'accueil **THE SYSTEM SHALL** afficher les 55 fiches sous forme de grille de cartes, triées alphabétiquement, avec pour chaque fiche : titre, thème (libellé + pastille de couleur), niveau, durée, préparation, nombre de participants et mots-clés d'action.

### Story 2 — Filtrer par thème
**En tant que** facilitant·e, **je veux** filtrer les fiches par thématique, **afin de** trouver les outils correspondant à mon objectif d'atelier.

#### Scenario: Filtre thème
- **WHEN** l'utilisateur choisit un thème dans le filtre « Thème » **THE SYSTEM SHALL** n'afficher que les fiches de ce thème et indiquer le nombre de résultats sur 55.

### Story 3 — Filtrer par action
**En tant que** facilitant·e, **je veux** filtrer par action (ex. « Se présenter », « Prioriser »), **afin de** cibler l'effet recherché.

#### Scenario: Filtre action
- **WHEN** l'utilisateur choisit une action **THE SYSTEM SHALL** n'afficher que les fiches dont les mots-clés contiennent cette action. **THE SYSTEM SHALL** proposer dans la liste toutes les actions distinctes du corpus, triées alphabétiquement.

### Story 4 — Filtrer par niveau
**En tant que** facilitant·e débutant·e ou confirmé·e, **je veux** filtrer par niveau de pratique (1 Débutant, 2 Intermédiaire, 3 Confirmé), **afin de** choisir une fiche adaptée à mon expérience.

#### Scenario: Filtre niveau
- **WHEN** l'utilisateur sélectionne un niveau **THE SYSTEM SHALL** n'afficher que les fiches de ce niveau.

### Story 5 — Filtrer par nombre de participants
**En tant que** facilitant·e, **je veux** filtrer selon la taille du groupe, **afin de** ne voir que les fiches réalisables avec mon nombre de participants.

#### Scenario: Filtre participants
- **WHEN** l'utilisateur choisit une tranche (1-8, 9-15, 16-30, 30 et +) **THE SYSTEM SHALL** afficher les fiches dont l'intervalle de participants recouvre la tranche choisie.

### Story 6 — Rechercher
**En tant que** visiteur, **je veux** une recherche plein texte, **afin de** retrouver une fiche par son nom ou son contenu.

#### Scenario: Recherche
- **WHEN** l'utilisateur saisit au moins un mot dans le champ de recherche **THE SYSTEM SHALL** filtrer en direct (tolérance de 150 ms) sur le titre, la description et les actions.

### Story 7 — Consulter une fiche
**En tant que** facilitant·e, **je veux** consulter le détail complet d'une fiche, **afin de** l'animer pas à pas.

#### Scenario: Page de détail
- **WHEN** l'utilisateur clique sur une carte **THE SYSTEM SHALL** ouvrir la page de détail de la fiche avec : titre, thème, niveau, durée, préparation, participants, description, matériel, déroulé pas à pas, conseils, variantes, source, un bouton vers le PDF original et un lien vers la fiche sur tilab.bzh, ainsi que 3 fiches du même thème.
- **WHEN** l'identifiant de fiche est inconnu ou absent **THE SYSTEM SHALL** afficher un message « Fiche introuvable » avec un lien de retour.

### Story 8 — Être aidé dans le choix
**En tant que** facilitant·e pressé·e, **je veux** décrire mon besoin en langage courant et recevoir des suggestions, **afin de** ne pas parcourir 55 fiches.

#### Scenario: Assistant de recommandation
- **WHEN** l'utilisateur ouvre l'assistant (bouton flottant ✨) et saisit une requête **THE SYSTEM SHALL** détecter le nombre de personnes, la durée et l'objectif, noter les 55 fiches et répondre en français avec au plus 3 fiches recommandées sous forme de mini-cartes cliquables.
- **WHEN** aucune fiche n'obtient un score suffisant **THE SYSTEM SHALL** proposer de préciser l'objectif et/ou le nombre de participants.
- **WHEN** l'assistant est ouvert **THE SYSTEM SHALL** permettre sa fermeture par le bouton ×, la touche Échap ou un clic extérieur, et **SHALL** garder le bouton flottant visible (icône ×/✨ selon l'état).

### Story 9 — Reconnaître la charte Ti Lab
**En tant que** visiteur du réseau Utilo, **je veux** retrouver l'identité visuelle du Ti Lab, **afin de** identifier immédiatement la provenance des fiches.

#### Scenario: Identité visuelle
- **WHEN** l'utilisateur affiche n'importe quelle page **THE SYSTEM SHALL** présenter : fond blanc, logo Utilo en en-tête, palette Ti Lab (anthracite/jaune/turquoise), polices ABeeZee/Hind Siliguri, titres surlignés en jaune, et une pastille de couleur par thème (turquoise, jaune, anthracite en alternance).
- **WHEN** l'utilisateur affiche la page sur mobile **THE SYSTEM SHALL** conserver une lisibilité et une ergonomie complètes (mise en page responsive).

---

## Requirements (EARS)

### Fonctionnels
1. **WHEN** le site est chargé **THE SYSTEM SHALL** fonctionner entièrement côté client, sans appel réseau autre que les ressources statiques, le logo tilab.bzh et la fiche PDF liée.
2. **WHEN** un filtre est modifié **THE SYSTEM SHALL** recalculer la liste affichée sans rechargement de page.
3. **WHEN** l'utilisateur clique « Réinitialiser » **THE SYSTEM SHALL** vider tous les filtres et la recherche.
4. **WHEN** aucune fiche ne correspond aux filtres **THE SYSTEM SHALL** afficher un message « Aucune fiche ne correspond ».
5. **WHEN** le contenu des fiches est affiché **THE SYSTEM SHALL** présenter le texte nettoyé du balisage YesWiki (guillemets doublés, balises HTML wiki) sans caractères parasites.

### Non fonctionnels
6. **THE SYSTEM SHALL** être hébergé sur GitHub Pages (branche `main`, dépôt dédié `mellionnec/utilo_web` (racine)).
7. **THE SYSTEM SHALL** charger en moins d'une seconde sur une connexion standard (poids total < 250 Ko hors PDF externes).
8. **THE SYSTEM SHALL** respecter l'accessibilité de base : labels de formulaires, aria-labels des boutons, navigation clavier, contrastes suffisants.
9. **THE SYSTEM SHALL** mentionner la source (guide Utilo / Ti Lab, 2021) et un lien vers la fiche originale sur chaque page de détail.
