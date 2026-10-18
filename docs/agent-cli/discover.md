---
id: discover
title: Discover Command
sidebar_label: Discover
sidebar_position: 5
---

# Discover Command

Trigger component discovery.

## `discover --discovery-type <TYPE>`

Discover components. Valid types: `get-app`, `get-map`, `mTls`.

```bash
getapp discover --discovery-type get-app

# With retry for unstable networks (exponential backoff: 1s, 2s, 4s...)
getapp --retry 3 discover --discovery-type get-app
```

## `discover --file <PATH>`

Load a discovery request from a JSON file instead of building it from flags.

```bash
getapp discover --file ./discovery-request.json
```

Use `--help` for full details.
