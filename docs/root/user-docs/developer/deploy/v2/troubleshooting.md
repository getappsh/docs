---
id: deploy-v2-troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 9
---

# Troubleshooting

Validating a manifest before you ship it, and debugging one that isn't deploying.

## Validating your manifest

Before shipping, check a manifest against the rules on [Tasks](./deploy-v2-tasks#validation--requirements):

1. **Schema** — PascalCase keys, `Type: Deploy/V2`, a non-empty `Actions` map (or the legacy
   top-level `Tasks`, never both), no two action keys naming the same action
2. **Identity** — `ReleaseId` equals the release you'll deploy it in
3. **Per-task** — each `Execute/v2` supplies its method's input (`ExeFile` for
   MSI/RPM/DEB/Script, `Target` for API, `ExeFile`/`Target` for `*_Uninstall`); each
   `Verification/v2` has a verify method (`API`/`Script`/`SSE`, and a `Message` for SSE); each
   `Revert/v2` has a removal method; each `Deploy/v2` / `FleetDeploy/v2` sets an `Action` that exists
   (in this manifest when it targets itself); each `FleetDeploy/v2` has a `Rule`; each `Group/v2` is
   non-empty; any `Rule` has at least one condition
4. **Ordering** — every `Verification`/`Revert` has a target (a preceding `Execute` sibling or
   an actionable parent); every rebooting task has a nested `Verification`
5. **Artifacts** — every `ExeFile` is actually included in the release; every `Deploy/v2`
   target is a registered dependency, delivered (`Done` + artifacts on disk), and itself a V2
   component
6. **Placeholders** — every `{Source.Path}` uses a known source and resolves to a value that fits
   its slot on the target device (a scalar in text; a whole `{Config.*}` group only as a `Body` /
   `Message` value)

At runtime the agent enforces all of these; a failure appears in
`<logs_dir>/deployments/<catalog_id>.log` with the failing stage or task index.

## Errors when saving or publishing a release

The server checks a release's dependencies when they are saved, and its dependencies and
`install.yaml` when it is published. A failure returns `422` with `errorCode:
"RELEASE.validationFailed"`, and `data` lists every problem — each with a `code`, a `message`, and
either the cycle `path` or the `install.yaml` `line`.

To run the same checks without saving anything (for example from CI), call
`POST /api/v1/catalog/releases/project/{project}/version/{version}/validate` with
`{ "scope": "dependencies" | "full", "dependencies"?: [...], "installYaml"?: "..." }`.
It returns `200` with `{ "valid": true }`, or the same `422`. Nothing is saved, the release doesn't
have to exist yet, and the caller needs `create-release` or `update-release`.

| Code | Meaning | Fix |
|---|---|---|
| `CYCLIC_DEPENDENCY` | The dependencies lead back to this release; `path` shows the full cycle (e.g. `A@1.0.0 → B@2.1.0 → A@1.0.0`) | Remove one dependency on the path |
| `SELF_DEPENDENCY` | The release lists itself as a dependency | Remove it |
| `DUPLICATE_DEPENDENCY` | The same dependency is listed twice | Keep one |
| `MISSING_DEPENDENCY` | A dependency id doesn't exist | Use an existing release's catalog id |
| `DEPENDENCY_NOT_RELEASED` | Publish only: a dependency isn't `released` | Publish the dependency first |
| `INVALID_YAML` | `install.yaml` isn't valid YAML | The reported `line` |
| `INVALID_MANIFEST` | Wrong shape: `Type` isn't `Deploy/V2`, empty `ReleaseId`, `Actions` and `Tasks` together, unknown task `Type` or `DeployType` | See [Validating your manifest](#validating-your-manifest) |
| `UNREGISTERED_DEPLOY_TARGET` | A `Deploy/v2` / `FleetDeploy/v2` task targets a release that isn't a registered dependency | Add it as a dependency, or fix the task's `ReleaseId` |
| `MISSING_ARTIFACT` | An `ExeFile` isn't an artifact of the release, or isn't uploaded yet | Upload it, or fix the name |
| `UNSIGNED_ARTIFACT` | Warning only: an artifact used by `install.yaml` has no signature | — |

A release in review that fails these checks is not promoted to `released` automatically; it
stays in review until the problem is fixed.

## Symptoms

