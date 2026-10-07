---
id: deploy-v2-logging-and-status
title: Logging & Status
sidebar_label: Logging & Status
sidebar_position: 7
---

# Logging & Status

How a [Deploy V2](./deploy-v2-overview) run reports itself, live and after the fact.

## Deploy log file

Every Deploy V2 run writes a dedicated log file:

```
<logs_dir>/deployments/<catalog_id>.log
```

- The whole dependency tree writes into the **parent's** file — one file tells the full story
- It's UTF-16LE encoded so Windows `msiexec`, which appends its own installer log to the same
  file, reads back as one consistent document
- Every line is also mirrored to the agent's global log/console with the real caller module
  and line

Deploy status is pushed live over SSE on every task transition, so a UI can follow progress in
real time.

## The status document (`message_log`)

The deploy record's `message_log` is a **structured JSON document** in every state — running,
succeeded, and failed alike (a failed run's reason rides inside its task's own status line,
not a bare error string). Consumers parse it rather than reading raw text:

```json
{
  "total": 3,
  "completed": 1,
  "skipped": 0,
  "failed": 0,
  "cancelled": 0,
  "current": "task [1] (app.msi) (max 15 min)",
  "messages": [
    "task [0] (runtime) — done",
    "task [1] (app.msi) — running (max 15 min)",
    "task [1.0] verifying task [1] (app.msi) — running (max 2 min)"
  ],
  "advisories": [
    { "code": "REBOOT_REQUIRED", "message": "reboot required to finish" }
  ]
}
```

| Field | Meaning |
|---|---|
| `total` | Number of tasks in the tree. |
| `completed` | Tasks in a terminal-complete state (`Done` or `Skipped`). |
| `skipped` / `failed` / `cancelled` | Counts by state. |
| `current` | The running task as a `task [<path>] (<label>)` reference, with its max time when known. |
| `messages` | One chain-pathed status line per reached task, in order. A verify/revert line names the task it acts on; a failed task's reason is on its own line. |
| `advisories` | Machine-actionable hints (see below). |

## Advisories

An **advisory** is a machine-actionable, user-facing hint a task raises during execution —
something a UI can turn into an action or an explanation. Advisories are aggregated across all
tasks, de-duplicated, and surfaced in `message_log.advisories`. Each has a stable `code` and a
human `message`:

| `code` | Meaning | Typical UI |
|---|---|---|
| `REBOOT_REQUIRED` | A device reboot is needed to finish applying the step (e.g. an MSI returned exit `3010`). | Prompt the user to reboot. |
| `FORCE_POSSIBLE` | The step can be retried **with force** to get past what stopped it (e.g. an uninstall found the product "not installed"). | Offer a "retry with force" action. |

Because the `code` is stable, a UI reacts to it directly instead of parsing message text.

## Fleet and nested status

A deploy is a **tree** — this release's tasks, any nested dependency sub-deploys, and any
[fleet rollout](./deploy-v2-orchestrator#fleet-deploy-across-managed-devices) to child agents.
The top deploy's status document folds the **whole tree** into one view:

- Every sub-deploy's finished (terminal) lines are merged onto the task that spawned them,
  **attributed to their source** — a local nested dependency shows as `deploy <release> — …`,
  a remote child as `remote deploy <release> <device> — …`.
- Progress bubbles up **live**: a running sub-deploy contributes its partial progress to the
  parent's share instead of jumping from nothing straight to done.
- It is **recursive at any depth** — a child that is itself an orchestrator folds its own
  grandchildren in before reporting up, so the top view reflects the entire tree.

Remote children report their delivery and deploy status back to the orchestrator as they run,
over the A2A core surface (`/api/core`); the orchestrator re-broadcasts each as its own SSE
event carrying the reporting **`device_id`**, so a UI can attribute every update to its device.
The orchestrator always re-reads the authoritative status from its own database, so a missed
message can never leave the view stale. Merged lines are **append-once** — a child's terminal
line appears exactly once no matter how many updates arrive.

## See also

- [How It Works](./deploy-v2-how-it-works)
- [Troubleshooting](./deploy-v2-troubleshooting)
