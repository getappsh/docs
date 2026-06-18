---
id: a2a-parent-management
title: A2A Parent-Side Device Management
sidebar_label: A2A Parent Management
sidebar_position: 3
---

# A2A Parent-Side Device Management

## What Is This?

In A2A (Agent-to-Agent) deployments, one GetApp agent can serve as a **parent** that actively manages a fleet of child agents. The parent doesn't just forward requests — it acts as a **command center** where an operator can push software updates, monitor delivery progress, and manage all connected devices from a single app store interface.

This builds on the existing A2A capability where an agent can impersonate a GetApp server for other agents. The parent management layer adds **active fleet control** on top of that passive connectivity.

### Before vs After

| Without parent management | With parent management |
|---------------------------|------------------------|
| Each device manages itself independently | Operator manages all devices from one place |
| No fleet visibility | Real-time dashboard: who's online, what's installed, what's in progress |
| Software updates are device-by-device | Push one update → all devices receive it |
| No grouping | Devices grouped into a single platform (one app store) |
| No real-time commands | Instant command push to any connected device |

---

## How It Works

### Connection Modes

When you configure a device to connect to a parent, you choose one of two modes:

#### Orchestration Mode (Recommended for Managed Fleets)

The device requests to be **fully managed** by the parent. The parent must explicitly accept it. Once accepted:

- The device becomes part of the parent's **platform** — sharing the same app store catalog
- The operator can push updates, start/stop downloads, trigger installs
- The device reports its progress back to the parent
- The parent tracks the device's online status in real time

**Best for:** Fleets where all devices should receive the same software and be managed centrally.

#### Reactive Mode (Lightweight)

The device subscribes to the parent's command channel **without needing approval*cts immediately but:

- The device keeps its own identity and platform
- The parent can send commands, but the device isn't grouped into the fleet platform
- No confirmation handshake required

**Best for:** Devices that need command capability without tight coupling to the parent's platform.

#### Comparison

| | Orchestration Mode | Reactive Mode |
|---|---|---|
| Parent approval required | Yes | No |
| Device joins parent's platform | Yes — shared app store | No — keeps own identity |
| Operator can push commands | Yes | Yes |
| Unified fleet view in UI | Yes | Visible but not grouped |
| Use case | Managed fleet (primary) | Loosely coupled devices |

---

## The Platform Concept

When devct in orchestration mode, they all join the parent's **platform**. A platform is a logical group of devices that share:

- The same **offerings catalog** (available software)
- The same **app store UI** on the operator's side
- A unified **status view** (delivery and deploy progress for all devices)

```
┌────────────────────────────────────────────────────────┐
│  Platform: "Field Unit Store"                           │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Tablet A  │  │ Laptop B  │  │ Kiosk C   │            │
│  │ Online ✓  │  │ Online ✓  │  │ Offline ✗  │           │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  All receive the same software catalog                  │
│  All managed from ONE operator interface                │
└────────────────────────────────────────────────────────┘
```

**Key benefit:** The operator thinks in terms of "my fleet" — not individual devices. One push action delivers software to every device on the platform.

---

## Unified App Store — One View, All Platforms

When multiple platforms are managed under one master agent, the app store presents a **single unified view** showing all applications from all platforms in one grid.

### What the User Sees

- A flat grid of all available applications, sorted alphabetically
- Each app card shows its name, version, status, and available actions (download, install, open)
- No platform labels, no device tabs, no grouping — just apps

### What Happens Behind the Scenes

- Each app card internally tracks which device it belongs to (`deviceId`)
- When the user triggers an action (download, install, cancel), the system automatically routes the command to the correct target device
- Download and installation progress is tracked per-device and reflected in real-time on the corresponding card
- If the same app name appears on multiple devices, a subtle device badge is shown for disambiguation

### Important: Apps Are NOT Shared

Platforms are merged into one app store **view** but applications are not shared across platforms:

| What is unified | What is NOT shared |
|---|---|
| The visual presentation (one grid) | App catalogs (each device has its own) |
| Action buttons (one click = correct device) | Download/install state (per-device) |
| Progress monitoring (all cards in one view) | Delivery files (stored on target device) |
| Status visibility (online/offline per app) | Policies and rules (evaluated per-device) |

