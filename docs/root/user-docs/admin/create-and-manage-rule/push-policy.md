---
id: push-policy
title: Push Policy
sidebar_label: Push Policy
sidebar_position: 3
---

# Push Policy

Not a separate screen — a single toggle on any [Policy](./policy), **Push to devices**, that
switches it from a passive gate into something that actively delivers.

**Permission level:** Admin

## Where it lives

**Admin → Rules → New rule** (or **Edit** on an existing one) → **Push to devices** checkbox
in the rule form.

## What you see

- The same rule form as [Policy](./policy), with the **Push to devices** checkbox checked
- In the rules table and detail panel, a rule with this on shows a **Push** chip next to its
  Status, so push-mode policies stand out from ones that only gate/evaluate

## What you can do

Check **Push to devices** when creating or editing a policy to mark it as a push policy, then
save it like any other rule. Toggle it off the same way to turn a push policy back into a
plain policy. Everything else about creating and targeting it (releases, conditions, active/
inactive) works exactly like [Policy](./policy).

## Example

**Auto-upgrade everyone below the latest release**
- Type: **Policy**
- Selected release: `MyApp @ 2.1.0`
- Condition: `Release Version` `<` `2.1.0`
- Push to devices: **on**

This is the push version of Policy's "Gate a release" example — instead of just recording who
qualifies, turning the toggle on means MyApp 2.1.0 is delivered automatically wherever the
condition holds, no manual [Multiple Software Delivery](../catalog/multiple-software-delivery)
run required. Check [Debug](./debug) first to see who it would reach before switching it on.

## See also

- [Policy](./policy)
- [Debug](./debug)
