---
id: platform-overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

# Platform — Overview

Before the [Platform Table](./platform-table) and the rest of this section, it helps to know
what a platform actually *is* — the model everything else in Admin builds on.

**Permission level:** Admin

## What is a Platform

A **platform** is one physical thing in the field — a vehicle, a kiosk, a tablet, a
workstation. Every platform is made of one or more **devices**, each one a running instance of
the GetApp agent. Each agent carries its own identity (a device ID, a device type) and, when
it's part of a multi-device platform, a shared **platform ID** — the value every device
belonging to the same physical asset reports in common.

- A device with **no** platform ID is simply its own single-device platform.
- When several devices **share** a platform ID, one of them is confirmed as the
  **orchestrator** — the platform's **master** — through an enrollment handshake between the
  agents; the rest become its children. From that point on, the master owns the platform's
  identity: its name and its type come from the master, not from any individual child.

This is exactly what the dashboard mirrors: [Platform Table](./platform-table) shows one row
per platform (never a bare child device), and [Platform Information](./platform-information)
aggregates installed software, events, and metadata across **every** member device — because
that's what the platform actually is, not just its master.

## Device metadata vs. platform metadata

Not everything a device reports belongs to the platform. A device's own name and
miscellaneous local metadata stay device-owned even when that device is a platform's master;
only the platform's own name and shared metadata are treated as platform-level. This is why
[Platform Information](./platform-information)'s metadata list can show platform-wide values
alongside per-member device detail without the two getting mixed up.

## See also

- [Platform Table](./platform-table)
- [Platform Information](./platform-information)
- [Types — Overview](../create-and-manage-type/types-overview) — what a **device type** and
  **platform type** are
