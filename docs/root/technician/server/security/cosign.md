---
id: cosign
title: Cosign
sidebar_label: Cosign
sidebar_position: 2
---

# Cosign

Every uploaded artifact is signed on the server and independently re-verified by the agent
before it's trusted — using [Sigstore Cosign](https://github.com/sigstore/cosign),
key-pair mode (no transparency log).

## Server — signing on upload

When an artifact is uploaded, the API server signs it as part of file processing:

```bash
cosign sign-blob --key <private key> --tlog-upload=false --output-signature <sig> -
```

The resulting signature is stored alongside the artifact (its own column, added by a
dedicated migration).

| Variable | What it is |
|---|---|
| `COSIGN_PRIVATE_KEY_PATH` | Path to the private key used to sign uploads |
| `COSIGN_PUBLIC_KEY_PATH` | Path to the public key (also used server-side, for symmetry) |
| `COSIGN_PASSWORD` | Password protecting the private key |

`--tlog-upload=false` — signatures are **not** published to Sigstore's public transparency
log (Rekor). Verification is purely key-pair based.

## Distributing keys (Helm)

The key pair is delivered to the cluster as a ConfigMap, populated from Helm values:

```yaml
cosign:
  privateKey: |
    -----BEGIN ... PRIVATE KEY-----
    ...
  publicKey: |
    -----BEGIN PUBLIC KEY-----
    ...
```

See [Helm Deployment & ArgoCD](../deployment/helm-deployment) for how values files are structured and applied.

## Agent — verification on download

Before accepting a downloaded artifact, the agent independently re-verifies its signature
against the public key (via a Rust Sigstore client, not the `cosign` CLI):

- **Pass** → the artifact is marked validated and the delivery proceeds.
- **Fail** → the delivery removes what it downloaded and retries once more from scratch
  (`state = Prepare`, progress reset); if the second attempt also fails, the delivery is
  marked `Error` with `"Signature Validation failed"`.

The agent reads its public key path from its own config (`cosing_public_key`) — it only ever
needs the **public** key, never the private one.

## Why this matters

The signature check happens on the **device**, independent of transport (HTTPS, a CDN agent
relay, removable media in a disconnected environment) — an artifact that was tampered with
after leaving the server fails validation regardless of how it physically got to the device.

## See also

- [Helm Deployment & ArgoCD](../deployment/helm-deployment)
- [SBOM Generator](./sbom-generator)
