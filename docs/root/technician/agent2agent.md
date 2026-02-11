---
id: agent2agent
title: Agent to Agent
sidebar_label: Agent to Agent
sidebar_position: 2
---

# Agent-to-Agent Connection

When a direct connection to the server is unavailable, or when a specific product is needed from another Agent, you can temporarily point the local Agent to a different peer.  
To do this, set the `BASE_URL` value in the `.env` file to the address of the other Agent and restart the process.  

For more information about the `.env` file and the enrollment process, see the **Enrollment** page.  

---

## Clarification

Here are a few clarifications regarding Agent-to-Agent connectivity:  

- Both Agents must have network connectivity between them.  
- The **Server Agent** (the Agent being connected to) can offer the products and content it already stores locally.  
- The **Server Agent** does **not** act as a bridge or relay to other servers or Agents.  

<p align="center">
  <img src="./agent2agnetDirgram.png" width="600" alt="Device status overview"/>
</p> 