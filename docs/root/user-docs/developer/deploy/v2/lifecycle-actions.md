---
id: deploy-v2-lifecycle-actions
title: Lifecycle Actions
sidebar_label: Lifecycle Actions
sidebar_position: 3.5
---

# Lifecycle Actions

A manifest can describe more than "how to install". With **`Actions`** a release ships a named
task tree for every step of its lifecycle — `install`, `uninstall`, `configuration`, `restart`,
or anything you name — and each one can be run on its own, from the API, from another task, or
across the managed fleet.

:::note Not the same as a task's `Type`
A **lifecycle action** is a named section of the manifest (`install`, `restart`, …). A task's
`Type` (`Execute/v2`, `Verification/v2`, …) is what one task does — see [Action](./deploy-v2-action).
:::

## The `Actions` map

```yaml
ReleaseId: ID.MyService@3.2.0
Type: Deploy/V2
Actions:
  install:                       # the action a normal deploy runs
    Tasks:
      - Type: Execute/v2
        Name: install-service
        DeployType: MSI
        ExeFile: my-service.msi
  configuration:                 # repeatable by default — re-applies every time it runs
    Description: Re-apply the service config
    Tasks:
      - Type: Execute/v2
        DeployType: Script
        ExeFile: apply-config.ps1
        Arguments: "-Config {ConfigPath.my_service}"
      - Type: Deploy/v2          # then run this release's own restart action
        Action: restart
  restart:
    Tasks:
      - Type: Execute/v2
        DeployType: Script
        ExeFile: restart-service.ps1
  uninstall:
    Tasks:
      - Type: Execute/v2
        DeployType: MSI_Uninstall
        Target: "{Release.metadata.productCode}"
```

| Field | Required | Description |
|---|---|---|
| *key* | ✅ | The action name. Known names — `install`, `uninstall`, `configuration`, `restart`, `up`, `down`, `revert` — are matched case-insensitively (`Install` is `install`). Any other name is a **custom** action and keeps its spelling. Two keys naming the same action are rejected. |
| `Tasks` | ✅ | The action's ordered task tree — exactly the same task syntax as everywhere else ([Tasks](./deploy-v2-tasks)). |
| `Repeatable` | ❌ | Overrides the action's [run mode](#once-vs-repeatable). |
| `Description` | ❌ | Free text for authors and UIs. |

`install` is **not** required. It is only the action a normal deploy runs (auto-deploy after
delivery, or the install-only start endpoint), so a release that is never deployed that way may
define only the actions it needs.

### Legacy manifests

A manifest with a top-level `Tasks:` list (and no `Actions:`) still works: its tasks become the
`install` action. Use one form or the other — a manifest with **both** `Tasks:` and `Actions:` is
rejected.

:::caution Deprecated
A top-level `Tasks:` is supported for backward compatibility only. New manifests should use
`Actions:`.
:::

## Once vs. repeatable

Every action runs in one of two modes:

| Mode | Default for | Behavior |
|---|---|---|
| **Once** | `install`, `uninstall` | Keeps progress. A run that failed or was interrupted **resumes** from the first unfinished task. An action that already finished `Done` is **not re-run** — starting it again returns immediately and re-reports its status. |
| **Repeatable** | every other action — `configuration`, `restart`, `up`, `down`, `revert`, and custom actions | Starts **fresh** every time — every task runs again on each invocation. |

Set `Repeatable: true` / `false` on an action to override its default.

A once action becomes runnable again when a later **state-changing** action finishes after it:
`install` → `uninstall` → `install` runs the install again.

## What an action does to the component state

When an action finishes `Done`, the release's component state follows the action:

| Action | Component state |
|---|---|
| `install` | `Installed` |
| `uninstall`, `revert` | `Uninstalled` — a `revert` undoes this release, whatever it restores in its place |
| any other (`configuration`, `restart`, `up`, `down`, custom) | unchanged |

While a state-changing action (`install` / `uninstall` / `revert`) is running, the component is
in `Deploy`. Lifecycle actions such as `restart` run on an installed component and never flip its
state. The same rule applies to the view of child devices on their orchestrator.

## Running an action

### From the API

