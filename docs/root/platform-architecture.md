---
id: platform-architecture
title: Platform Architecture — How GetApp Works
sidebar_label: Platform Architecture
sidebar_position: 2
---

# Platform Architecture — How GetApp Works

This page gives a clear picture of how the GetApp platform is built and how its parts
work together. It starts with the big picture, then shows how to use it.

- **Who this is for:** administrators, developers, and technicians.
- **What you'll learn:** the two sides of the platform, what each part does, how a release
  travels to a device, and the steps to run it yourself.

:::note At a glance
**8 server services** · **1 device agent** · **3 communication paths**
:::

## The two sides of GetApp

GetApp is an **"app store" for your whole network**. A central **server** decides *what* software each
device may receive, and a small **agent** on each device does the actual downloading and installing.
The two sides talk to each other:

| Side | What it is | Where it runs | Built with |
|---|---|---|---|
| **Server** | A group of small services (microservices) that manage the catalog, the devices, and the deployments. | In the data center / cloud | Node.js (NestJS), talking over a message bus |
| **Agent** | A small program that runs on each end device. It reports the device, downloads software, and installs it. | On every end device | Rust |

```mermaid
flowchart LR
    subgraph Server["GetApp Server (cloud / data center)"]
        GW[API Gateway]
        SVC[Microservices]
        DB[(Databases &<br/>file storage)]
        GW --- SVC --- DB
    end

    subgraph Devices["End devices"]
        A1[Agent]
        A2[Agent]
        A3[Agent]
    end

    A1 <-->|HTTPS| GW
    A2 <-->|HTTPS| GW
    A3 <-->|HTTPS| GW
```

*Diagram: every device runs its own agent and connects to the central server over HTTPS.*

This split — **decide centrally, act locally** — lets one server manage many thousands of
devices, even across slow or separated networks.

---

## The server: a team of small services

Instead of one big program, the server is split into many **microservices**. Each service has one
clear job. This makes the system easier to scale and to update, because you can change one service
without breaking the others.

The services do **not** call each other directly over normal web requests. They send **messages** on a
shared **message bus** (Apache Kafka). Think of it as an internal post office: a service drops a
message, and the right service picks it up. This keeps the services loosely connected — if one is
busy, the message simply waits.

```mermaid
flowchart TB
    GW[API Gateway<br/>REST + live updates]

    subgraph Bus["Message bus (Kafka)"]
        direction LR
        UP[Upload]
        OF[Offering]
        DI[Discovery]
        DL[Delivery]
        DP[Deploy]
        PM[Project<br/>Management]
        GM[Get-Map]
        SB[SBOM<br/>Generator]
    end

    GW --> UP & OF & DI & DL & DP & PM & GM
    UP -.-> SB

    DB[(PostgreSQL)]
    OBJ[(Object storage<br/>MinIO / S3)]
    IDP[Keycloak<br/>login]

    UP --- OBJ
    UP & OF & DI & DL & DP & PM & GM --- DB
    GW --- IDP
```

*Diagram: the API Gateway is the only public entry point; services exchange messages over Kafka and share a PostgreSQL database and object storage.*

### What each service does

| Service | Its job, in plain words |
|---|---|
| **API Gateway** | The front door. All requests from the agent, the web UI, and other tools come here first. It checks the login and passes the work to the right service. It can also push **live updates** to clients. |
| **Upload** | Takes in new software (release packages, container images) and stores the files. It keeps track of versions, policies, and asks for a security scan. |
| **Offering** | The catalog brain. It decides **which release is offered to which kind of device**, based on rules set by an administrator. |
| **Discovery** | The device register. It knows every device: its type, its operating system, and what is installed on it. New, unknown devices wait here for approval. |
| **Delivery** | Prepares and **caches** the files close to the devices, so downloads are fast. It can run as a main (origin) node or as a nearby cache (proxy) node. |
| **Deploy** | Follows each installation. It stores the **result** (success or failure), the logs, and the metrics, and raises **alerts** when something goes wrong. |
| **Project Management** | Manages projects, members, roles, and permissions. It also connects to Git for GitOps-style releases. |
| **Get-Map** | Handles map and hardware inventory data for devices. |
| **SBOM Generator** | Scans software for known security problems and license issues, and produces a "bill of materials" (a list of everything inside a package). |

### Where the data lives

