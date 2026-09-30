---
id: deploy-v2-orchestrator
title: Orchestrator
sidebar_label: Orchestrator
sidebar_position: 5
---

# Orchestrator

How [tasks](./deploy-v2-tasks) run relative to each other — ordering, nesting, and pulling in other
releases as dependencies.

## Ordering within a list

Tasks in a list run **in the order written**. Task 2 starts only after Task 1 is `Done`.

```yaml
Tasks:
  - Type: Execute/v2          # runs first
    DeployType: MSI
    ExeFile: core.msi
  - Type: Execute/v2          # runs only after core.msi succeeds
    DeployType: Script
    ExeFile: post-install.ps1
```

## Grouping & nested tasks

Any task can carry its own `Tasks` list of children. The parent runs its children and only
finishes once **all** of them finish — a parent is never `Done` before its children are. This
is how you bind several related steps (and the check or cleanup that covers them) into one
unit that succeeds or fails together.

Use `Type: Group/v2` when you want a container that runs **nothing itself** — it installs no
file, it just groups its children under one node (one rolled-up status, one subtree timeout,
its own share of the progress bar). A `Group` must have a non-empty `Tasks` list.

```yaml
Tasks:
  - Type: Group/v2                # a container: bundles the two steps below as one unit
    Weight: 100
    Tasks:
      - Type: Execute/v2          # install
        DeployType: MSI
        ExeFile: app.msi
      - Type: Verification/v2     # then confirm it took effect (gates the group)
        DeployType: API
        Target: "http://localhost:9000/health"
```

Children are addressed by a **chain path** — `1` is the second root task, `1.0` its first
child, `1.0.2` the third grandchild — and that path appears in validation errors and the
status trail so you always know *where* in the tree something happened. A parent's
`ExecutionTimeoutMin` bounds its **whole subtree**: if the group runs past it, the engine stops
the running children and fails the group.

An `Execute` task can also bind children directly (not only a `Group`): it runs its own
install first, then its children — so a `Verification`/`Revert` child can target the parent
install itself. See [Action](./deploy-v2-action) for how verification and revert actually trigger.

## Dependencies on other releases

Give a task `Type: Deploy/v2` and set its `ReleaseId` to the release it depends on to make it a
**dependency**. The engine delegates a full, nested Deploy V2 for that release and waits for
it to finish before continuing. A `Deploy/v2` task carries no `ExeFile`/`DeployType` — the
dependent's own `install.yaml` drives it.

```yaml
ReleaseId: ID.MainApp@2.0.0
Type: Deploy/V2
Tasks:
  - Type: Deploy/v2               # ← dependency: sub-deploy this release first
    ReleaseId: ID.Runtime@1.1.0
  - Type: Execute/v2
    DeployType: MSI
    ExeFile: main-app.msi         # ← then install the main app
```

A dependency must be a **registered dependency** of the parent release (declared in the
component catalog — a manifest cannot pull in a release the server never registered as a
dependency, whether direct or transitive), **delivered and ready** (delivery `Done` with all
its artifacts present), and must itself be a **Deploy V2** component (carry its own
`install.yaml`). V2 releases can only depend on V2 releases. The nested deploy is bounded by
the task's `ExecutionTimeoutMin`, and its cancellation is linked to the parent.

## The dependency tree

Dependencies form a **tree** the engine walks depth-first and validates entirely up front:

```mermaid
flowchart TD
    Main[ID.MainApp@2.0.0] --> Rt[ID.Runtime@1.1.0]
    Main --> Plg[ID.Plugin@1.0.0]
    Rt --> Base[ID.Base@1.0.0]
    Plg --> Base
```

## Cycles, depth, and de-duplication

| Guard | Behavior |
|---|---|
| **Cycle detection** | A release appearing as its own ancestor (A → B → A) fails with "dependency cycle detected". |
| **Depth limit** | The tree may not go deeper than `DEPLOY_MAX_DEPENDENCY_DEPTH` (env var, default `10`). |
| **Idempotency / diamond de-dup** | A release already deployed (`Done`) — e.g. `Base` reached via both `Runtime` and `Plugin` above — is not re-run; the second visit short-circuits. |

The whole tree logs into **one shared deploy-log file**, including which parent pulled in each
dependency.

## Roadmap

Today's dependency mechanism — a task delegating a nested Deploy V2 for another release — is
the foundation for a broader orchestrator that will:

- **coordinate a set of releases** as one managed unit, in a planned order
- **orchestrate across a fleet** — a master agent dispatching deploy plans to child agents
  (over the same A2A mesh used elsewhere) and tracking each child's task-level progress via
  SSE
- **express richer ordering** — grouping and conditional branches at the plan level

Because tasks, nesting, dependencies, per-task rules, weights, and live SSE progress already
exist at the manifest level, the orchestrator builds **on top of** the same primitives — a
plan is "a manifest of manifests".

The schema also reserves task types and deploy methods for capabilities still on this
roadmap — see [Action](./deploy-v2-action) and [Tasks](./deploy-v2-tasks) for where they'll plug in:

| Reserved | Kind | For |
|---|---|---|
| `Config/v2`, `Map/v2` | Task type | Config-group and map/data delivery |
| `Up/v2`, `Down/v2`, `Restart/v2` | Task type | Service/stack lifecycle control (bring up, tear down, restart a running deploy — e.g. a `DockerCompose` stack) |
| `DockerCompose`, `Helm` | Deploy method | Compose-stack and Helm-release installs |
| `Command` | Deploy method | A raw command line, alongside `API`, without a delivered script file |

## See also

- [Tasks](./deploy-v2-tasks)
- [Action](./deploy-v2-action)
- [How It Works](./deploy-v2-how-it-works)
