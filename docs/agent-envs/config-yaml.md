---
id: config-yaml
title: Runtime Settings (config.yaml)
sidebar_label: Runtime Settings (config.yaml)
sidebar_position: 1
---

# Runtime Settings (`config.yaml`)

Separate from the install-time [`.env` file](./env-file), the agent keeps a YAML-backed
settings store — `config.yaml` — for values that can change **while the agent is running**,
with no restart required. On first start, every key is seeded from an existing YAML value,
then a matching environment variable, then a compiled-in default, so the file always ends up
with every key present and visible.

:::note Editing config.yaml
Read and write these values with the [`getapp` CLI](/docs/root/technician/agent/interfaces/cli)
(`getapp config get`, `getapp config set ...`), or push them from the Server Dashboard.
A subset is also exposed as CLI flags directly (`--delivery-auto-trigger`,
`--deploy-timeout`, `--tcp-timeout`, ...). By default, server-pushed values win on conflict
with local ones — set `LOCAL_CONFIG_PRIORITY=true` in `.env` to flip that.
:::

:::note Source of truth
Reconstructed from the key constants and startup defaults in `agent/src/settings/settings_io.rs`.
Paths below are dotted for readability; in the file they're nested YAML — `delivery.max_parallel_deliveries`
is stored as a `max_parallel_deliveries` field nested under a `delivery` section.
:::

## Device

| Key | Default | Description |
|---|---|---|
| `device.device_id` | auto | Unique device ID (device-id file → `DEVICE_ID` env → hardware machine ID) |
| `device.device_type_token` | OS-specific | Device type token(s), e.g. `agent_linux`, `agent_macos`, `agent` |
| `device.platform` | — | Platform type token |
| `device.platform_id` | — | Platform's unique ID |
| `device.meta_data.name` | generated | Device display name |
| `device.meta_data.misc` | — | Free-form misc metadata |
| `device.meta_data.platform_name` | — | Human-readable platform name |
| `device.meta_data.unit` | — | Unit/location label |
| `device.local_config_priority` | `false` | When `true`, local values win over server-pushed values on conflict |
| `device.orchestrate_me` | `false` | Whether this device participates in orchestration as a managed (slave-side) node |
| `device.reactive_mode` | `false` | Enable reactive orchestration mode |
| `device.orchestrated_by` | — | ID of the orchestrator managing this device, when orchestrated |

## Network

| Key | Default | Description |
|---|---|---|
| `network.getapp_server_urls` | from `BASE_URL` | Server URLs the agent connects to |
| `network.availability_url` | — | URL used to probe network availability |
| `network.net_tcp_stream_timeout_sec` | `5` | TCP stream timeout, in seconds |
| `network.connection_refresh_enabled` | `false` | Periodically re-check and refresh the network connection |
| `network.connection_refresh_interval_secs` | `60` | Interval between connection refresh checks |
| `network.scan_interval_secs` | `5` | Interval between network scans |
| `network.scan_gateway_timeout_ms` | `500` | Timeout for gateway scan probes, in milliseconds |

## General

| Key | Default | Description |
|---|---|---|
| `general.query_status_interval_sec` | `2` | Seconds between polls for import/prepared status |

## Releases

| Key | Default | Description |
|---|---|---|
| `releases.health_check_timeout_secs` | `5` | Timeout for a single health check probe |
| `releases.health_check_interval_mins` | `1` | Interval between health check scheduling runs |

## Discovery

| Key | Default | Description |
|---|---|---|
| `discovery.periodic_interval_min` | `60` | Interval between periodic discovery runs, in minutes |
| `discovery.stale_after_mins` | `30` | Minutes after which a discovery result is considered stale |
| `discovery.status_entry_ttl_hours` | `24` | Hours to retain a discovery status entry before it's pruned |

## Delivery

