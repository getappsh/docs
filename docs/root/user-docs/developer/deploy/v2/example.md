---
id: deploy-v2-example
title: Example
sidebar_label: Example
sidebar_position: 8
---

# Example

A complete, annotated `install.yaml` exercising the main capabilities from
[Tasks](./deploy-v2-tasks), [Action](./deploy-v2-action), and [Orchestrator](./deploy-v2-orchestrator): a version gate, a
dependency, a conditional install with placeholders and metadata-driven timeouts, a grouped
install that's verified and reverted on failure, and a post-install script.

```yaml
# install.yaml — shipped inside release ID.MainApp@2.0.0
ReleaseId: ID.MainApp@2.0.0
Type: Deploy/V2
MinAgentVersion: 2.0.0

Tasks:
  # 1) Dependency: sub-deploy the runtime release first (a registered, delivered V2 dependency)
  - Type: Deploy/v2
    ReleaseId: ID.Runtime@1.1.0
    Weight: 30

  # 2) Main install as a verified, self-cleaning group — Windows only
  - Type: Group/v2
    Weight: 50
    Rule:
      conditions:
        and:
          - field: $.device.os.name
            operator: equals
            value: windows
    Tasks:
      - Type: Execute/v2          # install
        DeployType: MSI
        ExeFile: main-app.msi
        Arguments: '/qn INSTALLDIR="C:\Program Files\MainApp" DEVICE={Device.id}'
        LaunchTimeoutSec: 90
        ExecutionTimeoutMin: "{Release.metadata.timeoutInstallation}"
      - Type: Verification/v2      # confirm it is healthy (gates the group)
        DeployType: API
        Target: "http://localhost:9000/health"
        GraceTimeSec: 120
      - Type: Revert/v2            # if the check fails, uninstall what we just installed
        DeployType: MSI_Uninstall
        Target: "{Release.metadata.productCode}"

  # 3) Post-install script — rule written as an inline JSON string
  - Type: Execute/v2
    DeployType: Script
    ExeFile: post-install.ps1
    Weight: 20
    Rule: '{"conditions":{"and":[{"field":"$.device.type","operator":"equals","value":"Namer"}]}}'
    Arguments: "-Site {Config.device.site}"
```

## What the agent does, in order

1. Validates the whole manifest and the `ID.Runtime@1.1.0` sub-tree
2. Confirms agent version ≥ `2.0.0`
3. Installs `ID.Runtime@1.1.0` as a nested Deploy V2 (task 1)
4. On Windows devices, runs the group (task 2): installs `main-app.msi`, then verifies
   `/health` within the grace window. If the check **passes**, the revert ends `Skipped` and
   the group is `Done`; if it **fails**, the revert uninstalls the MSI and the deploy stops in
   failure
5. On `Namer` devices, runs `post-install.ps1` with the resolved `-Site` argument (task 3)
6. Marks the deploy `Done` — or fails at the first task that errors, times out, or whose
   check/rule fails

## See also

- [Tasks](./deploy-v2-tasks)
- [Action](./deploy-v2-action)
- [Orchestrator](./deploy-v2-orchestrator)
