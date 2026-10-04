---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 8
---

# Troubleshooting

## Connection errors

```bash
# Verify the agent is running
curl http://localhost:2220/api/v1/about

# Try with an explicit URL/port
getapp --url http://localhost:2220 status
getapp --port 3000 status

# Use retries for transient errors
getapp --retry 3 --timeout 120 device get
```

## Garbled output

Disable colors:

```bash
getapp --no-color device get
getapp device get > output.json  # auto-disables colors when piping
```

## Command errors

- Use `--help` to see available commands
- Global flags must come **before** the command name

## Platform-specific

**Windows PowerShell encoding:**

```powershell
$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = New-Object System.Text.UTF8Encoding
```

**Linux/macOS permissions:**

```bash
chmod +x getapp
./getapp device get
```

## General tips

- **Exit codes:** `0`=success, `1`=error, `2`=connection, `4`=bad args, `5`=timeout
- **Environment:** set `NO_COLOR=1` to disable colors
- **History:** saved in `GetAppData/.cli_history`
- **Logs:** check the agent service logs for server-side issues
