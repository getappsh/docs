---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 1
---

# Getting Started

Install the GetApp **Agent** and **Agent UI** on a device, and confirm it shows up connected
on the server.

- **Agent** — the background service. Talks to the GetApp server, manages installs. Install
  this on every device.
- **Agent UI** — an optional local dashboard on top of the Agent, for a human at the device to
  see status and trigger actions. Install it if you want that.

**Permissions:** installing either package needs admin (Windows) or sudo (Linux) rights.

## Download

For now, download both installers from the **Catalog → Applications** tab in the Admin
dashboard — see [Catalog Overview](./user-docs/admin/catalog/catalog-overview). *(Direct download
links will be added here later.)*

---

## Windows — MSI

### Agent

1. Run the Agent `.msi`. The wizard is: **Welcome → Install Directory → Ready to Install**.
2. On **Ready to Install**, click **Advanced Settings...** to open the settings dialog. It has
   exactly two fields:

   | Field | Property | What it is |
   |---|---|---|
   | **Remote server URL** | `GETAPP_BASE_URL` | The GetApp server this agent reports to — the same `BASE_URL` your environment uses, e.g. `https://api-getapp-dev.apps.getapp.sh` |
   | **Exposed agent port** | `GETAPP_GATEWAY_PORT` | Default `2220` |

   Click **OK**, then **Install**.

:::note That's genuinely all the graphical wizard exposes
There's no field in the dialog for a device name, device type, or disabling TLS — just those
two. To set anything else at install time, use a silent install (below) or edit `.env` after
installing and restart the agent service.
:::

### Recommended extras (silent install only)

Pass these via `GETAPP_EXTRA_VARS` (semicolon-separated `KEY=VALUE`) on a silent (`/qn`)
install:

| Key | Recommended because |
|---|---|
| `DEVICE_ID` | Without it, the agent generates a random ID — set your own so you can actually recognize this device later in the Platform Table |
| `DEVICE_TYPE_TOKEN` | Categorizes the device (default is just `agent`) — set it to something meaningful, e.g. `field-tablet` |
| `SECURE_TLS=false` | Disables TLS verification — for self-signed certs or a local test server only |

```powershell
msiexec /i GetAppAgent-Services-x.y.z-x86_64.msi /qn `
    GETAPP_BASE_URL=https://api-getapp-dev.apps.getapp.sh `
    GETAPP_EXTRA_VARS="DEVICE_ID=field-tablet-07;DEVICE_TYPE_TOKEN=field-tablet;SECURE_TLS=false"
```

Full property and env-var reference: [Package Bundles](./technician/agent/deployment/package-bundles),
[Environment Variables (.env)](/docs/agent-envs/env-file).

### Agent UI

Run the Agent UI `.msi` — Welcome → Install Directory → Install. No settings to configure; it
talks to the Agent installed on the same device.

---

## Linux — RPM

### 1. Download

Download the `.rpm` from **Catalog → Applications** (same as above — direct links coming
later).

### 2. Install — Agent

```bash
# Default — host and port only
sudo env GETAPP_BASE_URL=https://api-getapp-dev.apps.getapp.sh \
    GETAPP_GATEWAY_PORT=2220 \
    dnf install -y ./GetAppAgent-Services-x.y.z.rpm
```

Recommended, with the same extras as the MSI (on Linux these are individual `GETAPP_KEY=value`
vars, prefix stripped into `.env`):

```bash
sudo env GETAPP_BASE_URL=https://api-getapp-dev.apps.getapp.sh \
    GETAPP_GATEWAY_PORT=2220 \
    GETAPP_DEVICE_ID=field-tablet-07 \
    GETAPP_DEVICE_TYPE_TOKEN=field-tablet \
    GETAPP_SECURE_TLS=false \
    dnf install -y ./GetAppAgent-Services-x.y.z.rpm
```

### Agent UI

```bash
sudo dnf install -y ./GetAppAgent-UI-x.y.z.rpm
```

Just installs — no host or config needed; it talks to the local Agent's API.

---

## Verify it's connected

- **Agent local API (Swagger):** `http://localhost:2220/swagger-ui/#` (your `GATEWAY_PORT`)
- **Agent UI dashboard:** `http://localhost:2230`
- **On the server:** **Admin → Platforms** — find the device by the `DEVICE_ID` you set, and
  confirm its status dot is green (online). See [Platform Table](./user-docs/admin/manage-platform/platform-table)
  and [Platform Information](./user-docs/admin/manage-platform/platform-information) for what
  the connection details actually show.

---

## Upgrading the Agent

Once installed, the Agent is upgraded like any other release through GetApp — not by
re-running the installer by hand. Three ways a new version reaches a device:

- **Automatically** — with `AUTO_DEPLOY_ON_PULL` (the agent default), a new version deploys
  itself as soon as the agent pulls it, no action needed.
- **From the Store** — a user installs the update themselves from their own **Workspace**'s
  Download widget. See [Workspace](./user-docs/space/workspace).
- **From the Dashboard** — an admin pushes a specific version to one or more platforms via
  [Multiple Software Delivery](./user-docs/admin/catalog/multiple-software-delivery).

---

## Next Step

Proceed to [Enrollment](./technician/agent/configurations/enrollment) for what happens after install, and how
re-enrollment/troubleshooting works if the device doesn't show up connected.

---

## Further Reading

- **[Enrollment](./technician/agent/configurations/enrollment)** — what install-time identity actually does on the server.
- **[Configuration & Settings](./technician/agent/configurations/agent-settings)** — full reference for all agent settings: Layer 1 (`.env`), Layer 2 (`config.yaml`), CLI and API examples, init mechanism, and troubleshooting.
- **[CLI](./technician/agent/interfaces/cli)** — manage device updates and software delivery from the command line.
- **[Package Bundles](./technician/agent/deployment/package-bundles)** — building packages from source, silent/unattended installs, and MSI/RPM/DEB properties.
- **[Disconnected Environments](./technician/agent/deployment/disconnectedEnvioremnt)** — using the agent in air-gapped or offline networks.
- **[Roles and Permissions](./technician/server/auth-permission/roles-and-permissions)** — who can do what, and how to set it up.

Still stuck? See [Troubleshooting](./troubleshooting/getapp-tier1-troubleshooting).