| Request | What it does |
|---|---|
| `POST /api/v2/deploy/action/{catalog_id}/{action}` | Start the action. Optional `force_resume` query flag. Returns the action's status. |
| `GET /api/v2/deploy/action/{catalog_id}/{action}` | That action's status (`404` until it has run once). |
| `POST /api/v2/deploy/action/{catalog_id}/{action}/pause` | Pause the running action (`404` when it isn't running). A later start resumes it. |
| `GET /api/v2/deploy/{catalog_id}/actions` | The release's actions, each with its `repeatable` flag. |

Responses to know:

- **`409 Conflict`** — that action is already running for the release. Only **one run per
  release + action** at a time; *different* actions of the same release can run side by side
  (for example a `configuration` while a `restart` is still going).
- **`400 Bad Request`** — the delivered manifest doesn't declare that action.

These checks run **before** the action's status is reset to `Start`, so a rejected start never
leaves a stale `Start` behind. A `409` leaves the running action's status untouched; any other
rejected start is written to the release's deploy log (`Deploy V2 start rejected for …`) and
marks that action `Error`.

The older install-only endpoints — `POST /api/v2/deploy/start/{catalog_id}`,
`GET /api/v2/deploy/{catalog_id}` and `POST /api/v2/deploy/pause/{catalog_id}` — still work and act
on the `install` action. They are deprecated in favor of the action endpoints above.

### Listing actions without a delivery

`GET …/actions` first reads the release **metadata**, then falls back to the delivered manifest:

| Metadata key | Effect |
|---|---|
| `supportedActions` | `["install", "restart", …]` — the action names. Lets a UI list actions before the release is delivered. |
| `repeatableActions` | `["restart", …]` — exactly the actions shown as repeatable (an empty list means none). Without it, the manifest's setting (or the action's default) is used. |

The list is for display only — running an action always follows the delivered manifest.

### From another task

A `Deploy/v2` task runs an action of a release on this device; a `FleetDeploy/v2` task runs it on
the matched devices of the managed fleet. Both take an **`Action`** selector:

```yaml
Tasks:
  - Type: Deploy/v2              # run this release's own `configuration` action
    Action: configuration
  - Type: Deploy/v2              # run another release's `uninstall` action
    ReleaseId: ID.OldService@1.0.0
    Action: uninstall
  - Type: FleetDeploy/v2         # restart the service on every matched device
    Action: restart
    Rule:
      conditions:
        and:
          - { field: $.device.type, operator: equals, value: edge-sensor }
```

- **`ReleaseId`** is optional — omitted (or equal to the manifest's own) means **this release**.
  Any other release must be a registered dependency (see [Orchestrator](./deploy-v2-orchestrator)).
- A self-targeted action must exist in this manifest, or the manifest is rejected.
- `Action/v2` and `FleetAction/v2` are accepted as aliases of `Deploy/v2` and `FleetDeploy/v2`.
- The invoked action's progress and messages roll up onto the calling task, like any nested
  deploy.

:::caution Always set `Action`
An omitted `Action` falls back to `install`. This fallback is deprecated (a warning is logged) and
will become an error — write the action explicitly.
:::

### From the CDN / orchestrator

`POST /api/cdn/devices/action` accepts an `action` inside the payload for `deployStart` and
`deployPause`:

```json
{
  "action": "deployStart",
  "devices": ["device-17"],
  "payload": { "catalogId": "ID.MyService@3.2.0", "action": "restart" }
}
```

The action travels to child agents in the managed-command payload, and their status reports
carry it back, so each action is tracked separately on the orchestrator too. An omitted `action`
means `install`.

## Validation is per action

Running an action validates the manifest **shell** (release id, `Type`, at least one action) and
then **only that action's tree** — plus every action it invokes through `Deploy/v2` (self or
another release), followed all the way down. A broken or artifact-missing sibling action never
blocks an unrelated one; it is validated when it is itself run.

Loops are rejected by **release + action**: `A → B → A` across releases and
`configuration → restart → configuration` within one release both fail with an
"action cycle detected" / "dependency cycle detected" error.

## Status and logs

- Each action keeps its **own status row**, so running `restart` never overwrites the `install`
  status. The release status view shows the most recent **state-changing** action (`install`,
  `uninstall`, `revert`).
- Every action of a release writes into the same deploy log,
  `<logs_dir>/deployments/<catalog_id>.log`; the engine's lines name the action
  (`… action 'restart' …`) so runs are easy to tell apart.
- A task's optional **`Name`** is used as its label in the log and status lines.

## See also

- [Tasks](./deploy-v2-tasks)
- [Orchestrator](./deploy-v2-orchestrator)
- [Logging & Status](./deploy-v2-logging-and-status)
- [Example](./deploy-v2-example)
