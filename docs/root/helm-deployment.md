---
id: helm-deployment
title: Helm Deployment & ArgoCD GitOps
sidebar_label: Helm Deployment & ArgoCD
sidebar_position: 12
---

# Deploying GetApp with Helm & ArgoCD

This guide covers two paths for deploying the GetApp server:

1. **Manual Helm install** — deploy directly from the CLI using `helm install` / `helm upgrade`.
2. **ArgoCD GitOps** — let ArgoCD continuously reconcile the cluster state from a Git repository.

Both paths use the same Helm chart (`getappsh/getapp-release-control`) and the same values file structure.

---

## Prerequisites

| Requirement | Notes |
|---|---|
| Kubernetes cluster | 1.24+ recommended |
| `helm` CLI | v3.10+ |
| `kubectl` configured | pointing at the target cluster |
| Namespace created | e.g. `kubectl create namespace getapp-prod` |
| Image registry access | Harbor credentials or equivalent |
| ArgoCD installed | only for the GitOps path |

---

## Part 1 — Manual Helm Deployment

### 1. Get the Helm Chart

The chart lives in the `getapp-release-control` repository under `helm-chart/`.

```bash
git clone https://github.com/getappsh/getapp-release-control.git
cd getapp-release-control/helm-chart
```

### 2. Create Your Values File

Copy the default values and customise for your environment. The values file is divided into six sections (tagged A–F in the file):

| Section | Contents |
|---|---|
| **A** — Basic | Deployment mode, domain URL, image tags |
| **B** — Air-gap / OpenShift | TLS certs, resource limits, OpenShift routes |
| **C** — Infrastructure | PostgreSQL, Kafka, MinIO, Keycloak |
| **D** — Optional services | Vault, Agent Watch, Dashboard GetMap |
| **E** — ConfigMap values | All environment variables |
| **F** — Cluster config | Replicas, ingress class, HPA |

```bash
cp values.yaml values-prod.yaml
```

#### Minimum changes for a new environment

```yaml
# [A] Set your domain
routeMainUrl: apps.example.com

# [A] Pick the deployment mode
deploymentMode: getapp   # or "getmap" or "both"

# [A] Pin image tags to your release
getappRelease: 1.4.32
tag:
  api: 1.4.88-z-1.0.2
  delivery: 1.4.20-maalog.1
  # ... other tags

# [C] Change all default passwords!
postgres:
  password: "STRONG_RANDOM_PASSWORD"

minio:
  secret:
    rootUser: "your-minio-user"
    rootPassword: "STRONG_RANDOM_PASSWORD"

keycloak:
  admin:
    password: "STRONG_RANDOM_PASSWORD"
  secretKey: "STRONG_RANDOM_SECRET"

# [E] Change security secrets
config:
  jwtSecret: "STRONG_RANDOM_JWT_SECRET"
  deviceSecret: "STRONG_RANDOM_DEVICE_SECRET"

dashboard:
  nextauthSecret: "STRONG_RANDOM_NEXTAUTH_SECRET"
```

### 3. Deployment Modes

| Mode | Deploys |
|---|---|
| `getapp` | api, delivery, discovery, offering, dashboard, deploy, upload, project-management, sbom-generator, docs, agent-watch |
| `getmap` | api, delivery, discovery, offering, getmap, docs, dashboard-getmap |
| `both` | All of the above |

### 4. Infrastructure: Bundled vs External

By default, the chart deploys PostgreSQL, Kafka, MinIO, and Keycloak as in-cluster pods. **For production, disable the bundled services and point to your own infrastructure:**

```yaml
postgres:
  enabled: false
  host: my-postgres.internal
  port: 5432
  database: getapp_prod
  user: getapp_prod
  password: "STRONG_RANDOM_PASSWORD"

kafka:
  enabled: false
  host: kafka-broker-1.internal
  port: 9092
  # For multiple brokers:
  # brokers: "kafka-1:9092,kafka-2:9092,kafka-3:9092"

minio:
  enabled: false
  host: s3.amazonaws.com
  port: 443
  secret:
    rootUser: "ACCESS_KEY_ID"
    rootPassword: "SECRET_ACCESS_KEY"
  endpoint:
    internal: "https://my-bucket.s3.amazonaws.com"
    external: "https://my-bucket.s3.amazonaws.com"

keycloak:
  enabled: false
  hostname: "keycloak.my-domain.com"
  host: keycloak.my-domain.com
  port: 443
```