The unified store is a **presentation-layer merge** — one screen to see and control all apps across all managed platforms, while each app remains fully bound to its target device.

---

## Setting Up Parent Management

### On the Parent (Master) Device

The parent device requires no special configuration to accept children — it automatically serves the fleet management endpoints. Ensure:

1. The parent agent is running and accessible on the network
2. The parent's own `orchestrate_me` setting is **disabled** (a device that is itself orchestrated cannot manage children)

### On Each Child Device

Configure the child's `config.yaml` (or environment variables) before connecting:

**For orchestration mode (full fleet membership):**
```yaml
device:
  orchestrate_me: true
```

**For reactive mode (lightweight command channel):**
```yaml
device:
  reactive_mode: true
```

**Both modes simultaneously** (always connected + platform adoption if confirmed):
```yaml
device:
  orchestrate_me: true
  reactive_mode: true
```

The child also needs to know where the parent is — set the base URL to point to the parent agent instead of the GetApp server.

### What Happens After Configuration

1. **Child boots** and sends its metadata to the parent
2. **Parent stores** the device in its fleet registry
3. **If orchestration mode:**
   - Parent confirms the device (responds with `orchestrated_by`)
   - Child adopts the parent's platform identity
   - Child activates its command listener
4. **If reactive mode:**
   - Child activates immediately (no confirmation needed)
   - Child keeps its own platform identity
5. **Child subscribes** to the parent's SSE command channel
6. **Parent marks device as online** in the fleet dashboard

---

## Operator Workflow

### Viewing the Fleet

The operator accesses the fleet through the app store UI connected to the parent agent. The fleet view shows:

- **All connected devices** with their status (online/offline)
- **Device metadata** (OS, storage, battery, device type)
- **Component state** (what's installed, what's being downloaded)
- **Delivery/deploy progress** across the fleet

### Filtering Devices

The fleet can be filtered by three dimensions:

| Filter | Options | Description |
|--------|---------|-------------|
| **Status** | Active / Inactive / All | Active = recently reported. Inactive = not seen within TTL window |
| **Mode** | Orchestrated / Reactive / Both | Management level of the device |
| **Connectivity** | Online / Offline / Both | Whether the device is currently connected |

### Pushing Software Updates

To push a software component to devices:

1. Select the component (catalog entry) to deploy
2. Select target devices (all fleet, or specific subset)
3. Execute the push action

The system will:
- Deliver the offering to each target device
- Start the download automatically (or wait for manual trigger depending on action)
- Report progress back to the operator in real time

### Available Actions

| Action | What It Does |
|--------|-------------|
| **Push** | Send a new software offering to device(s) — makes it available for download |
| **Start Delivery** | Begin downloading a specific component on device(s) |
| **Stop Delivery** | Pause an in-progress download |
| **Cancel Delivery** | Cancel and discard a download |
| **Delete Delivery** | Remove a downloaded artifact from device(s) |
| **Start Deploy** | Install a downloaded component on device(s) |
| **Discovery** | Force device(s) to refresh their component inventory |
| **Metadata Request** | Request device(s) to send fresh system information |

### Monitoring Progress

After pushing an action, the operator can monitor progress through the releases view:

- **Per-device download progress** (percentage, speed, ETA)
- **Deploy status** (pending, in progress, success, failed)
- **Fleet-wide overview** (how many devices completed vs pending)

---

## Device Lifecycle

### Online/Offline Detection

Devices are tracked in real time through their SSE connection:

- **Online:** Device has an active connection to the parent's command channel
- **Offline:** Connection dropped (detected within ~10 seconds via heartbeat)

Offline devices **cannot receive commands**. Commands are not queued — the operator must resend after the device reconnects.

### TTL-Based Status

Beyond online/offline, devices have a TTL-based activity status:

- **Active:** Device has reported within the configured time window (default: hours)
- **Inactive:** Device hasn't reported recently but is still registered
- **Deleted:** Device hasn't reported for an extended period and is automatically removed

### Reconnection

When a device reconnects after going offline:
1. It re-registers with the parent (sends fresh metadata)
2. The parent updates its state in the fleet registry
3. The device resumes listening for commands
4. The operator sees it transition back to "online"

