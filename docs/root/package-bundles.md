---
id: package-bundles
title: Package Bundles
sidebar_label: Package Bundles
sidebar_position: 2
---

# Package Bundles

This guide covers the packaging configurations and build scripts for the GetApp Agent across different distribution formats: Debian/Ubuntu (`.deb`), Red Hat–family (`.rpm`), and Windows (`.msi`).

If you only need to install a pre-built package, see [Getting Started](./getting-started.md). The page below is for building packages from source, advanced install-time configuration, and silent / unattended deployments.

## Current Structure

```
bundles/
├── rpm/           # Red Hat/CentOS/AlmaLinux/Fedora packages
│   ├── build-rpm.sh
│   ├── getapp.service
│   ├── postinst
│   └── postrm
├── debian/        # Debian/Ubuntu packages
│   ├── build-deb.sh
│   ├── getapp.service
│   ├── postinst
│   └── postrm
└── wix/           # Windows MSI installer
    ├── main.wxs           # Main WiX installer definition
    ├── advanced-dlg.wxs   # Advanced Options dialog (URL, gateway port)
    ├── patch-dot-env.vbs  # VBScript: patches .env during install (deferred CA)
    └── read-dot-env.vbs   # VBScript: reads .env to pre-populate dialog on upgrade
```

## Building Packages

### Debian Package

**Supported Platforms**: Debian, Ubuntu, Linux Mint

**Prerequisites**:
```bash
cargo install cargo-deb
```

**Build**:
```bash
# From the agent/ directory:
./bundles/debian/build-deb.sh
```

Or manually:
```bash
cargo deb
```

The `.deb` package will be created in `target/debian/`

**Install**:
```bash
# Default configuration
sudo dpkg -i target/debian/getapp_*.deb

# With configuration overrides (env vars are forwarded to the postinst script)
sudo env GETAPP_BASE_URL=https://prod.server.com GETAPP_GATEWAY_PORT=2220 dpkg -i target/debian/getapp_*.deb

# With extra .env overrides (semicolon-separated KEY=VALUE pairs)
sudo env GETAPP_EXTRA_VARS="DEVICE_SECRET=mysecret;SWAGGER_ACTIVE=false" dpkg -i target/debian/getapp_*.deb
```

On **upgrade**, dpkg preserves `/etc/getapp/.env` (conffile protection — intentional: allows
users to manually edit and keep their `.env` on Linux, where no registry-based self-patch runs).
Only variables you explicitly pass are applied to the existing file.

**Configuration variables** (same names as MSI properties):

| Variable | `.env` key | Notes |
|---|---|---|
| `GETAPP_BASE_URL` | `BASE_URL` | Server URL |
| `GETAPP_GATEWAY_PORT` | `GATEWAY_PORT` | External port, default 2220 |
| `GETAPP_EXTRA_VARS` | _arbitrary_ | Semicolon-separated `KEY=VALUE` pairs — **MSI only** (on Linux, pass individual `GETAPP_KEY=value` env vars; `GETAPP_EXTRA_VARS` is accepted for MSI-script compat) |
| Any `GETAPP_*` | key with `GETAPP_` stripped | Individual extra keys — **Linux only** (e.g. `GETAPP_LOG_LEVEL=warn` → `LOG_LEVEL=warn` in `.env`) |

> **Passing extra `.env` keys on Linux** — use individual `GETAPP_KEY=value` env vars (postinst strips the prefix):
> ```bash
> sudo env GETAPP_DEVICE_SECRET=mysecret GETAPP_LOG_LEVEL=warn dpkg -i getapp_*.deb
> ```
> `GETAPP_EXTRA_VARS="KEY=VALUE;KEY2=VALUE2"` is also accepted on Linux (for compatibility with MSI automation scripts) but individual vars are the idiomatic Linux approach. On Windows MSI, `GETAPP_EXTRA_VARS` is the only supported mechanism for arbitrary extra keys — MSI ignores undeclared individual properties.

**Uninstall**:
```bash
# Remove package (preserves /etc/getapp/.env and data directories)
sudo dpkg -r getapp-agent

# Purge — remove package AND all config files (/etc/getapp)
sudo dpkg --purge getapp-agent
```

### RPM Package

**Supported Platforms**: Red Hat Enterprise Linux, CentOS, AlmaLinux, Fedora, Rocky Linux

**Prerequisites**:
```bash
cargo install cargo-generate-rpm
```

**Build**:
```bash
# From the agent/ directory:
./bundles/rpm/build-rpm.sh
```

Or manually:
```bash
cargo build --release
cargo generate-rpm
```

The `.rpm` package will be created in `target/generate-rpm/`

