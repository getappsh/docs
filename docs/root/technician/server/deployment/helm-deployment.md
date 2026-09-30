---
id: helm-deployment
title: Helm Deployment & ArgoCD GitOps
sidebar_label: Helm Deployment & ArgoCD
sidebar_position: 1
---

# Deploying GetApp with Helm & ArgoCD

This guide covers two paths for deploying the GetApp server:

1. **Manual Helm install** — deploy directly from the CLI using `helm install` / `helm upgrade`.
2. **ArgoCD GitOps** — let ArgoCD continuously reconcile the cluster state from a Git repository.

Both paths use the same Helm chart (`getappsh/getapp-release-control`) and the same values
file structure. For a smaller, single-node k3s footprint instead of full Kubernetes, see
[Low Mode](./low-mode).

---

## Prerequisites

| Requirement | Notes |
|---|---|
| Kubernetes cluster | 1.19+ |
| `helm` CLI | v3.0+ |
| `kubectl` configured | pointing at the target cluster |
| Ingress controller | nginx recommended (`ingressClassName: nginx` is the chart default) |
| `cert-manager` | for TLS certificates — see [Low Mode's cert-manager appendix](./low-mode#appendix-c--setting-up-cert-manager-tls-certificates) |
| Namespace created | e.g. `kubectl create namespace getapp-prod` |
| Image registry access | Harbor credentials or equivalent |
| ArgoCD installed | only for the GitOps path |

---

## Part 1 — Manual Helm Deployment

### 1. Get the Helm Chart

```bash
git clone https://github.com/getappsh/getapp-release-control.git
cd getapp-release-control/helm-chart
```

### 2. Deployment modes

The `deploymentMode` value controls which application stack the chart deploys:

| Mode | Description | Deployed components |
|---|---|---|
| `getapp` (default) | Full GetApp platform | **Shared** (API, Discovery, Delivery, Offering, Docs) + Dashboard, Deploy, Upload, Project Management, SBOM Generator, Agent Watch |
| `getmap` | Specialized mapping application | **Shared** + GetMap Node, Dashboard GetMap |
| `both` | Both platforms simultaneously | Everything from both modes |

```yaml
deploymentMode: getapp   # or "getmap" or "both"
```

**Optional, gated behind their own `enabled` flag** (not on by default, regardless of mode):
Agent Watch (`agentWatch.enabled`, GetApp mode only) and Dashboard GetMap
(`dashboardGetmap.enabled`, GetMap mode only).

### 3. Key global settings

```bash
cp values.yaml values-prod.yaml
```

| Parameter | Description | Default |
|---|---|---|
| `routeMainUrl` | Base domain for all services | `apps.getapp.sh` |
| `isOpenShift` | Switch ingress to OpenShift `Route` objects | `false` |
| `repository` | Container image repository | `harbor.getapp.sh/getapp-dev/` |
| `getappRelease` | GetApp release version | `1.4.9-develop` |
| `replicaCount` | Default replica count for microservices | `1` |
| `nameSpace` | **Deprecated** — namespace is auto-derived from `--namespace` | `getapp-global` |

```yaml
# Minimum changes for a new environment
routeMainUrl: apps.example.com
deploymentMode: getapp
getappRelease: 1.4.32
tag:
  api: 1.4.88-z-1.0.2
  delivery: 1.4.20-maalog.1
  # ...one tag per service

# Change every default password before production
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
config:
  jwtSecret: "STRONG_RANDOM_JWT_SECRET"
  deviceSecret: "STRONG_RANDOM_DEVICE_SECRET"
dashboard:
  nextauthSecret: "STRONG_RANDOM_NEXTAUTH_SECRET"
```

### 4. Infrastructure: bundled vs. external

By default, the chart deploys PostgreSQL, Kafka, MinIO, and Keycloak as in-cluster pods —
**for production, disable the bundled services and point to your own:**

| Service | Bundled default | Disable with |
|---|---|---|
| PostgreSQL | `postgres` pod, `16.4-alpine`, 10Gi PVC | `postgres.enabled: false` + `host`/`port`/`database`/`user`/`password` |
| Kafka | `kafka` pod, `3.8.1`, 10Gi PVC | `kafka.enabled: false` + `host`/`port` (or `brokers` for multiple) |
| MinIO (S3) | `minio` pod, 10Gi PVC | `minio.enabled: false` + `host`/`port`/`secret.rootUser`/`secret.rootPassword`/`endpoint` |
| Keycloak | `keycloak` pod, `26.4.0`, 1Gi PVC | `keycloak.enabled: false` + `hostname`/`host`/`port`/`admin`/`realm`/`clientId` |

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
  # brokers: "kafka-1:9092,kafka-2:9092,kafka-3:9092"   # multiple brokers

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
  admin:
    username: admin
    password: admin_password
  realm: production-realm
  clientId: getapp-prod
  secretKey: "production-secret-key"
  cookieKey: "PROD_JWT"
```

### 5. Horizontal Pod Autoscaler (HPA)

Disabled by default (global switch `hpa.enabled`), configurable **per service**:

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

Available per-service keys: `hpa.api`, `hpa.delivery`, `hpa.discovery`, `hpa.offering`,
`hpa.deploy` (GetApp only), `hpa.upload` (GetApp only), `hpa.projectManagement` (GetApp only),
`hpa.sbomGenerator` (GetApp only), `hpa.getmap` (GetMap only). Requires `metrics-server` in
the cluster; HPA only applies to services actually deployed under the current
`deploymentMode`.

### 6. OpenShift

```yaml
isOpenShift: true
```

Switches ingress resources to OpenShift `Route` objects and enables the matching security
context constraints.

### 7. Air-gapped environments

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
      client.pem: |
        -----BEGIN CERTIFICATE-----
        ...
  postgresKeys:
    configMapName: postgres-keys
    mountPath: /postgres-keys
    files:
      client.crt: |
        -----BEGIN CERTIFICATE-----
        ...

caCert:
  certificate: |
    -----BEGIN CERTIFICATE-----
    ... (your root CA) ...
```

For mirroring images into your own registry instead of pulling from `harbor.getapp.sh`, see
[Low Mode §5.1](./low-mode#51-optional-use-a-private--air-gapped-image-registry).

### 8. Deployment scenarios

```yaml
# values-getapp-dev.yaml — GetApp development environment
deploymentMode: getapp
routeMainUrl: dev.getapp.sh
agentWatch:
  enabled: true
hpa:
  api:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
postgres:
  enabled: true
kafka:
  enabled: true
minio:
  enabled: true
keycloak:
  enabled: true
```

```yaml
# values-getmap-prod.yaml — GetMap production, external infra
deploymentMode: getmap
routeMainUrl: prod.getapp.sh
dashboardGetmap:
  enabled: true
hpa:
  api:
    enabled: true
    minReplicas: 3
    maxReplicas: 20
  getmap:
    enabled: true
    minReplicas: 2
    maxReplicas: 15
postgres:
  enabled: false
  host: prod-postgres.internal
  password: ${POSTGRES_PASSWORD}
kafka:
  enabled: false
  host: prod-kafka.internal
minio:
  enabled: false
  host: s3.amazonaws.com
  secret:
    rootUser: ${AWS_ACCESS_KEY}
    rootPassword: ${AWS_SECRET_KEY}
keycloak:
  enabled: false
  hostname: "auth.company.com"
```

### 9. Install, upgrade, rollback

```bash
# First-time install
helm install getapp ./helm-chart \
  --namespace getapp-prod \
  --values values-prod.yaml \
  --create-namespace

# Upgrade (rolling update)
helm upgrade getapp ./helm-chart \
  --namespace getapp-prod \
  --values values-prod.yaml \
  --wait --timeout 10m

# Rollback — revisionHistoryLimit defaults to 3
helm history getapp -n getapp-prod
helm rollback getapp -n getapp-prod          # previous revision
helm rollback getapp 2 -n getapp-prod        # specific revision

# Uninstall
helm uninstall getapp --namespace getapp-prod
kubectl delete namespace getapp-prod   # optional
```

### 10. Verify the deployment

```bash
kubectl get pods -n getapp-prod
kubectl rollout status deployment/api -n getapp-prod
kubectl get ingress -n getapp-prod
kubectl logs -n getapp-prod -l app=api --tail=100
```

### 11. Accessing services

URL pattern: `https://<service>-<namespace>.<routeMainUrl>`.

| Service | Availability | URL |
|---|---|---|
| API Gateway / Swagger | All modes | `api-{ns}.{domain}` / `api-{ns}.{domain}/docs/` |
| Documentation | All modes | `docs-{ns}.{domain}` |
| Dashboard | `getapp` / `both` | `dashboard-{ns}.{domain}` |
| Agent Watch | `getapp` / `both`, if enabled | `agent-watch-{ns}.{domain}` |
| GetMap Node | `getmap` / `both` | via API Gateway |
| Dashboard GetMap | `getmap` / `both`, if enabled | `dashboard-getmap-{ns}.{domain}` |
| Keycloak | if bundled | `keycloak-{ns}.{domain}` |
| MinIO console / API | if bundled | `minio-{ns}.{domain}` / `minio-api-{ns}.{domain}` |

`helm status getapp -n {namespace}` lists every access URL and credential for the specific
deployment.

---

## Part 2 — ArgoCD GitOps Deployment

ArgoCD watches a Git repository and continuously reconciles the cluster to match the declared
state. This is the recommended approach for production environments.

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

```
helm-chart-values-files/
├── values-prod.yaml
├── values-staging.yaml
└── values-np-test.yaml
```

Commit and push any values changes — ArgoCD detects the change and reconciles.

### Step 2: Create an ArgoCD Application

**Option A — single-source (chart + values in the same repo):**

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

**Option B — multi-source (ArgoCD 2.6+, chart and values in separate repos):**

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

```bash
kubectl apply -f argocd-app-getapp-prod.yaml
```

### Step 3: Add Repository Credentials to ArgoCD

```bash
# HTTPS
argocd repo add https://github.com/your-org/helm-chart-values-files.git \
  --username <user> --password <token>

# SSH
argocd repo add git@github.com:your-org/helm-chart-values-files.git \
  --ssh-private-key-path ~/.ssh/id_rsa
```

### Step 4: Trigger a Sync

```bash
argocd app sync getapp-prod
# or: ArgoCD dashboard → getapp-prod → SYNC
```

### Step 5: Manage Image Versions

```yaml
# values-prod.yaml
tag:
  api: 1.4.90-main
```

Commit and push — ArgoCD detects the diff and rolls the update automatically. To bump
everything to a new GetApp release, set `getappRelease` plus every `tag.*` at once.

### Step 6: Monitor Sync Status

```bash
argocd app get getapp-prod
argocd app logs getapp-prod
argocd app resources getapp-prod
```

### Step 7: Rollback via ArgoCD

Rollback restores a previous **Git revision**, not a Helm revision:

```bash
argocd app history getapp-prod
argocd app rollback getapp-prod <REVISION_ID>
```

Revert the commit in the values repository to make it permanent.

---

## HashiCorp Vault for Secure Credentials

Enable Vault to avoid storing Git credentials (SSH keys, HTTPS passwords) in plain text in the
database:

```yaml
vault:
  enabled: true
  host: vault
  port: 8200
  devRootToken: "CHANGE_THIS_IN_PRODUCTION"
  mountPath: "getapp-secrets"
```

:::warning
The bundled Vault runs in **dev mode** — all secrets are stored in memory and lost on pod
restart. For production, replace it with a separately managed, production-grade Vault instance
using a persistent storage backend.
:::

See [GitOps](../gitops-section/gitops.md#secure-credential-storage-with-vault) for the full Vault policy and
environment variable reference.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Ingress Layer                         │
│  (nginx/traefik) - TLS termination & routing                │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│   Dashboard    │   │      API        │   │   Keycloak     │
│   (Frontend)   │   │  (Gateway)      │   │     (Auth)     │
└────────────────┘   └─────────────────┘   └────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│   Discovery    │   │   Delivery      │   │   Offering     │
│ (Microservice) │   │ (Microservice)  │   │ (Microservice) │
└────────────────┘   └─────────────────┘   └────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│   PostgreSQL   │   │     Kafka       │   │     MinIO      │
│   (Database)   │   │  (Messaging)    │   │   (Storage)    │
└────────────────┘   └─────────────────┘   └────────────────┘
```

---

## Security Considerations

**Production checklist:**

- [ ] Change all default passwords in `values.yaml`
- [ ] Use external secret management (Sealed Secrets, HashiCorp Vault)
- [ ] Enable TLS for all services
- [ ] Configure proper RBAC policies
- [ ] Set resource limits for all pods
- [ ] Enable network policies
- [ ] Configure backup strategies for databases
- [ ] Use a private container registry
- [ ] Enable pod security policies
- [ ] Configure monitoring and alerting

**Managing secrets** — three options, in increasing order of rigor: plain Kubernetes Secrets
(`kubectl create secret generic getapp-secrets --from-literal=... -n getapp-prod`), external
secret management (Vault / AWS Secrets Manager / Azure Key Vault / Sealed Secrets), or the Helm
Secrets plugin (`helm secrets install getapp getapp/getapp -f secrets.yaml`).

---

## Troubleshooting

```bash
kubectl get pods -n getapp-prod
kubectl describe pod <pod-name> -n getapp-prod
kubectl logs <pod-name> -n getapp-prod
kubectl get svc -n getapp-prod
kubectl get ingress -n getapp-prod
```

| Symptom | Likely cause | Fix |
|---|---|---|
| Pods stuck in `ImagePullBackOff` | Registry credentials missing | Add `imagePullSecrets` or authenticate `harbor.getapp.sh` |
| Keycloak not ready | Slow startup on first boot | Increase `initialDelaySeconds` in `keycloak.livenessProbe` |
| API returns 502 | Ingress buffer too small | Default sets `proxy-buffer-size: 64k` — review ingress annotations |
| ArgoCD shows `OutOfSync` forever | Values file has a merge conflict or invalid YAML | Run `helm template` locally and check for errors |
| Kafka connection refused | `kafka.host` set to `kafka` instead of `kafka-service` | Use `kafka-service` (the chart's internal service name) |
| MinIO upload fails with 413 | `proxyBodySize` too small | Increase `minio.ingress.proxyBodySize` |
| Database connection issues | PostgreSQL not running, or bad connection string | `kubectl get pods -l app=postgres`; check the configmap; `kubectl exec -it <api-pod> -- nc -zv postgres 5432` |
| Ingress not working | Controller missing, or DNS not pointed at it | `kubectl get pods -n ingress-nginx`; `kubectl describe ingress`; verify DNS |

## See also

- [Low Mode](./low-mode) — hardware sizing, both profiles, and a full k3s install walkthrough
- [Cosign](../security/cosign) — artifact signing keys, also delivered via this chart
- [GitOps](../gitops-section/gitops.md)
