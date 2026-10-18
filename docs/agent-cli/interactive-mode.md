---
id: interactive-mode
title: Interactive Mode
sidebar_label: Interactive Mode
sidebar_position: 7
---

# Interactive Mode

Start the REPL by running `getapp` with no command.

- **Command history** — saved to the platform data dir (Windows: `%APPDATA%\GetApp\.cli_history`;
  Linux/macOS: `~/.getapp/.cli_history`). Max 1000 entries, trimmed after 90 days.
- **Tab completion** — cycle through matching commands, subcommands, and command-specific flags
  with **Tab**. Type `--<TAB>` to see all flags for the active command.
- **Abbreviations** — `dev g` → `device get`, `conf s` → `config set`, `del sta` → `delivery start`
- **Help** — type `help` or `?`, or append `?` to any command: `discover ?`,
  `device set-enrollment ?`. If `?` is part of a value, quote it: `device set-metadata --name "xxx?"`

```bash
getapp
getapp> dev g              # device get
getapp> conf s --deploy-timeout 120  # config set --deploy-timeout 120
getapp> exit
```

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| **↑** / **↓** | Navigate history |
| **Tab** | Cycle to next completion match |
| **Ctrl+←** / **Ctrl+→** | Jump one word backward / forward |
| **Ctrl+Backspace** / **Ctrl+Delete** | Delete word backward / forward |
| **Ctrl+R** | Reverse search history |
| **Ctrl+A** / **Ctrl+E** | Start / end of line |
| **Ctrl+U** / **Ctrl+K** | Delete to start / end of line |
| **Ctrl+W** | Delete word backward |
| **Ctrl+D** | Exit (when line empty) |
| **Ctrl+C** | Cancel input |

Text selection (`Shift+Arrow`, `Ctrl+Shift+Arrow`) isn't supported by the interactive shell's
line editor — use your terminal emulator's own selection/copy shortcut instead.

## Color output

```bash
getapp --no-color device get      # flag
NO_COLOR=1 getapp device get      # environment variable
```

Colors auto-disable when piping: `getapp device get > file.json`.
