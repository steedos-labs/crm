# CRM Project AI Development Instructions

This repository is a Steedos-based CRM application intended to be developed primarily by AI agents. Treat these instructions as the project-wide system prompt for all coding, configuration, and metadata work.

## Primary Goal

Build a maintainable CRM on Steedos using metadata-first development. Prefer declarative Steedos metadata, YAML configuration, and Amis low-code pages before writing custom imperative code.

## Tech Stack

- Platform: Steedos
- Backend: Node.js, TypeScript/JavaScript, Moleculer services
- UI: Steedos pages and Amis schemas
- Metadata: YAML files under Steedos package `main/default` folders
- Storage: MongoDB for Steedos metadata; PostgreSQL/MySQL may be used for business data when configured

## Repository Structure

Use the standard Steedos project layout:

```text
.
├── package.json
├── steedos-config.yml
├── steedos-packages/
│   └── <package>/
│       ├── package.json
│       ├── package.service.js
│       └── main/default/
│           ├── objects/
│           ├── applications/
│           ├── tabs/
│           ├── pages/
│           ├── triggers/
│           ├── functions/
│           ├── permissionsets/
│           └── data/
└── .github/copilot-instructions.md
```

If required project files are missing, create them using Steedos conventions instead of inventing a custom framework structure.

## Steedos Metadata Conventions

- Define data models as Steedos objects in `objects/<object_name>/`.
- All custom business object/table API names must start with the `crm_` prefix, for example `crm_leads`, `crm_accounts`, `crm_contacts`, and `crm_opportunities`.
- Do not create custom objects, database tables, seed data files, tabs, pages, functions, or references that use an unprefixed CRM table/object name.
- Use modern split metadata files:
  - Fields: `objects/<object_name>/fields/<field_name>.field.yml`
  - List views: `objects/<object_name>/listviews/<view_name>.listview.yml`
  - Permissions: `objects/<object_name>/permissions/<permission>.permission.yml`
  - Buttons: `objects/<object_name>/buttons/<button_name>.button.yml`
- Define applications in `main/default/applications/*.app.yml`.
- Define navigation tabs in `main/default/tabs/*.tab.yml`.
- Define custom pages with paired `.page.yml` and `.page.amis.json` files in `main/default/pages/`.
- Define triggers in `main/default/triggers/*.trigger.yml`.
- Define functions in `main/default/functions/*.function.yml`.
- Define seed data in `main/default/data/`.

## CRM Domain Principles

- Model CRM concepts explicitly: leads, accounts, contacts, opportunities, activities, tasks, products, contracts, invoices, and customer service records when needed.
- Prefer clear English API names and Chinese labels when the UI is Chinese.
- Use lookup or master-detail relationships for CRM entities instead of duplicating related data.
- Preserve auditability for business records; avoid destructive updates unless the requirement explicitly says so.
- Add permissions with every business object so visibility and CRUD behavior are intentional.
- Add useful list views for every object that end users need to browse.

## AI Development Workflow

- Before changing code, inspect existing files and follow current project patterns.
- When a Steedos-specific task matches an available Steedos skill or reference, use it before implementing.
- Prefer small, complete, working increments: object → fields → permissions → list views → tabs/pages → seed data → validation.
- Do not create isolated metadata that is unreachable from the app navigation.
- After metadata or server-side changes, restart or validate the Steedos project with the existing project commands when available.
- Keep generated content deterministic and easy to review.

## Coding Standards

- Use YAML for Steedos metadata and keep formatting consistent.
- Use JavaScript/TypeScript only when declarative metadata cannot express the behavior.
- Avoid broad `try/catch` blocks and silent failures. Surface validation errors clearly.
- Do not commit secrets. Keep `.env` local and use documented environment variables.
- Do not add unnecessary dependencies.
- Keep comments rare and only for non-obvious business logic.

## Build and Validation

- Use existing scripts in `package.json` when present.
- Typical commands are:
  - `npm install`
  - `npm start`
  - `npm run build`
- Do not introduce new build, lint, or test tools unless the task requires it.

## Output Expectations

- Deliver runnable Steedos metadata and configuration, not just explanations.
- Update related documentation only when it helps future AI agents or developers use the feature.
- For implementation summaries, state the concrete files changed and the business capability added.
