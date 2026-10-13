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

![New Project wizard — a left step rail with General (required) plus Members, Docs, and GitOps (optional), showing the General step: a Project name field "payments-service" with the auto-assigned Project ID below it, Application/Infrastructure category chips with Application selected, and a Tags field](/img/manual/project/new-project-form.png)

| Step | Required? | What it's for |
|---|---|---|
| **General** | Yes | The name, category, tags, description, and distribution label |
| **Members** | Optional | Give people access up front |
| **Docs** | Optional | Write documentation that ships with the project |
| **GitOps** | Optional | Sync releases from a Git repository |

## General

| Field | Notes |
|---|---|
| **Project name** | One field that is both the project's identity and its display name. Unique across the deployment. No spaces, not only digits, no `@`, no length limit. Saved exactly as typed — not lowercased or hyphenated for you. The **Project ID** shown just below it mirrors what you type and is assigned automatically — it's there for reference only, not a separate field to fill in |
| **Categories** | The project type, picked as chips — see below |
| **Tags** | Up to three short tags — see below. Shown under the project name |
| **Description** | A longer description of the project, max 500 characters |
| **Distribution label** | The group the agent shows the project under. Pick an existing label from the dropdown or type a new one — see below |

### Tags

Type a tag and press **Enter** or a comma to add it; it appears as a chip below the field. Click
a chip's **×**, or press **Backspace** in the empty field, to remove the last one. The dropdown
suggests tags other projects already use, so similar projects share the same words.

- At most **three** tags per project.
- Each tag is up to **20** characters of lowercase letters, digits, and hyphens, for example
  `maps` or `field-ops`. What you type is lowercased and spaces become hyphens; anything else,
  such as `_` or `@`, is refused.

### Distribution label

Projects that share a label are grouped together in the agent. Open the dropdown to see the
labels that already exist, and type to filter them; pick one to join that group. To create a new
label, just type its name. The dropdown shows **Create “name”**, and the label is created when
the project is saved. The label is optional.

Only labels the project can use are suggested. A label can be tied to the **user** or
**technician** application category; a new Application project is a **user** application, so
labels tied to technician applications are not offered. Labels with no category, and every label
you create here, fit any project.

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
