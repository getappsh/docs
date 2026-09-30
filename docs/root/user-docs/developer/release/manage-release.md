---
id: manage-release
title: Manage a Release
sidebar_label: Manage a Release
sidebar_position: 4
---

# Manage a Release

Once a release exists, editing it directly is deliberately limited — most of what you'd want
to do to it happens by pointing other things *at* it instead.

**Permission level:** `update-release` to change a draft; `edit-released-release` (a separate,
narrower permission) to edit one that's already `released`

## Where it lives

[Project Detail](../project/project-detail) → **Releases** → select a release.

## You generally can't edit a published release

A `draft` or `in_review` release stays fully editable in the [wizard](./create-release). Once
a release is `released`, it's effectively locked — editing it back open needs the specific
`edit-released-release` permission, which most people won't have. If you need to change
something, [Duplicate](./create-release#duplicating-from-another-release) it into a new version
instead of trying to edit the original.

## Status changes

A release's status can be moved directly: **Draft → In Review → Released → Archived**.
**Archived** is the one status change available from *any* state — including a released
release — so it's the escape hatch for "this needs to stop being offered right now" without
touching its content. Treat it as the emergency option, not routine cleanup.

## Everything else happens by linking to it

A release itself doesn't have settings beyond status. What it's *for* is controlled elsewhere,
all pointing back at this release:

| To do this | Go to |
|---|---|
| Restrict which device type can install it | [Manage Device Type](../../admin/create-and-manage-type/manage-device-type) — offering policy |
| Gate or auto-push it fleet-wide by rule | [Policy](../../admin/create-and-manage-rule/policy) / [Push Policy](../../admin/create-and-manage-rule/push-policy) |
| Actually deploy it to platforms now | [Multiple Software Delivery](../../admin/catalog/multiple-software-delivery) |

## See also

- [Create a Release](./create-release)
- [Overview](./release-overview)
