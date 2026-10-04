---
id: helm-configmap
title: Server Environment Variables (Helm)
sidebar_label: Environment Variables (Helm)
sidebar_position: 1
---

# Server Environment Variables (Helm)

Every server-side microservice (`api`, `delivery`, `deploy`, `discovery`, `offering`,
`project-management`, `sbom-generator`, `docs`, ...) reads its configuration from a single
shared ConfigMap, `getapp-<namespace>`, injected via `envFrom` in each Deployment. This page
documents what that ConfigMap actually contains and where each value comes from, as templated
by the Helm chart (`getappsh/getapp-release-control`, `helm-chart/templates/getapp/configmap-getapp.yaml`).

For a step-by-step deployment walkthrough, see
[Helm Deployment & ArgoCD](/docs/root/technician/server/deployment/helm-deployment). This page is the reference for what
ends up in the ConfigMap, not how to run the install.

:::note Scope — why this list is shorter than "Environment Variables"
This page covers **one ConfigMap** (`getapp-<namespace>`) — the one shared by the `api`-family
services. The [Environment Variables](/docs/env) section is generated from a different,
broader source that catalogs every `process.env.*` read across the *whole* platform, including
services with their own separate ConfigMaps: `getmap-<namespace>`, `dashboard-<namespace>`,
`dashboard-getmap-<namespace>`, and `agent-watch-<namespace>`. Those are now documented too —
see the [values.yaml Reference](./values-reference), which covers every section of the Helm
chart's `values.yaml`, not just this one ConfigMap.
:::

:::note Source of truth
Reconstructed directly from `configmap-getapp.yaml` and `values.yaml` in the Helm chart repo.
Most values are computed as `<service>-<namespace>.<routeMainUrl>` — set `routeMainUrl` once
in your values file and every hostname below derives from it.
:::

## Air-gapped / disconnected deployments

Only present when `airGapedEnv.enabled` (or `global.enabled`) is `true`.

| Variable | Source | Description |
|---|---|---|
| `TARGET` | `config.target` | Deployment target identifier |
| `DEPLOY_ENV` | `config.deployEnv` | Deployment environment identifier (hidden when `global.hideDeployEnv`) |
| `DB_KEY_PATH` | `airGapedEnv.postgresKeys.*` | Path to the Postgres client key |
| `DB_PEM_PATH` | `airGapedEnv.postgresKeys.mountPath` | Path to the Postgres CA bundle |
| `DB_CERT_PATH` | `airGapedEnv.postgresKeys.*` | Path to the Postgres client cert |
| `KAFKA_PEM_PATH` / `KAFKA_CERT_PATH` / `KAFKA_KEY_PATH` | `airGapedEnv.kafkaKeys.*` | Kafka mTLS CA/cert/key paths |
| `NODE_TLS_REJECT_UNAUTHORIZED` | computed | Set to `'0'` (disabled) whenever low-mode, air-gapped, or global mode is on |
| `NODE_EXTRA_CA_CERT` | `extraCaCert.enabled` | Path to an extra CA cert (`/etc/ssl/ca.crt`) when enabled |

## Keycloak / Auth

| Variable | Source | Description |
|---|---|---|
| `AUTH_SERVER_URL` | `keycloak.hostname` or `keycloak.host` + `routeMainUrl` | Keycloak base URL used by the auth flow |
| `REALM` / `KEYCLOAK_REALM` | `keycloak.realm` | Keycloak realm |
| `CLIENT_ID` / `KEYCLOAK_CLIENT` / `KEYCLOAK_CLIENT_ID` | `keycloak.clientId` | Keycloak client ID |
| `SECRET_KEY` | `keycloak.secretKey` | Keycloak client secret |
| `COOKIE_KEY` | `keycloak.cookieKey` | Session cookie signing key |
| `KEYCLOAK_URL` | `keycloak.hostname` or `keycloak.host` + `routeMainUrl` | Keycloak base URL used by the permissions module |
| `KEYCLOAK_ADMIN_USER` / `KEYCLOAK_ADMIN_PASSWORD` | `keycloak.admin.*` | Keycloak admin credentials (realm/user management) |
| `ENABLE_PREMISSIONS` | `config.enablePremissions` | Feature flag for the permissions module |

## Dashboard

| Variable | Source | Description |
|---|---|---|
| `DASHBOARD_URL` | computed: `dashboard-<namespace>.<routeMainUrl>` | Public Dashboard URL. Used by the docs site's Dashboard link |