| Key | Default | Description |
|---|---|---|
| `delivery.delivery_auto_trigger` | — | Automatically trigger a download as soon as a matching offering is discovered |
| `delivery.delivery_storage_buffer_bytes` | `0` | Extra storage buffer, in bytes, reserved before a delivery may start |
| `delivery.use_only_artifacts_size_for_storage_calculation` | `false` | Ignore `totalSize` and calculate storage from raw artifact sizes only (CDN scenarios) |
| `delivery.max_parallel_deliveries` | `1` | Maximum concurrent deliveries |
| `delivery.delivery_timeout_mins` | `30` | Minutes before a single delivery is considered failed |
| `delivery.delivery_retry_count` | `2` | Download retry attempts on failure |
| `delivery.delivery_retry_delay_secs` | `5` | Delay between download retries, in seconds |
| `delivery.delivery_source` | `cache` | Delivery source: `remote` \| `cache` |

## Deploy

| Key | Default | Description |
|---|---|---|
| `deploy.deploy_auto_on_pull` | `false` | Automatically trigger deployment after a successful pull/download |
| `deploy.deploy_timeout_sec` | `60` | Timeout for a deployment to complete, in seconds |
| `deploy.install_done_timeout_min` | `15` | Minutes to wait for install-done confirmation |

## Bandwidth

| Key | Default | Description |
|---|---|---|
| `bandwidth.measurement_interval_sec` | `60` | Interval between bandwidth measurements |
| `bandwidth.tier_high_kbps` | `5000` | Threshold, in kbps, for the "high" bandwidth tier |
| `bandwidth.tier_medium_kbps` | `1000` | Threshold, in kbps, for the "medium" bandwidth tier |
| `bandwidth.measurement_timeout_sec` | `5` | Timeout for a single bandwidth measurement probe |

## Rules & policy enforcement

| Key | Default | Description |
|---|---|---|
| `rules.device_any` | `true` | Whether rules that target "any device" apply to this device |
| `rules.allow_no_policies` | `true` | Offer components that have no policies attached |
| `rules.enforce` | `true` | Globally enable/disable policy enforcement |
| `rules.enforcement_mode` | `offering` | Where policies are enforced: `offering` \| `delivery` \| `deploy` |

See [Policy Enforcement Configuration](/docs/root/technician/agent/rules-offering/policy-enforcement-configuration)
for the full behavior of each enforcement mode.

## Logs

| Key | Default | Description |
|---|---|---|
| `logs.logs_run_dispatch_job` | — | Enable the background log dispatch job |

## Telemetry

| Key | Default | Description |
|---|---|---|
| `telemetry.enabled` | `true` | Master switch for telemetry collection |
| `telemetry.logs_enabled` | `false` | Include logs in telemetry |
| `telemetry.metrics_enabled` | `false` | Include metrics in telemetry |
| `telemetry.send_interval_mins` | `60` | Minutes between telemetry send attempts |
| `telemetry.log_min_level` | `ERROR` | Minimum log level included in telemetry |
| `telemetry.send_batch_size` | `500` | Max records per telemetry send batch |
| `telemetry.backup_retention_hours` | `48` | Hours to retain un-sent telemetry backups |
| `telemetry.reactive_mode` | `false` | Send telemetry reactively rather than on a fixed interval |
| `telemetry.metrics_collect_interval_mins` | `5` | Minutes between metrics collection runs |

## Matomo

| Key | Default | Description |
|---|---|---|
| `matomo.matomo_use_buffer` | `true` | Buffer Matomo events instead of sending immediately |
| `matomo.matomo_server_url` | — | URL to send Matomo events to |
| `matomo.matomo_site_id` | — | Matomo site ID |
| `matomo.matomo_dimension_id` | — | Matomo dimension IDs, `key=value;key=value` |
| `matomo.matomo_max_retention_hours` | `720` | Max retention of buffered Matomo events, in hours |
| `matomo.matomo_max_buffer_size_mb` | `20` | Max Matomo buffer size, in MB |

## Orchestration

| Key | Default | Description |
|---|---|---|
| `reactive.sysinfo_push_interval_mins` | `5` | Minutes between system-info pushes when in reactive/orchestrated mode |

## See also

- [Environment Variables (.env)](./env-file) — install-time configuration, requires a restart
- [CLI Reference](/docs/root/technician/agent/interfaces/cli) — `getapp config get` / `getapp config set`
