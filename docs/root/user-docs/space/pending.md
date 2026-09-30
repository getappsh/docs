---
id: pending
title: Pending
sidebar_label: Pending
sidebar_position: 8
---

# Pending

When a device reports a Group, Platform, or Device Type the system doesn't recognize yet, the
version tied to it is auto-paused here instead of silently failing — this is where you
recognize it (or reject it).

**Permission level:** Admin portal access to view; `manage-discovery` (or admin) to resolve or
reject anything. (Reached via **Admin → Pending**; filed here under Space in this guide by
choice.)

## Where it lives

**Admin → Pending**. Deep-linkable to a specific tab from a notification
(`?tab=platform|deviceType|group|versions`).

## What you see

Four tabs: **Versions**, **Platform**, **Device Type**, **Group** — each filterable by status
(**Pending** / **Accepted** / **Rejected**) and searchable.

- **Versions** — a release that referenced an unrecognized resource, held back from normal
  processing
- **Platform / Device Type / Group** — the actual unrecognized resource itself, by the token
  the device reported

## What you can do

- **Resolve** a pending resource — recognizes it (creates or maps it to something real). Any
  pending Versions that were blocked on it clear automatically once it's resolved
- **Reject** a resource or a version, with a reason
- **Accept** or **Reject** a pending Version directly
- Multi-select resources (Pending status only) for a bulk **Resolve** or **Reject**
- Open a detail view on any row before deciding

## See also

- [Users & Roles](./users-and-roles)
- [Groups](../admin/groups/groups-overview)
- [Types — Overview](../admin/create-and-manage-type/types-overview)