| Symptom | Likely cause | Where to look |
|---|---|---|
| Deploy `Error` immediately, no task ran | Validation failed (parse/structure/main-release/version) | Deploy log — the `Validation of action '…' failed at stage '…'` line |
| Action `Error` with "Deploy V2 start rejected for …" in the log | The start was refused before running (release not delivered, no `install.yaml`, …) | The reason after the colon on that log line |
| "manifest ReleaseID … does not match requested deploy …" | `ReleaseId` ≠ the deployed release | Manifest `ReleaseId` vs. the release id |
| "Agent version … does not meet minimum required …" | Agent older than `MinAgentVersion` | Manifest `MinAgentVersion`; upgrade agent |
| "artifact not found for …" | An `ExeFile` wasn't delivered | Release contents vs. task `ExeFile` |
| "dependent … is not a registered dependency of …" | The `Deploy/v2` target isn't declared as a dependency of the parent in the catalog | The release's registered dependencies vs. the task `ReleaseId` |
| "delivery … has no artifacts" / "artifact … not found on disk" / "Item downloading not complete" | A release in the tree isn't fully delivered (status **and** state `Done`) or a file is missing | The delivery status/state and the on-disk artifacts |
| "dependent … is not a Deploy V2 component (no install.yaml)" | A dependency isn't V2 | Dependency release must ship `install.yaml` |
| "dependency cycle detected" / "action cycle detected" / "dependency depth exceeded" | A release + action that (directly or indirectly) runs itself, or too-deep nesting | The `Deploy/v2` chain; `DEPLOY_MAX_DEPENDENCY_DEPTH` |
| "Cannot resolve argument placeholder: `{…}`" | Unknown source, missing key, missing config group, or a non-scalar in a text slot | The placeholder and its source; for `{Config.*}`, the device's synced config groups |
| "… resolved to a JSON object/array, expected a scalar value" | A whole `{Config.<group>}` (or an object) used in an argument, target, header or param | Use a group + key path, `{ConfigJson.*}`, or move it to a `Body` value |
| A placeholder that used to read `config.yaml` now fails | `{Config.*}` reads the synced config groups | Switch it to `{DeviceConfig.*}` |
| `409 Conflict` — "action '…' is already running" | The same release + action is already running | Wait for it, or pause it first |
| `400` — "action '…' is not defined in the manifest" | The delivered manifest has no such action | The `Actions` keys of the delivered `install.yaml` |
| "… targets self action '…' which is not defined in this manifest" | A `Deploy/v2` / `FleetDeploy/v2` without a `ReleaseId` names a missing action | Add the action, or fix the `Action` name |
| "specify either a top-level Tasks (legacy) or Actions (new), not both" / "duplicate action" | Both manifest forms used, or two keys for one action (`Install` and `install`) | Keep only `Actions`, with one key per action |
| Starting a once action does nothing | It already finished `Done` | The action's status; run a state-changing action (e.g. `uninstall`) first, or mark it `Repeatable: true` |
| Task fails with "Launch timeout" / "did not complete within …min" | Installer slow or stuck | `LaunchTimeoutSec` / `ExecutionTimeoutMin`; installer behavior |
| Rule task fails on a device that "should" match | Rule condition/field mismatch | The task `Rule` and the device metadata in the log |
| `Task[…]: a Verification/Revert must have a target` | A `Verification`/`Revert` has no preceding `Execute` sibling and a pure-`Group`/root parent | Add an `Execute` before it, or nest it under an actionable task |
| `Task[…]: Group must have a non-empty tasks list` | An empty `Group/v2` | Give the group children, or remove it |
| `Task[…]: a task with CausesReboot: true must have a nested Verification child` | A rebooting task with no nested `Verification` | Add a `Verification` child under the reboot task |
| `Task[…]: SSE Verification requires a Message object` | An `SSE` verification with no `Message` | Add a `Message` object to match stream frames |
| `Task[…]: … requires an ExeFile or a Target` / `requires a Target` | A removal/API/SSE method missing its handle/endpoint | Supply `ExeFile` or `Target` as the method needs |

## Best practices

- Keep tasks **idempotent** (safe to re-run on resume)
- Prefer **metadata-driven timeouts** over hard-coded numbers where installers vary
- Scope tasks with **rules** instead of shipping the wrong artifact to the wrong device
- Keep **dependency trees shallow**

## See also

- [Tasks](./deploy-v2-tasks)
- [Lifecycle Actions](./deploy-v2-lifecycle-actions)
- [Logging & Status](./deploy-v2-logging-and-status)
