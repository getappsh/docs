---
id: deploy-v2-context
title: Context
sidebar_label: Context
sidebar_position: 6
---

# Context

What's actually inside the `{Device.*}` and `{Config.*}` [placeholder](./deploy-v2-tasks#placeholders--dynamic-values-at-runtime)
sources, and what a task's `Rule` evaluates against.

## Device metadata

The device context is the agent's own reported metadata — the same object a `Rule` condition
checks and `{Device.Path}` reads from:

| Field | What it is |
|---|---|
| `mac_address` | MAC address |
| `ip_address` | IP address |
| `name` | Device name |
| `location` | Geographic location (lat/long-style object) |
| `os` | Operating system |
| `os_release` | OS release version |
| `storage_available` | Available storage, in bytes |
| `battery` | Battery status |
| `bandwidth` | Latest measurement — download/upload Kbps and connection type |
| `versions` | Installed agent and agent-UI versions |
| *(anything else)* | Any custom key sent in the device's metadata that isn't one of the fields above is kept flat, exactly as sent — reachable the same way (`{Device.customField}`) |

So `{Device.os}` resolves the OS string, `{Device.bandwidth.downloadKbps}` (or however a given
custom field is nested) resolves into that object, and `{Device.customField}` reaches anything
you've added yourself — same rules as every other placeholder: it must resolve to a scalar, or
the task fails.

## Device config groups

`{Config.*}`, `{ConfigJson.*}` and `{ConfigPath.*}` read the configuration groups the device has
synced from the server ([GetConfig](../../../../technician/agent/configurations/getconfig)) — the
groups the agent keeps on disk. They are read once when the action starts running. A device with no
synced config leaves every `{Config.*}` unresolved, which
fails the task that uses it. See [Tasks](./deploy-v2-tasks#config-groups-in-depth) for how paths
and group values resolve.

`{DeviceConfig.*}` is different: it reads the agent's **own** runtime settings (`config.yaml`),
dotted by zone — e.g. `{DeviceConfig.device.meta_data.name}`.

## See also

- [Tasks](./deploy-v2-tasks#placeholders--dynamic-values-at-runtime)
- [Action](./deploy-v2-action)
