---
id: project-detail
title: Project Detail
sidebar_label: Project Detail
sidebar_position: 4
---

# Project Detail

Everything about one project, across six tabs.

**Permission level:** Developer portal access; some tabs and actions need project-specific
roles noted below.

## Where it lives

Open any project from [My Projects](./my-projects) or [My Releases](../release/my-releases).

## Overview

Summary of the project and its latest release at a glance.

![Project "Agent" Overview tab — Total Downloads, Latest Version, Published Releases, and Members cards, plus a Downloads-over-time chart and a Release status donut](/img/manual/project/project-overview.png)

## Releases

Every release of this project. See [Release — Overview](../release/release-overview) for what a
release is made of, and [ConfigMap](../../admin/catalog/configmap) if this is a
Configuration-type project.

![Project "Agent" Releases tab — release 1.5.3 selected, showing its release notes, details, and 4 artifacts including the flagged install file](/img/manual/project/project-releases-detail.png)

## Events

A project-scoped activity log — discovery, delivery, deploy, upload, SBOM scan, and **Git
sync** events (`git_sync_success` / `git_sync_failed` — see [GitOps](#gitops) below), each with
a severity and timestamp. Filterable by text.

## Docs

The project's own documentation, written when the project was created (or edited after).

## Members

Who has access to this project, separately from the platform-wide Admin roles.

- **Invite** by email — a debounced search against the user directory assists you, but a
  typed email is valid even with no match; assign a role: **project-owner**,
  **project-admin**, or **project-member**
- **Remove** a member from the project

## Settings

### General

Edit the project's display name, description, tag line, and Category (see
[New Project](./new-project#category-project-type)).

### GitOps

Sync this project's releases from a Git repository instead of authoring them by hand:

| Field | What it does |
|---|---|
| **Repository URL** | The Git clone URL. Nothing else here matters until this is set |
| **Branch** | Which branch to track |
| **Clone interval** | How often (in minutes) to poll the repo — defaults to 60 |
| **HTTPS username / password** | Credentials for a private repository |
| **GetApp file path** | Path within the repo to the file GitOps reads for release definitions |

A successful or failed sync shows up as a `git_sync_success` / `git_sync_failed` event on the
[Events](#events) tab, so that's the first place to check if a sync isn't behaving as
expected.

## See also

- [Release — Overview](../release/release-overview)
- [My Projects](./my-projects)
