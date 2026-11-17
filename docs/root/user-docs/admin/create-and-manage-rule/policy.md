---
id: policy
title: Policy
sidebar_label: Policy
sidebar_position: 2
---

# Policy

A policy is a rule scoped to **releases** — which app versions it applies to. See
[Overview](./rules-overview) for the shared rules screen and condition builder; this page covers
what's specific to the Policy type.

**Permission level:** Admin

## Where it lives

**Admin → Rules → New rule**, Type set to **Policy** (the default).

## What's specific to a policy

Below the [condition builder](./rules-overview#the-rule-form), a policy adds a **release picker**:
pick a **Project**, then one of its **Release** versions, and **Add** — repeatable, building
up a list of `project@version` pairs the policy applies to. Each is removable with its chip's
**✕**.

![Edit Rule dialog's release picker — Selected Releases test-new-project@1.0.3 and @1.0.4, with a Project/Release picker open showing GetApp-Delivery versions](/img/manual/rules/edit-rule-releases.png)

## Examples

**Install only where a required project is new enough**
- Type: **Policy**
- Selected release: `myapp @ 2.1.0`
- Condition: `Installed Version` — project `my-runtime` — **≥** `3.0.0`
- Push to devices: **off**

myapp 2.1.0 is offered only to devices that already have `my-runtime` 3.0.0 or newer
installed. Devices without `my-runtime` don't match. Check who qualifies via
[Debug](./debug) before relying on it.

**Flag out-of-date installs**
- Type: **Policy**
- Selected release: `myapp @ 2.1.0`
- Condition: `Installed Version` — project `myapp` — `<` `1.5.0`

Run this one through [Debug](./debug) and the device table shows exactly which devices still
run a myapp older than 1.5.0 — a quick way to see how far behind the fleet is before turning
on [Push Policy](./push-policy) to actually close the gap.

**Upgrades and fresh installs only**
- Type: **Policy**
- Selected release: `myapp @ 2.1.0`
- Conditions (OR): `Installed Version` — project `myapp` — **Is Not Installed**, or
  `Installed Version` — project `myapp` — `<` `2.1.0`

myapp 2.1.0 is offered to devices without myapp and to devices running an older myapp, but
not to devices that already have 2.1.0 or newer.

## See also

- [Overview](./rules-overview)
- [Push Policy](./push-policy)
- [Restrictions](./restrictions)
- [Debug](./debug)