**Install**:
```bash
# Default configuration — using dnf (recommended, handles dependencies)
sudo dnf install -y target/generate-rpm/getapp-*.rpm

# Using rpm directly (no dependency resolution)
sudo rpm -i target/generate-rpm/getapp-*.rpm

# With configuration overrides
sudo env GETAPP_BASE_URL=https://prod.server.com GETAPP_GATEWAY_PORT=2220 dnf install -y target/generate-rpm/getapp-*.rpm

# With extra .env overrides (semicolon-separated KEY=VALUE pairs)
sudo env GETAPP_EXTRA_VARS="DEVICE_SECRET=mysecret;SWAGGER_ACTIVE=false" dnf install -y target/generate-rpm/getapp-*.rpm

# Upgrade — pass only what you want to change
sudo env GETAPP_BASE_URL=https://newserver.com dnf install -y target/generate-rpm/getapp-*.rpm
```

> **`dnf` vs `rpm`**: prefer `dnf install -y` — it resolves dependencies automatically.
> `rpm -i` / `rpm -U` work but will fail if dependencies are missing.
> For upgrade, `dnf install` automatically detects and upgrades an existing installation.

On **upgrade**, RPM preserves `/etc/getapp/.env` (`config = "noreplace"` — intentional:
allows users to manually edit and keep their `.env` on Linux, where no registry-based self-patch runs).
Only variables you explicitly pass are applied to the existing file. Same variables as DEB — see table above.

**Service management (systemctl)**:
```bash
# Check service status
systemctl status getapp

# Start / stop / restart
sudo systemctl start getapp
sudo systemctl stop getapp
sudo systemctl restart getapp

# Enable / disable autostart on boot
sudo systemctl enable getapp
sudo systemctl disable getapp

# View live logs
sudo journalctl -u getapp -f

# View last 100 log lines
sudo journalctl -u getapp -n 100 --no-pager
```

**Uninstall**:
```bash
# Remove package using dnf (recommended)
sudo dnf remove getapp-agent

# Remove package using rpm directly
sudo rpm -e getapp-agent
```

> `/etc/getapp/.env` and data directories (`/var/lib/getapp`, `/var/log/getapp`) are preserved on uninstall — remove manually if needed:
> ```bash
> sudo rm -rf /etc/getapp /var/lib/getapp /var/log/getapp
> ```

### Windows MSI

**Supported Platforms**: Windows

**Prerequisites**:
```bash
cargo install cargo-wix
```

**Build**:
```bash
cargo wix
```

The `.msi` installer will be created in `target/wix/`

#### Interactive Installation

Double-click the `.msi` or run:
```powershell
msiexec /i target\wix\GetAppAgent-Services-x.y.z-x86_64.msi
```
The installer shows a dialog sequence: Welcome → Install Directory → (optional) Advanced Options → Install.

The **Advanced Options** dialog lets you set:
- **Server URL** (`BASE_URL`) — the GetApp server this agent reports to
- **Gateway port** (`GATEWAY_PORT`) — the externally accessible port (default: 2220)

#### Silent Installation (CLI / DevOps)

> **Always use an absolute path** to the `.msi` file — `msiexec` runs elevated and does not
> inherit the shell's working directory, so relative paths like `.\GetApp*.msi` will fail.

| Flag | UI shown | Use case |
|---|---|---|
| _(none)_ | Full wizard | Interactive end-user install |
| `/qb` | Progress bar + Cancel button | Human watching a console |
| `/qb!` | Progress bar, no Cancel button | Unattended but visible |
| `/qn` | None | Scripts, CI/CD, automation |

```powershell
# Minimal — all defaults, no UI
msiexec /i GetAppAgent-Services-x.y.z-x86_64.msi /qn

# Full custom, no UI (CI/CD)
# NOTE: when the path contains spaces, quote the entire PROPERTY=value as one string.
msiexec /i GetAppAgent-Services-x.y.z-x86_64.msi /qn `
    "INSTALLDIR=C:\custom\path\" `
    GETAPP_BASE_URL=https://prod.server.com `
    GETAPP_GATEWAY_PORT=2220

# With extra .env overrides (semicolon-separated KEY=VALUE)
msiexec /i GetAppAgent-Services-x.y.z-x86_64.msi /qn `
    GETAPP_BASE_URL=https://prod.server.com `
    GETAPP_EXTRA_VARS="DEVICE_SECRET=mysecret;SWAGGER_ACTIVE=false;LOG_LEVEL=warn"
