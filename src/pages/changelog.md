---
title: Changelog
---

# Changelog

Release notes for GetApp Server, Agent, and Agent UI.

---

## v1.6 (Upcoming Version)

### Platform
- Platform status reporting
- Platform analytics
- Platform actions and event tracking

### Actions & Deployment Orchestrator
- Deployment actions via Command
- Installation across devices on a platform
- Rule-based decision engine - Skip mode
- Configuration Action
- Uninstall Action
- Verification Action
- Up/Down/Restart Action
- Support Path Location Placeholder

### CDN
- Deliver release artifacts to the CDN from the edge, with a Load option
- New CRUD API on the server

### Agent UI
- New Agent UI

### Rule Engine
- Rules based on the installed version

### Dashboard
- Support for additional repositories
- Workspace support
- Server settings
- Dashboard permissions
- User-group assignment
- User and permission management via the UI
- GetIcon: add an icon to a project

### Security
- HTTPS support for Agent UI agent creation

---

## v1.5

### Platform
- Combine devices into a platform with a unique ID and dashboard view
- Platform metadata generation
- Platform API routes added to GetAppService (Swagger)

### Groups
- Add platforms to groups
- Automatic group assignment by metadata
- Pending groups

### Types
- Pending types
- Multiple releases per type

### Actions & Deployment Orchestrator
- Ordered installation sequencing
- Rule-based decision engine
- Rollback support
- Installation verification
- Deployment actions via API
- Placeholders Support (Config, Device, Env, Release)

### Releases
- Release creation via a guided wizard
- Duplicate an existing release

### Dashboard
- Parallel multi-file uploads
- Attach existing files from OCI

### GetConfig
- Platform and device configuration via GetConfig

### Security
- Co-signing in the Proxy and CDN

---

## v1.4

### Agent UI
- Merge device stores into a single unified store on the platform

### Agent API
- Swagger wrapper covering multiple agent roles

### CDN
- Real-time delivery and retrieval of agent-to-server data over the CDN

### Monitoring
- Agent-to-CDN/Server log and metric monitoring Collector
- Reactive Mode

### Dashboard
- Global search across project versions

### GetConfig
- Configuration retrieval over SSE

---

## v1.2

### UI
- New AppStore-style UI (compatible with Agent V2)
- Launch applications directly from the UI
- Multi-device platform view
- Delivery UI supporting USB and IM delivery methods

### API & Agent
- New V2 Agent API (backward compatible)
- Swagger documentation available at `/api-docs/v2`
- Device metadata reporting: OS, battery level, and location
- Device enrollment via API and YAML

### CDN
- Agent-to-agent connectivity over the CDN
- Device data and releases delivered via the CDN
- Delivery and deployment actions executed over the CDN

### Security
- Cosign-based artifact signing
- Automatic SBOM report generation per artifact
- Mandatory push rule enforcement
- Rule support for disconnected environments

### Releases
- Release dependency management, via JSON or the UI
- Pending Versions manager
- Sequential pending-releases queue

### Rule Engine
- Policy-based device restrictions
- Automatic delivery rules
- Rules debugger with device-match visualization

### Monitoring
- Agent Watch: integrated Grafana, Splunk, and UI monitoring
- Email alerts on errors
- CLI supporting one-shot commands and an interactive shell

### Dashboard
- Archive projects and releases
- GitOps integration with auto-release on commit
- Artifact downloads from the dashboard
- Enable/disable push, with error visibility

### GetConfig
- Key-value configuration groups per device
- Config map creation
- Agent configuration via GetConfig
