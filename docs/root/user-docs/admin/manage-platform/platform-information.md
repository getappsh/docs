---
id: platform-information
title: Platform Information
sidebar_label: Platform Information
sidebar_position: 3
---

# Platform Information

The detail drawer for a single platform — installed software, recent events, and metadata,
aggregated across every device the platform is made of.

**Permission level:** Admin

## Where it lives

Click any row in the [Platform Table](./platform-table) (anywhere except the expander,
checkbox, Status cell, or `⋯` menu) to slide this drawer in from the right.

## What you see

- **Header** — platform name, ID, type, member-device count, and a status dot; the platform
  type card and last-seen chip sit just below
- **Installed software** — one row per app installed on any member device (deduplicated),
  aggregated across the whole platform, not just the master device
- **Events** — the platform's recent alerts, newest first, with level/time/message/source
  columns; collapses to the latest 4 with a **Show more** toggle beyond that
- **Metadata** — every key the platform reports (`platform_id`, `platform_type`,
  `member_count`, `master_device`, plus every custom metadata key from the agent), each row
  showing the raw key and value

![Platform Information drawer for "agent-edge" — Installed Software (GetAppAgent-Services 1.5.0, Installed), 3 Events, and Metadata including Agent Version and Enrollment date](/img/manual/manage-platform/platform-information.png)

## What you can do

Three actions in the drawer's footer (shared with the single-device drawer, so both stay in
parity):

| Action | What it does |
|---|---|
| **Journal** | Opens [Platform Journal](./platform-journal) — always visible, it's read-only |
| **Edit config** | Opens [Configuration](./configuration) — only shown with the `manage-config` permission |
| **Delete** | Removes the platform's master device, after confirmation — only shown with the `manage-discovery` permission |

Click a device inside the software/events rows' attribution, or the drawer's close button
(**✕**), to dismiss it.

## See also

- [Platform Table](./platform-table)
- [Configuration](./configuration)
- [Platform Journal](./platform-journal)