```

#### MSI Properties Reference

| Property | Default | Description |
|---|---|---|
| `INSTALLDIR` | `C:\Program Files\GetApp\` | Installation directory — effective on **first install only**; ignored on upgrade/reinstall (path is locked in registry after first install) |
| `GETAPP_BASE_URL` | build-time default URL | GetApp server URL, written to `BASE_URL` in `.env` |
| `GETAPP_GATEWAY_PORT` | `2220` | External gateway port, written to `GATEWAY_PORT` in `.env` |
| `GETAPP_EXTRA_VARS` | _(empty)_ | Semicolon-separated `KEY=VALUE` pairs for additional `.env` overrides — **MSI only** (on Linux, pass individual `GETAPP_KEY=value` env vars instead) |

> **Property name case:** MSI officially requires public property names to be ALL UPPERCASE. Lowercase names may also work in practice when running with administrator privileges, but uppercase is always recommended for reliable, portable behavior.

#### How configuration is applied to `.env`

The MSI patches `.env` directly during installation via an embedded VBScript deferred custom action (runs inside `msiexec.exe` — no external scripts, GPO execution policy cannot block it).

- Any non-empty var explicitly passed on the CLI is written — including the factory default value, which acts as a reset.
- A silent upgrade with no CLI args is a pure no-op on `.env`.
- `GETAPP_BASE_URL` → overwrites `BASE_URL=`
- `GETAPP_GATEWAY_PORT` → overwrites `GATEWAY_PORT=`
- `GETAPP_EXTRA_VARS` → each semicolon-separated `KEY=VALUE` pair: overwrites the key if it exists, or appends under a `# --- MSI Install Vars ---` section
- Keys already in `.env` are updated in-place preserving original capitalisation; new keys are appended under a `# --- MSI Install Vars ---` section
- Manual edits and custom keys in `.env` are **never overwritten** (`NeverOverwrite="yes"` on the WiX component)

#### Silent upgrade

On upgrade, `.env` is never overwritten — all previous settings are preserved automatically. The Advanced Settings dialog pre-populates from the installed `.env`. Pass only the CLI properties you want to change:

```powershell
# Upgrade to a new version — .env preserved, only URL changed
msiexec /i "C:\path\to\GetAppAgent-Services-x.y.z-x86_64.msi" /qb `
    GETAPP_BASE_URL=https://newserver.com
```

Plain `msiexec /i` works for both **version upgrades** and **same-version reinstalls**.
`MajorUpgrade` handles the old product removal automatically.

> **Note:** Version upgrades may take ~60 seconds while the old service is stopped and
> the new one is started. Same-version reinstalls are faster. This is normal behaviour.

> **⚠ Do NOT pass `REINSTALL=ALL REINSTALLMODE=vomus`** — this prevents `msiexec` from
> performing the upgrade or reinstall entirely. It enters maintenance mode for the existing
> product and silently does nothing.
>
> **`INSTALLDIR` is ignored on reinstall/upgrade** — the install path is recorded in the
> registry on first install and restored automatically on every subsequent run. To move the
> installation to a different directory, uninstall first, then reinstall with the new path:
> ```powershell
> msiexec /x "C:\path\to\GetAppAgent-Services-0.3.26-x86_64.msi" /qn
> msiexec /i "C:\path\to\GetAppAgent-Services-0.3.26-x86_64.msi" /qn "INSTALLDIR=D:\custom\getapp\"
> ```

#### Verify installation

```powershell
# Registry now stores only: InstallVersion, InstallDir, DataPath, Name
reg query "HKLM\SOFTWARE\Elbit Systems\GetApp"

# .env is patched during MSI installation (not on first service startup)
Get-Content "C:\Program Files\GetApp\bin\.env" | Select-String "BASE_URL|GATEWAY_PORT"
```

## Package Components

### Service Files
Each package includes a systemd service unit file (`getapp.service`) for Linux platforms that:
- Runs the GetApp Agent as a system service
- Enables automatic startup on boot
- Manages service lifecycle (start, stop, restart)

### Installation Scripts

**postinst**: Post-installation script that:
- Sets up necessary directories and permissions
- Enables and starts the service
- Performs initial configuration

**postrm**: Post-removal script that:
- Cleans up service files
- Removes configuration (optional)
- Performs cleanup tasks

## Configuration

Package metadata is configured in the root `Cargo.toml`:
- `[package.metadata.deb]` — Debian package configuration
- `[package.metadata.generate-rpm]` — RPM package configuration
- `[package.metadata.wix]` — Windows installer configuration

## Next Steps

After installation:
- [Enrollment](./technician/enrollment.md) — connect the agent to a GetApp server
- [CLI](./technician/cli.md) — manage device updates and software delivery from the command line
- [Disconnected Environments](./technician/disconnectedEnviorment.md) — using the agent in air-gapped or offline networks
