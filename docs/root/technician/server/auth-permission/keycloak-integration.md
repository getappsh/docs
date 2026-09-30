---
id: keycloak-integration
title: Keycloak Permission Edit and Integration
sidebar_label: Keycloak Integration
sidebar_position: 1
---

# Keycloak Permission Edit and Integration

The API server authenticates and authorizes every request through Keycloak — this is the
connection config underneath the [Roles and Permissions](./roles-and-permissions) system.

## Connection configuration

Set via environment variables, read by `KeycloakConfigService` at startup:

| Variable | What it is |
|---|---|
| `AUTH_SERVER_URL` | The Keycloak server's base URL |
| `REALM` | The Keycloak realm GetApp authenticates against |
| `CLIENT_ID` | The OIDC client ID registered for the API |
| `SECRET_KEY` | The client secret (empty string if unset) |
| `COOKIE_KEY` | Key used to sign the session cookie |

## Enforcement mode

Two fixed settings control how Keycloak is actually enforced, independent of the `roles`
composite-role setup:

| Setting | Value | Meaning |
|---|---|---|
| Policy enforcement | `PERMISSIVE` | A request without a token isn't rejected outright — role checks still apply per-route (see [Roles and Permissions](./roles-and-permissions) for how `ENABLE_PERMISSIONS` and `permissions-enabled` layer on top) |
| Token validation | `OFFLINE` | Tokens are validated locally (signature/expiry) rather than round-tripping to Keycloak on every request |

## Roles and groups sync

Composite roles and groups (`user`, `viewer`, `tech`, `contributor`, `system-administrator`)
are created and kept in sync with Keycloak automatically at startup — see
[Roles and Permissions](./roles-and-permissions#how-roles-are-set-up) for the full sync
behavior and the `KEYCLOAK_AUTO_SYNC_ROLES` toggle.

## See also

- [Roles and Permissions](./roles-and-permissions)
- [Roles Setup & Management](./roles-setup-management)
- [Roles Reference and Scenarios](./roles-reference-scenarios)
