---
id: gitops-releases
title: GitOps Releases
sidebar_label: GitOps Releases
sidebar_position: 9
---

# GitOps Releases

A GetApp project can be connected to a Git repository so that **new releases are imported automatically from a `.getapp` file in the repo**. You commit a release manifest, GetApp clones the repo on a schedule (or on a webhook ping), and the upload service creates a new draft release with the matching artifacts and Docker images. No manual upload, no calls to the API from CI.

This page covers what the `.getapp` file looks like, how to enable the integration on a project, and how the three services that drive it fit together: **api**, **project-management**, and the **dashboard**.

For Cluster-level GitOps (deploying GetApp itself via ArgoCD), see the chart repo `getappsh/getapp-release-control` — that's a separate concern from the per-project release flow described here.

---

## How it works

```
┌──────────────────┐       ┌────────────────────┐       ┌──────────────────┐
│  Git repository  │       │ project-management │       │      upload      │
│   (.getapp file) │       │   (git-sync.svc)   │       │ (releases.svc)   │
└────────┬─────────┘       └─────────┬──────────┘       └────────┬─────────┘
         │                           │                           │
         │   ① webhook OR every      │                           │
         │      cloneInterval min    │                           │
         │ ◄─────────────────────────┤                           │
         │   git clone --depth 1     │                           │
         │ ──────────────────────────►                           │
         │                           │                           │
         │                       ② read .getapp                  │
         │                          (JSON, validate)             │
         │                           │                           │
         │                       ③ check release exists          │
         │                           │ ─────────────────────────►│
         │                           │                           │
         │                       ④ IMPORT_RELEASE                │
         │                           │ ─────────────────────────►│
         │                           │   create DRAFT release,   │
         │                           │   register docker images, │
         │                           │   pull artifacts in bg    │
         │                           │                           │
         │                       ⑤ emit GIT_SYNC_COMPLETED       │
         │                           │                           │
```

Each step lives in a specific place in the code:

| # | Where | What it does |
|---|---|---|
| ① | `project-management/.../git-sync-scheduler.service.ts` (periodic) and `api/.../project-management.controller.ts` (webhook) | Triggers `GitSyncService.syncRepository` |
| ② | `project-management/.../git-sync.service.ts` → `readGetappFile` | Clones the repo into a temp dir (with isolated SSH config) and parses the `.getapp` JSON |
| ③ | `git-sync.service.ts` → `checkReleaseExists` (calls `UploadTopics.GET_RELEASE_BY_VERSION`) | Skips the import if the version already exists |
| ④ | `upload/.../releases.service.ts` → `importRelease` (`UploadTopics.IMPORT_RELEASE`) | Creates the release as `DRAFT`, links Docker images synchronously, downloads file artifacts in the background |
| ⑤ | `git-sync.service.ts` → `emitSyncCompletedEvent` (`ProjectManagementTopicsEmit.GIT_SYNC_COMPLETED`) | Notifies the rest of the system that the sync finished |

---

## The `.getapp` file

The `.getapp` file is a **JSON document** committed to the project's Git repository. It must validate against `ImportReleaseDto` (`api/libs/common/src/dto/delivery/dto/import-release.dto.ts`).

### Lookup order

When `git-sync.service.ts` reads the file from the cloned repo, it tries three locations, in order:

1. The path configured on the project in `gitGetappFilePath` (e.g. `releases/v1.2.3.getapp`), if set.
2. A file named exactly `.getapp` at the repo root.
3. Any file with a `.getapp` extension at the repo root (e.g. `myproject.getapp`). If multiple are found, the first one alphabetically is used and a warning is logged.

If none exist, the sync is marked `FAILED` with `error: ".getapp file not found in repository"`.

### Required fields

The validator in `validateGetappConfig` enforces that the file has at least:

