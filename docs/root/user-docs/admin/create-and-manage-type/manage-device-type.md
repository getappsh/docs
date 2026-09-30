---
id: manage-device-type
title: Manage Device Type
sidebar_label: Manage Device Type
sidebar_position: 2
---

# Manage Device Type

Create, delete, and configure [device types](./types-overview#device-type) — plus which releases
each one is allowed to install.

**Permission level:** Admin

## Where it lives

**Admin → Types → Device Type** tab (deep-linkable via `?tab=device`).

## What you see

Name, **Fleet units** (how many real devices currently report this type), and a **⋯** menu. A
type shows up here either because it has a managed record (created via **New device type**)
or because it's simply present on a real device — the two are merged, so a type with 0 fleet
units can still exist, and a type with real units but no managed record can't be fully managed
yet.

![Device Types list showing 27 real types — agent (85 units), agent_linux, amit, amit_OneProject_Sanity, and more](/img/manual/types/device-types.png)

## What you can do

- **New device type** — name (spaces stripped) and an optional description
- **Delete** — only for types with a managed record; a type that's purely derived from device
  data shows an explanatory message instead of deleting anything
- **⋯ → Manage projects** — attach or detach whole projects (apps) this device type can offer
  at all
- **⋯ → Manage releases** (or the row's expand chevron) — the **offering policy** editor: for
  each project already attached, add one or more rules (combined with OR) restricting which
  release versions are installable — an **exact** pinned version, or a semver **range**
  (e.g. `≥1.2.0 ≤1.5.0`)

:::note Not the same "policy" as Rules
An offering policy controls what a type is *allowed to install at all* — catalog eligibility.
The [Policy](../create-and-manage-rule/policy) rules in Rules are a separate, fleet-wide
mechanism for gating or auto-pushing specific releases across devices. A release can be
excluded from a type's offering policy and still be the target of a completely unrelated push
policy — check both if something isn't installing as expected.
:::

## See also

- [Overview](./types-overview)
- [Manage Platform Type](./manage-platform-type)
- [Multiple Software Delivery](../catalog/multiple-software-delivery)
- [Policy](../create-and-manage-rule/policy)
