---
id: changelog
title: Changelog
sidebar_label: Changelog
sidebar_position: 11
---

# Changelog

Release notes for GetApp Server, Agent, and Agent UI.

---

## 26.5 — April 28, 2026

### New Features & Enhancements

#### MSI Pub Installation Notes (Global Environment Only)
- **Manual MSI Installation (Pub):** Each MSI package now requires a password during manual installation.
- **Agent Upgrade via GetApp:** The MSI password is provided automatically as an argument during the release installation flow.
- **PFX Code Signing (Pub Installation Only):** MSI agent installations support PFX-based code signing.
- **Password-Protected MSI Packages:** All MSI agent installations are password-protected as part of the Pub installation flow.

See [Getting Started](./getting-started.md) for installation steps.

#### CDN V2 API
- New API for querying state and dispatching actions from a single agent to multiple agents.
- Swagger available at `/swagger-ui/cdn/`.

Reference: [Agent CDN API](/docs/category/cdn).

#### GitOps Project Integration
- Connect a project to a Git repository to automatically generate new releases on commit.
- Connection details can be added when creating a new project under **Advanced Settings**, or updated on an existing project under **Settings**.

#### Automatic Delivery Rules
- Define rules that trigger an automatic download as soon as a matching device responds to an offering.

See [Policies and Restrictions Overview](./user-manual/policies-restrictions-overview.md) and [Evaluating Rules](./user-manual/rule-evaluation.md).

#### Pending Releases Queue
- Agents now queue downloads and process them sequentially, with support for both **push** and **pull** flows.

#### Project Types
- Projects can now be classified as **Application**, **Infrastructure**, **Library**, or **Bundle**.

#### Smart Search in Device Table
- Advanced, query-based search across the Device table.

See [Dashboard 101](./user-manual/dashboard-101.md).

#### Configurable Agent Installation
- `.env` and additional configuration values can now be set at install time via MSI/RPM arguments or through the installer GUI.
- Configuration values can be set on either the GUI or the CLI.

See [Getting Started](./getting-started.md), [CLI](./technician/cli.md), and [Policy Enforcement Configuration](./user-manual/policy-enforcement-configuration.md).

#### Artifact Download from Dashboard
- Artifacts can now be downloaded directly from the Dashboard.

See [Download and Deploy](./user-manual/downloading.md).

#### Rules Debugger
- Inspect any rule to see exactly which devices match it — useful for validating rule logic before rollout.

See [Evaluating Rules](./user-manual/rule-evaluation.md) and [Rule Fields and Expressions](./user-manual/rule-fields-expressions.md).

### Bug Fixes
- Catalog, Device Type, and Platform changes (insert / update / delete) now appear correctly.
- Release size now accounts for all included dependencies.

---

## 26.4 — April 14, 2026

### New Features & Enhancements

#### Artifact Upload Process
- New flow: **File Upload → Cosign → SBOM**.
- Includes SBOM report generation.

See [SBOM Generator](./sbom-generator.md).

#### CLI
- Command-line interface for managing device updates and software delivery through the GetApp agent service.

See [CLI](./technician/cli.md).

#### Device Info
- Improved device information surface and reporting.

See [Dashboard 101](./user-manual/dashboard-101.md).

#### Agent Watch — Monitor for Agent Deployment
- Connects to Grafana, Splunk, and a dedicated UI.
- Email notifications on error.

### Versions
- **GetAppAgent:** 0.3.29
- **GetAppAgentUI:** 0.3.16

---

## 26.3 — March 3, 2026

### New Features & Enhancements

#### Dependencies
- Support for dependencies by release — defined in JSON or directly in the GetApp UI.
- Support for complex installations via script or orchestrator per device.

See [Dependencies Overview](./user-manual/dependencies.md) and [Complex Installations with Dependencies](./user-manual/dependencies-complex-installations.md).

#### Rule Engine
- **Release Policy** — see [Policies and Restrictions Overview](./user-manual/policies-restrictions-overview.md) and [Managing Policies](./user-manual/managing-policies.md).
- **Device Restrictions** — see [Managing Restrictions](./user-manual/managing-restrictions.md).

#### Installation Configuration
- Easier configuration for release installations.

See [Policy Enforcement Configuration](./user-manual/policy-enforcement-configuration.md).

#### Release Configuration — Pre-Saved Metadata for Agent Behaviors
- Installation max size.
- Execute of release on end device.
- Agent size after successful installation (server-side reporting).

#### Release Table & Metrics View
- Device application view, device table view, and metrics dashboards.

See [Dashboard 101](./user-manual/dashboard-101.md).

#### Project Changelog
- View the entire change log per project.

#### Enable / Disable Push
- Show release error.
- Cancel a push before the installation starts on devices.

### Bug Fixes
- Project Update.
- Docker Delivery.

### Versions
- **GetAppAgent:** 0.3.26
- **GetAppAgentUI:** 0.3.14

---

## 26.2 — February 16, 2026

### New Features & Enhancements

#### V2 Agent API
- The new Agent API supports both V1 and V2.

See [Agent V2 API](/docs/category/v2) and [Agent Core API](/docs/category/core).

To use Swagger V2:
1. Go to the Swagger UI: `<Agent API>/swagger-ui/`.
2. Change `/api-docs/v1/openapi.json` to `/api-docs/v2/openapi.json` and press **Explore**.

#### Device Metadata
- Dynamic and Operating System metadata.
- Device metadata includes name, location, battery, OS, and custom fields.

See [Agent V2 API](/docs/category/v2).

#### Device Enrollment
- API and YAML configuration management for enrollment.
- Configures server URLs, authentication settings, and connection parameters.

See [Enrollment](./technician/enrollment.md).

#### Device Releases
- Manage all agent releases through a single API.

See [Agent V2 API](/docs/category/v2).

#### Discovery Trigger
- Minor punctuation and flow improvements to component discovery.

#### Action Permissions
- Role and tag management via Keycloak.

See [User Roles and Permissions](./user-manual/roles-and-permissions.md), [Setup and Management](./user-manual/roles-setup-management.md), and [Roles Reference](./user-manual/roles-reference-scenarios.md).

#### Disconnected Environment Support
- Support for USB or IM-based delivery when disconnected from the GetApp Server.

See [Disconnected Environments](./technician/disconnectedEnviorment.md).

#### Import / Export Release
- Import and export Release manifests.

#### Device Structure
- Manage devices with pagination and a logical pattern.

#### Cosign
- Sign artifacts with Cosign and validate them on the end device.

See [SBOM Generator](./sbom-generator.md).

#### Pending Versions Manager
- Add non-existing releases to a device and manage them on the end device.

### Versions
- **GetAppAgent:** 0.3.24
- **GetAppAgentUI:** 0.3.12