| Field | Type | Notes |
|---|---|---|
| `version` | string | Used to dedupe — if a release with this version already exists for the project, the sync is a no-op |
| `createdAt` | ISO 8601 date string | |
| `author` | email | |

### Full schema

```json
{
  "name": "MyApp 1.2.3",
  "version": "1.2.3",
  "tag": "stable",
  "createdAt": "2026-05-08T12:00:00Z",
  "author": "release-bot@example.com",
  "status": "draft",
  "releaseNotes": "- Fix login crash\n- New CDN endpoints",
  "metadata": {
    "buildNumber": 4172,
    "ciJob": "https://gitlab.com/.../jobs/12345"
  },

  "artifacts": [
    {
      "name": "myapp-1.2.3-linux-amd64.tar.gz",
      "platform": "linux",
      "size": 15728640,
      "sha256": "9f86d0...",
      "downloadUrl": "https://releases.example.com/myapp/1.2.3/linux-amd64.tar.gz",
      "isExecutable": true,
      "arguments": "--silent",
      "metadata": { "arch": "amd64" }
    }
  ],

  "dockerImages": [
    {
      "name": "myapp-api",
      "imageUrl": "registry.example.com/myapp/api:1.2.3",
      "platform": "linux",
      "metadata": {}
    }
  ],

  "dependencies": [
    { "catalogId": "abc-123", "name": "common-lib", "version": "4.0.0" }
  ]
}
```

What the upload service does with each section:

- **`dockerImages`** — registered synchronously as artifacts of type `DOCKER_IMAGE`. The release won't see them after creation if this step fails for an individual image (the import logs and continues).
- **`artifacts`** — file artifacts are queued for **background download** by URL. The release becomes available immediately as a `DRAFT`; artifacts trickle in (with SHA-256 verification) and any that fail produce `ArtifactWarningDto` entries.
- **`dependencies`** — looked up against the catalog by `catalogId` and linked to the release.
- **`status`** is informational; the import always creates the release in `DRAFT` regardless.

The `metadata` object you supply is preserved on the release, with `metadata.gitSync = true` injected automatically so downstream consumers can tell GitOps imports apart from manual ones.

---

## Configuring a project

The integration is configured per project, either at creation time or later from the project's settings.

### From the dashboard

In the project create/edit form, expand the **GitOps** accordion (`dashboard/components/projects/projects/git-ops-section.tsx`):

| Field | Description |
|---|---|
| **Git Repository URL** | HTTPS (`https://github.com/org/repo.git`) or SSH (`git@github.com:org/repo.git`). The auth method is auto-detected from the URL form. |
| **Authentication method** | `SSH` — paste a Base64-encoded private key. `HTTPS` — username + password / personal access token. The two methods are mutually exclusive; setting one clears the other. |
| **Branch** | Defaults to the repo's default branch. |
| **Clone Interval (minutes)** | How often the periodic scheduler should sync this project. Default `60`. |
| **`.getapp` File Path** | Optional. Path inside the repo, e.g. `releases/current.getapp`. Falls back to `.getapp` then any `*.getapp` at the root. |

Once saved, the settings panel also shows:

- **SSH Key**: `Configured` / `Not configured`
- **HTTPS Credentials**: `Configured` / `Not configured`
- **Webhook URL**: an auto-generated URL — copy this into your Git provider's webhook configuration (see below)

When editing, the secret fields display `*****` until you focus them — leaving them blank keeps the existing key/password.

### From the API

Both `POST /api/v1/project` (create) and `PATCH /api/v1/project/:id` (edit) accept the GitOps fields directly on the project DTO:

```json
{
  "name": "my-project",
  "gitCloneUrl": "git@github.com:my-org/my-project.git",
  "gitSshKey": "LS0tLS1CRUdJTiBPUEVOU1NIIFBSSVZBVEUgS0VZLS0tLS0...",
  "gitBranch": "main",
  "gitCloneInterval": 30,
  "gitGetappFilePath": "releases/current.getapp"
}
```

