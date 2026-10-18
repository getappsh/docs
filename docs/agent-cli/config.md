---
id: config
title: Config Commands
sidebar_label: Config
sidebar_position: 3
---

# Config Commands

Read and update the agent's [runtime settings](/docs/agent-envs/config-yaml)
(`config.yaml`) — no restart required.

## `config get`

Get the current agent configuration.

```bash
getapp config get
getapp --output yaml config get > config.yaml
```

## `config set`

Update settings.

| Flag | Description |
|---|---|
| `--delivery-auto-trigger` | Automatically trigger a download as soon as a matching offering is discovered |
| `--deploy-timeout` | Timeout, in seconds, for a deployment to complete |
| `--tcp-timeout` | TCP stream timeout, in seconds |
| `--comp-dir` | Folder to store downloaded components |

```bash
getapp config set --deploy-timeout 120
```

Use `--help` with any command for full details.
