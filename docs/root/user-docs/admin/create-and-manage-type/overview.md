---
id: types-overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

# Types — Overview

Before managing types, it helps to be clear on what they're types *of*. For what a
**platform** itself is, see [Platform — Overview](../manage-platform/platform-overview) — this
page covers the two categories built on top of it.

**Permission level:** Admin

## Device Type

A **device type** is a hardware category — derived from `device.deviceTypeName` — independent
of which platform it happens to be under. It's what a project attaches to when it wants to
offer software to a category of hardware, and what an offering policy scopes to (see
[Manage Device Type](./manage-device-type)).

## Platform Type

A **platform type** is an OS/platform category — derived from `device.platformName`. It owns a
**Version** (an image reference) and a hierarchy of the device types that belong to it. Where
device type answers "what kind of hardware is this," platform type answers "what kind of
platform is this" (see [Manage Platform Type](./manage-platform-type)).

## See also

- [Manage Device Type](./manage-device-type)
- [Platform Type](./manage-platform-type)
- [Platform — Overview](../manage-platform/platform-overview)
