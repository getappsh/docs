---
id: values-reference
title: Helm values.yaml Reference
sidebar_label: values.yaml Reference
sidebar_position: 2
---

# Helm values.yaml Reference

[Environment Variables (Helm)](./helm-configmap) covers only what ends up as a container env
var in the shared `getapp-<namespace>` ConfigMap — the `config:` block of `values.yaml`. That's
one section of six. This page is the complete reference: every top-level key in
`helm-chart/values.yaml`, organized the same way the file organizes itself.

:::note Source of truth
Reconstructed directly from `helm-chart/values.yaml` (1080 lines) in
`getappsh/getapp-release-control`. The file groups itself into six lettered sections — A–F —
via its own comments; this page mirrors that.
:::

## [A] Basic

| Key | Default | Description |
|---|---|---|
| `deploymentMode` | `getapp` | `getapp` \| `getmap` \| `both` — which stack(s) to deploy |
| `routeMainUrl` | `apps.getapp.sh` | Base domain; every service is exposed at `<service>-<namespace>.<routeMainUrl>` |
| `nameSpace` | `getapp-global` | **Deprecated** — no effect, the chart uses the Helm release namespace |
| `getappRelease` | e.g. `1.4.33-getapp-maalot-1.2` | Overall release version label (surfaced as `getappRelease` on every resource) |
| `repository` | `harbor.getapp.sh/getapp-dev/` | Image registry prefix for all first-party images |
| `tag.*` | per-service | Image tag for each service: `api`, `delivery`, `deploy`, `discovery`, `offering`, `projectmanagment`, `upload`, `dashboard`, `getmap`, `docs`, `sbomgenerator`, `agentWatch`, `dashboardGetmap` |
| `image.pullPolicy` | `IfNotPresent` | Pull policy applied to first-party images |

## [B] Air-gapped & OpenShift

| Key | Default | Description |
|---|---|---|
| `isOpenShift` | `false` | Use OpenShift `Route`s instead of `Ingress`, and OpenShift security contexts |
| `airGapedEnv.enabled` | `true` | Bakes Kafka/Postgres CA + client cert/key material into every pod (see below) and sets `NODE_TLS_REJECT_UNAUTHORIZED=0` |
| `airGapedEnv.kafkaKeys.configMapName` / `.mountPath` | `kafka-keys-prod` / `/kafka-keys` | Where the Kafka TLS ConfigMap is named/mounted |
| `airGapedEnv.kafkaKeys.files` | — | `filename: PEM contents` map — client cert/key only; CA comes from `caCert.certificate` |
| `airGapedEnv.postgresKeys.configMapName` / `.mountPath` | `postgres-keys` / `/postgres-keys` | Where the Postgres TLS ConfigMap is named/mounted |
| `airGapedEnv.postgresKeys.files` | — | Same pattern as Kafka, for the Postgres client cert/key |
| `extraCaCert.enabled` / `.secretName` | `false` / `extra-ca-cert` | Mount an extra CA cert (`NODE_EXTRA_CA_CERT`) from a Secret you provide |
| `resources.enabled` | `false` | When `true`, applies `resources.cpu`/`resources.memory` as limits (requests = 1/4 CPU, same memory) to **every** GetApp deployment |

## [C] GetApp infrastructure

Bundled dev/test infra — disable (`enabled: false`) and point at your own in production.

