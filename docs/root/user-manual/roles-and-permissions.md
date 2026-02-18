# User Roles and Permissions - Overview

**Last Updated:** February 18, 2026

Welcome to the GetApp Roles and Permissions documentation. This guide will help you understand and manage user access control in the GetApp system.

## 📚 Documentation Structure

This documentation is organized into three parts:

1. **This Overview** - Introduction to roles, composite roles, and key concepts
2. **[Setup and Management Guide](./roles-setup-management.md)** - Configuration, user management, and creating custom roles
3. **[Roles Reference](./roles-reference-scenarios.md)** - Complete role listings, examples, and troubleshooting

---

## Table of Contents

1. [What are Roles?](#what-are-roles)
2. [Understanding Composite Roles](#understanding-composite-roles)
3. [The Special `permissions-enabled` Role](#the-special-permissions-enabled-role)
4. [Pre-configured Composite Roles](#pre-configured-composite-roles)
5. [Quick Start](#quick-start)
6. [Next Steps](#next-steps)

---

## What are Roles?

**Roles** are permissions that control what users can do in the GetApp system. Think of a role as a key that unlocks specific features or actions.

### Examples:
- `view-project` - Allows you to see project details
- `create-project` - Allows you to create new projects
- `update-release` - Allows you to modify existing releases
- `deploy-production` - Allows you to deploy to production

Each role represents a specific action or access level in the system. Users can have multiple roles, giving them access to different features.

### How Roles Work

When a user attempts to perform an action (such as creating a project), the system performs the following checks:

1. **Is permission enforcing enabled?** - Verifies whether the permission enforcement is active.
2. **Does the user have the required role?** - Confirms that the user possesses the appropriate role for this action.
3. **Authorization decision** - If permissions are enabled and the user has the correct role, the action is allowed. Otherwise, the request is blocked (unless permission enforcement is disabled).

#### Special Cases: Agent Authentication and Project Tokens

**Agent Routes**: Routes used by agents do not require role-based authorization. If an agent has authenticated successfully, it can perform its designated operations without role checks.

**Project Tokens**: When a valid project token is provided, the system grants access to specific project-scoped operations without requiring individual user roles. The following actions are automatically permitted for the project associated with the token:

- **Project Management**: View, update, delete, and list projects
- **Release Management**: Create, view, update, edit imported releases, delete, publish, and list releases  
- **Artifact Management**: Upload, download, view, delete, and list artifacts

This token-based access ensures that automated workflows and integrations can interact with specific projects securely without requiring user-level role assignments.

---

## Understanding Composite Roles

**Composite roles** are like "bundles" of individual roles. Instead of assigning 10 separate roles to a user, you can assign one composite role that includes all of them.

### Why Use Composite Roles?

- **Easier Management**: Assign one role instead of many
- **Consistency**: All users in the same role have the same permissions
- **Flexibility**: Change permissions for all users by updating the composite role

### Example: Contributor Role

The `contributor` composite role includes:
- Creating, viewing, updating, and deleting projects
- Creating, viewing, updating, and publishing releases
- Uploading, viewing, and downloading artifacts
- Managing policies (release-associated rules)
- Viewing analytics, logs, and metrics

When you assign someone the `contributor` role, they automatically get all these permissions.

---

## The Special `permissions-enabled` Role

### What is `permissions-enabled`?

**`permissions-enabled`** is a special "stamp" role that is added to the JWT that is genrated for autehticated users, and it activates permissions checking for this user, if it wasn't enabled the the environemnt varible **`ENABLE_PERMISSIONS`**. **It doesn't grant any permissions by itself**—it only turns on the enforcement of permissions.

### How It Works

The GetApp system has two ways to control permission checking:

#### 🌍 Global Control (Everyone)
- Set `ENABLE_PERMISSIONS=true` → **All users** have permissions checked
- Set `ENABLE_PERMISSIONS=false` → **No one** has permissions checked (everyone can access everything)

#### 👤 Individual Control (Specific Users)
- When `ENABLE_PERMISSIONS=false` (global disable), you can still enforce permissions for specific users by giving them the `permissions-enabled` role
- Users **with** `permissions-enabled`: Permission checking is active—they must have required roles ✅
- Users **without** `permissions-enabled`: No permission checking—they can access everything ⚠️

### Why Use `permissions-enabled`?

**Gradual Rollout**: Test the permissions system with a few users before enabling it for everyone.

**Example Scenario**:
1. You have 100 users, but want to test permissions with just 5 people first
2. Keep `ENABLE_PERMISSIONS=false` (global disable)
3. Give the `permissions-enabled` role to 5 test users
4. Only those 5 users will have permission checking active
5. Once testing is successful, set `ENABLE_PERMISSIONS=true` to enable for everyone

### Quick Reference Table

| Global Setting | User Has `permissions-enabled`? | Result |
|----------------|--------------------------------|--------|
| `ENABLE_PERMISSIONS=true` | Doesn't matter | Permissions checked ✅ |
| `ENABLE_PERMISSIONS=false` | Yes | Permissions checked ✅ |
| `ENABLE_PERMISSIONS=false` | No | No checking, full access ⚠️ |

---

## Pre-configured Composite Roles

The system comes with two main composite roles that cover most use cases:

### 1. Contributor

**Who it's for**: Team members who work on projects—developers, product managers, QA engineers

**What they can do**:
- ✅ Manage projects (create, view, update, delete, list)
- ✅ Manage releases (create, view, update, publish, list)
- ✅ Manage artifacts (upload, download, view, list)
- ✅ Manage policies (release-associated rules)
- ✅ View discovery services, offerings, users
- ✅ View analytics, logs, metrics, and configuration
- ❌ **Cannot** deploy to devices or manage system settings
- ❌ **Cannot** manage restrictions (device-associated rules)
- ❌ **Cannot** manage users or system configuration

**Use case**: Give this role to anyone who needs to contribute to projects but doesn't need deployment or administrative access.

### 2. System Administrator

**Who it's for**: DevOps engineers, IT staff, system administrators

**What they can do**:
- ✅ Everything contributors can do
- ✅ Deploy applications to devices
- ✅ Manage discovery services and devices
- ✅ Link projects to device types
- ✅ Manage offerings (create, update, delete)
- ✅ Manage users
- ✅ Manage system configuration
- ✅ Manage restrictions (device-associated rules)
- ✅ Full access to analytics, logs, and metrics

**Use case**: Give this role to people who need to deploy applications, manage the infrastructure, and configure the system.

### Key Differences

| Capability | Contributor | System Administrator |
|-----------|-------------|---------------------|
| Create/manage projects | ✅ | ✅ |
| Upload/manage artifacts | ✅ | ✅ |
| Publish releases | ✅ | ✅ |
| Manage policies | ✅ | ✅ |
| **Deploy to devices** | ❌ | ✅ |
| **Manage restrictions** | ❌ | ✅ |
| **Manage users** | ❌ | ✅ |
| **Manage system config** | ❌ | ✅ |

---

## Quick Start

### For New Users: Getting Access

**Scenario**: You need access to work on projects

**What you need**: Ask your administrator to add you to the **"Contributors"** group in Keycloak

**Result**: You'll be able to create projects, upload artifacts, and manage releases

### For Administrators: Setting Up a New User

**Scenario**: You hired a new developer, Sarah

**Steps**:
1. Create Sarah's user account in Keycloak (or use SSO/LDAP)
2. Go to **Users** → Find Sarah → **Groups** tab
3. Click **"Join Group"** → Select **"Contributors"**
4. Click **"Join"**

**Result**: Sarah can now contribute to projects immediately

**Time to complete**: 2 minutes

### For Administrators: Enabling Permissions

**Choose one approach:**

#### Option A: Enable for Everyone (Recommended for Production)
```bash
ENABLE_PERMISSIONS=true
```
All users must have appropriate roles to access features.

#### Option B: Enable for Specific Users (Recommended for Testing)
1. Keep `ENABLE_PERMISSIONS=false`
2. Assign the `permissions-enabled` role to test users in Keycloak
3. Only those users will have permission checking enforced

---

## Groups and Role Assignment

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

### Best Practices

✅ **Use groups** instead of assigning roles directly to users

✅ **Use composite roles** for common permission sets

✅ **Document** your custom roles and groups

✅ **Review permissions** regularly (quarterly)

✅ **Keep at least 2 system administrators** at all times

❌ **Don't** assign hundreds of individual roles to users

❌ **Don't** give everyone admin access

---

## How Roles are Set Up

**Good news!** You don't need to manually create roles. The system automatically sets up all roles when it starts.

### What Happens Automatically

1. **System Startup**: GetApp API connects to Keycloak
2. **Role Creation**: System creates any missing roles
3. **Composite Role Setup**: Configures `contributor` and `system-administrator` roles
4. **Group Creation**: Creates Contributors and System Administrators groups
5. **Synchronization**: Updates any changes from code

### You'll See Log Messages Like

```
🚀 Starting OIDC Role Synchronization
✅ Created: create-project
✅ Created: view-release
✅ Synced composite role: 'contributor' (24 child roles)
✅ Synced group: 'Contributors'
🎉 Synchronization Complete!
```

**No manual work needed!** Just start the system and everything is configured.

> **Note:** Auto-sync is enabled by default. To disable it and manage roles manually, set `KEYCLOAK_AUTO_SYNC_ROLES=false`.

---

## Role Categories at a Glance

Here's a quick overview of the types of roles available:

### 📁 Project Management
`create-project`, `view-project`, `update-project`, `delete-project`, `list-projects`

### 🚀 Release Management
`create-release`, `view-release`, `update-release`, `edit-imported-release`, `delete-release`, `publish-release`, `push-release`, `list-releases`

### 📦 Artifact Management
`upload-artifact`, `download-artifact`, `view-artifact`, `delete-artifact`, `list-artifacts`

### 🚢 Deployment
`deploy-dev`, `deploy-staging`, `deploy-production`

### 🔍 Discovery & Devices
`view-discovery`, `manage-discovery`, `view-offering`, `create-offering`, `update-offering`, `delete-offering`, `manage-devices`, `link-project-device-type`

### 📋 Policies & Restrictions
**Policies** (Release rules - managed by contributors):
`create-policy`, `view-policy`, `update-policy`, `delete-policy`, `list-policies`

**Restrictions** (Device rules - managed by admins only):
`create-restriction`, `view-restriction`, `update-restriction`, `delete-restriction`, `list-restrictions`

### 👥 User Management
`view-user`, `manage-users`

### 📊 Analytics & Monitoring
`view-analytics`, `view-logs`, `view-metrics`

### ⚙️ Configuration
`view-config`, `manage-config`

---

## Next Steps

Now that you understand the basics:

### 📖 Learn More

- **[Setup and Management Guide](./roles-setup-management.md)** - Configure environment variables, manage users and groups, create custom composite roles

- **[Roles Reference and Scenarios](./roles-reference-scenarios.md)** - Complete role descriptions, real-world examples, and troubleshooting

### 🚀 Take Action

**For Administrators:**
1. Review your environment configuration
2. Add users to appropriate groups
3. Consider creating custom roles for your organization

**For Users:**
1. Contact your administrator to request access
2. Specify what you need to do (contribute to projects, deploy, etc.)
3. They'll add you to the appropriate group

---

## Getting Help

### Common Questions

**Q: How do I give someone access?**
- **A**: Add them to the "Contributors" or "System Administrators" group in Keycloak

**Q: How do I enable permissions?**
- **A**: Set `ENABLE_PERMISSIONS=true` in your environment variables

**Q: What's the difference between policies and restrictions?**
- **A**: Policies are rules on releases (managed by contributors), restrictions are rules on devices (managed by admins only)

**Q: What does `permissions-enabled` do?**
- **A**: It activates permission checking for specific users when global permissions are disabled. See [the detailed explanation above](#the-special-permissions-enabled-role).

### Need More Information?

- Check the [Setup and Management Guide](./roles-setup-management.md) for detailed instructions
- Review the [Roles Reference](./roles-reference-scenarios.md) for complete role listings and examples
- Check application logs for detailed permission checking information
- Review Keycloak admin console to verify user and group settings

---

**Ready to dive deeper?** Continue to the [Setup and Management Guide](./roles-setup-management.md)
