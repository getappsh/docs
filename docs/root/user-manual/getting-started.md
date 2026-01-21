---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started

Welcome to the **GetApp Agents Installation Guide**.  
This document walks you through installing and setting up the GetApp **Agent** and **Agent UI** components.  
  
- Install **Agent** when you need a background service that communicates with the GetApp server and manages applications on the device.  
- Install **Agent UI** when you want an interactive dashboard to view status and control actions from the device.  
- Install **both** when you need full functionality: background communication plus a local user interface.  
  
---
  
## Introduction

This guide is intended for first-time users installing the GetApp Agent and connecting it to backend servers.  
  
---
  
## Prerequisites
  
To install either package, you need permissions to execute installation files (.msi or .rpm).  
Administrative or sudo privileges may be required.  
If you encounter permission issues, contact your IT department for assistance.  
  
---
  
## Downloading

### Agent

To download the **Agent**, visit the  
[GetApp Agent Releases](https://github.com/getappsh/agent/releases)  
and download the appropriate package for your platform:  
  
- **Windows:** `.msi` installer  
- **Red Hat–based Linux:** `.rpm` package  
  
### Agent UI
  
To download the **Agent UI**, visit the  
[GetApp Agent UI Releases](https://github.com/getappsh/agent-ui/releases)  
and download the appropriate package for your platform:  
  
- **Windows:** `.msi` installer  
- **Red Hat–based Linux:** `.rpm` package  
  
---
  
## Installation

The installation process depends on your operating system.  
  
### Windows
  
1. Locate the downloaded .msi files (Agent and/or Agent UI).  
2. Double-click the file and follow the on-screen installation steps.  
3. Complete the setup using the default options unless instructed otherwise.  
  
### Red Hat–based Linux Distributions
  
#### Desktop Installation
  
1. Locate the downloaded .rpm files.  
2. Double-click the file and proceed with the installation dialog.  
  
#### Command Line Installation
  
Run the following command from the directory containing your RPM file.  

```bash
sudo yum install ./<package-filename>.rpm -y
```

Replace `<package-filename>` with the actual file name.  
  
---
  
## Quick Start

Once installation completes successfully.  
  
- The **Agent Swagger UI** is available at:  
  ```text
  http://localhost:2220/swagger-ui/#
  ```

- The **Agent Dashboard** is available at:  
  ```text
  http://localhost:2230
  ```
  
---
  
## Troubleshooting

Common issues during installation.  
  
- *Insufficient privileges — The installer may fail without admin/sudo rights.*  
- Network connectivity issues — Firewall or proxy settings might block communication.  
- Misconfiguration — Incorrect setup values may prevent proper operation.  
  
### Solutions
  
- Privileges or network issues: Contact your IT department for assistance.  
- Misconfiguration: See the Enrollment documentation for guidance.  
  
---
  
## Next Step
  
Proceed to the Enrollment page to continue setup.
