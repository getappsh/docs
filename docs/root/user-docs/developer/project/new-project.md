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

## What you fill in

| Field | Notes |
|---|---|
| **Display name** | Shown throughout the portal — not unique |
| **Project slug** | Unique across the deployment. No spaces, not only digits, no `@`. Saved exactly as typed — not lowercased or hyphenated for you |
| **Tag line** | One short line, max 20 characters |
| **Category** | The project type — see below |

![New project form — Display name "Maps Pro", Project slug "maps-pro", Tag line "Offline field mapping", and a Category dropdown set to Product](/img/manual/project/new-project-form.png)

## Category (project type)

In practice, most projects you create day-to-day are one of two categories:

- **Application** — a standalone installable app with its own UI, the thing an end user or a
  technician actually opens
- **Infrastructure** — a background service, agent, or daemon with no UI of its own

The full picker also offers **Product** (the technical default), **Library**, **Bundle**,
**Configuration**, and **Config map** — see [Overview](./project-overview) for what each of those is.

Once created, a project's Category can still be changed later from its
[Settings tab](./project-detail#settings).

## After creating

The project is ready immediately — publish a [release](../release/release-overview) to make it
available to devices.

## See also

- [My Projects](./my-projects)
- [Project Detail](./project-detail)
- [Release — Overview](../release/release-overview)