- **PostgreSQL** — the main database. It holds devices, releases, offerings, statuses, and settings.
- **MinIO / S3** — object storage for the large files (the actual packages and images).
- **Keycloak** — handles user login and permissions (single sign-on).
- Extra stores for logs and metrics (Elasticsearch and a time-series database) feed the **Deploy**
  dashboards.

---

## The agent: the worker on each device

The **agent** is a small, self-contained program written in Rust. It runs quietly in the background
(as a service) on each device. It has a few clear responsibilities:

```mermaid
flowchart TB
    subgraph Agent["GetApp Agent (one device)"]
        API[Local API + web UI<br/>actix-web]
        DM[Device Manager]
        subgraph Jobs["Core jobs"]
            DISC[Discovery]
            OFFER[Offering]
            DELIV[Delivery]
            DEPLOY[Deploy]
        end
        LDB[(Local database<br/>SQLite)]
        API --- DM
        DM --- DISC & OFFER & DELIV & DEPLOY
        DISC & OFFER & DELIV & DEPLOY --- LDB
    end

    DM <-->|HTTPS| Server[GetApp Server]
```

*Diagram: inside one device, the Device Manager runs four core jobs and records their state in a local SQLite database.*

| Agent job | What it does |
|---|---|
| **Discovery** | Looks at the device (hardware, operating system, installed software) and **reports** it to the server. |
| **Offering** | Asks the server **what software is available** for this device. |
| **Delivery** | **Downloads** the release files, checks they are complete and genuine, and can **resume** if the connection drops. |
| **Deploy** | **Installs** the software on the device and reports the result back. |

A few useful details:

- **Local database (SQLite)** — the agent remembers its own state on the device: what was downloaded,
  what was installed, and how far each job got. If the agent restarts, it can continue where it
  stopped.
- **Local API and web UI** — the agent runs a small web server on the device. A local user or UI can
  see status and trigger actions. The agent can also act as a **proxy**, forwarding requests to the
  server.
- **Verification** — downloaded files are checked with a signature (Cosign), so a device never
  installs a tampered package.

---

## How the parts talk to each other

There are three kinds of communication in the platform. It helps to keep them separate in your mind.

```mermaid
flowchart LR
    A1[Agent] -->|1. HTTPS + live updates| GW[API Gateway]
    GW -->|2. Messages on Kafka| SVC[Microservices]
    A1 <-->|3. Direct agent-to-agent| A2[Agent]
```

*Diagram: the three communication paths — agent-to-server, service-to-service, and agent-to-agent.*

1. **Agent ↔ Server** — over the internet using **HTTPS** (normal secure web requests). The agent
   also receives **live updates** — sent over **Server-Sent Events (SSE)** — so it reacts quickly
   when something changes, without asking again and again.
2. **Service ↔ Service (inside the server)** — over the **Kafka** message bus. This is private to the
   server.