| Section | Key highlights |
|---|---|
| `postgres` | `enabled`, `host`, `database`, `user`, `password`, `port`, `image.tag`, `replicas`, `persistence.size` |
| `kafka` | `enabled`, `host`, `port`, `brokers` (comma-separated, overrides host/port when set), `image.tag` |
| `minio` | `enabled`, `host`, `port`, `secret.rootUser`/`rootPassword`, `ingress.consoleHost`/`apiHost`/`proxyBodySize`, `persistence.size`, `resources.*`; when disabled: `endpoint.internal`/`endpoint.external` for an external S3 |
| `keycloak` | `enabled`, `hostname` (external override), `host`, `port`, `admin.username`/`password`, `realm`, `clientId`, `secretKey`, `cookieKey`, `image.tag`, `replicas`, `persistence.size`, `livenessProbe`/`readinessProbe`, `resources.*` |
| `matomo` | `enabled` (default `false`) |
| `pgadmin` | `enabled` (default `false`), `replicas`, `image.tag`, `defaultEmail`/`defaultPassword`, `serverMode`, `persistence.size`. Exposed at `pgadmin-<namespace>.<routeMainUrl>` |
| `elasticsearch` | `enabled` (default `false`), `host`, `httpPort`/`transportPort`, `image.tag`, `javaOpts`, `persistence.size`, `resources.*` |
| `kibana` | `enabled` (default `false`), `host`/`port`/`ingressHost`, `image.tag`, `resources.*`. Requires elasticsearch. Exposed at `kibana-<namespace>.<routeMainUrl>` |
| `victoriametrics` | `enabled` (default `false`), `host`/`port`, `retentionPeriod`, `persistence.size`, `resources.*` |
| `grafana` | `enabled` (default `false`), `host`/`port`/`ingressHost`, `admin.user`/`password`, `auth.anonymousEnabled`/`anonymousOrgRole`, `persistence.size`, `resources.*`. Exposed at `grafana-<namespace>.<routeMainUrl>` |

Third-party images (elasticsearch/kibana/victoriametrics/grafana) default to `.Values.repository`
like everything else — set `<service>.image.repository` to pull from elsewhere instead.

## [D] Other GetApp services

| Key | Default | Description |
|---|---|---|
| `vault.enabled` | `false` | Deploy HashiCorp Vault (dev mode — in-memory, no HA) for GitOps credential storage |
| `vault.devRootToken` | `getapp-vault-token` | Static dev root token — **change before sharing an environment** |
| `vault.mountPath` | `getapp-secrets` | Secrets engine mount path |
| `agentWatch.enabled` | `false` | Deploy the Agent Watch microservice (monitors/manages agents) |
| `dashboardGetmap.enabled` | `false` | Deploy the Dashboard GetMap frontend |
| `docs.enabled` | `true` | Deploy this docs site |
| `sbomGenerator.enabled` | `true` | Deploy the SBOM Generator (only when `deploymentMode` is `getapp` or `both`) |

## [E] ConfigMap values

Each block here becomes one ConfigMap's `data`. `config` (→ `configmap-getapp.yaml`) is the
big shared one already fully documented on
[Environment Variables (Helm)](./helm-configmap) — not repeated here. The rest are
service-specific and previously undocumented:

### `dashboard` → `configmap-dashboard.yaml`

| Key | Description |
|---|---|
| `nextauthSecret` | NextAuth.js signing secret — **change in production** |
| `sessionMaxAge` | Session max age, seconds (default `1800` = 30 min) |
| `probes.enabled` | Adds a readinessProbe hitting `/` on port 3002 |
| `resources.*` | CPU/memory requests and limits for the dashboard container |

### `getmap` → `configmap-getmap.yaml`

| Key | Description |
|---|---|
| `libot.discoveryUrl` / `.exportUrl` / `.token` | Libot discovery/export service URLs + auth token (all required) |
| `libot.callbackUrl` | Callback URL given to libot; auto-generated from namespace + `routeMainUrl` if empty |
| `productFiltering.*` | `mcCswRefDate`, `targetResolution`, `mcMinResolutionDeg`, `mcMaxResolutionDeg` |
| `wfs.*` | `productsCreationMethod` (`single`\|`polygonParts`), `polygonPartsWfs`, `maneuverArea`, `sequentialProductId` — the last three required only when `polygonParts` |
| `service.*` | `updateGobTime` (cron), `productsStaleAfter`, `useProductsCache`, `periodicGetMapStatus`, `mapRetryExponentialTimes`, `mapRetryWaitTime`, `mapRetryCount`, `updateJobMapTake` |
| `other.libotEmulator` / `.proxyDownloadBaseUrl` | Emulation mode toggle; base URL for the download proxy |

:::caution
`deployment-getmap.yaml`'s `configMapRef` for `getmap-<namespace>` is mis-indented (sits under
`env:` instead of `envFrom:`), so in the current chart these values likely never actually reach
the getmap container. Confirmed by inspection, not yet fixed — see the note on
[Environment Variables (Helm)](./helm-configmap).
:::