For HTTPS auth, swap `gitSshKey` for `gitHttpsUsername` + `gitHttpsPassword`. SSH and HTTPS are mutually exclusive; setting one nulls the other server-side. Sending an empty string for any of these fields **clears** the value (transformed to `null`).

The fields are stored in a separate `project_git_source` table (`ProjectGitSourceEntity`) joined 1:1 with the project, so disabling GitOps later is just clearing `gitCloneUrl`.

The `DetailedProjectDto` returned by the API exposes:

- `gitCloneUrl`, `gitBranch`, `gitCloneInterval`, `gitGetappFilePath` — as configured
- `gitWebhookUrl` — the generated webhook URL
- `gitSshKeyConfigured`, `gitHttpsCredentialsConfigured` — booleans (the actual secret is never returned)
- `gitAuthMethod` — `SSH_KEY`, `HTTPS_CREDENTIALS`, or `NONE`

---

## Triggering a sync

### Webhook (push-based)

Each project gets a unique webhook URL when its Git source is created or updated:

```
{API_BASE_URL}/api/v1/project/git-webhook/{token}
```

Where `{token}` is a 64-character hex string generated with `randomBytes(32)`. Treat it as a secret — anyone with the URL can trigger a sync.

Configure your Git provider (GitHub, GitLab, Gitea, etc.) to call this URL on **push** events. The endpoint is `@Unprotected` — there is no Bearer token requirement; the secret token in the URL path is the credential.

The handler resolves the token to its project, looks up the `gitSource`, and calls `GitSyncService.syncRepository`. If the token doesn't match any project, the request is rejected.

The webhook URL's host comes from `process.env.API_BASE_URL` on the project-management service, falling back to the request's host. If your API is behind a proxy or a custom domain, set `API_BASE_URL` explicitly so the generated URL matches what your Git provider can reach.

### Periodic scheduler

`GitSyncScheduler` (in project-management) runs every **5 minutes** via the `@TimeoutRepeatTask` decorator, with distributed locking so multiple project-management replicas don't race. Each tick:

1. Queries projects with `gitSource.cloneInterval > 0` that aren't already syncing.
2. For each project, checks whether `cloneInterval` minutes have elapsed since `lastSyncedAt` for that project.
3. If due, calls `GitSyncService.syncRepository`.

`cloneInterval` is read from the database on every tick, so changing it from the dashboard takes effect on the next scheduler run — no microservice restart needed.

### Concurrency

`GitSyncService` keeps an in-memory `syncInProgress` Set keyed by project ID. If a webhook fires while a sync is already running for the same project, the second call returns immediately with `status: IN_PROGRESS` rather than launching a second clone.

---

## What you see when a sync runs

`GitSyncResultDto` (returned and emitted) reports the outcome:

| Field | Values |
|---|---|
| `status` | `PENDING` · `IN_PROGRESS` · `SUCCESS` · `FAILED` |
| `version` | The version parsed from `.getapp` (when it could be read) |
| `releaseCreated` | `true` if a new release was imported, `false` if it already existed |
| `message` | Human-readable status, e.g. `"Release 1.2.3 already exists"` |
| `error` | Set when `status === FAILED` |

A `GitSyncCompletedEvent` with the same fields is emitted on `ProjectManagementTopicsEmit.GIT_SYNC_COMPLETED` so other services (or the dashboard) can react.

### Common failure modes

| `error` | Cause |
|---|---|
| `.getapp file not found in repository` | No file at `gitGetappFilePath`, no `.getapp` at root, no `*.getapp` files at root. |
| `.getapp file must contain a version field` (or `createdAt`, `author`) | Required field missing or empty. |
| `Failed to clone repository: ...` | Bad credentials, unreachable host, missing branch, or self-signed cert. For self-signed CAs, set `GIT_SYNC_SSL_NO_VERIFY=true` on the project-management deployment. |
| `Release version 1.2.3 already exists for project ...` | Bump `version` in `.getapp` before the next sync. |

