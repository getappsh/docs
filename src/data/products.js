// Product / solution catalog shown on the landing page and on /products.
// Each entry links into the existing docs — keep `docs` paths in sync with doc ids.

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'publish', label: 'Publish' },
  { id: 'govern', label: 'Govern' },
  { id: 'deliver', label: 'Deliver' },
  { id: 'edge', label: 'Edge & Offline' },
  { id: 'secure', label: 'Security' },
  { id: 'operate', label: 'Operate' },
];

export const AUDIENCES = {
  developer: 'Developer',
  admin: 'Admin',
  user: 'End user',
  technician: 'Technician',
};

export const PRODUCTS = [
  {
    id: 'app-store',
    name: 'GetApp Store',
    icon: 'store',
    category: 'deliver',
    featured: true,
    tagline: 'A self-service app store for every device in the network.',
    description:
      'Every signed-in user gets a personal Store portal to browse, install, and manage apps on their own devices — no special role required. A customizable widget workspace replaces the old flat app feed.',
    capabilities: ['Browse & install', 'Per-user workspace', 'Install status in real time'],
    audience: ['user'],
    docs: [
      { label: 'Space overview', to: '/docs/root/user-docs/space/space-overview' },
      { label: 'Workspace', to: '/docs/root/user-docs/space/workspace' },
    ],
  },
  {
    id: 'catalog',
    name: 'Catalog & Releases',
    icon: 'layers',
    category: 'publish',
    featured: true,
    tagline: 'Every digital asset, versioned and publishable.',
    description:
      'Projects hold releases; a release is an artifact plus a manifest. Apps, maps, configs, and data all live in one Catalog — composed step by step, reviewed, and published for delivery.',
    capabilities: ['Projects & releases', 'Attach existing artifacts', 'Release dependencies', 'Multi-platform delivery wizard'],
    audience: ['developer', 'admin'],
    docs: [
      { label: 'Catalog overview', to: '/docs/root/user-docs/admin/catalog/catalog-overview' },
      { label: 'Create a release', to: '/docs/root/user-docs/developer/release/create-release' },
    ],
  },
  {
    id: 'gitops',
    name: 'GitOps Releases',
    icon: 'git',
    category: 'publish',
    tagline: 'Commit a .getapp file, get a release.',
    description:
      'Link a project to a GitHub, GitLab, or any Git repository. GetApp watches for a .getapp manifest — on a schedule or via webhook — and creates the release automatically.',
    capabilities: ['GitHub / GitLab / any Git', 'Scheduled or webhook sync', 'Manifest-as-code'],
    audience: ['developer', 'technician'],
    docs: [
      { label: 'GitOps', to: '/docs/root/technician/server/gitops-section/gitops' },
      { label: 'GitOps releases', to: '/docs/root/technician/server/gitops-section/gitops-releases' },
    ],
  },
  {
    id: 'rules',
    name: 'Rules Engine',
    icon: 'rules',
    category: 'govern',
    featured: true,
    tagline: 'Decide who gets what — by policy, not by script.',
    description:
      'Policies scope releases, restrictions scope devices, and a single toggle turns a policy into a push. Build conditions from device fields and expressions, then debug a rule against the live fleet before trusting it.',
    capabilities: ['Policies & restrictions', 'Push policies', 'Expression builder', 'Live rule debugger'],
    audience: ['admin'],
    docs: [
      { label: 'Rules overview', to: '/docs/root/user-docs/admin/create-and-manage-rule/rules-overview' },
      { label: 'Fields & expressions', to: '/docs/root/technician/agent/rules-offering/rule-fields-expressions' },
    ],
  },
  {
    id: 'fleet',
    name: 'Fleet Inventory',
    icon: 'fleet',
    category: 'govern',
    tagline: 'A live snapshot of every platform and what runs on it.',
    description:
      'Model the fleet with device types, platform types, and nestable groups. The Platform Table, detail drawer, and journal show installed software, metadata, and every event across each platform.',
    capabilities: ['Device & platform types', 'Nestable groups', 'Platform journal', 'Universal platform offering'],
    audience: ['admin'],
    docs: [
      { label: 'Platform overview', to: '/docs/root/user-docs/admin/manage-platform/platform-overview' },
      { label: 'Groups', to: '/docs/root/user-docs/admin/groups/groups-overview' },
    ],
  },
  {
    id: 'getconfig',
    name: 'GetConfig',
    icon: 'sliders',
    category: 'govern',
    featured: true,
    tagline: 'Versioned runtime configuration for the whole fleet.',
    description:
      'Define key/value configuration once and distribute it by device type, device ID, or per platform. Semantic versioning, revision history, YAML or form editing, and Vault-backed sensitive values.',
    capabilities: ['ConfigMaps', 'Per-platform revisions', 'Sensitive keys via Vault', 'YAML & form editors'],
    audience: ['admin', 'technician'],
    docs: [
      { label: 'GetConfig', to: '/docs/root/technician/agent/configurations/getconfig' },
      { label: 'ConfigMap', to: '/docs/root/user-docs/admin/catalog/configmap' },
    ],
  },
  {
    id: 'agent',
    name: 'GetApp Agent',
    icon: 'agent',
    category: 'deliver',
    featured: true,
    tagline: 'The on-device runtime that delivers, installs, and reports.',
    description:
      'Runs on Linux and Windows (.deb, .rpm, .msi). Discovers offerings, downloads with retries, enforces policy, detects connectivity on its own, and reports status back — with a local UI, CLI, and live event stream.',
    capabilities: ['Linux & Windows packages', 'Auto connectivity detection', 'CLI & SSE interfaces', 'Policy enforcement on device'],
    audience: ['technician'],
    docs: [
      { label: 'Getting started', to: '/docs/root/getting-started' },
      { label: 'Agent settings', to: '/docs/root/technician/agent/configurations/agent-settings' },
    ],
  },
  {
    id: 'deploy-v2',
    name: 'Deploy V2',
    icon: 'workflow',
    category: 'deliver',
    tagline: 'Releases that describe how they install themselves.',
    description:
      'Ship an install.yaml inside the release: ordered and nested tasks, rule-gated steps, device placeholders, and other releases pulled in as dependencies — with per-run logs and live progress.',
    capabilities: ['install.yaml manifest', 'Task orchestration', 'Dependency releases', 'Recovery & logging'],
    audience: ['developer'],
    docs: [
      { label: 'Deploy V2 overview', to: '/docs/root/user-docs/developer/deploy/v2/deploy-v2-overview' },
      { label: 'Full example', to: '/docs/root/user-docs/developer/deploy/v2/deploy-v2-example' },
    ],
  },
  {
    id: 'cdn',
    name: 'CDN & Agent-to-Agent',
    icon: 'network',
    category: 'edge',
    tagline: 'Let one agent serve and command a whole site.',
    description:
      'A CDN agent acts as a local configuration and command server for nearby devices. In A2A mode a parent agent impersonates the server for its children — pushing updates and monitoring delivery from the edge.',
    capabilities: ['CDN master node', 'A2A parent management', 'Built-in reverse proxy'],
    audience: ['technician'],
    docs: [
      { label: 'CDN configure', to: '/docs/root/technician/agent/fleet-connectivity/cdn-configure' },
      { label: 'A2A parent management', to: '/docs/root/technician/agent/fleet-connectivity/a2a-parent-management' },
    ],
  },
  {
    id: 'offline',
    name: 'Disconnected Delivery',
    icon: 'usb',
    category: 'edge',
    tagline: 'Air-gapped networks and removable media, first-class.',
    description:
      'Carry releases into fully disconnected environments on a USB machine, with an agent configured on both ends. Same releases, same policies — no network required.',
    capabilities: ['Air-gapped workflow', 'Removable media', 'Offline-safe agent config'],
    audience: ['technician'],
    docs: [
      { label: 'Disconnected environments', to: '/docs/root/technician/agent/deployment/disconnectedEnvioremnt' },
      { label: 'Proxy mode', to: '/docs/root/technician/agent/deployment/proxy-mode' },
    ],
  },
  {
    id: 'supply-chain',
    name: 'Supply-Chain Security',
    icon: 'shield',
    category: 'secure',
    featured: true,
    tagline: 'Signed on upload, verified on device, scanned for CVEs.',
    description:
      'Every uploaded artifact is signed with Sigstore Cosign and re-verified by the agent before it is trusted. An SBOM generator scans each upload and stores the report and vulnerabilities alongside it.',
    capabilities: ['Cosign signing', 'Agent-side verification', 'SBOM & vulnerability reports'],
    audience: ['developer', 'technician'],
    docs: [
      { label: 'Cosign', to: '/docs/root/technician/server/security/cosign' },
      { label: 'SBOM generator', to: '/docs/root/technician/server/security/sbom-generator' },
    ],
  },
  {
    id: 'access',
    name: 'Identity & Access',
    icon: 'key',
    category: 'secure',
    tagline: 'Keycloak-backed roles for every portal and action.',
    description:
      'Every API request is authenticated and authorized through Keycloak. Fine-grained permissions gate the Admin, Developer, and Store portals, with reference roles for common scenarios.',
    capabilities: ['Keycloak SSO', 'Fine-grained permissions', 'Reference roles'],
    audience: ['admin', 'technician'],
    docs: [
      { label: 'Roles & permissions', to: '/docs/root/technician/server/auth-permission/roles-and-permissions' },
      { label: 'Users & roles', to: '/docs/root/user-docs/space/users-and-roles' },
    ],
  },
  {
    id: 'observability',
    name: 'Fleet Observability',
    icon: 'chart',
    category: 'operate',
    tagline: 'Health, throughput, and deploys on one screen.',
    description:
      'An operations dashboard with live events, plus agent logs and Matomo analytics pushed up to the server — local-first, so nothing blocks the device when the link is down.',
    capabilities: ['Operations dashboard', 'Log dispatch', 'Usage analytics', 'Tiered troubleshooting'],
    audience: ['admin', 'technician'],
    docs: [
      { label: 'Dashboard', to: '/docs/root/user-docs/space/space-dashboard' },
      { label: 'Telemetry', to: '/docs/root/technician/agent/observability/telemetry' },
    ],
  },
  {
    id: 'server',
    name: 'GetApp Server',
    icon: 'server',
    category: 'operate',
    tagline: 'The control plane — on Kubernetes, Docker, or small hardware.',
    description:
      'The microservice platform behind every portal. Install with Helm and ArgoCD GitOps, run without Kubernetes via Docker Compose, or size down with Low Mode for constrained sites.',
    capabilities: ['Helm & ArgoCD', 'Docker Compose', 'Low Mode sizing', 'OpenAPI everywhere'],
    audience: ['technician'],
    docs: [
      { label: 'Helm deployment', to: '/docs/root/technician/server/deployment/helm-deployment' },
      { label: 'Docker Compose', to: '/docs/root/technician/server/deployment/docker-compose-deployment' },
    ],
  },
];
