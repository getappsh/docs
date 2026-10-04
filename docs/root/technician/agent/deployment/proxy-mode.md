---
id: proxy-mode
title: Proxy Mode
sidebar_label: Proxy Mode
sidebar_position: 3
---

# Proxy Mode

When enabled, the agent runs a small rule-based reverse proxy on its own public port — one
address in front, splitting traffic between the agent itself and the real GetApp server
depending on the request.

**Permission level:** Technician / agent operator — set via `.env`, not runtime config.

## Enabling it

```bash
PROXY=true
```

| Variable | Default | What it does |
|---|---|---|
| `PROXY` | `false` | Enables the proxy task alongside the agent's normal API server |
| `AGENT_PORT` | `2221` | The agent's own API — becomes **internal-only** when proxy mode is on |
| `GATEWAY_PORT` | `2220` | The externally exposed port — the proxy binds **here** instead of the agent API directly |

With `PROXY=false` (default), the agent's API server binds directly to `GATEWAY_PORT`. With
`PROXY=true`, the agent's API binds to `AGENT_PORT` internally, and a separate proxy task binds
to `GATEWAY_PORT` — the one address a client actually talks to.

## Routing rules

The proxy reads `routes.json` (in the agent's config directory) and auto-populates it at
startup with three rules, evaluated in order against the request path:

| # | Matches | Routes to |
|---|---|---|
| 1 | `/api/delivery/prepare...` | The agent's own local API (`localhost:{AGENT_PORT}`) |
| 2 | Any other `/api/...` path | The real GetApp server (`BASE_URL`) |
| 3 | Everything else (catch-all) | The agent's own local API (`localhost:{AGENT_PORT}`) |

In practice: most API traffic passes straight through to the real server, one specific
delivery-prepare path is handled locally, and everything that isn't `/api/*` (the Agent UI,
local-only routes) is served by the agent itself — all from one exposed port, so a client never
needs to know whether a given call should go to the agent or the cloud server.

## When to use it

Point a client (Agent UI, a third-party tool) at one single URL instead of configuring it to
know about both the agent and the real server separately — useful when the client can only be
given one endpoint, or when you want the agent to transparently front the server connection.

:::note Not the same as CDN Configure
[CDN Configure](../fleet-connectivity/cdn-configure) is about one agent serving **config and commands** to other
managed devices. Proxy mode is about one agent fronting **HTTP traffic** between a client and
the real server. They're unrelated mechanisms that happen to both involve "one agent in front
of something else."
:::

## See also

- [Agent Configuration & Settings](../configurations/agent-settings)
- [CLI](../interfaces/cli)
