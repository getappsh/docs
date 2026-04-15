---
id: disconnectedEnvioremnt  
title: Disconnected Environments  
sidebar_label: Disconnected Environments  
sidebar_position: 3
---
  
# GetApp Agent Configuration Guide for Disconnected Environments (Offline / Removable Media)

This document provides a clear setup guide for configuring the **GetApp Agent** in a fully disconnected (air‑gapped) environment for both the Device and the USB machine. It includes a recommended workflow, sample `.env` configuration, operational notes, and references to official documentation.

---

## 1. Overview

- It is recommended to configure the **Agent** once on the **Device** and once on the **USB** (via a `.env` file).
- The executable (`.exe`) should reside in the device’s standard location, while each environment (Device / USB) should have its own **`.env`** and **`data`** directories.
- In a disconnected setup, ensure each system has its own **DATA_PATH** and that databases are not unintentionally shared.

---

## 2. Running the USB Agent (applies to both UI and Server)

Run the service **from the directory containing the USB configuration files** (including `.env`). This is required so the service reads the correct config.

```powershell
& '<location of the device exe>/GetApp-service.exe' console
```

> **Important:** The working directory must be the same directory where the `.env` resides.

---

## 3. Configuration (`.env`)

Here are the key configuration items for the USB environment:

- **DATA_PATH** – where the internal DB/data is stored.
- **DEVICE_ID** – the identifier of the USB machine.
- **BASE_URL** – which server the agent communicates with.
- **DEVICE_TYPE** – defines the machine role (USB, Agent, IM).

### Example `.env` for USB

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

#DEVICE_TYPE – defines the machine role (USB, Agent, IM).
DEVICE_ID=USB

# ==============================================================================
# GetApp Server Configuration
# ==============================================================================

BASE_URL="http://localhost:2222"

# Persistent data directory
DATA_PATH="D:\\GetAppData"

# Unique USB identifier
DEVICE_ID="USB_001"

# Policy and component request behavior
POLICY_ENFORCEMENT_MODE=deploy
PLATFORM_TYPE_TOKEN=universal
```

#### Common adjustments
- **BASE_URL** – Replace with the internal server IP/port in your environment.
- **GATEWAY_PORT** – Change if the port is already in use.
- **DATA_PATH** – Ensure the path exists and the service has write permissions.
- **DEVICE_ID** – Choose a unique name (e.g., `USB-Lab-01`).
- **POLICY_ENFORCEMENT_MODE** – Set to `deploy` to list all components while still blocking deployment when policy denies.
- **PLATFORM_TYPE_TOKEN** – Set to `universal` to include all available components across platform types.

### Policy and platform token settings
These environment variables are useful when the disconnected USB agent or device is configured to fetch component lists and apply policy-based deployment logic.

```bash
# When set to deploy, policy enforcement returns all components but prevents deployment if policy denies
POLICY_ENFORCEMENT_MODE=deploy

# Request all available components across platform types
PLATFORM_TYPE_TOKEN=universal
```

---

## 4. Service Startup & Validation

1. Place the `.env` file in the usb directory.
2. Run the service in console mode (see Section 2).
3. Validate:
   - If `AGENT_URL` is set, verify it loads in a browser or internal CLI.
   - Check that logs/data are created under `DATA_PATH`.
---

## 5. Reference Documentation

- USB `.env` example is included above.
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
