---
id: logs-and-metrics
title: Logs and Metrics — Transfer Agent to Server
sidebar_label: Logs and Metrics
sidebar_position: 1
---

# GetApp Logs and Metrics — Transfer Agent to Server

Two independent, always-local-first mechanisms push agent data up to the server: log
dispatch, and Matomo analytics. Neither blocks the agent's normal operation if the server is
unreachable — both buffer locally and catch up later.

## Log dispatch

A background job periodically uploads the agent's own log file to the server.

| Setting | Default | What it does |
|---|---|---|
| `RUN_LOG_DISPATCH_JOB` | `true` | Enables the job. When `false`, dispatch is skipped entirely (logged, not an error). |

**How it works:**
1. The job asks the server for an upload endpoint.
2. It collects log entries since the last successful dispatch — on first run, defaults to the
   last 3 days.
3. It uploads the log file to that endpoint, tagged `"Device Monitoring"`.
4. The last-dispatch timestamp is updated regardless of outcome, so a failed run doesn't
   endlessly re-upload the same window on every retry.

## Metrics — Matomo analytics

Usage/analytics events are tracked locally with [Matomo](https://matomo.org/) and sent to a
configured Matomo tracker on a schedule — not streamed live.

| Setting | Default | What it does |
|---|---|---|
| `matomo.matomo_use_buffer` | — | Buffer events locally before sending, instead of sending immediately |
| `matomo.matomo_server_url` | — | The Matomo tracker URL to report to |
| `matomo.matomo_site_id` | — | Matomo site ID |
| `matomo.matomo_dimension_id` | — | Matomo custom dimension ID |
| `matomo.matomo_max_retention_hours` | — | How long buffered events are kept before being dropped |
| `matomo.matomo_max_buffer_size_mb` | — | Buffer size cap on disk |

Buffered events are stored under `{data_dir}/analytics` and flushed to the tracker on the
configured send interval — if the server is unreachable, events simply wait in the buffer
until the next successful send, up to the retention/size limits above.

These settings are pushed the same way as any other agent setting — see the
[`getapp_config` reserved group](../configurations/getconfig#the-getapp_config-reserved-group) in GetConfig.

## See also

- [GetConfig](../configurations/getconfig)
- [Agent Configuration & Settings](../configurations/agent-settings)
