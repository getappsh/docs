---
id: docker-compose-deployment
title: Docker Compose Deployment (API / Delivery Proxy)
sidebar_label: Docker Compose Deployment
sidebar_position: 3
---

# Docker Compose Deployment

An alternative to [Helm](./helm-deployment) for environments without Kubernetes — the same
full microservice stack, run directly with `docker compose`. Lives in
`getapp-release-control/docker-compose/`.

## Services

`docker-compose.yaml` defines the same microservices as the Helm chart's `getapp` mode: `api`,
`delivery`, `deploy`, `discovery`, `project-management`, `offering`, `upload`, `docs`,
`dashboard`, plus infrastructure (`broker` (Kafka), `pg` (PostgreSQL), `pgadmin`, `keycloak`),
and — when running in `getmap`/`both` mode — `getmap-node`.

## API as the single entry point

Only **`api`** publishes a host port (`3000:3000`). Every other microservice — including
`delivery` — has **no published port**; they're reachable only from other containers over the
internal `getapp` Docker network. `api` is effectively the proxy: it's the one thing exposed
outside the compose network, and it routes requests through to `delivery` and the rest
internally. There's no separate nginx/reverse-proxy container in front of it — if you need
TLS termination or a public domain, put your own reverse proxy in front of the `api` container.

## Configuration

Image tags are pinned per-service in `.env`:

```bash
GETAPP_RELEASE_TAG=1.4.33-getapp-maalot-1.2
API_TAG=1.4.143-main
DELIVERY_TAG=1.4.25-main
DEPLOY_TAG=1.4.11-main
DISCOVERY_TAG=1.4.74-main
# ...one *_TAG per service
```

Runtime environment variables for every service come from `.env.dev` (`env_file:` on each
service) — the same variable names used across the platform elsewhere in these docs.

## Running it

```bash
cd getapp-release-control/docker-compose
docker compose up -d
docker compose ps
```

## See also

- [Helm Deployment & ArgoCD](./helm-deployment) — the Kubernetes/OpenShift path
- [Low Mode](./low-mode)
