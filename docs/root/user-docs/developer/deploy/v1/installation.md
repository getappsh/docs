---
id: deploy-v1-installation
title: Installation
sidebar_label: Installation
sidebar_position: 2
---

# Installation

How [Deploy V1](./deploy-v1-overview) actually picks and runs an artifact — no manifest to declare it
explicitly, so the agent works it out from what's there.

## Picking the artifact

1. **First pass** — look for an artifact flagged `is_executable` (the same **install** flag you
   set in [Components](../../release/create-release#step-2--components) when authoring the
   release). Route it by file extension: `.msi` → the MSI installer, `.rpm` → the RPM
   installer, anything else → run it as a script
2. **Second pass** — if nothing was flagged, fall back to the same extension-based routing over
   every artifact instead

Whichever artifact is picked, it's the **only** one that runs — V1 installs exactly one file
(script, MSI, or RPM), with whatever arguments it was authored with, and nothing else. No
multiple ordered steps, no dependents, no config/map delivery. That's what
[Deploy V2](../v2/deploy-v2-overview) adds.

## See also

- [Overview](./deploy-v1-overview)
- [Deploy V2 — Tasks](../v2/deploy-v2-tasks)
