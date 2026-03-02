# GetApp – Complex Installations with Dependencies

This page explains how to perform **complex installations** (multi-step, dependency-aware, custom scripts) on a device using the GetApp APIs.

It is intended as a sub-page of **Dependency Model** and focuses on *how to orchestrate installs in practice*.

---

## When to Use This Flow

Use this approach when:

- You want to install multiple components in a controlled sequence
- You want your own installation scripts per Release / component
- You need explicit rollback / error handling
- You want to integrate external installers (MSI/RPM/scripts) but still keep GetApp state accurate

---

# 1) Inspect Device Release State Before Installation

When starting an installation, first query the device’s current release states:

- **API:** `GET /api/v2/device/releases`

This returns (per release) the device state, for example:

- `downloaded` (or similar status indicating content is present)
- `catalog_id` (the identifier you will use for deploy actions)
- `artsDirPath` (or similar path) where the artifacts/components are located on the device

### Why this matters

- Confirms the release and dependencies are actually present on-device
- Lets you locate the artifacts directory for scripts/installers
- Prevents starting installs when content was not delivered yet

---

# 2) Trigger Installation via Deploy API

Once you have the `catalog_id`, you can orchestrate installation using the deploy endpoints.

## 2.1 Start Installation

- **API:** `POST /api/v2/deploy/start/{catalog_id}`

Use this to trigger the installation process for the release identified by `catalog_id`.

> Tip: In dependency-based deployments, ensure dependencies are present (downloaded) before starting the root installation.

## 2.2 Read Installation Status

- **API:** `GET /api/v2/deploy/{catalog_id}`

Use this to monitor the deploy lifecycle and determine whether:

- Installation is running
- Completed successfully
- Failed (and why)

## 2.3 Update Installation Status (Manual Orchestration)

- **API:** `PUT /api/v2/deploy/{catalog_id}`

Use this when you manage custom installation logic and want to explicitly update the deploy state (e.g., from your installer script).

Typical uses:

- Mark `Running` when your script begins
- Mark `Installed` when your script ends successfully
- Mark `Error` when your script fails (and include logs)

---

# 3) Custom Installation Per Release (Bring Your Own Installer)

If you want to create your own installation logic per release/component:

1. Fetch release state and artifact path:  
   `GET /api/v2/device/releases`
2. Use `artsDirPath` (or equivalent) to locate artifacts/components on disk
3. Run your own installer logic (script/MSI/RPM/anything)
4. Update GetApp deploy status using:  
   `PUT /api/v2/deploy/{catalog_id}`

This allows complex installers while still maintaining accurate orchestration state in GetApp.

---

# 4) Error Handling and Rollback Responsibility

## 4.1 Rollback is Script-Managed

In case of failure, rollback logic is the responsibility of your installation script/job.

GetApp will track state — but **your script must implement rollback steps** (restore files, uninstall packages, revert configuration, etc.).

## 4.2 Mark Deploy as Error + Provide Logs

When an error happens:

- Set deployment status to `Error` using:  
  `PUT /api/v2/deploy/{catalog_id}`

- Always include:
  - `messageLog` (or equivalent field) with details
  - Clear failure reason (what failed, where, exit code if relevant)

This ensures:
- UI shows correct state
- Operators can debug quickly
- Automated systems can decide whether to retry or halt

---

# Recommended Installation Pattern (High-Level)

1. **Pre-check**
   - `GET /api/v2/device/releases`
   - Verify all required releases/dependencies are `downloaded`
2. **Start deploy**
   - `POST /api/v2/deploy/start/{catalog_id}`
3. **Run installer**
   - Use `artsDirPath` to locate content
   - Execute your install logic
4. **Update status**
   - `PUT /api/v2/deploy/{catalog_id}` → `Installed` or `Error`
5. **Monitor**
   - `GET /api/v2/deploy/{catalog_id}` until completion

---

## Notes

- For dependency deployments, delivery order is leaf → root, but installation is typically executed at the root level (see *Dependency Model* page).
- Always keep deploy state aligned with real device state to avoid “green UI / broken device”.

---