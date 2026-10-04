---
id: multiple-software-delivery
title: Multiple Software Delivery
sidebar_label: Multiple Software Delivery
sidebar_position: 2
---

# Multiple Software Delivery

Push a released application version from the Catalog out to one or more platforms, via a
3-step wizard.

**Permission level:** Admin

## Where it lives

**Admin → Catalog → Applications** tab → **Install on platform** on an app's row.

## What you see and can do

### Step 1 — Select version

Every **released** version of the app (draft/unreleased versions aren't offered), newest
first, each marked with its release date and a **Latest** chip where it applies. A search box
appears once there are 8+ released versions. Pick one, then **Next: Select platforms**.

![Step 1 of the Install on platform wizard for Agent-UI, showing versions v1.5.1 (Latest) through v1.0.6 with release dates](/img/manual/multiple-software-delivery/step1-select-version.png)

### Step 2 — Select platforms

The same platform picker used elsewhere in Admin: search by name/ID/group, an advanced
**Rules** search (rule-engine query or a quick metadata match), a select-all checkbox, and one
row per **platform** (never a bare child device) with its type, group, device count, and
status. Multi-select as many as you need, then **Review**.

![Step 2 of the Install on platform wizard, showing 100 real platform rows with two selected](/img/manual/multiple-software-delivery/step2-select-platforms.png)

### Step 3 — Review

A summary (application + version, target platform count) and the full list of selected
platforms. Any platform that violates an active rule/restriction is flagged inline with the
violated rule's name, so you can catch it before pushing rather than after. Deselect a
platform here with its **✕** if you change your mind. **Install on N platforms** sends the
push.

![Step 3 review screen showing Agent-UI v1.5.1 targeting 2 platforms with 0 alerts](/img/manual/multiple-software-delivery/step3-review.png)

:::note What "installed" means here
A successful click means the push was **accepted**, not that installation finished — the
gateway delivers it asynchronously. Watch progress in each platform's [Status chip](../manage-platform/platform-table#status-chips-and-the-detail-panel)
or its [Journal](../manage-platform/platform-journal).
:::

:::note Push target
The install always targets the platform's own ID — the device running the agent — never a
child device's ID. A platform with several member devices still receives one push, at the
platform level.
:::

## See also

- [Platform Table](../manage-platform/platform-table)
- [Platform Journal](../manage-platform/platform-journal)
