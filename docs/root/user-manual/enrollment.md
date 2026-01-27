---
id: enrollment  
title: Enrollment  
sidebar_label: Enrollment  
sidebar_position: 2
---
  
# Enrollment
  
This section explains how to enroll the GetApp Agent with the servers using local configuration files.  
Before starting, make sure the GetApp Agent (and optionally the Agent UI) is installed as described in the *Getting Started* guide.  
  
---
  
## Prerequisites
  
To configure the agents, users must have permission to edit the `.env` files.  
Administrative or sudo privileges may be required.  
If you do not have the necessary permissions, contact your IT department for assistance.  
  
For installation steps, see the *Getting Started* documentation.  
  
---
  
## `.env` File Location
  
The GetApp Agent uses a configuration file named .env to store connection details, including the BASE_URL that points to the GetApp server.  
This file is created during installation and must be updated so the agent can communicate with the correct environment.  
  
The location of the .env file depends on your operating system:  
  
### Windows
  
The default location for the .env file is:  
  
```text
C:\Program Files\GetApp\bin\.env
```

### Red Hat–based Linux Distributions
  
The default location for the .env file is:  
  
```text
/etc/getapp/.env
```
  
---
  
## Editing the .env File
  
As mentioned in the Prerequisites section, ensure you have the required permissions to edit the .env file.  

Typically, only one variable needs to be updated: BASE_URL.    
Set this to the correct GetApp server URL or IP address, for example:  

```text
BASE_URL=http://your-getapp-server.local
```
  
### Windows Example
  
![Windows_env](/img/windows_env_file.png)
  
### Linux Example

![linux_env](/img/linux_env_file.png)
  
---
  
## Post-Editing Steps

Once the .env file is updated and saved, restart the corresponding agent services to apply the changes.  

### Windows
  
1. Open the search bar and type “Services”.  
2. In the list, locate GetAppAgentService.  
3. Right-click it and choose Restart.  
  
### Red Hat–based Linux Distributions
  
1. Open a terminal.  
2. Run the following command:  

```bash
sudo systemctl restart getapp.service
```
  
3. Press Enter to confirm.  
  
---
  
## After Configuration
  
After restarting the service:  
  
1. Open the Agent Dashboard in your browser, for example:  

   ```text
   http://localhost:2230
   ```

2. Refresh the page.  
3. Confirm that the updated configuration has taken effect.

## Next Step
  
Proceed to the Dashboard page to get a better understanding.