---
id: enrollment
title: Enrollment
sidebar_label: Enrollment
---

# Enrollment

This section explains how to enroll the GetApp Agent with the servers using local configuration files.

---

## Prerequisites

To configure the agents, users must have permission to edit the `.env` files.  
Administrative or sudo privileges may be required.  
If you do not have the necessary permissions, contact your IT department for assistance.

---

## `.env` File Location

The location of the `.env` file depends on your operating system:

### Windows
The default location for the `.env` file is:  
```C:\Program Files\GetApp\bin.env```  
  
### Red Hat–based Linux Distributions
The default location for the `.env` file is:  
```/etc/getapp/.env```  
  

---

## Editing the `.env` File

As mentioned in the [Prerequisites](#prerequisites) section, ensure you have the required permissions to edit the `.env` file.  

Only one variable typically needs to be updated: **`BASE_URL`**.  
Set this to the correct GetApp server URL or IP address, for example:
```text
BASE_URL=http://your-getapp-server.local
```
  

### Windows Example

<p align="center">
  <img src="/img/windows_env_file.png" width="600" alt="Windows environment file example"/>
</p>

### Linux Example

<p align="center">
  <img src="/img/linux_env_file.png" width="600" alt="Linux environment file example"/>
</p>

---

## Post-Editing Steps

Once the `.env` file is updated and saved, restart the corresponding agent services to apply the changes.

### Windows

1. Open the search bar and type **“Services”**.  
2. In the list, locate **GetAppAgentService**.  
3. Right-click it and choose **Restart**.

### Red Hat–based Linux Distributions

Open a terminal and run:

```bash
sudo systemctl restart getapp.service
```
Press Enter to confirm.
  
---
  
## After Configuration
After restarting the service:  
* Open the Agent Dashboard in your browser.  
* Refresh the page.  
* Confirm that the updated configuration has taken effect.
