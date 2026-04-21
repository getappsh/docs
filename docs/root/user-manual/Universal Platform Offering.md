---
id: universal-platform-offering
title: Universal Platform Offering
sidebar_label: Universal Platform Offering
sidebar_position: 5
---

# Universal Platform Offering

By default, a device sees only the software offerings that belong to its specific **platform** and **device type**.

The **Universal Platform** feature is for special devices — such as management consoles, gateways, or universal installer nodes — that need to see the **complete software catalog** across every platform and device type, not just their own.

---

## How It Works

When a device is configured with the `universal` platform identifier, the server automatically returns offerings for **all platforms and all device types** in a single response.

From the device's perspective, it simply receives a richer catalog — no special handling is needed on the device side.

---

## Enabling Universal Platform Offering

To enable this behavior, assign the platform name `universal` to the device in the server configuration.

:::tip Case-Insensitive
The token is **case-insensitive** — `universal`, `Universal`, and `UNIVERSAL` are all recognized and treated the same way.
:::

:::caution Reserved Name
`universal` is a **reserved platform identifier**. Do not create a regular platform with this name — it will be treated as the universal token and bypass normal platform-scoped offering.
:::

---

## What the Device Receives

| Device Platform | What the device sees |
|---|---|
| `linux-x64`, `windows-arm`, etc. | Only offerings relevant to that platform |
| `universal` | Offerings for **every** platform and device type in the system |

The response is a single merged list — the device does not need to make multiple requests or know how many platforms exist.

---

## Notes

- **Complete catalog**: The device receives offerings from all platforms and all device types — not just its own.
- **Partial availability**: If offerings for one platform or device type are temporarily unavailable, the device still receives everything else. No error is returned for partial failures.
- **No duplicates**: If the same software release is offered under multiple platforms or device types, it appears only once in the response.
- **Dependencies included**: Any software that another offering depends on is automatically included in the response.

---

## Agent-to-Agent (A2A) Mode

In an **A2A topology**, one agent acts as an intermediary server that downstream agents connect to instead of the main GetApp server. The intermediary agent proxies discovery, delivery, and deploy requests upstream.

### Universal Platform in A2A

For an A2A intermediary to serve downstream agents across **multiple platforms**, assign the `universal` platform token to the intermediary agent:

```env
# In the agent's .env file
DEVICE_PLATFORM_TOKEN=universal
```

With this setting, the intermediary agent's own discovery will retrieve offerings for every platform, making the full catalog available locally for all downstream agents regardless of their platform.

### How It Works in A2A

The intermediary agent, configured with `universal`, downloads the full catalog — all platforms and device types — from the upstream server.

Downstream agents connecting to the intermediary each receive only the offerings relevant to their own platform, exactly as they would connecting directly to the server. The `universal` setting is transparent to downstream agents.

---

## Configuration Reference (Technical)

There are three ways to set the `universal` platform on a device: via the `.env` file, via the enrollment CLI command, or via the REST API.

### Option 1 — Environment Variable (`.env` file)

Open the agent's `.env` file (see the [Enrollment](../technician/enrollment) page for file location) and set or add the `DEVICE_PLATFORM_TOKEN` variable:

```env
DEVICE_PLATFORM_TOKEN=universal
```

After saving the file, restart the agent service to apply the change.

:::note
If `DEVICE_PLATFORM_TOKEN` is commented out or not present, the agent uses the platform registered during enrollment. Uncomment or add the line to override it.
:::

### Option 2 — Enrollment CLI Command

Use the `device set-enrollment` CLI command with the `--platform` flag:

```bash
getapp device set-enrollment --platform universal
```

You can combine this with other enrollment parameters in a single command:

```bash
getapp device set-enrollment --device-id <DEVICE_ID> --device-type <TYPE> --platform universal
```

:::tip Verify the change
Run `getapp device get` to confirm the platform is now set to `universal`.
:::

### Option 3 — REST API

Send a `PUT` request to the agent's enrollment endpoint:

```
PUT http://<agent-host>:<port>/api/v2/device/enrollment
Content-Type: application/json
```

**Request body:**

```json
{
  "platform": "universal"
}
```

You can combine it with other enrollment fields in a single request:

```json
{
  "deviceId": "<DEVICE_ID>",
  "deviceType": ["<TYPE>"],
  "platform": "universal",
}
```

All fields are optional — only the ones provided will be updated.

:::tip Verify via API
After the call, send `GET http://<agent-host>:<port>/api/v2/device` to confirm the platform field is set to `universal`.
:::

---

### Comparison

| Method | When to use |
|---|---|
| `.env` file | Scripted/automated provisioning, infrastructure-as-code, or when managing many devices |
| `device set-enrollment` CLI | Interactive setup, one-off changes, or when UI/shell access is available |
| REST API | Remote or programmatic configuration, CI/CD pipelines, or management tools |

All three methods produce the same result — the agent reports `universal` as its platform on the next discovery cycle.

