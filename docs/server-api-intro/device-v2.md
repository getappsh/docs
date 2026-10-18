---
id: device-v2
title: Server API — Device V2
sidebar_label: Device V2
---

import SwaggerLink from '@site/src/components/SwaggerLink';

# Server API — Device V2

The V2-only version of the [Device](./device) surface — login, offering, delivery, deploy,
device data / config / restrictions, telemetry, the managed command stream, and diagnostics
endpoints under `/api/v2/...`. This is what the agent's generated V2 client
(`get_app_client`) is built from, so use it when working on agent ↔ server V2 calls.

<SwaggerLink path="/docs/v2/device" />

See also [Device](./device) for the full device surface (v1 and v2), or [V2](./v2) for the
curated resource-grouped view.

<SwaggerLink path="/docs/v2/device" label="Open in Swagger ↗" />
