# Roles Reference and Scenarios

**Last Updated:** February 18, 2026

[← Back to Overview](./roles-and-permissions.md)

---

This document provides a complete reference of all available roles and real-world usage scenarios.

## Table of Contents

**Part 1: Roles Reference**
1. [Composite Roles](#composite-roles)
2. [Project Management Roles](#project-management-roles)
3. [Release Management Roles](#release-management-roles)
4. [Artifact Management Roles](#artifact-management-roles)
5. [Deployment Roles](#deployment-roles)
6. [Discovery & Device Roles](#discovery--device-roles)
7. [Policies & Restrictions Roles](#policies--restrictions-roles)
8. [User Management Roles](#user-management-roles)
9. [Analytics & Monitoring Roles](#analytics--monitoring-roles)
10. [Configuration Roles](#configuration-roles)
11. [Special Roles](#special-roles)

**Part 2: Common Scenarios**
12. [User Onboarding Scenarios](#user-onboarding-scenarios)
13. [Custom Role Scenarios](#custom-role-scenarios)
14. [Testing Scenarios](#testing-scenarios)
15. [Emergency Access Scenarios](#emergency-access-scenarios)
16. [Troubleshooting](#troubleshooting)

---

# Part 1: Roles Reference

## Composite Roles

Composite roles bundle multiple individual roles together for easier management.

| Role | Description | Included Roles |
|------|-------------|----------------|
| `contributor` | Can contribute to projects - create releases, upload artifacts, manage projects, and define policies | 24 roles |
| `system-administrator` | Can deploy applications, manage devices, configure the system, and manage all policies and restrictions | 31 roles |

**See Overview** for detailed breakdown of what each composite role includes.

---

## Project Management Roles

Control access to project-related operations.

| Role | Description | Typical Use |
|------|-------------|-------------|
| `create-project` | Create new projects | Developers, project managers |
| `view-project` | View project details | All team members, stakeholders |
| `update-project` | Modify existing projects | Project owners, administrators |
| `delete-project` | Delete projects | Project owners, administrators |
| `list-projects` | Browse all projects | All team members, stakeholders |

### Common Combinations

**Project Owner**: `create-project`, `view-project`, `update-project`, `delete-project`, `list-projects`

**Project Viewer**: `view-project`, `list-projects`

---

## Release Management Roles

Control access to release-related operations.

| Role | Description | Typical Use |
|------|-------------|-------------|
| `create-release` | Create new releases | Developers, release managers |
| `view-release` | View release details | All team members, stakeholders |
| `update-release` | Modify existing releases | Release managers, developers |
| `edit-imported-release` | Edit imported releases that are in released status | Release managers, administrators |
| `delete-release` | Delete releases for a project | Release managers, administrators |
| `push-release` | Push/deploy releases to devices | DevOps engineers, administrators |
| `publish-release` | Publish releases (make them available) | Release managers, QA leads |
| `list-releases` | Browse all releases | All team members, stakeholders |

> **Important Note**: Release management roles only apply to projects where the user is a member. Even if a user has the relevant roles (e.g., `create-release`, `update-release`), they will not be able to perform these actions on projects they are not a member of. Project membership is required in addition to having the appropriate role.

### Common Combinations

**Release Manager**: `create-release`, `view-release`, `update-release`, `publish-release`, `list-releases`

**Release Viewer**: `view-release`, `list-releases`

**Deployer**: `view-release`, `push-release`

---

## Artifact Management Roles

Control access to artifact upload, download, and management.

| Role | Description | Typical Use |
|------|-------------|-------------|
| `upload-artifact` | Upload artifacts to releases | Developers, build systems |
| `download-artifact` | Download artifacts from releases | Developers, deployment systems |
| `delete-artifact` | Delete artifacts | Release managers, administrators |
| `view-artifact` | View artifact details and metadata | All team members, stakeholders |
| `list-artifacts` | Browse all artifacts | All team members, stakeholders |

### Common Combinations

**Artifact Contributor**: `upload-artifact`, `download-artifact`, `view-artifact`, `list-artifacts`

**Artifact Viewer**: `view-artifact`, `download-artifact`, `list-artifacts`

**Artifact Manager**: All artifact roles

---

## Deployment Roles

Control access to deploying releases to different environments.

| Role | Description | Typical Use |
|------|-------------|-------------|
| `deploy-dev` | Deploy to development environment | Developers, DevOps |
| `deploy-staging` | Deploy to staging environment | QA engineers, DevOps |
| `deploy-production` | Deploy to production environment | Senior DevOps, administrators |

### Security Best Practice

🔒 **Separate deployment roles by environment:**
- Give developers `deploy-dev` only
- Give QA engineers `deploy-staging`
- Restrict `deploy-production` to senior staff only

---

## Discovery & Device Roles

Control access to discovery services, device offerings, and device management.

| Role | Description | Typical Use |
|------|-------------|-------------|
| `view-discovery` | View discovery services and discovered devices | Contributors, administrators |
| `manage-discovery` | Create, update, and delete discovery services | System administrators |
| `view-offering` | View device type offerings | Contributors, administrators |
| `create-offering` | Create new device offerings | System administrators |
| `update-offering` | Update existing offerings | System administrators |
| `delete-offering` | Delete offerings | System administrators |
| `view-device` | View device information | All team members |
| `manage-devices` | Create, update, and delete devices | System administrators |
| `link-project-device-type` | Link projects to device types | System administrators |

### Common Combinations

**Discovery Viewer**: `view-discovery`, `view-offering`, `view-device`

**Offering Manager**: `view-offering`, `create-offering`, `update-offering`, `delete-offering`

**Device Administrator**: `view-device`, `manage-devices`, `link-project-device-type`

---

## Policies & Restrictions Roles

Control access to policies (release-associated rules) and restrictions (device-associated rules).

### Policies (Release Rules)

Policies are rules associated with releases that define how they can be deployed.

| Role | Description | Typical Use |
|------|-------------|-------------|
| `create-policy` | Create new deployment policies | Contributors, release managers |
| `view-policy` | View policy details | All team members |
| `update-policy` | Modify existing policies | Contributors, release managers |
| `delete-policy` | Delete policies | Contributors, release managers |
| `list-policies` | Browse all policies | All team members |

### Restrictions (Device Rules)

Restrictions are rules associated with devices that control what can be deployed to them.

| Role | Description | Typical Use |
|------|-------------|-------------|
| `create-restriction` | Create new device restrictions | System administrators |
| `view-restriction` | View restriction details | System administrators |
| `update-restriction` | Modify existing restrictions | System administrators |
| `delete-restriction` | Delete restrictions | System administrators |
| `list-restrictions` | Browse all restrictions | System administrators |

### Key Difference: Policies vs. Restrictions

| Aspect | Policies | Restrictions |
|--------|----------|--------------|
| **Associated with** | Releases | Devices |
| **Who manages** | Contributors, release managers | System administrators only |
| **Purpose** | Define release deployment rules | Define device deployment constraints |
| **Examples** | "This release can only go to dev environments" | "This device can download release only when batrery is above 20 percent" |
| **Included in Contributor role** | ✅ Yes | ❌ No |
| **Included in System Admin role** | ✅ Yes | ✅ Yes |

---

## User Management Roles

Control access to user-related operations.

| Role | Description | Typical Use |
|------|-------------|-------------|
| `view-user` | View user information | Contributors, administrators |
| `manage-users` | Create, update, and delete users | System administrators |

**Note**: User management typically happens in Keycloak, not in the GetApp UI. These roles control API access to user information.

---

## Analytics & Monitoring Roles

Control access to analytics, logs, and metrics.

| Role | Description | Typical Use |
|------|-------------|-------------|
| `view-analytics` | View analytics and reports | Team leads, stakeholders, administrators |
| `view-logs` | View system logs for debugging | Developers, DevOps, administrators |
| `view-metrics` | View system performance metrics | DevOps, administrators |

### Common Combinations

**Operations Viewer**: `view-logs`, `view-metrics`

**Business Analyst**: `view-analytics`

**Full Monitoring**: All three roles

---

## Configuration Roles

Control access to system configuration.

| Role | Description | Typical Use |
|------|-------------|-------------|
| `manage-config` | Modify system configuration settings | System administrators |
| `view-config` | View system configuration settings | Contributors, administrators |

**Security Note**: `manage-config` should be restricted to trusted administrators only, as it can affect system behavior.

---

## Special Roles

| Role | Description |
|------|-------------|
| `permissions-enabled` | Activates permission checking for specific users when `ENABLE_PERMISSIONS=false` globally |

**See Overview** for detailed explanation of how this role works.

---

# Part 2: Common Scenarios

## User Onboarding Scenarios

### Scenario 1: Onboarding a New Developer

**Goal**: Give Sarah access to work on projects

**Background**: Sarah is a new frontend developer joining the team.

**Steps**:
1. Create Sarah's user account in Keycloak (or use SSO/LDAP integration)
2. Go to **Users** → Find Sarah → **Groups** tab
3. Click **"Join Group"** → Select **"Contributors"**
4. Click **"Join"**

**Result**: Sarah can now:
- ✅ Create and manage projects
- ✅ Upload and download artifacts
- ✅ Create and publish releases
- ✅ Manage policies (release rules)
- ❌ Cannot deploy to devices
- ❌ Cannot manage system configuration

**Time to complete**: 2 minutes

---

### Scenario 2: Promoting to DevOps Engineer

**Goal**: Give John deployment and system management permissions

**Background**: John has been a developer for 6 months and is now taking on DevOps responsibilities.

**Steps**:
1. Go to **Users** → Find John → **Groups** tab
2. Click **"Join Group"** → Select **"System Administrators"**
3. Click **"Join"**

**Result**: John can now:
- ✅ Everything he could do as a contributor
- ✅ Deploy to dev, staging, and production
- ✅ Manage discovery services and devices
- ✅ Manage restrictions (device rules)
- ✅ Manage system configuration

**Note**: If John should keep both roles explicitly, leave him in both "Contributors" and "System Administrators" groups.

**Time to complete**: 1 minute

---

### Scenario 3: Creating a Read-Only User

**Goal**: Give a stakeholder read-only access to monitor progress

**Background**: Your product owner wants to view projects and releases but shouldn't make changes.

**Option A: Quick Method**

Assign these individual roles:
- `view-project`, `list-projects`
- `view-release`, `list-releases`
- `view-artifact`, `list-artifacts`
- `view-analytics`

**Option B: Better Method (Create a Viewer Role)**

1. Create a composite role called `viewer` (see [Setup and Management Guide](./roles-setup-management.md#creating-custom-composite-roles))
2. Include: `view-project`, `list-projects`, `view-release`, `list-releases`, `view-artifact`, `list-artifacts`, `view-offering`, `view-analytics`
3. Create a "Viewers" group with this role
4. Add the stakeholder to the group

**Result**: Stakeholder can:
- ✅ View all projects, releases, and artifacts
- ✅ View analytics
- ❌ Cannot create, update, or delete anything

---

## Custom Role Scenarios

### Scenario 4: Release Manager Role

**Goal**: Create a role for people who manage releases but don't create projects

**Background**: You have team members who coordinate releases but aren't developers.

**Solution**: Create a `release-manager` composite role with:
- Project viewing: `view-project`, `list-projects`
- Release management: `create-release`, `view-release`, `update-release`, `publish-release`, `list-releases`
- Artifact viewing: `view-artifact`, `download-artifact`, `list-artifacts`
- Policy management: `create-policy`, `view-policy`, `update-policy`, `list-policies`
- Analytics: `view-analytics`

**See**: [Setup and Management Guide](./roles-setup-management.md#example-custom-composite-roles) for implementation details.

---

### Scenario 5: Artifact-Only Access for Build Systems

**Goal**: Give a CI/CD pipeline access to upload artifacts only

**Background**: Your automated build system needs to upload artifacts but shouldn't have other permissions.

**Steps**:
1. Create a service account or user for the build system
2. Assign only these roles:
   - `view-project`
   - `view-release`
   - `upload-artifact`
   - `view-artifact`

**Result**: Build system can:
- ✅ Find the project
- ✅ Find the release
- ✅ Upload artifacts
- ❌ Cannot create projects or releases
- ❌ Cannot delete anything
- ❌ Cannot access other system features

**Security Note**: Use a service account with minimal permissions for automated systems.

---

## Testing Scenarios

### Scenario 6: Testing Permissions with One User

**Goal**: Test permission enforcement before rolling out to everyone

**Background**: You want to verify the permissions system works correctly before mass deployment.

**Steps**:
1. Keep `ENABLE_PERMISSIONS=false` (global disable)
2. Create or select a test user in Keycloak
3. Assign the `permissions-enabled` role to the test user
4. Assign appropriate roles (e.g., add to "Contributors" group)
5. Test with the test user account:
   - Try accessing features they should access ✅
   - Try accessing features they shouldn't access (should be blocked) ❌
6. If everything works:
   - Option A: Set `ENABLE_PERMISSIONS=true` globally
   - Option B: Add `permissions-enabled` to more users gradually

**Result**: Only the test user has permission checking active. Other users can access everything normally.

---

### Scenario 7: Gradual Rollout Plan

**Goal**: Enable permissions for teams one at a time

**Week 1**: Test with IT team
- Add `permissions-enabled` to IT staff
- Monitor for issues
- Adjust roles as needed

**Week 2**: Enable for development team
- Add `permissions-enabled` to developers
- Monitor for issues
- Provide support

**Week 3**: Enable for remaining users
- Option A: Set `ENABLE_PERMISSIONS=true` globally
- Option B: Continue adding `permissions-enabled` to remaining users

**Week 4**: Full enforcement
- Set `ENABLE_PERMISSIONS=true`
- Remove individual `permissions-enabled` roles (no longer needed)
- Monitor and support

---

## Emergency Access Scenarios

### Scenario 8: Emergency Access Needed

**Goal**: Give someone temporary full system access immediately

**Background**: A critical issue requires someone to access parts of the system they normally can't.

**Quick Solution (Temporary)**:
1. Go to **Users** → Find the user → **Groups** tab
2. Add them to **"System Administrators"** group
3. They now have full access immediately (on next login/token refresh)

**After the emergency**:
1. Remove them from "System Administrators" group
2. They return to their normal permissions

**Time to complete**: 1 minute

---

### Scenario 9: Locked Out Admin Recovery

**Goal**: Recover from accidentally removing all admin access

**Background**: Someone accidentally removed all administrators from the "System Administrators" group.

**Solution**:
1. **Access Keycloak directly**:
   - Log into Keycloak admin console with Keycloak admin credentials
   - This bypasses GetApp permissions

2. **Re-add at least one user to System Administrators group**:
   - Go to **Groups** → **System Administrators**
   - Add yourself or another trusted user

3. **Verify**:
   - Log into GetApp with the restored admin
   - Confirm full access is restored

4. **Prevent future issues**:
   - Document at least 2 users who should always have admin access
   - Keep Keycloak admin credentials in a secure location

---

## Troubleshooting

### Issue 1: Permissions Aren't Being Checked

**Symptoms**: Users can access everything regardless of their roles

**Possible Causes & Solutions**:

1. **Global permissions disabled**:
   - Check: `ENABLE_PERMISSIONS` environment variable
   - Solution: Set `ENABLE_PERMISSIONS=true` in `.env` file and restart API service

2. **User doesn't have `permissions-enabled` role**:
   - Check: User's roles in Keycloak
   - Solution: Assign `permissions-enabled` role OR enable global permissions

3. **Stale authentication token**:
   - Solution: Have the user log out and log back in

---

### Issue 2: User Can't Access Something They Should

**Symptoms**: User gets "Forbidden" or "Unauthorized" errors

**Debugging Steps**:

1. **Check group membership**:
   - Keycloak → **Users** → Find user → **Groups** tab
   - Verify they're in the correct group

2. **Check role assignments**:
   - **Role Mappings** tab
   - Verify they have the required role (check both direct and group-assigned roles)

3. **Check if role exists**:
   - Keycloak → **Clients** → **api** → **Roles**
   - Verify the required role exists

4. **Check composite role configuration**:
   - If using composite roles, verify they include the required child role

5. **Refresh user's token**:
   - Have user log out and log back in

6. **Check API logs**:
   - Look for permission check messages showing required vs. actual roles

---

### Issue 3: Roles Aren't Appearing in Keycloak

**Symptoms**: After starting the API service, roles don't appear

**Solutions**:
1. Check `KEYCLOAK_AUTO_SYNC_ROLES` is `true` (or not set)
2. Verify `KEYCLOAK_ADMIN_USER` and `KEYCLOAK_ADMIN_PASSWORD` are correct
3. Check `KEYCLOAK_URL` and `KEYCLOAK_REALM` are correct
4. Verify network connectivity to Keycloak
5. Check API service logs for synchronization errors

---

### Issue 4: User Has Role But Still Can't Access

**Symptoms**: User has the correct role in Keycloak but still gets permission errors

**Solutions**:
1. **Clear cache and refresh token**:
   - Have user log out completely
   - Clear browser cache
   - Log back in

2. **Verify token contents**:
   - Use [jwt.io](https://jwt.io) to decode the access token
   - Check that role appears in `resource_access.api.roles` array

3. **Verify role is client role**:
   - Role must be under `api` client, not realm roles

4. **Check permission enforcement is enabled**:
   - Verify `ENABLE_PERMISSIONS=true` OR user has `permissions-enabled` role

5.**Veify that user is a member of a project**
   - If the user tries to perfom an action that is releated to a project, he must be a memebr of this project

---

### Issue 5: Changes Not Taking Effect

**Symptoms**: Role or group changes in Keycloak don't work

**Root Cause**: User's authentication token is cached

**Solution**:
1. Have user log out of GetApp
2. Have user log back in
3. New token will include updated roles

**Alternative**: Wait for token expiration (usually 5-60 minutes)

---

## Debugging Tools

### Decode User Tokens

To see exactly what roles a user has:

1. Get the user's access token (from browser dev tools)
2. Go to [jwt.io](https://jwt.io)
3. Paste the token
4. Look at `resource_access.api.roles` array

This shows the exact roles in the user's current token.

### Check Application Logs

The API logs show permission checks:

```
Checking permission for user 'sarah@example.com'
Required role: 'create-project'
User roles: ['view-project', 'create-project', 'list-projects']
Permission: GRANTED
```

### Review Keycloak Events

Keycloak tracks:
- User logins
- Role assignments
- Group membership changes

Access in: Keycloak Admin Console → Events

---

## Quick Reference Tables

### By User Type

| User Type | Suggested Role | Group |
|-----------|---------------|-------|
| Developer | `contributor` | Contributors |
| DevOps Engineer | `system-administrator` | System Administrators |
| Release Manager | Custom `release-manager` | Release Managers (custom) |
| Stakeholder/Viewer | Custom `viewer` | Viewers (custom) |

### Common Permission Combinations

| Need to... | Required Roles |
|------------|----------------|
| Work on projects | `contributor` composite role |
| Deploy to devices | `system-administrator` composite role |
| View everything | All `view-*` and `list-*` roles |
| Manage releases only | Custom role with release + artifact viewing |
| Build system uploads | `view-project`, `view-release`, `upload-artifact` |

---

## Need More Help?

- Review the [Overview](./roles-and-permissions.md) for basic concepts
- Check the [Setup and Management Guide](./roles-setup-management.md) for configuration and user management
- Check application logs for detailed information
- Review Keycloak admin console for user and role verification

---

**Found an issue?** Check the troubleshooting section above or review your environment configuration in the [Setup and Management Guide](./roles-setup-management.md).