:::note
`DASHBOARD_URL` is pending merge into the Helm chart —
[getappsh/getapp-release-control#22](https://github.com/getappsh/getapp-release-control/pull/22).
:::

## Kafka

| Variable | Source | Description |
|---|---|---|
| `KAFKA_BROKER_URL` | `kafka.enabled` → in-cluster service; else `kafka.brokers` or `kafka.host`/`kafka.port` | Kafka bootstrap broker(s) |
| `KAFKAJS_NO_PARTITIONER_WARNING` | `config.kafkajsNoPartitionerWarning` | Suppresses the KafkaJS default-partitioner deprecation warning |

## Microservice client

| Variable | Source | Description |
|---|---|---|
| `MICRO_SERVICE_TYPE` | `config.microServiceType` (forced to `SOCKET` when `lowMode.enabled`) | Inter-service transport: `KAFKA` or `SOCKET` |
| `MICROSERVICE_RESPONSE_WAIT_TIME` | `config.microserviceResponseWaitTime` | Timeout waiting for a microservice response |
| `{DELIVERY,DEPLOY,DISCOVERY,OFFERING,PROJECT,UPLOAD,GETMAP,SBOM_GENERATOR}_PORT` | `config.*Port` | Per-service SOCKET-mode listen ports |
| `{DELIVERY,DEPLOY,DISCOVERY,OFFERING,PROJECT,UPLOAD,GETMAP,SBOM_GENERATOR}_HOST` | `config.*Host` | Per-service SOCKET-mode hostnames |

## Postgres

| Variable | Source | Description |
|---|---|---|
| `POSTGRES_HOST` / `POSTGRES_PORT` | `postgres.host` / `postgres.port` | Postgres connection endpoint |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` | `postgres.user` / `postgres.password` | Postgres credentials |
| `POSTGRES_DB` | `postgres.database` | Database name |

## JFrog Artifactory

| Variable | Source | Description |
|---|---|---|
| `JFROG_BASE_URL` / `JFROG_REPO` | `config.jfrogBaseUrl` / `config.jfrogRepo` | Artifactory base URL and repo |
| `JFROG_USER_NAME` / `JFROG_PASSWORD` | `config.jfrogUserName` / `config.jfrogPassword` | Artifactory credentials |

## Security

| Variable | Source | Description |
|---|---|---|
| `DEVICE_SECRET` | `config.deviceSecret` | Shared secret for device authentication |
| `JWT_SECRET` / `JWT_EXPIRATION` | `config.jwtSecret` / `config.jwtExpiration` | JWT signing secret and token lifetime |

## AWS / uploads

| Variable | Source | Description |
|---|---|---|
| `AWS_REGION` / `BUCKET_NAME` | `config.awsRegion` / `config.bucketName` | AWS region and S3 bucket |
| `UPLOAD_URL_EXPIRE` / `DOWNLOAD_URL_EXPIRE` | `config.uploadUrlExpire` / `config.downloadUrlExpire` | Presigned URL TTLs |
| `MULTIPART_UPLOAD_ENABLED` | `config.multipartUploadEnabled` | Enable multipart upload for large artifacts |
| `MULTIPART_THRESHOLD_MB` / `MULTIPART_PART_SIZE_MB` | `config.multipartThresholdMb` / `config.multipartPartSizeMb` | Multipart threshold and chunk size |
| `MULTIPART_UPLOAD_URL_EXPIRE` | `config.multipartUploadUrlExpire` | Presigned URL TTL for multipart parts |

## S3 / MinIO

| Variable | Source | Description |
|---|---|---|
| `S3_ENDPOINT_INTERNAL` | `minio.enabled` → computed `<minio.ingress.apiHost>-<namespace>.<routeMainUrl>`; else `minio.endpoint.internal` | S3/MinIO endpoint used by in-cluster services |
| `S3_ENDPOINT_EXTERNAL` | same, or `minio.endpoint.external` | S3/MinIO endpoint used for externally-facing URLs (e.g. presigned download links) |
| `ACCESS_KEY_ID` / `SECRET_ACCESS_KEY` | `minio.secret.rootUser` / `minio.secret.rootPassword` | MinIO/S3 credentials |
| `MINIO_USE_SSL` | `config.minioUseSsl` | Use TLS when talking to MinIO |
| `RPC_PAYLOAD_VERSION` | `config.rpcPayloadVersion` | Payload version for the RPC/messaging layer |

## Server API URL

| Variable | Source | Description |
|---|---|---|
| `SERVER_API_URL` | computed: `https://api-<namespace>.<routeMainUrl>` | Public server base URL. Used by the docs site to build its Swagger links |
| `SERVER_URL` | computed: `api-<namespace>.<routeMainUrl>/api/` | Internal-use base URL for integration test scripts (no scheme, `/api/` suffix — not meant for external links) |

:::note
`SERVER_API_URL` is pending merge into the Helm chart —
[getappsh/getapp-release-control#23](https://github.com/getappsh/getapp-release-control/pull/23).
:::

## Integration test config

| Variable | Source | Description |
|---|---|---|
| `TEST_USERNAME` / `TEST_PASSWORD` | `config.testUsername` / `config.testPassword` | Credentials used by the e2e/integration test suite |
| `COMPONENT_NAME` / `COMPONENT_DESCRIPTION` | `config.componentName` / `config.componentDescription` | Default component metadata used in tests |
| `RELEASE_NOTE` | `config.releaseNote` | Default release note used in tests |
| `MIGRATION_RUN` | `config.migrationRun` | Whether tests trigger a migration run |
| `PRODUCT_ID` | `config.productId` | Default product ID used in tests |
| `BOUNDING_BOX` | `config.boundingBox` | Default geo bounding box used in map-related tests |

## Other

| Variable | Source | Description |
|---|---|---|
| `LOGGER_FORMAT` | `config.loggerFormat` | Log output format |

## HashiCorp Vault

Only present when `vault.enabled`.

| Variable | Source | Description |
|---|---|---|
| `VAULT_ADDR` | computed: in-cluster service DNS | Vault address (GitOps credential storage) |
| `VAULT_DEV_ROOT_TOKEN_ID` | `vault.devRootToken` | Vault dev root token |
| `VAULT_MOUNT_PATH` | `vault.mountPath` | Secrets engine mount path |

## Monitoring & logging

Each var only present when its service is `.enabled`.

| Variable | Source | Description |
|---|---|---|
| `ELASTICSEARCH_NODE` | `elasticsearch.host` / `elasticsearch.httpPort` | Elasticsearch endpoint |
| `KIBANA_URL` | `kibana.host` / `kibana.port` | Kibana endpoint |
| `VICTORIA_METRICS_URL` | `victoriametrics.host` / `victoriametrics.port` | VictoriaMetrics endpoint |
| `GRAFANA_URL` | `grafana.host` / `grafana.port` | Grafana endpoint |

## See also

- [Helm Deployment & ArgoCD](/docs/root/technician/server/deployment/helm-deployment) — how to actually deploy with these values
