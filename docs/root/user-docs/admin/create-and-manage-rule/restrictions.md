---
id: restrictions
title: Restrictions
sidebar_label: Restrictions
sidebar_position: 4
---

# Restrictions

The other rule type on the same [Rules](./rules-overview) screen. Where a policy is scoped to
releases, a restriction is scoped to **devices** — by device type, OS, or explicit device ID —
and is what shows up as the **Restricted** chip on the [Platform Table](../manage-platform/platform-table).

**Permission level:** Admin

## Where it lives

**Admin → Rules → New rule**, Type set to **Restriction** (or filter the table to
**Restrictions** to find existing ones).

## What you see

Same table, same detail panel, same [condition builder](./rules-overview#the-rule-form) as Policy —
the only differences are in the type and its association fields.

## What you can do

- Build the condition exactly as for a policy, except **version-typed fields
  (`release.version`, `installed.version`) are excluded** — a restriction can't be
  version-scoped, only device-scoped
- Associate the restriction with any combination of:
  - **Device types** — search and multi-select
  - **OS types** — search and multi-select
  - **Devices** — search and multi-select by device ID directly
- Toggle **Active**, then Create/Update as usual
- A device or platform that matches an active restriction's conditions shows the
  **Restricted** status chip wherever it appears (the Platform Table, its detail panel), with
  the blocking rule visible in that chip's detail panel

## Restriction messages

Each condition in the builder has an optional **Validation message** field, right below its
Field/Operator/Value row. Use it to explain, in plain language, *why* this condition exists —
e.g. "Requires firmware 2.0+" instead of making someone reverse-engineer the raw condition.
When the restriction blocks a platform, this message is what shows up alongside the blocking
rule wherever that platform's **Restricted** status is surfaced, so whoever's looking at it
knows why — not just that it's blocked.

## See also

- [Overview](./rules-overview)
- [Policy](./policy)
- [Debug](./debug)
- [Platform Table](../manage-platform/platform-table)
