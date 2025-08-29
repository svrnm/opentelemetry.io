---
title: デプロイメント
description: OpenTelemetryコレクターをデプロイするために適用できるパターン
weight: 3
---

The OpenTelemetry Collector consists of a single binary which you can use in
different ways, for different use cases. This section describes deployment
patterns, their use cases along with pros and cons and best practices for
collector configurations for cross-environment and multi-backend deployments.
For deployment security considerations, see [Collector hosting best
practices][security].

## リソース {#resources}

- KubeCon NA 2021の[OpenTelemetryコレクターデプロイメントパターン][y-patterns]に関する講演
- 講演に付随する[デプロイメントパターン][gh-patterns]

[security]: /docs/security/hosting-best-practices/
[gh-patterns]: https://github.com/jpkrohling/opentelemetry-collector-deployment-patterns/
[y-patterns]: https://www.youtube.com/watch?v=WhRrwSHDBFs
