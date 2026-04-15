---
id: policy-enforcement-configuration
title: Policy Enforcement Configuration Guide
sidebar_label: Policy Enforcement Configuration
sidebar_position: 5
---

# Policy Enforcement Configuration Guide

This guide shows you how to configure policy enforcement for your GetApp agent to control when and where software policies are checked during the component delivery and deployment lifecycle.

## Quick Start

Add these environment variables to your agent's `.env` file:

```bash
# Enable policy enforcement globally (default: true)
ENFORCE_POLICIES=true

# Control WHERE policies are enforced (default: offering)
# Options: offering | delivery | deploy
POLICY_ENFORCEMENT_MODE=offering
```

Then restart the agent for changes to take effect.

## Understanding Policy Enforcement

### What Are Policies?

Policies are rules that determine which software components can be installed on a device based on criteria like:
- Component version requirements
- Security classifications
- Device metadata (OS version, region, etc.)
- Certification status

For more information on creating and managing policies, see [Managing Policies](managing-policies.md).

### The Three Enforcement Stages

Your agent evaluates software at three points in the lifecycle:

1. **Offering Query** - When displaying available releases in the device store
2. **Delivery Start** - When beginning to download a component
3. **Deploy** - When installing a downloaded component

The `POLICY_ENFORCEMENT_MODE` setting controls which of these stages perform policy checks.

### Enforcement Mode Comparison

| Stage | Offering Mode | Delivery Mode | Deploy Mode | ENFORCE_POLICIES=false |
|-------|---------------|---------------|-------------|------------------------|
| **Offering Query** | ✅ Enforced | ❌ Skipped | ❌ Skipped | ❌ Skipped |
| **Delivery Start** | ✅ Enforced | ✅ Enforced | ❌ Skipped | ❌ Skipped |
| **Deploy** | ✅ Enforced | ✅ Enforced | ✅ Enforced | ❌ Skipped |
| **Restrictions** | ✅ Always | ✅ Always | ✅ Always | ✅ Always |

:::info
**Restrictions** are always enforced regardless of policy enforcement mode. See [Managing Restrictions](managing-restrictions.md) for details.
:::

## Configuration Scenarios

### Scenario 1: Production Environment (Recommended)

**Goal**: Only show approved software to end users

**Configuration**:
```bash
ENFORCE_POLICIES=true
POLICY_ENFORCEMENT_MODE=offering
```

**Behavior**:
- ✅ Non-compliant releases hidden from device store
- ✅ Downloads blocked for non-compliant components
- ✅ Deployments blocked for non-compliant components

**Best for**: Production deployments where strict control is required

---

### Scenario 2: Flexible User Experience

**Goal**: Let users see all releases but prevent downloading non-compliant ones

**Configuration**:
```bash
ENFORCE_POLICIES=true
POLICY_ENFORCEMENT_MODE=delivery
```

**Behavior**:
- ⚠️ All releases visible in device store (including non-compliant)
- ✅ Downloads blocked for non-compliant components
- ✅ Deployments blocked for non-compliant components

**Best for**: Organizations that want transparency about available releases while maintaining download controls

---

### Scenario 3: Transfer Agent (Air-Gapped Networks)

**Goal**: Download software packages for transfer but validate policies at final installation

**Configuration**:
```bash
ENFORCE_POLICIES=true
POLICY_ENFORCEMENT_MODE=deploy
```

**Behavior**:
- ⚠️ All releases visible in device store
- ⚠️ Downloads succeed for all components (no policy check)
- ✅ Deployments blocked for non-compliant components

**Best for**: Agents that download software for transfer to air-gapped networks, where the final target device will enforce policies at installation time

---

### Scenario 4: Development/Testing

**Goal**: Disable all policy checks for rapid iteration

**Configuration**:
```bash
ENFORCE_POLICIES=false
# POLICY_ENFORCEMENT_MODE is ignored when ENFORCE_POLICIES=false
```

**Behavior**:
- ⚠️ All releases visible in device store
- ⚠️ Downloads succeed for all components
- ⚠️ Deployments succeed for all components (policies ignored)
- ✅ Restrictions still enforced (cannot be disabled)

**Best for**: Development and testing environments

## Step-by-Step Configuration

### Windows Installation

1. Open the agent `.env` file:
   ```
   C:\Program Files\GetApp\Agent\.env
   ```

2. Add or modify these lines:
   ```bash
   ENFORCE_POLICIES=true
   POLICY_ENFORCEMENT_MODE=offering
   ```

3. Save the file

4. Restart the GetApp Agent service:
   - Press `Win+R`, type `services.msc`, press Enter
   - Find "GetApp Agent" in the list
   - Right-click → Restart

### Linux Installation

1. Open the agent `.env` file:
   ```bash
   sudo nano /opt/getapp/agent/.env
   ```

2. Add or modify these lines:
   ```bash
   ENFORCE_POLICIES=true
   POLICY_ENFORCEMENT_MODE=offering
   ```

3. Save the file (Ctrl+O, Enter, Ctrl+X)

4. Restart the agent service:
   ```bash
   sudo systemctl restart getapp-agent
   ```

## Verifying Configuration

### Check Agent Logs

After restarting, check the agent logs to confirm the enforcement mode:

**Windows**:
```
C:\Program Files\GetApp\Agent\logs\agent.log
```

**Linux**:
```bash
sudo journalctl -u getapp-agent -n 100
```

Look for log entries like:
```
INFO: Applying policy evaluation to offerings (ENFORCE_POLICIES=true, MODE=Offering, enforcing=true)
```

