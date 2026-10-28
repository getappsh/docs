---
id: debug
title: Debug
sidebar_label: Debug
sidebar_position: 5
---

# Debug

Test a rule before trusting it — see exactly which devices it matches right now, without
waiting for it to fire for real.

**Permission level:** Admin

## Where it lives

**Admin → Rules** → the **▶ (Evaluate)** button on any rule's row, or the **Evaluate** button
in its detail panel.

## What you see and can do

- **Matching** count vs. **Total Evaluated**
- A table of every matching device: name/ID, OS, platform, and its groups

![Rule Evaluation Results modal — Matching 1, Total Evaluated 346, with agent_linux-8e25 (linux) listed as the matching device](/img/manual/rules/evaluation-results.png)
- Click a matched device (where a discovery message is available) to expand its raw
  **context** — the JSON payload the rule engine evaluated against, fetched on demand
- Long lists are capped at 20 rows with a "+N more devices" note

[Installed Version](./rules-overview#installed-version) conditions are evaluated the same way:
each device is checked against the projects its agent last reported as installed (the
`installed.projects` part of the context).

## See also

- [Overview](./rules-overview)
- [Policy](./policy)
- [Restrictions](./restrictions)
