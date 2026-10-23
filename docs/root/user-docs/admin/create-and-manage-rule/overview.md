---
id: rules-overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

# Rules — Overview

Policies, push policies, and restrictions are all the same underlying object — a **rule** —
built and managed from one screen.

**Permission level:** Admin

## Policies vs. Restrictions

**A policy is a release-level filter: "which devices should receive this version?"** It's
associated with one or more specific releases, and its conditions decide which devices those
releases apply to.

**A restriction is a device-level filter: "what is this device allowed to install?"** It's
associated with device types, OS types, or explicit devices instead of a release, and its
conditions apply across every project — not just one.

They work together: a release only reaches a device when it satisfies whatever
[policy](./policy) scopes it, and the target device doesn't violate any active
[restriction](./restrictions). A [Push Policy](./push-policy) is just a policy with delivery
turned on, and [Debug](./debug) lets you check either kind against real devices before you
trust it.

## The rule engine

Every rule — policy or restriction — shares the same structure and condition builder.

**Rule structure:** Name, optional Description, Type (Policy/Restriction), Active on/off,
Association (what it targets), and a Rule Expression (the conditions below).

**Conditions:** nested AND/OR groups of Field / Operator / Value rows. Fields come from the
server's rule-field list plus the built-in **Installed Version** field (`installed.version`).
Operators depend on the field's type:

| Field type | Operators |
|---|---|
| Number | Equals, Not Equals, Greater/Less Than, Greater/Less Than or Equal |
| String | Equals, Not Equals, Contains, Not Contains, Starts With, Ends With, Matches (regex); under **More operators**: Version Equals/Not Equal, Version Greater/Less Than, Version Greater/Less Than or Equal |
| Array | Contains, Not Contains, In, Not In |
| Installed Version | Version Equals/Not Equal, Version Greater/Less Than, Version Greater/Less Than or Equal, Is Installed, Is Not Installed |
| Any field | Existence — is set / is not set |

Version operators compare semantic versions (`2.10.0` is newer than `2.9.0`). On a text field
such as **Agent Version** the value is a version, e.g. `Agent Version` **<** `1.7.0`; a device
that doesn't report that field never matches.

### Installed Version

An **Installed Version** condition checks what is already installed on the device, regardless
of which releases the rule is attached to. Its value is a **project** — picked by its unique
project name — and a **version**:

- `Installed Version` — project `my-runtime` — **≥** `3.0.0` matches a device that has
  `my-runtime` 3.0.0 or newer installed
- Every installed version of that project on the device is checked; the condition matches
  when **any** of them satisfies the operator
- A device that doesn't have the project installed never matches a version operator
- **Is Installed** / **Is Not Installed** take only the project and check whether any version
  of it is installed. Combine them with OR, e.g. "`myapp` is not installed **OR** installed
  `myapp` < `2.1.0`" to allow fresh installs and upgrades but not re-installs or downgrades

Under the hood the condition is saved as
`{ "field": "installed.version", "operator": "semver-gte", "value": { "projectName": "my-runtime", "version": "3.0.0" } }`,
or `{ "field": "installed.version", "operator": "not-exists", "value": { "projectName": "my-runtime" } }`
for Is Not Installed (`exists` for Is Installed).
The server rejects the rule if the project name doesn't exist or the version isn't a valid
semantic version.

Each condition can also carry an optional **validation message** — free text explaining why
that condition exists, surfaced wherever the blocking rule is shown (see
[Restrictions](./restrictions#restriction-messages)).

## Why use rules at all

- **One place to manage it** — no touching individual devices or redeploying anything
- **Precise targeting** — any combination of release, device type, OS, or explicit device
- **Guardrails** — stop incompatible or unapproved software before it installs
- **Change anytime** — toggle a rule off instead of undoing a deployment
- **Test before you trust it** — [Debug](./debug) shows exactly who a rule would match, before
  it's live

## Where it lives

**Admin → Rules**.

## What you see

- Header: how many rules are active vs. total, a **LIVE** chip once rules have loaded
- **Search**, and filter buttons for **All / Policies / Restrictions**
- The rules table: name + description, a **Policy**/**Restriction** type chip, its **Target**
  (the releases, device types, OS types, or device count it's scoped to — `all` if none),
  **Status** (Active/Off), a **Push** chip when push mode is on, and per-row actions

![Rules table showing 6 real rules — Test, Test_5, mendentory push, Allow All Devices (Policy), amit-restriction and Is charching (Restriction)](/img/manual/rules/rules-table.png)

- Clicking a row opens its detail panel: full type/target/description/status, any installed-
  version conditions in plain English (e.g. `Installed my-runtime ≥ 3.0.0`), associated
  releases, and device-type/OS chips

![Rule detail panel for a policy named "mendentory push" — Policy type, target release mendentory_push_test@0.0.2, Active, Push mode Yes, with Evaluate/Edit/Disable/Delete actions](/img/manual/rules/rule-detail.png)

## What you can do

- **New rule** to open the create dialog, or **Edit**/**Duplicate** an existing one from its
  row or detail panel
- Per row: **Evaluate** (see [Debug](./debug)), **Edit**, **Duplicate**, **Off/On** (toggle
  active), **Delete**

### The rule form

- **Name**, **Description**, **Type** (Policy or Restriction — [Policy](./policy) vs.
  [Restrictions](./restrictions)), **Active**, and **Push to devices** (see
  [Push Policy](./push-policy))
- The condition builder described above — **+ Condition** adds a row to the current group,
  **+ Group** nests a new AND/OR group inside it, and the AND/OR button on a group toggles its
  logic
- What comes after the condition builder depends on the **Type** you picked — see
  [Policy](./policy) and [Restrictions](./restrictions)

![Edit Rule dialog — Name "Test", Type Policy, Active and Push to devices checked, a Device Name Equals condition](/img/manual/rules/edit-rule-top.png)

## See also

- [Policy](./policy)
- [Push Policy](./push-policy)
- [Restrictions](./restrictions)
- [Debug](./debug)