This happens automatically — no manual intervention required.

---

## Architecture Patterns

### Single Master + Fleet (Most Common)

One parent device manages all other devices in the deployment:

```
         Operator (App Store UI)
              │
              ▼
     ┌─────────────────┐
     │  Master Agent    │  ← Manages the fleet
     └────────┬────────┘
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
  Child     Child     Child    ← All orchestrated, same platform
```

### Master + Mixed Fleet

Parent manages some devices tightly (orchestrated) and observes others loosely (reactive):

```
         Operator (App Store UI)
              │
              ▼
     ┌─────────────────┐
     │  Master Agent    │
     └────────┬────────┘
              │
    ┌─────────┼─────────────┐
    ▼         ▼             ▼
  Child     Child        Child
  (orch)    (orch)      (reactive)
  Platform  Platform    Independent
  member    member      listener
```

### Multi-Tier (Server → Master → Fleet)

A centralized server manages the master, which in turn manages local devices:

```
  GetApp Server (cloud/HQ)
         │
         ▼
  ┌─────────────────┐
  │  Master Agent    │  ← Receives updates from server
  │  (standalone)    │  ← Manages local fleet
  └────────┬────────┘
           │
     ┌─────┼─────┐
     ▼     ▼     ▼
   Child Child Child   ← Orchestrated by master
```

> **Note:** The master in this pattern connects to the server in standalone mode (not orchestrated). A device that is itself orchestrated cannot manage children.

---

## Important Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| **Commands are not queued** | Offline devices miss commands | Monitor connectivity; resend after device comes back online |
| **Single parent only** | A device can be managed by exactly one parent | Plan your hierarchy; reassigning requires config change |
| **No circular management** | An orchestrated device cannot orchestrate children | Keep masters in standalone mode |
| **Platform ID is persistent** | Once adopted, remains even if parent changes | Clear `platform_id` and `orchestrated_by` in config when switching parents |
| **Heartbeat delay** | Offline detection takes ~10 seconds | Account for brief delay between disconnect and status update |

---

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| Device doesn't appear in fleet | Child not configured to connect to this parent | Verify `orchestrate_me` or `reactive_mode` is enabled and base URL points to parent |
| Device shows "offline" but is running | Network issue or SSE connection dropped | Check network connectivity; device should auto-reconnect within seconds |
| Pushed command had no effect | Device was offline when command was sent | Verify device is online, then resend the command |
| Device never gets confirmed (orch mode) | Parent has `orchestrate_me = true` | Disable `orchestrate_me` on the parent — it can't manage children if it's managed itself |
| Stale devices in fleet list | Device hasn't been removed after going inactive | Manually delete via the UI, or wait for auto-cleanup (TTL-based) |
| Software not available on child | Offering wasn't pushed to that specific device | Ensure the device ID was included in the push action's device list |
| Child shows wrong platform | Previously connected to a different parent | Clear `platform_id` and `orchestrated_by` in the child's config, then restart |

---

## Quick Reference

### Configuration Summary

| Setting | Location | Values | Effect |
|---------|----------|--------|--------|
| `device.orchestrate_me` | Child config | `true` / `false` | Request full fleet membership from parent |
| `device.reactive_mode` | Child config | `true` / `false` | Subscribe to parent commands without approval |
| `device.orchestrated_by` | Child config (auto-set) | Parent's ID or `null` | Populated by parent during handshake |
| `device.platform_id` | Child config (auto-set in orch mode) | Platform identifier | Inherited from parent in orchestration mode |

### Action Quick Reference

| I want to... | Action | Notes |
|--------------|--------|-------|
| Make software available to devices | **Push** | Adds offering to device catalog |
| Start downloading on devices | **Start Delivery** | Begins download immediately |
| Pause a download | **Stop Delivery** | Can be resumed later |
| Cancel and remove a download | **Cancel Delivery** | Discards partial download |
| Remove installed software | **Delete Delivery** | Removes artifact from device |
| Install downloaded software | **Start Deploy** | Triggers installation |
| Refresh device inventory | **Discovery** | Device re-scans its components |
| Get fresh device info | **Metadata Request** | Device sends updated system info |