### 5. OpenShift

If deploying to OpenShift, set `isOpenShift: true`. This switches ingress resources to OpenShift `Route` objects and enables the appropriate security context constraints.

```yaml
isOpenShift: true
```

### 6. Air-Gapped Environments

For networks where Kafka and Postgres are reached over TLS with private CA certificates:

```yaml
airGapedEnv:
  enabled: true
  kafkaKeys:
    configMapName: kafka-keys-prod
    mountPath: /kafka-keys
    files:
      client.key: |
        -----BEGIN PRIVATE KEY-----
        ...
        -----END PRIVATE KEY-----
      client.pem: |
        -----BEGIN CERTIFICATE-----
        ...
        -----END CERTIFICATE-----
  postgresKeys:
    configMapName: postgres-keys
    mountPath: /postgres-keys
    files:
      client.crt: |
        -----BEGIN CERTIFICATE-----
        ...
        -----END CERTIFICATE-----

caCert:
  certificate: |
    -----BEGIN CERTIFICATE-----
    ... (your root CA) ...
    -----END CERTIFICATE-----
```

### 7. Install or Upgrade

```bash
# First-time install
helm install getapp ./helm-chart \
  --namespace getapp-prod \
  --values values-prod.yaml \
  --create-namespace

# Upgrade (rolling update)
helm upgrade getapp ./helm-chart \
  --namespace getapp-prod \
  --values values-prod.yaml

# Upgrade and wait for rollout
helm upgrade getapp ./helm-chart \
  --namespace getapp-prod \
  --values values-prod.yaml \
  --wait --timeout 10m
```

### 8. Verify the Deployment

```bash
# Check all pods are Running
kubectl get pods -n getapp-prod

# Watch rollout
kubectl rollout status deployment/api -n getapp-prod

# Check ingresses / routes
kubectl get ingress -n getapp-prod

# View logs for a specific service
kubectl logs -n getapp-prod -l app=api --tail=100
```

### 9. Rollback

Helm keeps a revision history (controlled by `revisionHistoryLimit`, default 3):

```bash
# List revisions
helm history getapp -n getapp-prod

# Rollback to the previous revision
helm rollback getapp -n getapp-prod

# Rollback to a specific revision
helm rollback getapp 2 -n getapp-prod
```

---

## Part 2 — ArgoCD GitOps Deployment

ArgoCD watches a Git repository and continuously reconciles the cluster to match the declared state. This is the recommended approach for production environments.

### Architecture

```
┌──────────────────────────────────────┐
│          Git Repository              │
│  helm-chart-values-files/            │
│  ├── values-prod.yaml                │
│  └── values-staging.yaml            │
└──────────────────┬───────────────────┘
                   │  ArgoCD watches
                   ▼
┌──────────────────────────────────────┐
│            ArgoCD                    │
│  Application CR (declarative config) │
│  ┌────────────────────────────────┐  │
│  │ source: helm-chart repo        │  │
│  │ values: values-prod.yaml       │  │
│  │ target: getapp-prod namespace  │  │
│  └────────────────────────────────┘  │
└──────────────────┬───────────────────┘
                   │  helm template | kubectl apply
                   ▼
┌──────────────────────────────────────┐
│         Kubernetes Cluster           │
│  namespace: getapp-prod              │
│  (all GetApp deployments, services,  │
│   configmaps, ingresses)             │
└──────────────────────────────────────┘
```

### Step 1: Prepare the Values Repository

Store your environment-specific values files in a Git repository. Recommended layout:

```
helm-chart-values-files/
├── values-prod.yaml
├── values-staging.yaml
└── values-np-test.yaml
```

Commit and push any values changes to this repository. ArgoCD will detect the change and reconcile.

### Step 2: Create an ArgoCD Application

Create an `Application` resource pointing at both the Helm chart source and your values repository.

**Option A: Single-source (chart + values in the same repo)**

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: getapp-prod
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/getappsh/getapp-release-control.git
    targetRevision: main
    path: helm-chart
    helm:
      valueFiles:
        - values.yaml
        - ../../helm-chart-values-files/values-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: getapp-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

**Option B: Multi-source (chart and values in separate repos)**

