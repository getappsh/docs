---
id: disconnectedEnvioremnt  
title: Disconnected Environments  
sidebar_label: Disconnected Environments  
sidebar_position: 3
---
  
# GetApp Agent Configuration Guide for Disconnected Environments (Offline / Removable Media)

This document provides a clear setup guide for configuring the **GetApp Agent** in a fully disconnected (air‑gapped) environment for both the Device and the Dream machine. It includes a recommended workflow, sample `.env` configuration, operational notes, and references to official documentation.

---

## 1. Overview

- It is recommended to configure the **Agent** once on the **Device** and once on the **Dream** (via a `.env` file).
- The executable (`.exe`) should reside in the device’s standard location, while each environment (Device / Dream) should have its own **`.env`** and **`data`** directories.
- You may begin initial testing using the current approved SD"B version.
- In a disconnected setup, ensure each system has its own **DATA_PATH** and that databases are not unintentionally shared.

---

## 2. Running the Dream Agent (applies to both UI and Server)

Run the service **from the directory containing the Dream configuration files** (including `.env`). This is required so the service reads the correct config.

```powershell
& '<location of the device exe>/GetApp-service.exe' console
```

> **Important:** The working directory must be the same directory where the `.env` resides.

---

## 3. Configuration (`.env`)

Here are the key configuration items for the Dream environment:

- **DATA_PATH** – where the internal DB/data is stored.
- **DEVICE_ID** – the identifier of the Dream machine.
- **BASE_URL** – which server the agent communicates with.
- **DDS_MACHINE_TYPE** – defines the machine role (Dream, Agent, IM, Disabled).

### Example `.env` for Dream

```env
# Agent Service Configuration
# ==============================================================================

# The port that the GetApp service is exposed on (external gateway port)
GATEWAY_PORT=2223

# Optional: CLI access URL
# AGENT_URL=http://localhost:2223/

# ==============================================================================
# DDS Configuration
# ==============================================================================

# Machine type: Agent | IM | Disabled | Dream
DDS_MACHINE_TYPE=Dream

# ==============================================================================
# GetApp Server Configuration
# ==============================================================================

BASE_URL="http://localhost:2222"

# Persistent data directory
DATA_PATH="C:\\ProgramData\\GetAppData"

# Unique Dream identifier
DEVICE_ID="DreamTest"
```

#### Common adjustments
- **BASE_URL** – Replace with the internal server IP/port in your environment.
- **GATEWAY_PORT** – Change if the port is already in use.
- **DATA_PATH** – Ensure the path exists and the service has write permissions.
- **DEVICE_ID** – Choose a unique name (e.g., `Dream-Lab-01`).

---

## 4. Service Startup & Validation

1. Place the `.env` file in the same directory as `GetApp-service.exe`.
2. Run the service in console mode (see Section 2).
3. Validate:
   - If `AGENT_URL` is set, verify it loads in a browser or internal CLI.
   - Check that logs/data are created under `DATA_PATH`.
4. Begin testing using the approved SD"B build.

---

## 5. Reference Documentation

- Dream `.env` example is included above.
- Additional docs are available at **docs.getapp.sh**:
  - **Enrollment Guide**
  - **Agent-to-Agent Guide**
- Full documentation repository:
  https://github.com/getappsh/docs/tree/main/docs/root

---

## 6. Quick Troubleshooting

- **Service does not start:** Ensure you ran it from the directory containing `.env`.
- **Port conflict:** Change `GATEWAY_PORT` and restart.
- **No write access to `DATA_PATH`:** Fix permissions or choose a valid directory.
- **Cannot reach `BASE_URL`:** Validate local network access (even offline setups may use local proxies or loopback communication).

---