3. **Agent ↔ Agent** — some agents can talk **directly to each other**. This is used for separated or
   offline networks (see [Agent-to-agent](#agent-to-agent-and-offline-networks) below).

---

## The main flow: from a new release to an installed app

This is the most important flow in the platform. It shows how software moves from a developer all the
way to an end device.

```mermaid
sequenceDiagram
    participant Dev as Developer / CI
    participant UP as Upload
    participant OF as Offering
    participant DI as Discovery
    participant AG as Agent (device)
    participant DL as Delivery
    participant DP as Deploy

    Dev->>UP: 1. Upload — send a new release
    UP->>UP: Store files, run security scan
    UP-->>OF: 2. Announce — "new release is ready"
    OF->>OF: 3. Decide — which device types get it
    OF-->>DI: Update device offerings
    AG->>DI: 4. Discover — report device, ask "what's for me?"
    DI-->>AG: Here is your offering
    AG->>DL: 5. Deliver — download the release files
    DL-->>AG: Files (cached nearby)
    AG->>AG: 6. Deploy — install on the device
    AG->>DP: 7. Report — result (success / fail)
```

*Diagram: a release travels Upload → Announce → Decide → Discover → Deliver → Deploy → Report.*

Step by step:

1. **Upload** — a developer (or an automated CI pipeline) sends a new release to the **Upload**
   service. The files are stored and a **security scan** (SBOM) is started.
2. **Announce** — Upload tells **Offering** that a new release exists.
3. **Decide** — **Offering** applies the administrator's rules and decides **which device types** are
   allowed to receive this release.
4. **Discover** — each **agent** regularly reports its device to **Discovery** and asks what software
   is available for it.
5. **Deliver** — the agent **downloads** the files through **Delivery**, which serves them from a
   cache close to the device for speed.
6. **Deploy** — the agent **installs** the release on the device.
7. **Report** — the agent tells **Deploy** whether the installation worked. Administrators see this on
   the dashboard, with logs and alerts.

:::tip Push and pull
Software can arrive in two ways. In **pull**, the device checks for new offerings and installs when
ready. In **push**, an administrator sends a release to chosen devices. Both use the same flow above.
:::

---

## How a device first joins

Before a device can receive software, the server must know about it. This is the **discovery** flow.

```mermaid
flowchart TD
    A[Agent starts on device] --> B[Collect device info<br/>hardware, OS, software]
    B --> C[Send info to Discovery]
    C --> D{Known device type?}
    D -- yes --> E[Register device<br/>ready for offerings]
    D -- no --> F[Wait as 'pending'<br/>for admin approval]
    F --> E
```

*Diagram: an unknown device type waits as "pending" until an administrator approves it.*

- A brand-new device type is **not** trusted automatically. It waits as **pending** until an
  administrator approves it. This stops unknown devices from silently joining.
- Once approved, the device appears in the register and starts receiving offerings.

---

## Agent-to-agent and offline networks

Some networks are separated from the main server (for example, a tactical or air-gapped site). Here,
one agent can act as a **master** and manage other **child** agents nearby. This is called
**orchestration**, and the agents talk to each other **directly** (using a technology called DDS)
instead of going through the central server.

```mermaid
flowchart TD
    S[GetApp Server] <-->|HTTPS| M[Master agent]
    M <-->|direct agent-to-agent| C1[Child agent]
    M <-->|direct agent-to-agent| C2[Child agent]
    M <-->|direct agent-to-agent| C3[Child agent]
```

*Diagram: one master agent talks to the server and relays to nearby child agents.*

- The **master** agent stays in contact with the server and passes information to the children.
- The **children** can keep working even when the server is not reachable.
- For more detail, see [Agent-to-agent](technician/agent/fleet-connectivity/a2a-parent-management.md) and
  [Disconnected environment](technician/agent/deployment/disconnectedEnviorment.md).

---

# How to use it

This part gives the practical, ordered steps. Each step links to a full guide.

## 1. Install the agent

Install the GetApp Agent on the device. Installers exist for Windows (MSI) and Linux (DEB / RPM).

See [Getting Started](getting-started.md) for full installation steps.

## 2. Connect the agent to your server (enrollment)

The agent needs to know **which server** to talk to. This is set in a small configuration file called
`.env`, using the `BASE_URL` value:

```text
BASE_URL=http://your-getapp-server.local
```

Full details, including file locations for Windows and Linux, are in
[Enrollment](technician/agent/configurations/enrollment.md).

After this, the agent starts its **discovery** job and reports the device to the server.

## 3. Approve the device (administrator)

If the device type is new, approve it so it can receive software. This happens in the web UI, backed
by the **Discovery** service. See [Roles and permissions](technician/server/auth-permission/roles-and-permissions.md) for
who is allowed to do this.

## 4. Publish software

A developer or CI pipeline uploads a release. You can also connect releases to Git — see
[GitOps releases](technician/server/gitops-section/gitops-releases.md). The **Offering** rules then decide which devices may receive
it. To target specific devices, use the **push** option.

## 5. Watch the delivery and installation

Once a release is offered:

- The agent **downloads** it through **Delivery** (fast, cached, and resumable).
- The agent **installs** it. Simple releases use the classic install path; richer releases can carry
  their own step-by-step recipe — see [Deploy V2 (install.yaml)](user-docs/developer/deploy/v2/overview.md).
- The **Deploy** dashboard shows the result, the logs, and any **alerts**.

## 6. Troubleshoot if needed

If something fails, start with the troubleshooting guides:

- [Tier 1 — App Store Agent](troubleshooting/tier1-appstore-agent.mdx)
- [Tier 2 — App Store Agent](troubleshooting/tier2-appstore-agent.mdx)
- [Tier 2 — Server](troubleshooting/tier2-server.mdx)

---

## See also

- [Intro](intro.md) — what GetApp is, in short.
- [Getting Started](getting-started.md) — install and first run.
- [Deploy V2 (install.yaml)](user-docs/developer/deploy/v2/overview.md) — how a release can describe its own installation.
- [Terminology](Terminology.md) — the full list of platform terms (glossary of all platform terms).
