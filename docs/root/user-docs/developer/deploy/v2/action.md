---
id: deploy-v2-action
title: Action
sidebar_label: Action
sidebar_position: 4
---

# Action

A [task's](./deploy-v2-tasks) `Type` is the action it performs.

| `Type` | What it does |
|---|---|
| `Execute/v2` | **Run a thing** — install a file, run a script, call an endpoint, or remove a package. The workhorse task. |
| `Verification/v2` | **Check a step succeeded** — an HTTP, script, or event-stream check that *gates* its group. See [Verifying a step](#verifying-a-step). |
| `Revert/v2` | **Undo a step** — nested cleanup that runs when the step it covers fails. See [Reverting a step](#reverting-a-step-undo). |
| `Group/v2` | **Bind child tasks** — a container that runs no installer of its own; it groups several tasks (and their verification/revert) as one unit. See [Orchestrator](./deploy-v2-orchestrator). |
| `Deploy/v2` | **Sub-deploy a dependent release** — delegates a full nested Deploy V2 of another release, the orchestrator. See [Orchestrator](./deploy-v2-orchestrator). |
| `Config/v2`, `Map/v2` | Reserved — fail as "unsupported" if used today. |
| `Up/v2`, `Down/v2`, `Restart/v2` | Reserved — planned service/stack lifecycle actions (bring up, tear down, restart a running deploy) for capabilities like `DockerCompose`. Not runnable today. |

`Deploy` is distinct from `Execute`/`Verification`/`Revert` in one important way: those three
all act on *this* task's own artifact. `Deploy` carries no local artifact at all — its whole
job is handing off to another release entirely.

## Verifying a step

A `Verification/v2` task checks that a step actually worked, and **gates** the group it sits
in: the group's install is not accepted as `Done` until the check passes. Place a verification
as the last child of a group (or as a child of an `Execute`) so it covers the install(s)
before it.

Three check methods:

| `DeployType` | Passes when |
|---|---|
| `API` | The HTTP call to `Target` returns a **2xx** status. |
| `Script` | The script (`ExeFile`) exits **0**. |
| `SSE` | A frame on the `Target` event stream matches the `Message` object (every key/value present). |

- **Grace-time retry** — a verification is retried within `GraceTimeSec` (optionally capped by
  `RetryCount`, spaced by `RetryBackoffSec`) until it passes or the window elapses, then it
  fails
- **Bounded wait** — an `SSE` verification waits for its signal but can never hang: the wait is
  bounded by the grace window / execution timeout
- On pass, the group can finish `Done`; on failure the verification, its parent, and the
  deploy fail (and any `Revert` in the group fires)

```yaml
- Type: Execute/v2
  DeployType: MSI
  ExeFile: app.msi
  Tasks:
    - Type: Verification/v2       # verifies the parent install
      DeployType: SSE
      Target: Radio
      GraceTimeSec: 120
      Message:
        status: ready
```

## Reverting a step (undo)

A `Revert/v2` task **undoes the install(s) it covers** when they don't succeed — a per-step
cleanup, not a version rollback. Place it as the last child of a group; it targets the
preceding `Execute` sibling(s) in that group (or its actionable parent).

**When it fires:**

- **Execute → Revert** (no verification between) — the revert runs only if the install failed
- **Execute → Verification → Revert** — the revert runs only if the verification did not pass
  (a failed install before the verification also triggers it)

**What happens:**

- A revert runs a removal method — `MSI_Uninstall` / `RPM_Uninstall` / `DEB_Uninstall`,
  `Script`, or `API` — reading its handle from `ExeFile` or `Target`, with optional `Force`
- A **fired revert always ends the deploy in failure**: it's cleanup for a step that already
  failed, so even when the undo itself succeeds the parent is marked `Error` and the deploy
  stops
- If the covered step **succeeded** (and verified), the revert is not needed and ends
  `Skipped` — a clean deploy still reaches 100%
- Tasks outside the group are untouched

```yaml
- Type: Group/v2
  Tasks:
    - Type: Execute/v2            # install
      DeployType: MSI
      ExeFile: app.msi
    - Type: Verification/v2       # check it
      DeployType: API
      Target: "http://localhost:9000/health"
    - Type: Revert/v2             # undo the install if the check fails
      DeployType: MSI_Uninstall
      Target: "{Msi.ProductCode}"
```

## Reboot tasks

A task that restarts the device declares `CausesReboot: true`. Because the agent process may
be killed by the reboot, such a task **must** bind a nested `Verification` child — that check
is how the agent confirms, after coming back up, that the step took effect. (A manifest with a
rebooting task and no nested verification is rejected at validation.)

```yaml
- Type: Execute/v2
  DeployType: MSI
  ExeFile: driver.msi
  CausesReboot: true
  Tasks:
    - Type: Verification/v2       # re-checked after the reboot
      DeployType: Script
      ExeFile: check-driver.ps1
```

On restart, the agent resumes the deploy and re-checks the reboot task's nested verification
instead of re-installing: **pass** → the task is `Done` and the deploy continues; **fail** →
the install did not take, so the task (and deploy) fail, firing any revert. A non-reboot
deploy interrupted by a restart is **not** auto-resumed — it's marked `Error` and must be
re-triggered.

## See also

- [Tasks](./deploy-v2-tasks)
- [Orchestrator](./deploy-v2-orchestrator)
- [Overview](./deploy-v2-overview)
