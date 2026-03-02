---
id: dependencies-overview
title: Dependencies Overview
sidebar_label: Dependencies Overview
sidebar_position: 5
---
# GetApp – Dependency Model

## Overview

GetApp supports **release-based dependency management**.

Dependencies are defined per Release and are resolved, delivered, and installed according to a deterministic execution model designed for edge and tactical environments.

---

# 1. Dependency Scope

## 1.1 Release-Based Dependencies

- Dependencies are defined **per Release**.
- Each Release may declare **multiple dependencies**.
- The server supports storing and managing **multiple dependency trees across releases**.
- There is no global system-wide dependency registry.
- Dependency resolution is scoped strictly to the Release definition.

---

# 2. Dependency Identity

A dependency is uniquely identified by:
<Project Name> & <Version>
Example: GetAppService 1.0.0


Project name and version together form the unique dependency key.

---

# 3. Delivery Rules

## 3.1 Already Installed or Delivered

If a dependency (Project + Version):

- Is already installed on the Agent  
OR  
- Was already delivered to the Agent  

→ It will NOT be delivered again.

This prevents:
- Redundant downloads
- Duplicate artifacts
- Version conflicts
- Bandwidth waste (critical for edge environments)

---

## 3.2 Delivery Order

Dependencies are delivered in **leaf → root order**.

Execution flow:

1. Leaf dependencies (no children) are delivered first.
2. Parent dependencies are delivered only after their children succeed.
3. The root Release is delivered last.

This guarantees:

- Deterministic execution
- Stable install ordering
- Predictable recovery behavior

---

# 4. Installation Rules

## 4.1 Root Installation Rule

Installation is executed **only for the root dependency**.

Child dependencies:

- Are delivered
- Are prepared
- Are not independently executed unless triggered by the root

The root Release is responsible for:

- Triggering its own installation logic
- Validating dependency readiness
- Reporting final installation status

---

## 4.2 Script / MSI / RPM Deployments

If the deployment type is:

- Script
- MSI
- RPM

Then:

- After successful initialization, the system will mark **all dependencies as Installed**.
- If initialization fails:
  - All related dependencies will be marked as **Failed**.

This ensures:

- Consistent state reporting
- Clear failure visibility
- Transaction-like orchestration behavior

---

# 5. Rule Policy Behavior

Rule Policies apply **only to live deployments**.

- Policies are evaluated during active deployment flows.
- They are not retroactively applied to historical deliveries.
- They do not modify static dependency metadata.

---

# 6. Future Enhancements

The following features are planned:

## 6.1 Device-Type Dependencies

Dependencies defined per Device Type.

## 6.2 Offering-Level Dependencies

Dependencies defined per Offering configuration.

These capabilities will be developed in future versions.

---

# 7. Execution Summary

| Rule | Behavior |
|------|----------|
| Scope | Defined per Release |
| Identity | Project + Version |
| Re-delivery | Prevented if already installed or delivered |
| Delivery Order | Leaf → Root |
| Installation | Root only |
| Script/MSI/RPM | Marks all dependencies installed after init |
| Policy | Applies only to live deployments |
| Device/Offering Dependencies | Planned |

