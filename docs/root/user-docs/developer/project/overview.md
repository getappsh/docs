---
id: project-overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

# Project — Overview

A **project** is a versioned, publishable unit — not only "an app."

**Permission level:** Developer portal access. Creating a project needs the project-create
permission specifically.

## The real project types

| Type | What it is |
|---|---|
| `product` | Deliverable product — the default when creating one |
| `application` | A store app installed on platforms |
| `lib` | A library/driver dependency other projects can use |
| `bundle` | A bundle of other releases |
| `infra` | An infrastructure package |
| `config` | A CONFIG project — see [ConfigMap](../../admin/catalog/configmap) |
| `config_map` | A ConfigMap project |

All seven are created the same way — see
[New Project](./new-project#category-project-type).

## What a project owns

Whatever its type, a project owns a name (a unique slug), a display name, a description, and
a list of [releases](../release/release-overview). Beyond that, it's also the unit that owns:

- **[Members](./project-detail#members)** — who has access to it, independent of platform-wide
  Admin roles
- **[GitOps settings](./project-detail#gitops)** — an optional Git repository it syncs releases
  from instead of being authored by hand
- **Docs** — its own written documentation

## See also

- [My Projects](./my-projects)
- [New Project](./new-project)
- [Project Detail](./project-detail)
- [Release — Overview](../release/release-overview)
