---
id: overview
title: GetApp Agent CLI
sidebar_label: Overview
sidebar_position: 1
---

# GetApp Agent CLI

`getapp` is the command-line interface for the GetApp Agent — manage device updates,
configuration, and software delivery from a terminal, either as one-shot commands for
scripting or as an interactive shell with history and tab completion.

## Key features

- **Dual modes** — one-shot commands and an interactive REPL
- **Tab completion** — commands, subcommands, and flags
- **Command abbreviations** — `dev g` → `device get`
- **Smart retry** — exponential backoff for failed requests
- **Multiple output formats** — JSON, YAML, table, plain text

## Installation

The `getapp` CLI ships bundled with the [agent installation](/docs/root/getting-started) — no
separate install step needed on a managed device.

To build it from source (contributors):

```bash
# from the agent/ repository root
cargo build --bin getapp --release

# binary location
target/release/getapp     # Linux/macOS
target/release/getapp.exe # Windows
```

**Defaults:** URL `http://localhost:2220` · timeout `30s` · format `json` · no retries.

## Usage modes

**One-shot** — run a single command:

```bash
getapp device get
getapp --retry 3 discover --discovery-type get-app
```

**Interactive** — start the REPL:

```bash
getapp
getapp> dev g           # abbreviated: device get
getapp> conf s --deploy-timeout 120
getapp> exit
```

See [Interactive Mode](./interactive-mode) for tab completion, history, and keyboard shortcuts.

:::note
Global flags must come **before** the command name: `getapp --port 8080 device get`, not
`getapp device get --port 8080`.
:::

## Global flags

| Flag | Description | Default |
|---|---|---|
| `-u, --url <URL>` | Agent base URL | `http://localhost:2220` |
| `-p, --port <PORT>` | Override port | `2220` |
| `-t, --timeout <SEC>` | Request timeout | `30` |
| `-o, --output <FMT>` | Format: `json`, `yaml`, `table`, `plain` | `json` |
| `-c, --no-color, --nc` | Disable colors | Enabled |
| `-r, --retry <N>` | Retry attempts (0–5) | `0` |
| `-v, --version` | Show version | — |
| `-h, --help` | Show help | — |

```bash
getapp --url http://remote:8080 device get
getapp --timeout 120 --retry 3 discover --discovery-type get-app
getapp --output yaml --no-color config get > config.yaml
```

Set `NO_COLOR=1` to disable colors globally.

### Retry behavior

Exponential backoff with `--retry`:

| Retry | Delay | Cumulative |
|---|---|---|
| 1st | 1s | 1s |
| 2nd | 2s | 3s |
| 3rd | 4s | 7s |
| 4th | 8s | 15s |
| 5th | 16s | 31s |

```bash
getapp --retry 3 --timeout 120 discover --discovery-type get-app
```

## Commands

- [Device](./device) — device information and enrollment
- [Config](./config) — read and update runtime settings
- [Offering](./offering) — query available offerings
- [Discover](./discover) — trigger component discovery
- [Other](./other) — `about` / `status`

## Quick reference

```bash
# Build
cargo build --bin getapp --release

# Basic commands
getapp device get
getapp config set --deploy-timeout 120
getapp discover --discovery-type get-app

# With flags
getapp --url http://remote:8080 --retry 3 device get
getapp --output yaml --no-color config get

# Interactive
getapp               # start REPL
getapp> dev g         # abbreviated: device get
getapp> help          # show help
getapp> exit          # exit
```
