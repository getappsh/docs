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

**Gate a release on installed version**
- Type: **Policy**
- Selected release: `MyApp @ 2.1.0`
- Condition: `Release Version` **≥** `2.0.0`
- Push to devices: **off**

This doesn't push anything by itself — it records that MyApp 2.1.0 is only considered
compliant where the release-version condition holds, so you can see who does and doesn't
qualify via [Debug](./debug) before deciding what to do about it.

**Flag out-of-date installs**
- Type: **Policy**
- Selected release: `MyApp @ 2.1.0`
- Condition: `Installed Version` `<` `1.5.0`

Run this one through [Debug](./debug) and the version-evaluation table shows exactly which
associated releases fail the condition — a quick way to see how far behind the fleet is before
turning on [Push Policy](./push-policy) to actually close the gap.

## See also

- [Overview](./rules-overview)
- [Push Policy](./push-policy)
- [Restrictions](./restrictions)
- [Debug](./debug)
