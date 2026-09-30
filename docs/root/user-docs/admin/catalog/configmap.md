---
id: configmap
title: ConfigMap
sidebar_label: ConfigMap
sidebar_position: 3
---

# ConfigMap

Shared configuration — groups of key/value settings defined once and applied across many
devices, by device type or by explicit device ID, instead of repeating them per device.

**Permission level:** Admin

## Where it lives

**Admin → Catalog → Configurations** tab. This is a different surface from per-device
[Configuration](../manage-platform/configuration): a CONFIG-type project here is the *source*,
and a device's Configuration screen shows it read-only under **Linked ConfigMaps** once
attached.

## What you see

- A list of every CONFIG project, with its display name and internal name
- Selecting one shows its **Groups** (hidden groups — empty scaffolding with no content, no
  secrets, and not global — are collapsed by default behind a **Show all** toggle) and the
  **ConfigMaps** already applied to it, as clickable chips
- Each group row: name (+ optional Git file path), scope (`global` or `scoped`), and a count
  of sensitive keys
- A revision banner: **DRAFT #N** with **Publish**/**Discard**, or **ACTIVE** with its version

## What you can do

- **New group** — create a group (name, optional display name, global flag, optional Git file
  path, comma-separated sensitive keys, and its YAML content); creating or editing anything
  here opens a draft revision automatically if one isn't already open
- Edit or delete an existing group from its row
- **Publish** the draft to make it the active revision, or **Discard** it to throw the draft
  away
- Click a ConfigMap chip to open its **associations** — which device type ID or explicit
  device IDs it applies to — and add or remove associations from there

:::caution No demo data
Unlike per-device Configuration, this screen has no demo-mode fallback — it calls the real API
directly and returns nothing in a demo session. Real screenshots need a live backend.
:::

## See also

- [Configuration](../manage-platform/configuration)
- [Platform Table](../manage-platform/platform-table)
