---
id: catalog-overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

# Catalog — Overview

The Catalog is every digital asset that exists in the GetApp world — everything that can be
published, versioned, and eventually delivered to a platform.

**Permission level:** Admin

## Where it lives

**Admin → Catalog**, as five tabs:

| Tab | What it holds |
|---|---|
| **Applications** | Store apps — the real, live catalog: publish, version, and [deliver](./multiple-software-delivery) them to platforms |
| **Infrastructure** | System-level packages — foundational, store-visible services |
| **Maps** | Geospatial packages — coverage areas, tiles, resolution |
| **System Upgrades** | Device system/firmware upgrades — installed and activated like a platform upgrade |
| **Configurations** | [ConfigMaps](./configmap) — shared configuration attached to a platform type or a specific platform |

![The Applications tab of the Catalog, showing 50 real apps with type, version, platform, and Released status](/img/manual/catalog/applications.png)

:::note Applications is live; the rest are previews
Applications is wired to the real catalog API today. Infrastructure, Maps, and System
Upgrades render illustrative demo rows until their own APIs are connected — the tabs and
layout are real, the data in them isn't yet.
:::

## What you can do

- Browse and search each tab's assets, with status (published/draft/deprecated) and last
  updated
- From **Applications**, run [Multiple Software Delivery](./multiple-software-delivery) to
  push a released version to platforms
- From **Configurations**, manage [ConfigMap](./configmap) groups and their device
  associations

## See also

- [Multiple Software Delivery](./multiple-software-delivery)
- [ConfigMap](./configmap)
