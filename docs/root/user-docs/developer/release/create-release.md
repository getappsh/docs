---
id: create-release
title: Create a Release
sidebar_label: Create a Release
sidebar_position: 2
---

# Create a Release

Compose a [release](./release-overview) step by step: its artifacts, its dependencies, and who it's
delivered to — reviewed and published at the end.

**Permission level:** Developer portal access to compose a release; `publish-release` to
actually publish it; `upload-artifact` to add or change artifacts.

## Where it lives

[Project Detail](../project/project-detail) → **Releases** → new release. Or **Duplicate** an existing
release to start from — see below.

## Duplicating from another release

Every existing release has a **Duplicate** button. It opens this same wizard, pre-filled from
that release's artifacts and settings — nothing is written until you give it a new version
number in Step 1. It's the fastest way to publish a near-identical follow-up release.

## The steps

| Step | Required? | What it's for |
|---|---|---|
| **Basics** | Yes | Version, name, release notes, configuration. Creates the draft |
| **File Upload** | — | The artifacts the release delivers |
| **Install (V1)** | Optional | The one file a [Deploy V1](../deploy/v1/deploy-v1-overview) agent runs |
| **Orchestrator (V2)** | Optional | The [Deploy V2](../deploy/v2/deploy-v2-overview) plan, written to `install.yaml` |
| **Policies** | Optional | Who the release is offered to |
| **Review & Publish** | — | Check everything, then publish |

