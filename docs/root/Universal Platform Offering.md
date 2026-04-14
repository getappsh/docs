---
id: universal-platform-offering
title: Universal Platform Offering
sidebar_label: Universal Platform Offering
sidebar_position: 5
---

# Universal Platform Offering

By default, a device receives offering results scoped to its specific **platform** and **device type**.  
The **Universal Platform** feature allows a device to receive offering results for **all platforms** in a single discovery response.

---

## How It Works

During device discovery, the server checks each platform identifier the device reports.  
If the device's platform list includes the reserved token `universal`, the server fetches offerings for every registered platform and merges them into the discovery response — instead of fetching only the device's own platform.

This is useful for devices that need to be aware of the full catalog across all platforms, such as management consoles, gateways, or universal installer nodes.

---

## Enabling Universal Platform Offering

To enable this behavior, assign the platform name `universal` to the device in the server configuration.

:::caution Reserved Name
`universal` is a **reserved platform identifier**. Do not create a regular platform with this name — it will be treated as the universal token and bypass normal platform-scoped offering.
:::

---

## Discovery Response Behavior

| Device Platform | Offering Scope |
|---|---|
| `linux-x64`, `windows-arm`, etc. | Offering for that specific platform only |
| `universal` | Offering for **all** registered platforms, merged into one response |

When `universal` is detected, the server:
1. Fetches the full list of registered platforms.
2. Retrieves the offering for each platform concurrently (failures for individual platforms are tolerated — they are skipped, not propagated).
3. Merges all results into the unified `releases` array of the discovery response.

---

## Notes

- **Fault tolerance**: If fetching the offering for one platform fails, it is silently skipped. The device still receives offerings for all other platforms.
- **Dependencies**: Platform offerings returned include nested component dependencies, resolved recursively.
- **Deduplication**: If the same release appears under multiple platforms, it is merged into a single entry with a combined `hierarchyTrees` structure showing all applicable platform/device-type paths.

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

The platform expansion in A2A mode was refined in the latest commits:

1. The server queries the **offering tree table** directly to discover which platforms actually have offering entries (`get_distinct_platform_names`), rather than iterating over the platform registry. This avoids empty results when platforms are registered but have no associated offerings.
2. For each discovered platform, the offering tree is fetched and merged into the unified response.
3. Downstream agents connecting to the A2A intermediary receive offerings scoped to their own platform as usual — the intermediary holds the full catalog and serves the right slice.