ArgoCD 2.6+ supports multiple sources in a single Application:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: getapp-prod
  namespace: argocd
spec:
  project: default
  sources:
    - repoURL: https://github.com/getappsh/getapp-release-control.git
      targetRevision: main
      path: helm-chart
      helm:
        valueFiles:
          - $values/values-prod.yaml
    - repoURL: https://github.com/your-org/helm-chart-values-files.git
      targetRevision: main
      ref: values
  destination:
    server: https://kubernetes.default.svc
    namespace: getapp-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

Apply the manifest:

```bash
kubectl apply -f argocd-app-getapp-prod.yaml
```

### Step 3: Add Repository Credentials to ArgoCD

If either repository is private, register credentials in ArgoCD:

```bash
# HTTPS
argocd repo add https://github.com/your-org/helm-chart-values-files.git \
  --username <user> \
  --password <token>

# SSH
argocd repo add git@github.com:your-org/helm-chart-values-files.git \
  --ssh-private-key-path ~/.ssh/id_rsa
```

### Step 4: Trigger a Sync

ArgoCD syncs automatically when `automated` sync policy is set. To force a sync manually:

```bash
# Via CLI
argocd app sync getapp-prod

# Via UI
# Open the ArgoCD dashboard → find getapp-prod → click SYNC
```

### Step 5: Manage Image Versions

To update a microservice version, edit the values file in Git:

```yaml
# values-prod.yaml
tag:
  api: 1.4.90-main
```

Commit and push. ArgoCD detects the diff and performs a rolling update automatically.

To update all services to a new GetApp release:

```yaml
getappRelease: 1.4.33
tag:
  api: 1.4.90-main
  delivery: 1.4.21-main
  # ...
```

### Step 6: Monitor Sync Status

```bash
# Check application health and sync status
argocd app get getapp-prod

# Stream live sync logs
argocd app logs getapp-prod

# List all managed resources
argocd app resources getapp-prod
```

Expected output when healthy:

```
Name:               getapp-prod
Health Status:      Healthy
Sync Status:        Synced
```

### Step 7: Rollback via ArgoCD

Rollback restores a previous Git revision — not a Helm revision:

```bash
# List history
argocd app history getapp-prod

# Rollback to a specific revision ID
argocd app rollback getapp-prod <REVISION_ID>
```

To make the rollback permanent, revert the commit in the values repository.

---

## Horizontal Pod Autoscaler (HPA)

HPA is disabled by default. To enable it cluster-wide and per service:

```yaml
hpa:
  enabled: true   # global switch

  api:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
    cpuUtilization: 70
    memoryUtilization: 80

  delivery:
    enabled: true
    minReplicas: 1
    maxReplicas: 5
    cpuUtilization: 70
    memoryUtilization: 70
```

HPA requires `metrics-server` to be installed in the cluster.

---

## HashiCorp Vault for Secure Credentials

Enable Vault to avoid storing Git credentials (SSH keys, HTTPS passwords) in plain text in the database:

```yaml
vault:
  enabled: true
  host: vault
  port: 8200
  devRootToken: "CHANGE_THIS_IN_PRODUCTION"
  mountPath: "getapp-secrets"
```

:::warning
The bundled Vault runs in **dev mode** — all secrets are stored in memory and lost on pod restart. For production, replace it with a separately managed, production-grade Vault instance using a persistent storage backend.
:::

See [GitOps](./gitops.md#secure-credential-storage-with-vault) for the full Vault policy and environment variable reference.

---

## Common Issues

| Symptom | Likely cause | Fix |
|---|---|---|
| Pods stuck in `ImagePullBackOff` | Registry credentials missing | Add `imagePullSecrets` or authenticate `harbor.getapp.sh` |
| Keycloak not ready | Slow startup on first boot | Increase `initialDelaySeconds` in `keycloak.livenessProbe` |
| API returns 502 | Ingress buffer too small | The chart default sets `proxy-buffer-size: 64k` — review ingress annotations |
| ArgoCD shows `OutOfSync` forever | Values file has a merge conflict or invalid YAML | Run `helm template` locally and check for errors |
| Kafka connection refused | `kafka.host` set to `kafka` instead of `kafka-service` | Use `kafka-service` (the chart's internal service name) |
| MinIO upload fails with 413 | `proxyBodySize` too small | Increase `minio.ingress.proxyBodySize` |
