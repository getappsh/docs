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

1. **Schema** — PascalCase keys, `Type: Deploy/V2`, non-empty `Tasks`
2. **Identity** — `ReleaseId` equals the release you'll deploy it in
3. **Per-task** — each `Execute/v2` supplies its method's input (`ExeFile` for
   MSI/RPM/DEB/Script, `Target` for API, `ExeFile`/`Target` for `*_Uninstall`); each
   `Verification/v2` has a verify method (`API`/`Script`/`SSE`, and a `Message` for SSE); each
   `Revert/v2` has a removal method; each `Deploy/v2` has a `ReleaseId` (≠ the manifest's);
   each `Group/v2` is non-empty; any `Rule` has at least one condition
4. **Ordering** — every `Verification`/`Revert` has a target (a preceding `Execute` sibling or
   an actionable parent); every rebooting task has a nested `Verification`
5. **Artifacts** — every `ExeFile` is actually included in the release; every `Deploy/v2`
   target is a registered dependency, delivered (`Done` + artifacts on disk), and itself a V2
   component
6. **Placeholders** — every `{Source.Path}` uses a known source and resolves to a scalar on
   the target device

At runtime the agent enforces all of these; a failure appears in
`<logs_dir>/deployments/<catalog_id>.log` with the failing stage or task index.

## Symptoms

| Symptom | Likely cause | Where to look |
|---|---|---|
| Deploy `Error` immediately, no task ran | Validation failed (parse/structure/main-release/version) | Deploy log — the `Validation failed at stage '...'` line |
| "manifest ReleaseID … does not match requested deploy …" | `ReleaseId` ≠ the deployed release | Manifest `ReleaseId` vs. the release id |
| "Agent version … does not meet minimum required …" | Agent older than `MinAgentVersion` | Manifest `MinAgentVersion`; upgrade agent |
| "artifact not found for …" | An `ExeFile` wasn't delivered | Release contents vs. task `ExeFile` |
| "dependent … is not a registered dependency of …" | The `Deploy/v2` target isn't declared as a dependency of the parent in the catalog | The release's registered dependencies vs. the task `ReleaseId` |
| "delivery … has no artifacts" / "artifact … not found on disk" / "Item downloading not complete" | A release in the tree isn't fully delivered (status **and** state `Done`) or a file is missing | The delivery status/state and the on-disk artifacts |
| "dependent … is not a Deploy V2 component (no install.yaml)" | A dependency isn't V2 | Dependency release must ship `install.yaml` |
| "dependency cycle detected" / "dependency depth exceeded" | Circular or too-deep dependencies | The dependency tree; `DEPLOY_MAX_DEPENDENCY_DEPTH` |
| "Cannot resolve argument placeholder: `{…}`" | Unknown source, missing key, or non-scalar | The placeholder and its source |
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
- [Logging & Status](./deploy-v2-logging-and-status)
