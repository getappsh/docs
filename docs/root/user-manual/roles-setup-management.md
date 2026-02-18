# Setup and Management Guide

**Last Updated:** February 18, 2026

[← Back to Overview](./roles-and-permissions.md)

---

This guide covers configuration, user management, and creating custom roles.

## Table of Contents

1. [Environment Configuration](#environment-configuration)
2. [Enabling and Disabling Permissions](#enabling-and-disabling-permissions)
3. [Managing Users and Groups](#managing-users-and-groups)
4. [Assigning Users to Groups](#assigning-users-to-groups)
5. [Creating Custom Composite Roles](#creating-custom-composite-roles)
6. [Troubleshooting Setup Issues](#troubleshooting-setup-issues)

---

## Environment Configuration

The permissions system uses environment variables to control its behavior.

### Required Environment Variables

Add these to your `.env` file:

```bash
# Keycloak Connection
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=getapp
KEYCLOAK_CLIENT_ID=api

# Admin Credentials (for automatic role setup)
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=your-admin-password
```

###Optional Environment Variables

```bash
# Auto-sync roles and groups on startup (default: true)
KEYCLOAK_AUTO_SYNC_ROLES=true

# Enable permission checking globally (default: false)
ENABLE_PERMISSIONS=false
```

### Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `KEYCLOAK_URL` | Yes | - | The web address of your Keycloak server |
| `KEYCLOAK_REALM` | Yes | - | Your Keycloak realm name (usually `getapp`) |
| `KEYCLOAK_CLIENT_ID` | Yes | - | Your application client ID (usually `api`) |
| `KEYCLOAK_ADMIN_USER` | Yes | - | Keycloak admin username for auto-sync |
| `KEYCLOAK_ADMIN_PASSWORD` | Yes | - | Keycloak admin password for auto-sync |
| `KEYCLOAK_AUTO_SYNC_ROLES` | No | `true` | Automatically sync roles and groups on startup |
| `ENABLE_PERMISSIONS` | No | `false` | Enable permission checking for all users |

### Where to Find These Values

- **KEYCLOAK_URL**: The web address where you access Keycloak (e.g., `http://localhost:8080` or `https://auth.yourcompany.com`)
- **KEYCLOAK_REALM**: Found in Keycloak admin console under "Realm Settings"
- **KEYCLOAK_CLIENT_ID**: Found in Keycloak under Clients (the client representing your API)
- **KEYCLOAK_ADMIN_USER**: The username you use to log into the Keycloak admin console
- **KEYCLOAK_ADMIN_PASSWORD**: The password for the admin user

---

## Enabling and Disabling Permissions

By default, permission checking is **disabled**. This means users can access any endpoint without role validation.

### How to Enable Permissions

You have **two options**:

#### Option 1: Enable for Everyone (Global)

Set the environment variable:

```bash
ENABLE_PERMISSIONS=true
```

**Effect**: All users must have the required roles to access protected endpoints.

**When to use**:
- In production environments
- When you're ready to enforce permissions for everyone
- For new installations where you want security from day one

#### Option 2: Enable for Specific Users (Gradual Rollout)

Keep `ENABLE_PERMISSIONS=false` (or omit it), and assign the `permissions-enabled` role to specific users in Keycloak.

**Effect**: Only users with the `permissions-enabled` role have permission checking enforced. Others can access everything.

**When to use**:
- Testing the permissions system with a few users
- Gradual rollout to avoid disrupting existing users
- Training new administrators before full deployment

### Configuration Scenarios

#### Scenario 1: Development Environment

**Goal**: Allow developers to access everything without restrictions

```bash
ENABLE_PERMISSIONS=false
KEYCLOAK_AUTO_SYNC_ROLES=true
```

**Result**: Roles are created automatically, but no permission checking is enforced.

#### Scenario 2: Testing Permissions

**Goal**: Test permissions with a few users before rolling out

```bash
ENABLE_PERMISSIONS=false
KEYCLOAK_AUTO_SYNC_ROLES=true
```

Then assign the `permissions-enabled` role to test users in Keycloak.

**Result**: Only test users have permission checking active.

#### Scenario 3: Production Environment

**Goal**: Full security with permission checking for everyone

```bash
ENABLE_PERMISSIONS=true
KEYCLOAK_AUTO_SYNC_ROLES=true
```

**Result**: All users must have appropriate roles to access endpoints.

#### Scenario 4: Manual Role Management

**Goal**: Full control over role definitions in Keycloak

```bash
ENABLE_PERMISSIONS=true
KEYCLOAK_AUTO_SYNC_ROLES=false
```

**Result**: You manage all roles manually. System doesn't modify Keycloak.

### How to Disable Permissions

#### Option 1: Disable Globally

Set the environment variable:

```bash
ENABLE_PERMISSIONS=false
```

or remove the variable entirely from your `.env` file.

**Effect**: No permission checking for anyone—all users can access all endpoints.

#### Option 2: Remove Individual User Enforcement

Remove the `permissions-enabled` role from all users in Keycloak while keeping `ENABLE_PERMISSIONS=false`.

**Effect**: All users can access everything (no permission checking).

### Disabling Automatic Role Synchronization

If you want to manage roles manually and disable automatic setup:

```bash
KEYCLOAK_AUTO_SYNC_ROLES=false
```

**Warning**: Only disable this if you plan to manage roles manually in Keycloak. You'll need to:
- Manually create all roles
- Manually configure composite roles
- Manually create and link groups
- Manually update roles when the system adds new features

**Recommendation**: Keep auto-sync enabled unless you have a specific reason to manage roles manually.

---

## Managing Users and Groups

### What are Groups?

**Groups** are collections of users who share the same permissions. Think of them like departments or teams in your organization.

### Pre-configured Groups

The system automatically creates these groups:

#### Contributors Group
- **Automatic Role**: `contributor` composite role
- **Members Get**: All contributor permissions automatically
- **Who should be here**: Developers, product managers, QA engineers, designers

#### System Administrators Group
- **Automatic Role**: `system-administrator` composite role
- **Members Get**: Full system management permissions
- **Who should be here**: DevOps engineers, system administrators, IT staff

### Benefits of Using Groups

✅ **Easy User Management**: Add a user to a group instead of assigning individual roles

✅ **Consistent Permissions**: All group members have the same access

✅ **Quick Updates**: Change group permissions once, affects all members

✅ **Clear Organization**: See which team each user belongs to

✅ **Scalability**: Manage hundreds of users efficiently

---

## Assigning Users to Groups

### In Keycloak Admin Console

#### Step 1: Open Keycloak Admin Console
1. Navigate to `http://your-keycloak-url/admin`
2. Login with admin credentials
3. Select the correct realm (usually `getapp`)

#### Step 2: Find the User
1. Click **"Users"** in the left sidebar
2. Use the search box to find the user
3. Click on the user's username to open their profile

#### Step 3: Add User to Group
1. Click the **"Groups"** tab
2. Click the **"Join Group"** button
3. Select a group from the list:
   - **Contributors** - For project team members
   - **System Administrators** - For IT staff
4. Click **"Join"**

#### Step 4: Verify
1. The group now appears in the user's "Group Membership" list
2. The user automatically gets all roles from that group
3. The user's next login will include the new roles

### Quick Example

**Scenario**: You hired a new developer, Sarah

**Steps**:
1. Create Sarah's user account in Keycloak
2. Go to Sarah's user profile
3. Click "Groups" tab → "Join Group"
4. Select "Contributors" → Click "Join"
5. Done! Sarah can now create projects, upload artifacts, and manage releases

**Time to complete**: 2 minutes

### Removing Users from Groups

1. Go to **Users** → Find the user
2. Click on the user's username
3. Go to the **"Groups"** tab
4. Find the group in the "Group Membership" list
5. Click the **"Leave"** button next to the group
6. Confirm the removal

The user will lose all roles from that group on their next login.

### Managing Multiple Groups

#### Can a User Be in Multiple Groups?

**Yes!** A user can be in multiple groups and will have the combined permissions from all their groups.

**Example**:
- Sarah is in "Contributors" group → Gets contributor permissions
- Sarah is also in a custom "Release Managers" group → Gets additional release management permissions
- Sarah has all permissions from both groups

#### Overlapping Permissions

If two groups have the same role, the user just gets that role once (no duplication or conflicts).

---

## Creating Custom Composite Roles

Composite roles make it easier to manage groups by bundling individual roles together.

### When to Create Custom Roles

- You need a different set of permissions than the pre-configured groups
- You want to organize users by department or team
- You need role-based access for specific workflows

### Option 1: In Keycloak UI (Recommended)

#### Step 1: Navigate to Client Roles
1. Go to **Clients** in the left sidebar
2. Click on the **api** client
3. Click the **"Roles"** tab

#### Step 2: Create New Role
1. Click **"Create Role"**
2. Enter role name (e.g., `release-manager`)
3. Add a description (e.g., "Composite role for release managers")
4. Click **"Save"**

#### Step 3: Make it Composite
1. On the role's page, toggle **"Composite Role"** to ON
2. In the "Associated Roles" section, select **api** from the dropdown

#### Step 4: Add Child Roles
1. Select the individual roles you want to include
2. Click **"Add selected"**
3. The composite role now includes all selected roles

#### Step 5: Assign to Users or Groups
You can now assign this composite role to users or groups like any other role

### Option 2: Define in Code (For Developers)

For automatic setup, developers can add composite roles to the configuration file.

**File**: `api/libs/common/src/oidc-roles/constants/role-definitions.constant.ts`

```typescript
export const COMPOSITE_ROLE_DEFINITIONS: CompositeRoleDefinition[] = [
  // Existing roles...
  
  // Add your new composite role:
  {
    name: 'release-manager',
    description: 'Composite role for release managers',
    childRoles: [
      ApiRole.VIEW_PROJECT,
      ApiRole.LIST_PROJECTS,
      ApiRole.CREATE_RELEASE,
      ApiRole.VIEW_RELEASE,
      ApiRole.UPDATE_RELEASE,
      ApiRole.PUBLISH_RELEASE,
      ApiRole.LIST_RELEASES,
      ApiRole.VIEW_ARTIFACT,
      ApiRole.LIST_ARTIFACTS,
    ],
  },
];
```

After adding this code, restart the API service. The new composite role will be created automatically!

### Example Custom Composite Roles

#### Release Manager
**Purpose**: Users who manage releases but don't create projects

```typescript
{
  name: 'release-manager',
  description: 'Manage releases and artifacts',
  childRoles: [
    ApiRole.VIEW_PROJECT,
    ApiRole.LIST_PROJECTS,
    ApiRole.CREATE_RELEASE,
    ApiRole.VIEW_RELEASE,
    ApiRole.UPDATE_RELEASE,
    ApiRole.PUBLISH_RELEASE,
    ApiRole.LIST_RELEASES,
    ApiRole.VIEW_ARTIFACT,
    ApiRole.DOWNLOAD_ARTIFACT,
    ApiRole.LIST_ARTIFACTS,
    ApiRole.VIEW_ANALYTICS,
  ],
}
```

#### Viewer
**Purpose**: Stakeholders who need read-only access

```typescript
{
  name: 'viewer',
  description: 'Read-only access to all resources',
  childRoles: [
    ApiRole.VIEW_PROJECT,
    ApiRole.LIST_PROJECTS,
    ApiRole.VIEW_RELEASE,
    ApiRole.LIST_RELEASES,
    ApiRole.VIEW_ARTIFACT,
    ApiRole.LIST_ARTIFACTS,
    ApiRole.VIEW_OFFERING,
    ApiRole.VIEW_DISCOVERY,
    ApiRole.VIEW_USER,
    ApiRole.VIEW_ANALYTICS,
    ApiRole.VIEW_LOGS,
    ApiRole.VIEW_METRICS,
    ApiRole.VIEW_CONFIG,
  ],
}
```

#### DevOps Engineer
**Purpose**: Engineers who deploy but don't develop

```typescript
{
  name: 'devops-engineer',
  description: 'Deploy and monitor applications',
  childRoles: [
    ApiRole.VIEW_PROJECT,
    ApiRole.VIEW_RELEASE,
    ApiRole.VIEW_ARTIFACT,
    ApiRole.DOWNLOAD_ARTIFACT,
    ApiRole.DEPLOY_DEV,
    ApiRole.DEPLOY_STAGING,
    ApiRole.DEPLOY_PRODUCTION,
    ApiRole.MANAGE_DISCOVERY,
    ApiRole.VIEW_METRICS,
    ApiRole.VIEW_LOGS,
    ApiRole.MANAGE_DEVICES,
  ],
}
```

### Creating Custom Groups

Once you have a custom composite role, create a group for it:

1. Go to **Groups** in the left sidebar
2. Click **"Create group"**
3. Enter the group name (e.g., "Release Managers")
4. Click **"Create"**
5. Click on the newly created group
6. Go to the **"Role Mappings"** tab
7. Select **"api"** from the "Client Roles" dropdown
8. Add your custom composite role
9. Click **"Add selected"**

Now you can add users to this group, and they'll automatically get all the roles from your custom composite role.

---

## Troubleshooting Setup Issues

### Roles Not Appearing in Keycloak

**Problem**: After starting the API service, roles don't appear in Keycloak

**Solutions**:
1. Check the API service logs for errors
2. Verify `KEYCLOAK_ADMIN_USER` and `KEYCLOAK_ADMIN_PASSWORD` are correct
3. Ensure `KEYCLOAK_AUTO_SYNC_ROLES` is not set to `false`
4. Verify the Keycloak URL and realm are correct
5. Check that the admin user has permission to create roles and groups

### Permission Checking Not Working

**Problem**: Users can access endpoints they shouldn't

**Solutions**:
1. Verify `ENABLE_PERMISSIONS=true` is set
2. If using per-user enforcement, check that users have the `permissions-enabled` role
3. Clear browser cache and get a fresh authentication token
4. Check that the user's roles are correctly set in Keycloak
5. Review API logs for permission check messages

### Synchronization Fails on Startup

**Problem**: API logs show errors during role synchronization

**Solutions**:
1. Verify Keycloak is running and accessible
2. Check network connectivity to Keycloak
3. Verify admin credentials are correct
4. Check Keycloak logs for errors
5. Ensure the `api` client exists in Keycloak

### User Has Role But Still Can't Access

**Problem**: User has the correct role in Keycloak but still gets permission errors

**Solutions**:
1. Have user log out completely and log back in
2. Clear browser cache
3. Use [jwt.io](https://jwt.io) to decode the user's access token and verify the role appears in the token
4. Verify role is a client role (under `api` client), not a realm role
5. Check if permission checking is enabled (`ENABLE_PERMISSIONS=true` or user has `permissions-enabled` role)

### Changes Not Taking Effect

**Problem**: Role or group changes in Keycloak don't seem to work

**Root Cause**: User's authentication token is cached and hasn't been refreshed

**Solution**:
1. Have the user log out of GetApp
2. Have the user log back in
3. The new token will include updated roles

**Alternative**: Wait for token expiration (usually 5-60 minutes depending on configuration)

---

## Best Practices

### User Management

✅ **Use groups** instead of assigning roles directly to users

✅ **Use composite roles** for common permission sets

✅ **Document custom roles** - Keep a record of what each custom role is for

✅ **Review permissions regularly** - Audit group memberships quarterly

✅ **Keep at least 2 system administrators** - Prevent lockouts

❌ **Don't** assign hundreds of individual roles to users

❌ **Don't** give everyone admin access "just in case"

### Security

✅ **Start with minimal permissions** - Add more as needed

✅ **Test changes** with a single user before rolling out

✅ **Use service accounts** with limited permissions for automated systems

✅ **Enable permissions in production** - Set `ENABLE_PERMISSIONS=true`

❌ **Don't** disable permissions in production unless necessary

❌ **Don't** share admin credentials across multiple people

### Operations

✅ **Monitor the auto-sync logs** on startup

✅ **Keep Keycloak admin credentials secure**

✅ **Document your custom composite roles**

✅ **Have a process for emergency access**

❌ **Don't** manually modify auto-synced roles in Keycloak (they'll be overwritten)

❌ **Don't** disable auto-sync unless you're managing roles manually

---

## Next Steps

- Return to the [Overview](./roles-and-permissions.md) for basic concepts
- Check the [Roles Reference and Scenarios](./roles-reference-scenarios.md) for complete role listings and real-world examples
- Review the Keycloak admin console to verify your setup

---

**Need help?** Check the [troubleshooting section](#troubleshooting-setup-issues) or review the [Roles Reference](./roles-reference-scenarios.md) for more examples.
