---
id: cli
title: CLI
sidebar_label: CLI
sidebar_position: 1
---

# GetApp Agent CLI v2

Command-line interface for managing device updates and software delivery through the GetApp agent service.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage Modes](#usage-modes)
- [Global Flags](#global-flags)
- [Commands](#commands)
- [Examples](#examples)
- [Interactive Mode](#interactive-mode)
- [Troubleshooting](#troubleshooting)

---

## Overview

GetApp Agent CLI v2 provides a command-line interface for managing device updates, configurations, and software delivery. Supports both one-shot commands for scripting and interactive shell with history and tab completion.

### Key Features

- **Dual Modes**: One-shot commands and interactive REPL
- **Tab Completion**: Commands, subcommands, and flags
- **Command Abbreviations**: `dev g` → `device get`
- **Smart Retry**: Exponential backoff for failed requests
- **Multiple Formats**: JSON, YAML, table, plain text
- **Type-Safe API**: Auto-generated client from OpenAPI spec

### Architecture

The CLI is built in Rust using:

**Auto-Generated API Client (`agent_local_client`):**
- Generated automatically from OpenAPI specification (`open-api/spec.yaml`)
- Provides type-safe functions for all agent API endpoints
- Eliminates manual HTTP request construction
- Compile-time validation prevents API misuse

**Why `agent_local_client`:**
- **Type Safety**: Catch errors at compile time, not runtime
- **70% Less Code**: No manual `reqwest::Client` calls
- **Auto-Sync**: Regenerate when API changes via `cargo build`
- **IntelliSense**: Full IDE autocomplete support
- **Single Source of Truth**: OpenAPI spec defines everything

**How It's Generated:**
```bash
# Generation happens automatically during build
# Or manually update the client:
cd agent_local_client
cargo build
```

**Example Usage in Code:**
```rust
// Before (manual HTTP):
let response = client
    .get("http://localhost:2220/api/v1/device")
    .send()
    .await?;

// After (auto-generated):
use agent_local_client::apis::device_api;
let device = device_api::get_device(&config).await?;
```

**Components:**
- **Clap**: Command-line parsing and help
- **Rustyline**: Interactive mode with history
- **Serde**: JSON/YAML serialization
- **Reqwest**: HTTP (via `agent_local_client`)

---

## Installation

Build from the repository root:

```bash
# Release build (recommended)
cargo build --bin getapp --release

# Binary location
target/release/getapp     # Linux/macOS
target/release/getapp.exe # Windows
```

**Prerequisites:**
- Rust 1.70+
- GetApp agent service running (default: `http://localhost:2220`)

**Defaults:**
- URL: `http://localhost:2220`
- Timeout: 30 seconds
- Format: JSON
- No retries

---

## Usage Modes

**One-Shot Mode** - Run single command:
```bash
getapp device get
getapp --retry 3 discover --discovery-type get-app
```

**Interactive Mode** - Start REPL:
```bash
getapp
getapp> dev g           # Abbreviated: device get
getapp> conf s --deploy-timeout 120
getapp> exit
```

**Note**: Global flags must come before command name.

---

## Global Flags

Flags must be specified **before** the command name.

| Flag | Description | Default |
|------|-------------|---------|
| `-u, --url <URL>` | Agent base URL | `http://localhost:2220` |
| `-p, --port <PORT>` | Override port | `2220` |
| `-t, --timeout <SEC>` | Request timeout | `30` |
| `-o, --output <FMT>` | Format: json, yaml, table, plain | `json` |
| `-c, --no-color, --nc` | Disable colors | Enabled |
| `-r, --retry <N>` | Retry attempts (0-5) | `0` |
| `-v, --version` | Show version | - |
| `-h, --help` | Show help | - |

**Examples:**
```bash
getapp --url http://remote:8080 device get
getapp --timeout 120 --retry 3 discover --discovery-type get-app
getapp --output yaml --no-color config get > config.yaml
```

**Environment**: Set `NO_COLOR=1` to disable colors globally.

---

## Commands

### Device Commands

Manage device information and enrollment.

- **`device get`** - Get device information
- **`device set-id <ID>`** - Set device ID
- **`device set-enrollment`** - Configure enrollment (`--device-id`, `--device-type`, `--platform`, `--server-urls`)
- **`device set-metadata`** - Update metadata (`--name`, `--location`, `--misc`)

### Config Commands

- **`config get`** - Get agent configuration
- **`config set`** - Update settings (`--delivery-auto-trigger`, `--deploy-timeout`, `--tcp-timeout`, `--comp-dir`)

### Catalog Commands

- **`catalog device-type <TYPE>`** - List offerings for device type
- **`catalog platform <PLATFORM>`** - List offerings for platform
- **`catalog project <PROJECT>`** - List offerings for project

### Discover Command

- **`discover --discovery-type <TYPE>`** - Discover components (`get-app`, `get-map`, `mTls`)
- **`discover --file <PATH>`** - Load request from JSON file

### Other Commands

- **`about`** / **`status`** - Show agent information

**Help:** Use `--help` with any command for details.

---

## Examples

```bash
# Device operations
getapp device get --output table
getapp device set-id DEVICE-12345
getapp device set-enrollment --device-id DEV-001 --device-type router

# Configuration
getapp config get
getapp config set --deploy-timeout 120

# Discovery with retry (exponential backoff: 1s, 2s, 4s...)
getapp --retry 3 discover --discovery-type get-app

# Catalog queries
getapp catalog device-type router --platform linux
getapp catalog platform windows

# Remote agent with timeout
getapp --url http://remote:8080 --timeout 60 device get

# Output formats
getapp device get --output yaml
getapp --no-color config get > config.json

# Interactive mode with abbreviations
getapp
getapp> dev g              # device get
getapp> conf s --deploy-timeout 120  # config set --deploy-timeout 120
getapp> exit
```

---

## Interactive Mode

### Features

- **Command History**: Saved to platform data dir (Windows: `%APPDATA%\GetApp\.cli_history`; Linux/macOS: `~/.getapp/.cli_history`). Max 1000 entries, trimmed after 90 days.
- **Tab Completion**: Cycle through matching commands, subcommands, and **command-specific flags** one at a time with **Tab**. Type `--<TAB>` to see all flags for the active command (e.g. `discover --<TAB>` shows `--discovery-type`, `--file`, etc.).
- **Abbreviations**: `dev g` → `device get`, `conf s` → `config set`, `del sta` → `delivery start`
- **Help**: Type `help` or `?`, or append `?` to any command: `discover ?`, `device set-enrollment ?`
  > **Note**: If `?` is part of a value, quote the value: `device set-metadata --name "xxx?"`

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **↑** / **↓** | Navigate history |
| **Tab** | Cycle to next completion match |
| **Ctrl+←** / **Ctrl+→** | Jump one word backward / forward |
| **Ctrl+Backspace** / **Ctrl+Delete** | Delete word backward / forward |
| **Ctrl+R** | Reverse search history |
| **Ctrl+A** / **Ctrl+E** | Start/end of line |
| **Ctrl+U** / **Ctrl+K** | Delete to start/end of line |
| **Ctrl+W** | Delete word backward |
| **Ctrl+D** | Exit (when line empty) |
| **Ctrl+C** | Cancel input |

**Text selection** (`Shift+Arrow`, `Ctrl+Shift+Arrow`): not supported by the interactive shell's line editor (rustyline has no selection state). Use your terminal emulator's mouse selection or its own copy shortcut (e.g. right-click → Copy, or `Ctrl+Shift+C` in Windows Terminal).

### Color Output

**Disable colors:**
```bash
getapp --no-color device get      # Flag
NO_COLOR=1 getapp device get      # Environment variable
```

Colors auto-disable when piping: `getapp device get > file.json`

### Retry Behavior

Exponential backoff with `--retry` flag:

| Retry | Delay | Cumulative |
|-------|-------|------------|
| 1st | 1s | 1s |
| 2nd | 2s | 3s |
| 3rd | 4s | 7s |
| 4th | 8s | 15s |
| 5th | 16s | 31s |

```bash
# Retry up to 3 times for unstable networks
getapp --retry 3 --timeout 120 discover --discovery-type get-app
```

---

## Troubleshooting

### Connection Errors

**Problem**: Cannot connect to agent

```bash
# Verify agent is running
curl http://localhost:2220/api/v1/about

# Try with explicit URL/port
getapp --url http://localhost:2220 status
getapp --port 3000 status

# Use retries for transient errors
getapp --retry 3 --timeout 120 device get
```

### Output Issues

**Garbled output?** Disable colors:
```bash
getapp --no-color device get
getapp device get > output.json  # Auto-disables colors when piping
```

### Command Errors

- Use `--help` to see available commands
- Global flags must come **before** command name
- Example: `getapp --port 8080 device get` (not `getapp device get --port 8080`)

### Platform-Specific

**Windows PowerShell encoding:**
```powershell
$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = New-Object System.Text.UTF8Encoding
```

**Linux/macOS permissions:**
```bash
chmod +x getapp
./getapp device get
```

### General Tips

- **Exit codes**: 0=success, 1=error, 2=connection, 4=bad args, 5=timeout
- **Environment**: Set `NO_COLOR=1` to disable colors
- **History**: Saved in `GetAppData/.cli_history`
- **Logs**: Check agent service logs for server-side issues

---

## Quick Reference

**Build:**
```bash
cargo build --bin getapp --release
```

**Basic Commands:**
```bash
getapp device get
getapp config set --deploy-timeout 120
getapp discover --discovery-type get-app
```

**With Flags:**
```bash
getapp --url http://remote:8080 --retry 3 device get
getapp --output yaml --no-color config get
```

**Interactive:**
```bash
getapp               # Start REPL
getapp> dev g        # Abbreviated: device get
getapp> help         # Show help
getapp> exit         # Exit
```

---

**Last Updated**: February 2026