---
id: groups-overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

# Groups — Overview

A **group** is a named, nestable container for platforms — a folder, not a type. Where
[device type and platform type](../create-and-manage-type/types-overview) describe *what* a platform
is, a group describes *where it belongs* organizationally: a site, a region, a customer, a
fleet segment — whatever grouping makes sense for you.

**Permission level:** Admin

## Why groups exist

- **Filtering** — the [Platform Table](../manage-platform/platform-table) can filter by group
  directly
- **Bulk targeting** — group a fleet segment once, then filter to it whenever you need to work
  with that segment, instead of picking platforms one at a time
- **Reporting** — group/platform/device counts roll up the hierarchy, so a parent group's
  numbers include everything nested under it

A platform belongs to exactly **one** group at a time; groups themselves can nest arbitrarily
deep.

## See also

- [Manage Groups](./manage-groups)
- [Platform Table](../manage-platform/platform-table)
