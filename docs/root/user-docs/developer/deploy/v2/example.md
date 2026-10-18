---
id: deploy-v2-example
title: Example
sidebar_label: Example
sidebar_position: 8
---

# Example

A complete, annotated `install.yaml` exercising the main capabilities from
[Tasks](./deploy-v2-tasks), [Lifecycle Actions](./deploy-v2-lifecycle-actions),
[Action](./deploy-v2-action), and [Orchestrator](./deploy-v2-orchestrator): a version gate, a
dependency, a conditional install with placeholders and metadata-driven timeouts, a grouped
install that's verified and reverted on failure, a post-install script, and separate
`configuration` and `uninstall` actions.

```yaml
# install.yaml — shipped inside release ID.MainApp@2.0.0
ReleaseId: ID.MainApp@2.0.0
Type: Deploy/V2
MinAgentVersion: 2.0.0

Actions:
  install:
    Tasks:
      # 1) Dependency: install the runtime release first (a registered, delivered V2 dependency)
      - Type: Deploy/v2
        ReleaseId: ID.Runtime@1.1.0
        Action: install
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
            Name: install-main-app
            DeployType: MSI
            ExeFile: main-app.msi
            Arguments: '/qn INSTALLDIR="C:\Program Files\MainApp" DEVICE={Device.id} PORT={Config.mainapp.port}'
            LaunchTimeoutSec: 90
            ExecutionTimeoutMin: "{Release.metadata.timeoutInstallation}"
          - Type: Verification/v2      # confirm it is healthy (gates the group)
            DeployType: API
            Target: "http://localhost:{Config.mainapp.port}/health"
            GraceTimeSec: 120
          - Type: Revert/v2            # if the check fails, uninstall what we just installed
            DeployType: MSI_Uninstall
            Target: "{Release.metadata.productCode}"

      # 3) Apply the configuration (runs this release's own configuration action)
      - Type: Deploy/v2
        Action: configuration
        Weight: 20

  configuration:                       # repeatable by default — runs fresh every time
    Tasks:
      - Type: Execute/v2
        DeployType: API
        Method: POST
        Target: "http://localhost:{Config.mainapp.port}/config"
        Body:
          site: "{DeviceConfig.device.meta_data.name}"   # agent runtime setting (scalar)
          settings: "{Config.mainapp}"                    # the whole config group, embedded as JSON
      - Type: Execute/v2
        DeployType: Script
        ExeFile: post-install.ps1
        Rule: '{"conditions":{"and":[{"field":"$.device.type","operator":"equals","value":"Namer"}]}}'
        Arguments: "-ConfigFile {ConfigPath.mainapp}"

  uninstall:
    Tasks:
      - Type: Execute/v2
        DeployType: MSI_Uninstall
        Target: "{Release.metadata.productCode}"
```

## What the agent does, in order

When the release is deployed (the `install` action):

1. Validates the `install` action, every action it runs (`configuration`, and
   `ID.Runtime@1.1.0`'s `install`) and their artifacts
2. Confirms agent version ≥ `2.0.0`
3. Runs `ID.Runtime@1.1.0`'s `install` action as a nested Deploy V2 (task 1)
4. On Windows devices, runs the group (task 2): installs `main-app.msi` on the port from the
   `mainapp` config group, then verifies `/health` within the grace window. If the check
   **passes**, the revert ends `Skipped` and the group is `Done`; if it **fails**, the revert
   uninstalls the MSI and the deploy stops in failure
5. Runs the `configuration` action (task 3): posts the device name and the whole `mainapp` group to
   the app, then — on `Namer` devices — runs `post-install.ps1` with the path of the group's file
6. Marks `install` `Done` and the component `Installed` — or fails at the first task that errors,
   times out, or whose check/rule fails

Later, `POST /api/v2/deploy/action/ID.MainApp@2.0.0/configuration` re-applies the configuration on
its own, and `…/uninstall` removes the app and marks the component `Uninstalled`.

## See also

- [Tasks](./deploy-v2-tasks)
- [Action](./deploy-v2-action)
- [Orchestrator](./deploy-v2-orchestrator)
