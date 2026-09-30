---
id: deploy-v1-overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

# Deploy V1 — Overview

The original install path — no manifest, no tasks: one artifact, installed directly. This is
what agent **1.5** runs; [Deploy V2](../v2/deploy-v2-overview) is the newer, manifest-driven engine that
later agent versions add alongside it.

## How the agent picks V1

This is the fallback: if a release's delivered artifacts directory has **no** `install.yaml`,
the agent deploys it the V1 way instead of handing off to
[Deploy V2](../v2/deploy-v2-overview).

## What V1 checks before installing

Unlike V2 (which does its own checks internally), V1's own code path explicitly:

1. Confirms the release's catalog ID is actually in this device type's offering tree — refuses
   otherwise
2. Enforces policy evaluation at the deploy stage, if policy enforcement is turned on for that
   stage (`ENFORCE_POLICIES` / enforcement mode) — a failed policy blocks the deploy with the
   failure reason

## Then it installs — see [Installation](./deploy-v1-installation)

## See also

- [Installation](./deploy-v1-installation)
- [Deploy V2 — Overview](../v2/deploy-v2-overview)
