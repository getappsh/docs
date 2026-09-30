---
id: platform-configure
title: Platform Configure
sidebar_label: Platform Configure
sidebar_position: 2
---

# Platform Configure

What a platform's identity actually consists of — the enrollment fields set once at install,
and the metadata reported continuously afterward. For the *how-to* of editing `.env` and
restarting the service, see [Enrollment](./enrollment).

## Enrollment — set once, rarely changes

Written at install time (via the MSI/RPM installer or `.env`), read once at startup:

| Field | Maps to | What it is |
|---|---|---|
| `device_id` | `DEVICE_ID` | The device's unique identifier |
| `device_type` | `DEVICE_TYPE_TOKEN` | One or more device-type tokens |
| `platform_id` | `PLATFORM_TYPE_ID` | The platform's unique ID |
| `platform` | `PLATFORM_TYPE_TOKEN` | The platform's name/token |
| `url_get_app_server_available` | `BASE_URL` (plus fallbacks) | The GetApp server URL(s) this agent can reach |
| `delivery_source` | — | Delivery source mode |
| `orchestrate_me` | — | When `true`, requests a master agent orchestrate this device (A2A) |

See [Enrollment](./enrollment) for editing these via `.env`, and
[Package Bundles](../deployment/package-bundles) for setting them at install time via MSI/RPM properties.

## Metadata — reported continuously

Gathered live from the device and sent on every discovery/heartbeat, not something you set by
hand:

| Field | What it is |
|---|---|
| `mac_address` / `ip_address` | Network identity |
| `name` | Device display name |
| `location` | Geolocation, when available |
| `os` / `os_release` | Operating system and version |
| `storage_available` | Free disk space |
| `battery` | Battery status, on battery-powered devices |
| `bandwidth` | Measured upload/download throughput |
| `versions` | Installed agent/agent-UI version strings |
| `misc` | Flattened, agent-specific extra fields |

This is the same metadata the [Platform Table](../../../user-docs/admin/manage-platform/platform-table#expanding-a-row)
and [Platform Information](../../../user-docs/admin/manage-platform/platform-information) drawer
show on the server side — enrollment identifies the platform once, metadata is what keeps its
picture on the server current.

## See also

- [Enrollment](./enrollment)
- [GetConfig](./getconfig)
- [Platform Table](../../../user-docs/admin/manage-platform/platform-table)
