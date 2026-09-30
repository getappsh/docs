---
id: sse
title: Server-Sent Events (SSE)
sidebar_label: SSE
sidebar_position: 2
---

# Server-Sent Events (SSE)

The Agent's local API exposes live event streams — a client subscribes once instead of
polling. Used internally by the Agent UI, and open to any local integration.

**Where it lives:** `GET /api/v2/events/*` on the agent's own API (default port `2220`).

## Streams

| Endpoint | Fires | Payload |
|---|---|---|
| `/events/offering` | The device's offering catalog changes | `Vec<ProjectOfferingDto>` — same shape as `GET /device/offering` |
| `/events/delivery` | Any delivery state change | The native `Delivery` record |
| `/events/deploy` | Any deployment state change | The native `Deploy` record |
| `/events/notifications` | A banner, warning, or error needs to reach the UI | `NotificationEvent` — kind, severity, category, message, optional entity reference |
| `/events/getconfig` | The device receives a new config from the server | The full assembled config object — same shape as `GET /config/file` |

Each stream's payload is self-contained — no follow-up REST call needed to react to an event.

## Offering stream parameters

`/events/offering` accepts the same query parameters as the offering REST endpoint:

| Param | Default | Effect |
|---|---|---|
| `bypass_policy` | `false` | Skip policy enforcement — availability is `null` on every release |
| `include_updates` | `false` | Include releases currently delivering, deploying, or already installed |
| `offering_mode` | `install` | On a `universal`-platform device: `install` returns only this device's own platform/type offerings; `download` returns everything across all platforms and types |

## Managed-command channel (A2A / CDN)

A separate channel, `GET /api/cdn/events/managed/{device_id}`, is the long-lived stream a
managed child device opens after a confirmed A2A handshake. It emits typed commands
(`Discovery`, `Push`, `DeliveryStart`, `DeliveryStop`, `DeliveryCancel`, `DeliveryDelete`,
`DeployStart`, `MetadataRequest`) plus `: ping` keepalives. Registering the stream marks the
device online on the parent; closing it marks it offline immediately. See
[A2A Parent-Side Device Management](../fleet-connectivity/a2a-parent-management) and [CDN Configure](../fleet-connectivity/cdn-configure).

## Keepalive and cleanup

Every SSE client is pinged every 10 seconds; a client that stops responding is pruned from the
broadcast list automatically — no manual cleanup needed on either side.

## See also

- [A2A Parent-Side Device Management](../fleet-connectivity/a2a-parent-management)
- [CDN Configure](../fleet-connectivity/cdn-configure)
- [GetConfig](../configurations/getconfig)