### Test Offering Query

Call the device store API to see if policy enforcement is working:

```bash
curl http://localhost:8080/device/store
```

- With `MODE=offering`: Non-compliant components will have `"offered": false`
- With `MODE=delivery` or `deploy`: All components will have `"offered": true`

## Important Notes

### Restrictions Are Always Enforced

**Restrictions** (device-level blocks) are ALWAYS enforced regardless of `ENFORCE_POLICIES` or `POLICY_ENFORCEMENT_MODE`:

```bash
# Even with policies disabled, restrictions still block components
ENFORCE_POLICIES=false  # ← Policies ignored
# But restrictions still active! ←
```

See [Managing Restrictions](managing-restrictions.md) for more information.

### Device-Type Tree Gating

Device-type offering tree gating (which components are eligible for specific device types) is **always enforced** during deployment, regardless of policy settings.

### Invalid Mode Values

If you specify an invalid mode value, the agent defaults to `offering` mode (most secure):

```bash
POLICY_ENFORCEMENT_MODE=invalid  # ← Invalid
# Agent defaults to: offering
```

Check agent logs for a warning message if this happens.

## Troubleshooting

### Problem: Components Missing from Device Store

**Symptom**: Expected releases don't appear in `GET /device/store`

**Diagnosis**: 
- Check `POLICY_ENFORCEMENT_MODE` setting
- Review agent logs for policy evaluation results
- Verify component metadata meets policy criteria

**Solution**:
1. Temporarily set `POLICY_ENFORCEMENT_MODE=delivery` to see all releases
2. Review policy rules to understand why components are blocked
3. Update component metadata or policy rules as needed

See [Managing Policies](managing-policies.md) for how to update policy rules.

---

### Problem: Downloads Failing with Policy Error

**Symptom**: Delivery start fails with error: *"Component cannot be downloaded due to policy restrictions"*

**Diagnosis**: Mode is `offering` or `delivery`, and component fails policy check

**Solution**:
- Review policy rules applied to the component
- Check device metadata in agent logs
- Set `POLICY_ENFORCEMENT_MODE=deploy` if you need to allow downloads

---

### Problem: Deployment Blocked After Download

**Symptom**: Component downloaded successfully but deployment fails with policy error

**Diagnosis**: This is expected behavior when `POLICY_ENFORCEMENT_MODE=deploy`

**Solution**:
- Review policy rules to understand failure reason
- Update device metadata if criteria changed
- Or set `POLICY_ENFORCEMENT_MODE=delivery` to block downloads instead

---

### Problem: Configuration Changes Not Applied

**Symptom**: Changed `.env` file but behavior unchanged

**Solution**:
1. Verify you edited the correct `.env` file (check agent installation path)
2. Ensure you saved the file
3. **Restart the agent service** (configuration is loaded at startup)
4. Check agent logs to confirm new mode is active

## Advanced Topics

### Combining Policies and Restrictions

Policies and restrictions work together to control software deployment:

| Rule Type | Enforcement | Can Be Disabled? | Scope |
|-----------|-------------|------------------|-------|
| **Policies** | Configurable per stage | Yes (ENFORCE_POLICIES=false) | Component eligibility |
| **Restrictions** | Always active | No | Device-level blocks |

Even with `ENFORCE_POLICIES=false`, restricted devices cannot download/deploy components.

For more information, see [Policies & Restrictions Overview](policies-restrictions-overview.md).

### Logging Policy Decisions

Enable debug logging to see detailed policy evaluation:

```bash
LOG_LEVEL=debug
```

This adds detailed logs showing:
- Which policies were evaluated
- Which criteria passed/failed
- Device metadata used for evaluation

### Per-Component Policy Override

Policy enforcement mode is **global per agent**. There is no per-component override. If you need different enforcement for different components, consider:
- Using separate agent instances with different configurations
- Using policy rules that incorporate component-specific criteria

See [Rule Fields & Expressions](rule-fields-expressions.md) for information on creating conditional policy rules.

## Migration from Boolean ENFORCE_POLICIES

If you previously used only `ENFORCE_POLICIES`:

**Old Configuration**:
```bash
ENFORCE_POLICIES=true
```

**New Equivalent** (default behavior maintained):
```bash
ENFORCE_POLICIES=true
POLICY_ENFORCEMENT_MODE=offering  # ← Added, but this is the default
```

No action required for existing deployments. The new mode defaults to `offering`, preserving current enforcement behavior.

## Related Documentation

- [Managing Policies](managing-policies.md) - Creating and managing policy rules
- [Managing Restrictions](managing-restrictions.md) - Device-level restriction management
- [Policies & Restrictions Overview](policies-restrictions-overview.md) - Understanding the rule system
- [Rule Fields & Expressions](rule-fields-expressions.md) - Advanced rule configuration
- [Environment Variables Overview](/docs/env/) - Technical reference
- [FAQ: Policy Enforcement](/docs/root/FAQ#policy-enforcement) - Common questions

## Need Help?

If you're unsure which mode to use for your deployment scenario:

1. **Start with offering mode** (default) - Most secure
2. **Monitor agent logs** for policy enforcement actions
3. **Review policy failures** to understand what's being blocked
4. **Adjust mode** based on your organizational requirements

For technical support, contact your GetApp administrator with:
- Current `ENFORCE_POLICIES` and `POLICY_ENFORCEMENT_MODE` values
- Recent agent log excerpts showing policy enforcement
- Description of desired behavior
