---
id: new-project
title: New Project
sidebar_label: New Project
sidebar_position: 3
---

# New Project

Create a new [project](./project-overview).

**Permission level:** Developer portal access, plus the project-create permission (users
without it don't see this entry at all)

## Where it lives

**Develop → My Projects → New project**.

## A guided wizard

New Project is a wizard with a step rail down the left. Only **General** is required —
**Members**, **Docs**, and **GitOps** are optional, and you can fill them in any order or skip
them entirely. **Create Project** is available from any step, and you can revisit everything
later from the project's [Settings](./project-detail#settings).

![New Project wizard — a left step rail with General (required) plus Members, Docs, and GitOps (optional), showing the General step: a Project name field "payments-service" with the auto-assigned Project ID below it, Application/Infrastructure category chips with Application selected, and a Tagline field](/img/manual/project/new-project-form.png)

| Step | Required? | What it's for |
|---|---|---|
| **General** | Yes | The name, category, and tagline |
| **Members** | Optional | Give people access up front |
| **Docs** | Optional | Write documentation that ships with the project |
| **GitOps** | Optional | Sync releases from a Git repository |

## General

| Field | Notes |
|---|---|
| **Project name** | One field that is both the project's identity and its display name. Unique across the deployment. No spaces, not only digits, no `@`, no length limit. Saved exactly as typed — not lowercased or hyphenated for you. The **Project ID** shown just below it mirrors what you type and is assigned automatically — it's there for reference only, not a separate field to fill in |
| **Categories** | The project type, picked as chips — see below |
| **Tagline** | One short line, max 20 characters |

### Category (project type)

The category is chosen from chips. By default the wizard offers the two you reach for most:

- **Application** — a standalone installable app with its own UI, the thing an end user or a
  technician actually opens (selected by default)
- **Infrastructure** — a background service, agent, or daemon with no UI of its own

## Members

Give individual people access to the project up front, instead of inviting them afterwards.
This step needs the **update-project** role — if you don't have it the step is greyed out and
skipped, and you can still create the project.

Add people by email and assign a role — **Owner**, **Admin**, or **Member**. A debounced
search against the user directory helps you find people, but a typed email is valid even with
no match. The people you add are staged here and invited the moment the project is created.

## Docs

Write documentation that lives with the project. Add one or more docs, each a **title** and a
**Markdown** body. Like members, docs are staged here and created once the project exists.

## GitOps

Connect the project to a Git repository so its releases sync from the repo instead of being
authored by hand. Leave the clone URL empty to skip GitOps entirely.

| Field | What it does |
|---|---|
| **Git clone URL** | The HTTPS or SSH repository URL. Nothing else here matters until this is set |
| **Branch** | Which branch to track — defaults to the repository's default branch |
| **Clone interval (min)** | How often (in minutes) to poll the repo — defaults to 60 |
| **HTTPS username / password** | Credentials for a private repository |
| **.getapp file path** | Path within the repo to the `.getapp` manifest GitOps reads |

## After creating

Create Project is reachable from any step once General is valid. On success you land on the new
project's [Releases tab](./project-detail#releases), ready to publish its first
[release](../release/release-overview).

Members and docs are applied as a best-effort follow-up: if one can't be saved, the project is
still created and you get a warning rather than a failure — add the missing member or doc later
from [Project Detail](./project-detail).

## Customizing the form

The fields, their order, and which categories appear as chips are driven by a per-deployment
layout. An administrator can tailor the create-project form for an environment — relabel
fields, reorder them, or re-add the other categories — without changing the application. This
is an optional deployment-level override; out of the box you get the form described above.

## See also

- [My Projects](./my-projects)
- [Project Detail](./project-detail)
- [Release — Overview](../release/release-overview)
