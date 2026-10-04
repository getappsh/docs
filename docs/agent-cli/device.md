---
id: device
title: Device Commands
sidebar_label: Device
sidebar_position: 2
---

# Device Commands

Manage device information and enrollment.

## `device get`

Get device information.

```bash
getapp device get --output table
```

## `device set-id <ID>`

Set the device ID.

```bash
getapp device set-id DEVICE-12345
```

## `device set-enrollment`

Configure enrollment.

| Flag | Description |
|---|---|
| `--device-id` | Device ID |
| `--device-type` | Device type token |
| `--platform` | Platform type token |
| `--server-urls` | GetApp server URL(s) |

```bash
getapp device set-enrollment --device-id DEV-001 --device-type router
```

## `device set-metadata`

Update device metadata.

| Flag | Description |
|---|---|
| `--name` | Device display name |
| `--location` | Device location |
| `--misc` | Free-form misc metadata |

Use `--help` with any command for full details.
