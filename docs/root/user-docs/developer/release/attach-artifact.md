---
id: attach-artifact
title: Attach an Artifact
sidebar_label: Attach an Artifact
sidebar_position: 3
---

# Attach an Artifact

Pull an artifact onto a release from somewhere it already exists, instead of uploading fresh
bytes.

**Permission level:** `upload-artifact`

## Where it lives

[Create a Release](./create-release) → Components step → **Attach from source**.

## Choose a source

| Source | What it browses |
|---|---|
| **Object storage** | Files already uploaded to the bucket |
| **Container registry** | OCI (docker) images from configured registries |
| **RPM repository** | Packages from configured yum repos |
| **APT repository** | `.deb` packages from configured apt repos |

![Attach from source — Select source step, showing the four source options: Object storage, Container registry, RPM repository, APT repository](/img/manual/release/attach-select-source.png)

## Browse & select

Search within the chosen source (server-side filtered), multi-select as many items as you
need, and scroll for more — the list loads more automatically as you near the bottom. An item
already on the release is marked **On release**, since two artifacts can't share a name.

![Attach from source — Browse & select step, searching "agent" within Object storage with one log file selected](/img/manual/release/attach-browse-select.png)

## Review

A final list of everything you picked, each removable before confirming. **Attach** adds them
all to the release.

![Attach from source — Review step, showing the one selected file ready to Attach](/img/manual/release/attach-review.png)

:::note Not install-bound by default
Attached artifacts arrive without the install flag — go back to the Components list afterward
to mark whichever one is the actual installer.
:::

## See also

- [Create a Release](./create-release)
- [Overview](./release-overview)