A release has **both** install paths: the V1 installer for agents without Deploy V2, and the
Orchestrator plan for agents with it. Fill in either one or both — publishing doesn't require
either. Your deployment can hide a step, rename it, or make it required — see
[Customizing the wizard](#customizing-the-wizard).

**Next** and **Back** skip any step you don't have the role for. Your work is saved each time you
press **Next**, when you press **Save draft**, and when you leave the wizard, so you can come back
to a draft later and pick up where you stopped.

## Step 1 — Basics

Version and name. The draft release is created here before anything else can attach to it.
The version must be `MAJOR.MINOR.PATCH` (for example `1.2.3`) and can't already exist in the
project — if a draft with that version exists, the wizard offers to resume it instead.
Release settings such as auto-deploy are under **Show configuration**.

![Release wizard — Basics step, with Version 2.1.0, Name, a Markdown changelog with its preview, and Show configuration below](/img/manual/release/wizard-basics.png)

## Step 2 — File Upload

Upload the files this release carries — click **Upload file** or drag files onto the page — or
[attach one from an existing source](./attach-artifact) instead. Every artifact here is
delivered to the device; which one *installs* is set in the next two steps.

`install.yaml` can't be uploaded here: the wizard generates it from the
[Orchestrator](#step-4--orchestrator-v2) plan.

![Release wizard — File Upload step, listing an .msi, a .sh and a README as uploaded, with Upload file, Attach from source and a drop area](/img/manual/release/wizard-file-upload.png)

## Step 3 — Install (V1)

For agents that run [Deploy V1](../deploy/v1/deploy-v1-installation): pick the **Installer file**
and, optionally, the **Install arguments** (for example `/quiet /norestart`). The wizard shows
how the agent will run the file you picked:

| File | Runs as |
|---|---|
| `.msi` | MSI installer |
| `.rpm` | RPM package |
| `.sh` | Script (bash) |
| `.ps1` | Script (PowerShell) |
| `.bat` | Script (cmd) |
| anything else | Executable (run directly) |

The extension match is case-sensitive, like the agent's: `Setup.MSI` runs directly, not
through the MSI installer. If you don't pick a file, the agent falls back to the first `.msi`
or `.rpm` in the release; if there's none, nothing runs on a V1 install.

Publish is blocked while the chosen installer is still uploading.

![Release wizard — Install (V1) step, with field-service-2.1.0.msi chosen as the installer file, "Installs as MSI installer", and install arguments /quiet /norestart](/img/manual/release/wizard-install-v1.png)

## Step 4 — Orchestrator (V2)

Build the [Deploy V2](../deploy/v2/deploy-v2-overview) plan. The wizard turns it into the
release's `install.yaml` every time it saves. **Leave the plan empty and the release ships
without `install.yaml`** — it then installs with V1 only.

### Starting point

When you first open the step, the wizard builds a plan from the files you uploaded:

- every installer (`.msi`, `.rpm`, `.deb`, `.sh`, `.ps1`, `.bat`) gets an **Install** task
- every package (`.msi`, `.rpm`, `.deb`) also gets an **Uninstall** task

If none of the uploaded files is an installer, the plan starts empty. If you empty the plan
yourself, it stays empty the next time you open the draft.

![Release wizard — Orchestrator (V2) step, with the Tasks list on the left and the Install section holding a FirstApp 2.4.0 dependency task (Fleet rule) and the two uploaded installers](/img/manual/release/wizard-orchestrator.png)

### Tasks

The **Tasks** list on the left holds every task you've written. **Add task** opens the task
editor; pick one or more **Actions**, and the wizard places a copy of the task in each of those
action's sections. The task stays in the list, so you can drag it into another section for
another copy.

- Editing a task **in the list** updates every copy placed from it
- Editing a **placed copy** changes only that copy — it stops following the list
- Deleting a task from the list doesn't remove the copies already placed

On a placed task you can add **Subtasks** (for example a check that runs after it), set a
**Weight** (its share of the progress bar), and set a **Rule** (the devices it runs on).

### Actions

Each section of the plan is an [action](../deploy/v2/deploy-v2-lifecycle-actions) — the
sections in `install.yaml`. By default you see **Install**, **Uninstall**, **Health**,
**Configure**, **Activate**, and **Deactivate**.

- **Add action** shows a hidden action again, or adds a **Custom action…** with your own name.
  A custom action runs only when called by name — from the agent, or from another release's task
- The arrows move a section up or down; `install.yaml` follows the section order
- An empty section can be removed; a section with tasks can't, until you move or remove them
- **Re-run each time** controls whether the action starts fresh every time it runs. It's off
  by default for Install and Uninstall (they run once, and a failed run resumes where it
  stopped) and on for every other action

A plan with any tasks needs at least one task in **Install**. Until it has one, **Next** is
blocked and you can't jump past this step in the rail.

### Dependencies

Under **Add dependency…**, search for a project — you can type any part of its name — then
pick a version. Only versions that have a Deploy V2 plan are offered. Before adding it, the
server checks it. It is refused, with the reason shown under the picker, when it would:

- create a **dependency cycle** — for example this release → B → this release. The cycle is shown
  as a chain of release chips, each linking to that release
- point to **this release itself**, or to a release that doesn't exist

Adding a dependency adds one task per action the dependency has. Its **Install** task goes to
the top of your Install section; the others go to the end of their sections. Each one is a
[`FleetDeploy/v2`](../deploy/v2/deploy-v2-orchestrator#fleet-deploy-across-managed-devices) task
with a **Fleet rule**, pre-filled from the dependency's own rule and the device types it is
offered to. A dependency task without a fleet rule blocks publishing.

The **Dependencies** list shows what's added. Removing a dependency also removes every task
that deploys it, and is saved when you move to the next step. It doesn't affect the
dependency's own release.

![Release wizard — Orchestrator (V2) step scrolled down: the Tasks list scrolled to the Dependencies list with FirstApp 2.4.0, the Uninstall section with the .msi and the dependency's uninstall task, and the Health section with an API health check and Re-run each time on](/img/manual/release/wizard-orchestrator-actions.png)

### install.yaml

**Show YAML** opens the generated `install.yaml` beside the plan. The **⋯** menu can
**Download YAML**, **Edit YAML** (edit the text directly, then **Apply**), or **Upload YAML**
(replace the plan with a file — you review it before applying). You can also drop an
`install.yaml` file onto the step. A task that carries fields the task editor doesn't show is
marked **Edited in YAML** — edit it with **Edit YAML** so those fields are kept.

Problems in the plan are listed under it, and block publishing until fixed. When there are
none, you see **Manifest is valid.**

If a draft already has an `install.yaml` that can't be read, the step says so and publishing is
blocked. **Retry** reads it again; **Replace it** overwrites it with the plan you write here.

## Step 5 — Policies

Two independent, role-gated ways to narrow who this release reaches — leaving both unset
delivers it to everyone:

- **Device type offering** — the same [offering policy](../../admin/create-and-manage-type/manage-device-type)
  editor used from Types, scoped to this release. Type in the device type picker to filter it
- **Release policy** — associates a [Policy](../../admin/create-and-manage-rule/policy) rule
  with this specific release

Active [restrictions](../../admin/create-and-manage-rule/restrictions) are shown here
read-only — they still block matching devices regardless of what you set in this step.

If you have none of the offering or policy roles, **Next** skips this step and the release is
offered to everyone.

![Release wizard — Policies step, with no device type narrowed, an Add a device type picker, and the General policy "Allow All Devices" attached](/img/manual/release/wizard-policies.png)

## Step 6 — Review & Publish

A read-only summary of every step, each with a quick **Edit** link back to it. **Publish**
(gated on `publish-release`) flips the release's status to `released`.

| Row | Shows |
|---|---|
| **Basics** | Version and name |
| **File Upload** | Number of artifacts |
| **Install (V1)** | The installer and how it runs — or the file the agent falls back to |
| **Policies** | *Narrowed*, or *Delivers to everyone* |
| **Orchestrator (V2)** | The plan's tasks, with a preview and **Download** of `install.yaml` — or *No Deploy-V2 plan — installs with V1 only* |

![Release wizard — Review & Publish step, with Basics, File Upload, Install (V1), Policies and Orchestrator (V2) rows, each with an Edit link](/img/manual/release/wizard-review.png)

Publishing is blocked while:

- the Orchestrator plan has problems (they're listed here too)
- the V1 installer is still uploading
- a step your deployment made required isn't complete

This step also shows the server's **publish checks** for the saved draft. Publishing is refused
while any of them fails:

| Check | Fails when |
|---|---|
| Dependency cycle | The release's dependencies lead back to it |
| Dependencies released | A dependency is still a draft, in review, or archived |
| `install.yaml` syntax and shape | The file isn't valid YAML, `Type` isn't `Deploy/V2`, `ReleaseId` is empty, or a task type is unknown (the line number is shown) |
| Deploy targets | A `Deploy/v2` / `FleetDeploy/v2` task targets a release that isn't a registered dependency |
| Artifacts | An `ExeFile` in `install.yaml` isn't an uploaded artifact of this release |

An artifact used by `install.yaml` that isn't signed shows as a warning only.

The same checks run when a release in review is promoted to `released` automatically (for
example once its regulations are compliant) — if they fail, it stays in review.

## Customizing the wizard

An administrator can tailor the wizard per deployment, without changing the application. Out of
the box you get the wizard described above. There are two optional files in
`public/config/` of the GetApp Platform deployment.

**`release-wizard.steps.json`** changes the steps, matched by key (`basics`, `file-upload`,
`install-v1`, `orchestrator`, `policies`, `review`). Each entry can set `title`, `order`,
`hidden`, `requiredRoles`, and `required`. A required step blocks **Next**, the steps after it,
and **Publish** until it's complete. For example, to hide the V1 installer step where every
agent runs Deploy V2, and to require at least one uploaded file:

```json
{
  "version": 1,
  "steps": [
    { "key": "install-v1", "hidden": true },
    { "key": "file-upload", "required": true }
  ]
}
```

**`release-wizard.deploy-v2.json`** changes the Orchestrator:

| Key | What it does |
|---|---|
| `orchestratorRequired` | `true` makes the Deploy V2 plan mandatory: **Next** on the Orchestrator and **Publish** stay blocked until the plan has an Install task. Default `false` |
| `actions` | The actions offered, in order. Each has a `value` (the `install.yaml` key, built-in or custom), a `label`, and optionally `default` (`false` = only under **Add action**), `live`, and `tip` (a hint in the task editor) |
| `sources` | The task sources offered (File, API, …) |

A missing or invalid file falls back to the defaults, so the wizard always opens.

## SBOM

Releases carry a Software Bill of Materials scan (status shows on
[Project Detail's Events tab](../project/project-detail#events) as `sbom_started` / `sbom_ready` /
`sbom_failed`), gated by dedicated `create-sbom-scan` / `view-sbom-scan` / `retry-sbom-scan`
permissions. There's no dashboard control to start or retry a scan yet — that's API/CI-only
today; the dashboard only surfaces its status once it runs.

## See also

- [Overview](./release-overview)
- [Attach an Artifact](./attach-artifact)
- [Manage a Release](./manage-release)
