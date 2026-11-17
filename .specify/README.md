# .specify — Spécification pilotée (Spec Kit)

Ce dépôt suit l'approche [Spec Kit](https://github.com/github/spec-kit) (spec-driven development).

## Arborescence

```
.specify/
├── memory/
│   └── constitution.md   # principes du projet (toujours appliqués)
└── README.md             # ce fichier
specs/
└── 001-site-utilo/
    ├── spec.md           # exigences (user stories + EARS)
    ├── plan.md           # plan technique, risques, questions ouvertes
    └── tasks.md          # tâches incrémentales + critères d'acceptation
```

## Commandes Spec Kit (à utiliser avec un agent IA type Copilot/Claude Code)

| Commande | Rôle |
|---|---|
| `/specify` | Rédiger ou modifier `spec.md` à partir d'un besoin (WHAT/WHY, user stories, scénarios EARS « WHEN… THE SYSTEM SHALL… ») |
| `/plan` | Produire le plan technique `plan.md` à partir de la spec |
| `/tasks` | Décomposer le plan en tâches vérifiables `tasks.md` |
| `/implement` | Implémenter les tâches en suivant les critères EARS |

## Pour une initialisation complète par le CLI

Si vous souhaitez régénérer la structure officielle (scripts de vérification, commandes multi-outils) :

```bash
npm install -g @github/spec-kit
specify init --here --ai copilot   # ou claude / cursor
```

Les fichiers existants (`constitution.md`, `specs/…`) seront repris par la structure générée.
