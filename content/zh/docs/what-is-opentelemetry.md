---
title: 什么是 OpenTelemetry？
description: 简短说明 OpenTelemetry 是什么，不是什么。
aliases:
  [
    /about,
    "OpenTelemetry

      是一个[可观测性](/docs/concepts/observability-primer/#what-is-observability)框架和工具包，

      旨在创建和管理遥测数据，如[链路](/docs/concepts/signals/traces/)、

      [指标](/docs/concepts/signals/metrics/)和[日志](/docs/concepts/signals/logs/)。

      重要的是，OpenTelemetry 对供应商和工具是中立的，这意味着它可以与各种可观测性后端一起使用，

      包括 [Jaeger](https://www.jaegertracing.io/) 和

      [Prometheus](https://prometheus.io/) 这类开源工具以及商业化产品。",
    /otel
  ]
weight: 150
cSpell:ignore: youtube
---

OpenTelemetry 被设计为可扩展的。一些扩展 OpenTelemetry 的例子包括：

- An **[observability] framework and toolkit** designed to facilitate the

  - [Generation][instr]
  - Export
  - [Collection](../concepts/components/#collector)

  of [telemetry data][] such as [traces], [metrics], and [logs].

- **Open source**, as well as **vendor- and tool-agnostic**, meaning that it can
  be used with a broad variety of observability backends, including open source
  tools like [Jaeger] and [Prometheus], as well as commercial offerings.
  OpenTelemetry is **not** an observability backend itself.

A major goal of OpenTelemetry is to enable easy instrumentation of your
applications and systems, regardless of the programming language,
infrastructure, and runtime environments used.

The backend (storage) and the frontend (visualization) of telemetry data are
intentionally left to other tools.

<div class="td-max-width-on-larger-screens">
{{< youtube iEEIabOha8U >}}
</div>

For more videos in this series and additional resources, see
[What next?](#what-next)

## 什么是可观测性？ {#what-is-observability}

[Observability] is the ability to understand the internal state of a system by
examining its outputs. In the context of software, this means being able to
understand the internal state of a system by examining its telemetry data, which
includes traces, metrics, and logs.

To make a system observable, it must be [instrumented][instr]. That is, the code
must emit [traces], [metrics], or [logs]. The instrumented data must then be
sent to an observability backend.

## 为什么选择 OpenTelemetry？ {#why-opentelemetry}

随着云计算、微服务架构的兴起和日益复杂的业务需求，软件和基础设施的可观测性需求比以往任何时候都要强烈。

OpenTelemetry 满足可观测性的需求，并遵循两个关键原则：

1. 你所生成的数据归属于你自己，不会被供应商锁定。 There's no vendor lock-in.
2. 你只需要学习一套 API 和约定。

这两个原则的结合赋予团队和组织在当今现代计算世界中所需的灵活性。

如果你想了解更多信息，请查阅 OpenTelemetry
的[使命、愿景和价值观](/community/mission/)。

## 主要的 OpenTelemetry 组件 {#main-opentelemetry-components}

OpenTelemetry 包括以下主要组件：

- 适用于所有组件的[规范](/docs/specs/otel)
- 定义遥测数据形状的标准[协议](/docs/specs/otlp/)
- 为常见遥测数据类型定义标准命名方案的[语义约定](/docs/specs/semconv/)
- 定义如何生成遥测数据的 API
- 实现规范、API 和遥测数据导出的[语言 SDK](/docs/languages)
- 实现常见库和框架的仪表化的[库生态系统](/ecosystem/registry)
- 可自动生成遥测数据的自动仪表化组件，无需更改代码
- [OpenTelemetry Collector](/docs/collector)：接收、处理和导出遥测数据的代理
- 各种其他工具，
  如[用于 Kubernetes 的 OpenTelemetry Operator](/docs/platforms/kubernetes/operator/)、
  [OpenTelemetry Helm Charts](/docs/platforms/kubernetes/helm/) 和
  [FaaS 的社区资产](/docs/platforms/faas/)

OpenTelemetry 广泛应用于许多已集成 OpenTelemetry
提供默认可观测性的[库、服务和应用](/ecosystem/integrations/)。

OpenTelemetry 得到众多[供应商](/ecosystem/vendors/)的支持，其中许多为
OpenTelemetry 提供商业支持并直接为此项目做贡献。

## 可扩展性 {#extensibility}

OpenTelemetry is designed to be extensible. Some examples of how it can be
extended include:

- 向 OpenTelemetry Collector 添加接收器以支持来自自定义源的遥测数据
- 将自定义仪表化库加载到 SDK 中
- 创建适用于特定用例的 SDK 或 Collector 的[分发](/docs/concepts/distributions/)
- 为尚不支持 OpenTelemetry 协议（OTLP）的自定义后端创建新的导出器
- 为非标准上下文传播格式创建自定义传播器

尽管大多数用户可能不需要扩展 OpenTelemetry，但此项目几乎每个层面都可以实现扩展。

## 历史 {#history}

OpenTelemetry 是[云原生计算基金会 (CNCF)](https://www.cncf.io)的一个项目，是由
OpenTracing 和 OpenCensus 项目合并而成的。原来这两个项目都是为解决同样的问题而创建的：
缺乏一种标准的方法来为代码进行仪表化并将遥测数据发送到可观测性后端。
由于这两个项目都无法独立解决这个问题，所以将其合并成立了 OpenTelemetry，
吸收了双方的优势，提供了统一的解决方案。
Both of these projects were created to solve the same problem: the lack of a
standard for how to instrument code and send telemetry data to an Observability
backend. As neither project was fully able to solve the problem independently,
they merged to form OpenTelemetry and combine their strengths while offering a
single solution.

如果你目前正在使用 OpenTracing 或 OpenCensus，
你可以在[迁移指南](/docs/migration/)中了解如何迁移到 OpenTelemetry。

[merger]: https://www.cncf.io/blog/2019/05/21/a-brief-history-of-opentelemetry-so-far/

## 接下来做什么？ {#what-next}

- 参阅[入门指南](/docs/getting-started/) &mdash; 立即开始！
- 了解 [OpenTelemetry 的概念](/docs/concepts/)。
- [Watch videos][] from the [OTel for beginners][] or other [playlists].
- Sign up for [training](/training), including the **free course**
  [Getting started with OpenTelemetry](/training/#courses).

[Cloud Native Computing Foundation]: https://www.cncf.io
[instr]: ../concepts/instrumentation
[Jaeger]: https://www.jaegertracing.io/
[logs]: ../concepts/signals/logs/
[metrics]: ../concepts/signals/metrics/
[observability]: ../concepts/observability-primer/#what-is-observability
[OTel for beginners]: https://www.youtube.com/playlist?list=PLVYDBkQ1TdyyWjeWJSjXYUaJFVhplRtvN
[playlists]: https://www.youtube.com/@otel-official/playlists
[Prometheus]: https://prometheus.io/
[telemetry data]: ../concepts/signals/
[traces]: ../concepts/signals/traces/
[Watch videos]: https://www.youtube.com/@otel-official
