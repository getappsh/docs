---
id: env-file
title: Environment Variables (.env)
sidebar_label: Environment Variables (.env)
sidebar_position: 2
---

# Environment Variables (`.env`)

The agent reads its install-time configuration from a `.env` file next to the binary (or from
real process environment variables, which take priority). These are set once at install —
via the MSI/RPM installer GUI/arguments, or by editing the file directly — and require an
agent restart to take effect.

For settings you can change **at runtime** without restarting, see
[Runtime Settings (config.yaml)](./config-yaml).

:::note Source of truth
This reflects `agent/.env.dev`, the canonical commented reference shipped in the agent
repository. If the two ever disagree, `.env.dev` wins.
:::

## Agent service

| Variable | Default | Description |
|---|---|---|
| `AGENT_IP` | `0.0.0.0` | The IP that the GetApp service listens on |
| `AGENT_PORT` | `2221` | The internal port the GetApp service runs on |
| `GATEWAY_PORT` | `2220` | The external gateway port the service is accessible from |
| `PROXY` | `false` | Enable proxy mode |
| `AGENT_URL` | — | URL of the getapp service for the GetApp CLI; if set, overrides hostname:port |

## DDS configuration

| Variable | Default | Description |
|---|---|---|
| `DDS_MACHINE_TYPE` | `Agent` | Machine type: `Agent` \| `IM` \| `Disabled` |

## GetApp server

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | — | URL of the GetApp server, e.g. `https://api-getapp-dev.apps.getapp.sh` |

## Agent identity

| Variable | Default | Description |
|---|---|---|
| `DEVICE_ID` | auto | Unique device ID for agent authentication. If unset, derived from system info or generated randomly |
| `DEVICE_TYPE_TOKEN` | `agent` | Device type token used for agent authentication |
| `PLATFORM_TYPE_TOKEN` | — | Platform name of the agent (optional) |
| `PLATFORM_TYPE_ID` | — | The platform's unique ID |

## Network

| Variable | Default | Description |
|---|---|---|
| `NETWORK_AVAILABILITY_URL` | — | URL used to check network availability (connected state); point it at a "disconnected" mock to simulate offline testing |
| `TCP_STREAM_TIMEOUT` | `5` | Timeout for the TCP stream, in seconds |

## API documentation

| Variable | Default | Description |
|---|---|---|
| `SWAGGER_ACTIVE` | `true` | If `false`, disables the Swagger UI — reduces memory usage |

## Matomo analytics

| Variable | Default | Description |
|---|---|---|
| `MATOMO_URL` | — | URL to send Matomo events to (optional) |
| `MATOMO_SITE_ID` | `3` | The site ID in Matomo |
| `MATOMO_DIMENSION_ID` | `map_name=1;role=2` | Matomo dimension IDs, `key=value;key=value` |
| `MATOMO_MAX_RETENTION_HOURS` | `24` | Max retention of buffered Matomo events, in hours |
| `MATOMO_MAX_BUFFER_SIZE_MB` | `20` | Max buffer size, in MB |

## Storage and asset paths

| Variable | Default | Description |
|---|---|---|
| `DATA_PATH` | platform default | Absolute path to the data directory (use `/` or `\\` as separator) |
| `MAP_ASSETS_DIR_PATH` | — | Path where map assets (GPKG files, data JSON) are located |
| `COMP_ASSETS_DIR_PATH` | `<data_dir>/downloads` | Folder to store downloaded components |

## Query and status

| Variable | Default | Description |
|---|---|---|
| `QUERY_STATUS_INTERVAL` | `2` | Seconds to wait when polling import/prepared status |

## Security and authentication