### `dashboardGetmapConfig` → `configmap-dashboard-getmap.yaml`

| Key | Description |
|---|---|
| `grafanaDashboardUrl` / `matomoDashboardUrl` | Links shown in the Dashboard GetMap UI |
| `isDeviceAuthEnabled` | Enable device authentication |
| `loginUsername` / `loginPassword` | Default login credentials (empty = no default) |
| `maxLastConnectionDays` / `maxLastUpdateDays` | Staleness thresholds shown as warnings |
| `settingsPassword` | Password gating the settings screen (empty = disabled) |

### `agentWatchConfig` → `configmap-agent-watch.yaml`

The largest of the service-specific blocks (~35 keys). Grouped by what it configures:

| Group | Keys |
|---|---|
| GetApp API auth | `getappUsername`, `getappPassword` |
| Database | `databaseName`, `databaseSynchronize`, `databaseSslEnabled`, `databaseSslCaCert`, `databaseSslClientCert`, `databaseSslClientKey`, `databaseSslRejectUnauthorized` |
| Monitoring cadence | `pollIntervalMinutes`, `deliveryEscalationHours`, `offeringWarningHours`, `agentDownWarningDays`, `agentDownErrorDays` |
| Prometheus | `prometheusEnabled`, `prometheusMetricsPath` |
| Splunk HEC | `splunkHecEnabled`, `splunkHecUrl`, `splunkHecToken`, `splunkHecIndex`, `splunkHecSource`, `splunkHecSourcetype` |
| Notifications | `notificationErrorThreshold`, `webhookUrl`, `slackWebhookUrl`, `emailSmtpHost`, `emailSmtpPort`, `emailSmtpSecure`, `emailFrom`, `emailTo`, `emailPassword` |
| Log provider | `logProvider` (`splunk`\|`opensearch`\|`loki`), plus matching `splunkUrl`/`splunkToken`, `opensearchUrl`/`opensearchUsername`/`opensearchPassword`, or `lokiUrl` |
| Server | `corsOrigin`, `logLevel` |

### `cosign` → `configmap-cosign.yaml`

| Key | Description |
|---|---|
| `privateKey` | Encrypted Sigstore private key (PEM) used to sign release artifacts |
| `publicKey` | Matching public key, used by agents to verify signatures |

### `caCert` → `configmap-ca.yaml`

| Key | Description |
|---|---|
| `certificate` | Shared CA bundle (PEM) — sourced by `extraCaCert` and the air-gapped Kafka/Postgres key bundles |

## [F] Cluster config

| Key | Default | Description |
|---|---|---|
| `replicaCount` | `1` | Replica count for all GetApp microservices |
| `revisionHistoryLimit` | `3` | Old ReplicaSets retained for rollback |
| `ingress.className` | `nginx` | Ingress class (non-OpenShift only) |
| `ingress.annotations` | — | nginx-ingress annotations applied to every Ingress (SSL redirect, proxy buffer sizes, timeouts, ...) |
| `hpa.enabled` | `false` | Global HPA switch — must be `true` **and** the per-service switch below to actually enable autoscaling for that service |
| `hpa.<service>.*` | `enabled: false`, `minReplicas: 1`, `maxReplicas: 10`, `cpuUtilization: 70`, `memoryUtilization: 70` | Per-service HPA, for: `api`, `delivery`, `deploy`, `discovery`, `getmap`, `offering`, `projectManagement`, `sbomGenerator`, `upload` |
| `globalDashboard.*` | — | Separate "getapp-pro" global dashboard app: `enabled`, `image.{name,tag}`, `nextauthSecret`, `sessionMaxAge`, `demoMode`, `adminEmail`/`adminPassword`, `nodeTlsRejectUnauthorized`, `basePath`, `nextauthUrl`, `publicIssuer`, `issuer`, `resources` |

## See also

- [Environment Variables (Helm)](./helm-configmap) — the `config` block in full detail
- [Helm Deployment & ArgoCD](/docs/root/technician/server/deployment/helm-deployment) — how to actually run the install
