---
id: platform-journal
title: Platform Journal
sidebar_label: Platform Journal
sidebar_position: 5
---

# Platform Journal

A live, filterable timeline of everything that's happened to a platform — deliveries,
deployments, releases, and system events — across every device it's made of.

**Permission level:** Admin (read-only for anyone who can open the platform)

## Where it lives

[Platform Table](./platform-table) or [Platform Information](./platform-information) → **⋯ →
Journal** (table row) or the drawer's **Journal** button.

## What you see

- **Header** — platform name, ID, a **LIVE** badge once the activity stream connects, and a
  running total of activities and failures
- **Phase tabs** — `All phases` / `delivery` / `deploy` / `release` / `device` / `project` /
  `system`
- Each row: absolute + relative timestamp, phase chip, device ID + version (if applicable),
  type/actor/source, a status icon (spinner while in progress, ✓ on success, a warning glyph
  on failure), the message, and a status pill

![Platform Journal for "agent-edge" — 2 activities: a completed DEPLOY of GetAppAgent-Services@1.5.0, and a DEVICE discovery event](/img/manual/manage-platform/platform-journal.png)

## What you can do

- Click a **phase tab** to filter to just that kind of activity
- **Failures only** — toggle to see just what went wrong, with a live failure count
- **Search** — filter by message, device ID, type, version, or actor
- Leave it open — new events push in over SSE and merge into the list live (a `started` entry
  automatically drops its spinner once a matching `completed`/`failed` entry for the same
  device+catalog+version arrives)

## See also

- [Platform Table](./platform-table)
- [Platform Information](./platform-information)