| Variable | Default | Description |
|---|---|---|
| `SECURE_TLS` | `true` | Enable TLS security |
| `AUTH_TYPE` | `secret` | Authentication type: `password` \| `CC` (client certificates) \| `secret` \| `token` |
| `DEVICE_SECRET` | — | Encrypted key agreed upon by client and server (for `AUTH_TYPE=secret`) |
| `TOKEN` | — | Constant refresh token to request a new access token (for `AUTH_TYPE=token`) |
| `AGENT_PASSWORD` | — | Password for the GetApp server (for `AUTH_TYPE=password`) |
| `AGENT_USERNAME` | — | Username for the GetApp server (for `AUTH_TYPE=password`) |
| `AGENT_KEY_PATH` | — | Client key path (for `AUTH_TYPE=CC`) |
| `AGENT_CERT_PATH` | — | Client certificate path (for `AUTH_TYPE=CC`) |
| `AGENT_CERT_KEY_PATH` | — | Client certificate key path (for `AUTH_TYPE=CC`) |
| `CA_CERT_PATH` | — | CA certificate path (for `AUTH_TYPE=CC`) |

## Background jobs and automation

| Variable | Default | Description |
|---|---|---|
| `RUN_LOG_DISPATCH_JOB` | `true` | Enable the log dispatch job |
| `AUTO_DEPLOY_ON_PULL` | `true` | Automatically trigger deployment after a successful pull/download |
| `HEALTH_CHECK_TIMEOUT_SECS` | `5` | Timeout for each individual health check probe |
| `HEALTH_CHECK_INTERVAL_MINS` | `1` | Interval between health check scheduling runs |
| `LOCAL_CONFIG_PRIORITY` | `false` | When `true`, existing local `config.yaml` values take priority over server-pushed values on conflict. Server values still fill in keys with no local value |

## Policy enforcement

| Variable | Default | Description |
|---|---|---|
| `ALLOW_NO_POLICIES` | `true` | When `true`, components with no policies are offered |
| `ENFORCE_POLICIES` | `true` | Globally enable/disable policy enforcement. When `false`, all policy checks are skipped regardless of `POLICY_ENFORCEMENT_MODE` |
| `POLICY_ENFORCEMENT_MODE` | `offering` | Where in the lifecycle policies are enforced: `offering` (hide non-compliant releases from the store), `delivery` (allow browsing, block download), or `deploy` (allow download, block install — for transfer-mode agents). Restrictions and device-type offering gating are **always** enforced regardless of this setting |

## Storage limits

| Variable | Default | Description |
|---|---|---|
| `STORAGE_DELIVERY_BUFFER_BYTES` | `0` (disabled) | Extra storage buffer, in bytes, reserved beyond the component's required size before a delivery is allowed to start |
| `USE_ONLY_ARTIFACTS_SIZE_FOR_STORAGE_CALC` | `false` | When `true`, ignores component metadata's `totalSize` and calculates storage requirements only from raw artifact `size` fields — useful for CDN scenarios where the agent doesn't install components, only downloads them |

## Delivery

| Variable | Default | Description |
|---|---|---|
| `DELIVERY_SOURCE` | `Remote` | Delivery source: `Remote` \| `Cache` |
| `MAX_PARALLEL_DELIVERIES` | `1` | Maximum number of parallel deliveries allowed at once |
| `DELIVERY_TIMEOUT_MINS` | `30` | Timeout, in minutes, before a single delivery is considered failed |
| `DOWNLOAD_RETRY_COUNT` | `2` | Number of download retry attempts on failure |

## CDN

| Variable | Default | Description |
|---|---|---|
| `CDN_INACTIVE_DEVICE_HOURS` | `24` | Hours of inactivity after which a device is considered stale |
| `CDN_DEVICE_DELETE_AFTER_DAYS` | `30` | Days after which a stale row is hard-deleted from the DB |
| `CDN_PLATFORM_MANAGEMENT` | all platforms | Comma-separated platform filter list; uncomment to restrict |

## See also

- [Runtime Settings (config.yaml)](./config-yaml) — settings editable live via `getapp config set` or a dashboard push, no restart required
- [Getting Started](/docs/root/getting-started) — installing and configuring the agent
- [Policy Enforcement Configuration](/docs/root/technician/agent/rules-offering/policy-enforcement-configuration)