### Security & isolation

- The cloned repo and any SSH key are written to a per-sync temp dir under `os.tmpdir()` and deleted in a `finally` block.
- When using SSH, `GIT_SSH_COMMAND` points at the ephemeral key with `StrictHostKeyChecking=no` and an isolated `known_hosts` — the host's `~/.ssh` is never read or written.
- `GIT_TERMINAL_PROMPT=0` prevents Git from blocking on credential prompts.
- HTTPS credentials are URL-encoded into the clone URL for the duration of the clone, never logged.
- Stored secrets (`sshKey`, `httpsPassword`) are never returned from the API — only `*Configured` booleans.

---

## End-to-end example

Add a `.getapp` file to your repo:

```json title=".getapp"
{
  "version": "2.0.0",
  "createdAt": "2026-05-08T09:00:00Z",
  "author": "ci@my-org.com",
  "name": "MyApp 2.0.0",
  "releaseNotes": "Major rewrite.",
  "artifacts": [
    {
      "name": "myapp-2.0.0-linux-amd64.tar.gz",
      "platform": "linux",
      "size": 20480000,
      "sha256": "abc123...",
      "downloadUrl": "https://releases.my-org.com/myapp/2.0.0/linux-amd64.tar.gz"
    }
  ],
  "dockerImages": [
    { "name": "myapp", "imageUrl": "registry.my-org.com/myapp:2.0.0" }
  ]
}
```

In the GetApp dashboard, open the project's **Settings → GitOps** and set:

- Git Repository URL: `git@github.com:my-org/myapp.git`
- SSH Key: paste your deploy key
- Branch: `main`
- Clone Interval: `15`
- `.getapp` File Path: leave blank

Copy the generated **Webhook URL** and add it to GitHub: **Settings → Webhooks → Add webhook**, content type JSON, push events.

On the next push that updates the file:

1. GitHub calls `POST /api/v1/project/git-webhook/<token>`.
2. project-management clones the repo, reads `.getapp`, sees version `2.0.0` is new.
3. upload creates release `2.0.0` as `DRAFT`, registers the Docker image, and starts downloading the tarball with SHA-256 verification.
4. `GIT_SYNC_COMPLETED` fires with `status: SUCCESS, releaseCreated: true, version: "2.0.0"`.

The release shows up in the dashboard with the `gitSync: true` metadata flag.

---

## Reference

| File | Role |
|---|---|
| `project-management/apps/project-management/src/git-sync.service.ts` | Clone, read `.getapp`, trigger import, emit completion |
| `project-management/apps/project-management/src/git-sync-scheduler.service.ts` | Every-5-min scheduler, per-project interval check |
| `project-management/apps/project-management/src/project-management.service.ts` | Webhook token & URL generation, project create/edit persistence |
| `api/apps/api/src/modules/project-management/project-management.controller.ts` | `POST /git-webhook/:token` (Unprotected) |
| `api/libs/common/src/dto/project-management/dto/git-sync.dto.ts` | `GitSyncStatus`, `GitSyncResultDto`, `GitSyncCompletedEvent` |
| `api/libs/common/src/dto/project-management/dto/project.dto.ts` | `gitCloneUrl`, `gitSshKey`, `gitCloneInterval`, etc. on create/edit/detailed DTOs |
| `api/libs/common/src/dto/delivery/dto/import-release.dto.ts` | `ImportReleaseDto` — the `.getapp` file schema |
| `api/libs/common/src/database/entities/project-git-source.entity.ts` | `project_git_source` table |
| `dashboard/components/projects/projects/git-ops-section.tsx` | GitOps form section in the project create/edit UI |
| `upload/apps/upload/src/releases.service.ts` (`importRelease`) | Creates the draft release, registers Docker images, downloads artifacts in the background |
