---
id: low-mode
title: Low Mode
sidebar_label: Low Mode
sidebar_position: 2
---

# GetApp — Hardware & Cluster Requirements

> **Status:** Revision 2.
> Low-mode figures are derived from **live measurements** of the reference k3s
> deployment (single node, 8 vCPU / 15 GiB). Full-mode figures are now grounded
> in **live measurements from a production AKS cluster** (see [Appendix A](#appendix-a--live-measurements)),
> cross-checked against the chart's configured resource requests.

This document defines the hardware and cluster prerequisites needed **before**
the GetApp Helm chart can be installed, plus a step-by-step install guide.

Two profiles are covered:

| Profile | Deploy mode | Typical target | Services |
| --- | --- | --- | --- |
| **Full system** | `deploymentMode: getapp` (+ optional monitoring) | Multi-node Kubernetes | All microservices + Kafka + monitoring stack |
| **Low mode** | `values-lowmode.yaml` | Single-node k3s | Core microservices only, SOCKET comms, no Kafka/monitoring |

See [Helm Deployment & ArgoCD](./helm-deployment) for the full-mode chart reference this
document sizes against.

---

## 1. Low mode requirements (single-node k3s)

> Live resource measurements from the reference k3s deployment are in
> [Appendix A](#appendix-a--live-measurements).

### 1.1 Recommended sizing — low mode

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | 4 vCPU | 8 vCPU |
| Memory | 8 GiB | 16 GiB |
| Storage (PVC + OS + container images) | 60 GiB | 100 GiB |

Notes:
- MinIO artifact storage grows with uploaded artifacts — size the MinIO PVC
  (`minio.persistence.size`, default 10 Gi) for your real artifact volume.
- Container image layers on a single node typically consume 10–20 GiB.
- Keycloak's memory request must not exceed its limit; `values-lowmode.yaml`
  already aligns the request to 1 Gi for k3s.

---

## 2. Full system requirements (multi-node Kubernetes)

Full mode adds Kafka and (optionally) the monitoring stack, which are the main
drivers of the higher footprint.

> Live resource measurements from a production AKS cluster are in
> [Appendix A](#appendix-a--live-measurements).

### 2.1 Recommended sizing — full system

Steady-state measured usage for the microservices + Kafka + Postgres (external
S3/Keycloak, no monitoring) is ~2.2 vCPU / ~9.2 GiB. The recommendations below
add headroom for spikes, in-cluster MinIO/Keycloak, and the optional monitoring
stack:

| Resource | Minimum (external S3/Keycloak, no monitoring) | Recommended (all in-cluster + monitoring) |
| --- | --- | --- |
| CPU | 4 vCPU | 12–16 vCPU |
| Memory | 12 GiB | 32 GiB |
| Storage (PVCs) | ~10 GiB (Postgres only) | ~80–120 GiB |
| Nodes | 1 (large) | 3+ (HA) |

> The production reference cluster runs comfortably with GetApp consuming
> ~2.2 vCPU / ~9.2 GiB because it **externalizes S3 and Keycloak** and skips the
> monitoring stack. Enabling in-cluster MinIO + Keycloak adds ~0.6–1 vCPU and
> ~1–1.5 GiB; the monitoring stack (Elasticsearch/Kibana/VictoriaMetrics/Grafana)
> adds ~1 vCPU and ~2.5–4 GiB plus ~25 GiB of PVCs.

PVC subtotal in full mode: Postgres 5 + MinIO 10 + Keycloak 1 + Elasticsearch 10
+ VictoriaMetrics 10 + Grafana 5 (+ pgAdmin 2 if enabled) ≈ **41–43 Gi**, before
accounting for artifact/log/metric growth.

> **Reduce the footprint** by externalizing Postgres, S3 and Keycloak
> (`enabled: false`) and disabling the monitoring stack — this can bring full
> mode close to the low-mode footprint while keeping Kafka.

---

## 3. Cluster prerequisites

These must exist in the cluster **before** running `helm install`.

| Prerequisite | Required for | Why |
| --- | --- | --- |
| **Kubernetes / k3s** | Both | k3s v1.36+ verified for low mode; any conformant Kubernetes for full mode. |
| **NGINX Ingress Controller** | Both | All ingresses use `ingressClassName: nginx` (dashboard, api, Keycloak, MinIO, etc.). |
| **Default StorageClass (RWO)** — Longhorn recommended | Both | PVCs for Postgres, MinIO, Keycloak (and monitoring in full mode). The storage class must honor pod `fsGroup` so stateful pods can write to their volumes — **Longhorn** does this; the k3s built-in `local-path` does **not** set group ownership and can break Keycloak/Postgres/MinIO writes. |
| **cert-manager** + a `ClusterIssuer` named `letsencrypt-prod` | Both (default) | Ingresses are annotated `cert-manager.io/cluster-issuer: letsencrypt-prod` and expect TLS certs to be issued automatically. **Exception:** in `global.enabled: true` mode this annotation is omitted and every ingress instead uses one pre-existing TLS secret (`global.tlsSecretName`) that you must create beforehand. |
| **metrics-server** | Optional (both) | Required only if you enable HPA (`hpa.enabled`) or want `kubectl top`. Not needed for a fixed-replica install. |
| **DNS or `/etc/hosts` entries** | Both | Subdomains resolve to the ingress controller (e.g. `dashboard-<ns>.<routeMainUrl>`). For low mode without cluster DNS, see the release-control repo's `INSTALL.md`. |
| **Private image registry access** | Air-gapped / custom registry | Needed when pulling images from your own registry instead of `harbor.getapp.sh`. See [§5](#5-installation-guide). |

---

## 4. Component inventory

### 4.1 Core GetApp microservices (both profiles)

`api`, `dashboard`, `delivery`, `deploy`, `discovery`, `offering`,
`project-management`, `upload`.

### 4.2 Bundled infrastructure (both profiles, unless externalized)

| Service | Purpose | Persistent storage |
| --- | --- | --- |
| PostgreSQL | Primary database | Yes (PVC) |
| MinIO | S3-compatible object storage | Yes (PVC) |
| Keycloak | SSO / authentication | Yes (PVC) |

> In production you can point the chart at **external** Postgres / S3 / Keycloak
> and set `enabled: false` for each — this reduces in-cluster resource needs.
> See [Helm Deployment §4](./helm-deployment#4-infrastructure-bundled-vs-external).

### 4.3 Full-mode-only services (disabled in low mode)

| Service | Enabled by | Notes |
| --- | --- | --- |
| Kafka | `kafka.enabled` | Inter-service messaging (full mode). Low mode uses SOCKET instead. |
| SBOM generator | `sbomGenerator.enabled` | Software Bill of Materials |
| Elasticsearch + Kibana | `elasticsearch.enabled`, `kibana.enabled` | Log storage & exploration |
| VictoriaMetrics + Grafana | `victoriametrics.enabled`, `grafana.enabled` | Metrics & dashboards |
| Docs, Agent-Watch, Vault, pgAdmin | respective `.enabled` flags | Optional add-ons |

---

## 5. Installation guide

Run all commands from the `helm-chart/` directory. Both modes create the target
namespace (`getapp`) automatically via `--create-namespace`. These commands are
based on the release-control repo's `INSTALL.md`.

### 5.1 (Optional) Use a private / air-gapped image registry

By default the chart pulls images from the public registry defined in
`values.yaml`:

```yaml
repository: harbor.getapp.sh/getapp-dev/
```

If you must use your **own** registry (e.g. air-gapped), do the following
**before** installing:

1. **Update the `repository` value** in `values.yaml` to your registry/project
   prefix (keep the trailing slash), for example:

   ```yaml
   repository: my-registry.example.com/getapp/
   ```

2. **Mirror the images** into your registry. The exact image list and tags are
   in the release-control repo's `getapp-images-list.txt`. For each image,
   pull it, re-tag it to your registry, and push it:

   ```sh
   # Example for one image — repeat for every entry in getapp-images-list.txt
   SRC=harbor.getapp.sh/getapp-dev/api:1.4.148-main
   DST=my-registry.example.com/getapp/api:1.4.148-main
   docker pull  "$SRC"
   docker tag   "$SRC" "$DST"
   docker push  "$DST"
   ```

   For a fully air-gapped host, use the repo's helper scripts to save/load the
   images as tarballs (`load-images.sh` and the related `load-and-deploy.sh` /
   `pull-and-save-images.sh` scripts).

3. **Verify** the image tags in `values.yaml` (`tag.api`, `tag.dashboard`, …)
   match the tags you pushed.

4. If your registry requires authentication, create an `imagePullSecret` in the
   `getapp` namespace and reference it (or configure the nodes' container
   runtime with registry credentials).

### 5.2 Install — regular / full mode

```sh
helm upgrade --install getapp . \
  -f values.yaml \
  --namespace getapp \
  --create-namespace
```

To enable optional services (Kafka is on by default; monitoring is off), set the
relevant `*.enabled: true` flags in `values.yaml` first
(`elasticsearch`, `kibana`, `victoriametrics`, `grafana`, `sbomGenerator`, …).

### 5.3 Install — low mode (k3s)

Layers the low-mode overrides on top of the base values (disables Kafka,
sbom-generator and the monitoring stack; forces SOCKET communication; injects
hostAliases for MinIO/Keycloak):

```sh
helm upgrade --install getapp . \
  -f values.yaml \
  -f values-lowmode.yaml \
  --namespace getapp \
  --create-namespace
```

If the k3s cluster has no DNS server wired in, add the ingress hostnames to the
host's `/etc/hosts` (see the release-control repo's `INSTALL.md` for the exact
entries).

### 5.4 Testing the installation

1. Confirm all pods are `Running`:

   ```sh
   kubectl get pods -n getapp
   ```

   In low mode you should see 11 pods (`api`, `dashboard`, `delivery`, `deploy`,
   `discovery`, `keycloak`, `minio`, `offering`, `postgres`,
   `project-management`, `upload`), all `1/1 Running`.

2. Browse to the dashboard (low mode default):
   `https://dashboard-getapp.apps.getapp.sh`.

3. You will be redirected to the Keycloak login page. Log in with the default
   user `test` / password `123`.

4. After login, create a new project, create a release, and upload an artifact
   to that release. If the upload succeeds, the server is installed correctly.

---

## Appendix A — Live measurements

### B.1 Low mode — reference k3s deployment

Measured on a single k3s node (8 vCPU / ~15 GiB RAM) running the **11 low-mode
pods** (`api`, `dashboard`, `delivery`, `deploy`, `discovery`, `keycloak`,
`minio`, `offering`, `postgres`, `project-management`, `upload`):

| Metric | Observed |
| --- | --- |
| Sum of GetApp pod CPU (idle) | ~23 mCPU |
| Sum of GetApp pod memory (idle) | ~1.5 GiB |
| **Whole node** CPU under light use | ~1.84 vCPU (22%) |
| **Whole node** memory under light use | ~7.2 GiB (47%) — includes OS, k3s, Longhorn, ingress |
| Keycloak (heaviest pod) | ~648 MiB, ~10 mCPU |
| PVCs provisioned | Postgres 5 Gi + MinIO 10 Gi + Keycloak 1 Gi = **16 Gi** |

> The node-level memory figure (~7 GiB) is dominated by the OS, the k3s control
> plane, Longhorn and the NGINX ingress controller — not by the GetApp pods
> themselves (~1.5 GiB). Budget for this platform overhead.

### B.2 Full mode — production AKS cluster

Measured on a production **AKS** cluster running the full stack in the `getapp`
namespace. This deployment uses **external S3 (Azure) and external Keycloak**
(neither runs in-cluster), so only PostgreSQL is a bundled infra pod, and the
monitoring stack (Elasticsearch/Grafana/etc.) is **not** deployed here.

Cluster shape (shared with other workloads):

| Node pool | Count | Per-node CPU | Per-node memory |
| --- | --- | --- | --- |
| `agentpool` (general) | 2 | 8 vCPU | 32 GiB |
| `largememory` | 6 | 4 vCPU | 32 GiB |

Live GetApp namespace usage (`kubectl top pods -n getapp`):

| Pod | CPU | Memory |
| --- | --- | --- |
| kafka-broker | 626m | 3923 Mi |
| postgres | 381m | 2964 Mi |
| dashboard\* | 988m | 977 Mi |
| getmapagent-dev | 8m | 642 Mi |
| api | 56m | 131 Mi |
| upload | 29m | 128 Mi |
| discovery | 31m | 122 Mi |
| getmap-node | 27m | 120 Mi |
| project-management | 21m | 109 Mi |
| delivery | 25m | 105 Mi |
| offering | 24m | 101 Mi |
| deploy | 16m | 72 Mi |
| dashboard-getmap | 0m | 6 Mi |
| **Total** | **~2.23 vCPU** | **~9.2 GiB** |

\* The `dashboard` pod was crash-looping (18,977 restarts) during measurement,
which inflates its CPU/memory — a healthy dashboard uses far less. Investigate
any pod with a high restart count before trusting its numbers.

Key takeaways:
- **Kafka (~3.9 GiB) and PostgreSQL (~3 GiB) dominate memory** — together ~75%
  of the namespace footprint. The stateless microservices are light
  (~20–60 mCPU and ~100–130 MiB each).
- Steady-state usage for the whole stack (with external S3/Keycloak, no
  monitoring) is roughly **2–3 vCPU and ~9–10 GiB**.
- Only PVC in use here is **postgres 5 Gi** (external S3 handles artifacts).
- Storage class is Azure Disk CSI (`disk.csi.azure.com`) — a managed
  RWO class that honors `fsGroup`, so no Longhorn is required on managed
  Kubernetes.
- Prerequisites confirmed present: `ingress-nginx`, `cert-manager`,
  `metrics-server`.

---

## Appendix B — Configured requests/limits in the chart

The table below sums the chart's configured resource **requests/limits** for the
services that set them (used for scheduling headroom, independent of live usage).

| Service | CPU request | Mem request | Mem limit | PVC |
| --- | --- | --- | --- | --- |
| Keycloak | 500m | 2 Gi* | 1 Gi* | 1 Gi |
| MinIO | 125m | 512 Mi | 512 Mi | 10 Gi |
| Elasticsearch | 250m | 1 Gi | 2 Gi | 10 Gi |
| Kibana | 250m | 512 Mi | 1 Gi | — |
| VictoriaMetrics | 250m | 512 Mi | 1 Gi | 10 Gi |
| Grafana | 250m | 256 Mi | 512 Mi | 5 Gi |
| Core microservices (8×) | unset by default† | unset† | unset† | — |
| Kafka | unset by default | — | — | — |

---

## Appendix C — Setting up cert-manager (TLS certificates)

The chart does **not** create a certificate issuer. Every ingress is annotated
`cert-manager.io/cluster-issuer: "letsencrypt-prod"` and expects that issuer to
already exist in the cluster (see [§3 Cluster prerequisites](#3-cluster-prerequisites)).
This appendix documents two ways to satisfy that prerequisite: a **public
Let's Encrypt** issuer (for internet-reachable clusters) and a **local
self-signed CA** (for k3s / air-gapped setups, or when you want to use your own
certificate authority).

> **Which one do I need?**
> - If your hostnames are publicly resolvable and ports 80/443 are reachable from the
>   internet → use **C.2 (Let's Encrypt)**.
> - If you want to use your own certificate authority (e.g. in a k3s cluster or on an air gapped environment ) →
>   use **C.3 (local self-signed CA)**. If you use your own CA, it must be
>   installed (trusted) on the local machine beforehand so browsers/clients
>   trust the issued certificates.

### C.1 Install cert-manager

Install once per cluster, into its own namespace, with CRDs enabled:

```sh
helm repo add jetstack https://charts.jetstack.io --force-update
helm repo update jetstack

helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --set crds.enabled=true \
  --wait --timeout 5m
```

Verify all three pods are `Running`:

```sh
kubectl get pods -n cert-manager
# cert-manager-...            1/1 Running
# cert-manager-cainjector-... 1/1 Running
# cert-manager-webhook-...    1/1 Running
```

### C.2 Option A — public Let's Encrypt issuer

Use this only when the ingress hostnames are publicly reachable. Create a
`ClusterIssuer` named `letsencrypt-prod` (the exact name the chart references)
using the ACME HTTP-01 solver:

```yaml
# letsencrypt-prod-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: you@example.com            # CHANGE to a real contact address
    privateKeySecretRef:
      name: letsencrypt-prod-account-key
    solvers:
      - http01:
          ingress:
            class: nginx
```

```sh
kubectl apply -f letsencrypt-prod-issuer.yaml
```

cert-manager will then automatically issue and renew a real, publicly-trusted
certificate for every ingress — no browser import needed.

### C.3 Option B — local self-signed CA (k3s / offline)

Use this when Let's Encrypt cannot validate your hostnames, or if it's simply
unreachable (for example, in an air-gapped environment). It creates a local
Certificate Authority and wires it to the **same** name the chart references
(`letsencrypt-prod`), so **no chart change is required**. Three resources are
required to create the local Certificate Authority:

1. a self-signed *bootstrap* issuer,
2. a 10-year CA certificate signed by that bootstrap issuer (stored in a Secret),
3. a CA `ClusterIssuer` named `letsencrypt-prod` that signs the per-ingress leaf
   certs from that CA.

Example manifest for all three:

```yaml
# local-ca-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: selfsigned-bootstrap
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: getapp-local-ca
  namespace: cert-manager
spec:
  isCA: true
  commonName: getapp-local-ca
  secretName: getapp-local-ca
  duration: 87600h    # 10 years
  privateKey:
    algorithm: ECDSA
    size: 256
  issuerRef:
    name: selfsigned-bootstrap
    kind: ClusterIssuer
    group: cert-manager.io
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  ca:
    secretName: getapp-local-ca
```

Apply it and wait for the CA to become ready:

```sh
kubectl apply -f local-ca-issuer.yaml
kubectl wait --for=condition=Ready certificate/getapp-local-ca -n cert-manager --timeout=60s
```

### C.4 Verify certificates are issued

The chart's ingresses create `Certificate` objects automatically from their
annotations. Once the issuer exists, they flip from `READY=False` to `True`:

```sh
kubectl get certificate -n getapp
# api-tls             True   api-tls
# dashboard-tls       True   dashboard-tls
# keycloak-tls-cert   True   keycloak-tls-cert
# minio-api-tls       True   minio-api-tls
# minio-console-tls   True   minio-console-tls
```

> If they stay `False`, the issuer name doesn't match. Confirm a `ClusterIssuer`
> named exactly `letsencrypt-prod` exists: `kubectl get clusterissuer`.

### C.5 Trust the local CA in the browser (Option B only)

Leaf certs from a local CA are valid but not trusted by browsers until you
import the CA once. Export it from the cluster:

```sh
kubectl get secret getapp-local-ca -n cert-manager \
  -o jsonpath='{.data.tls\.crt}' | base64 -d > getapp-local-ca.crt
```

Then trust it, either per-browser or system-wide:

- **Firefox:** Settings → Privacy & Security → Certificates → View Certificates →
  Authorities → Import → select `getapp-local-ca.crt` → check *"Trust this CA to
  identify websites"* → OK, then reload.
- **System-wide (Chrome/curl/etc., Debian/Ubuntu):**

  ```sh
  sudo cp getapp-local-ca.crt /usr/local/share/ca-certificates/getapp-local-ca.crt
  sudo update-ca-certificates
  ```

Certificates auto-renew via cert-manager; because the same CA signs the renewed
leaf certs, you only import the CA **once**.

### C.6 Alternative — bypass issuers with a pre-created secret

If you prefer not to run cert-manager at all, deploy with `global.enabled: true`.
In that mode the chart omits the cert-manager annotation and instead points every
ingress at a single pre-existing TLS secret named by `global.tlsSecretName`
(default `getapp-global-tls`), which you must create in the `getapp` namespace
before installing.

## See also

- [Helm Deployment & ArgoCD](./helm-deployment)
- [Docker Compose Deployment](./docker-compose-deployment)
