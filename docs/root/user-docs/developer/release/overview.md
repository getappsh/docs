---
id: release-overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

# Release — Overview

**A release is an artifact + a manifest.** The artifact is what gets delivered; the manifest
tells the agent what to *do* with it once it arrives.

**Permission level:** Developer portal access; specific actions need the roles noted on each
page in this section.

## Artifact

One or more files attached to the release — an installer, a binary, a docker image, an rpm/deb
package, a data file. Exactly one can be flagged as the **install** artifact: the thing that
actually runs. See [Attach an Artifact](./attach-artifact) for pulling one in from an existing
source instead of uploading fresh bytes.

## Manifest

Underneath, the agent installs a release by running `install.yaml` — the Deploy V2 manifest —
an ordered list of **tasks**. Each task carries:

- A **type** — the action it performs: `Execute`, `Config`, `Revert`, `Verification`, `Map`,
  or `Deploy` (which **orchestrates** installing a *dependent* release's own manifest in turn,
  nesting one release's install inside another's)
- A **deploy method** — `MSI`, `RPM`, `DEB`, `Script`, `DockerCompose`, `Helm`, `API`, `SSE`...
- Fields that can reference the release's own **data and metadata** at run time instead of a
  fixed value (e.g. a timeout sourced from `Release.metadata.timeoutInstallation`)

`install.yaml` is a reserved name — the wizard blocks uploading a file with it directly. The
concepts above (tasks, actions, orchestrated dependents, metadata templating) are real and
already how Deploy V2 works; the manifest is composed server-side, not hand-edited through the
dashboard today.

## Lifecycle

A release moves through a real status lifecycle: `draft` → `in_review` → `approved` →
`released` — or `archived` / `error`. Only `released` is considered by
[Multiple Software Delivery](../../admin/catalog/multiple-software-delivery),
[offering policies](../../admin/create-and-manage-type/manage-device-type), and
[Policy](../../admin/create-and-manage-rule/policy) rules.

## See also

- [Create a Release](./create-release)
- [Attach an Artifact](./attach-artifact)
- [Manage a Release](./manage-release)
- [My Releases](./my-releases)
