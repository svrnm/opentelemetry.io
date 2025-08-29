---
title: 宣布启动 RPC 语义约定稳定性项目
linkTitle: 稳定 RPC 语义约定
date: 2025-06-02
author: >-
  [Liudmila Molkova](https://github.com/lmolkova)（微软）、[Trask Stalnaker](https://github.com/trask)（微软）
sig: Semantic Conventions
cSpell:ignore: Dubbo Liudmila Molkova
---

语义约定 SIG 很高兴宣布正式启动 RPC 稳定性推进工作！

继 2025 年 5 月数据库语义约定完成稳定后，我们将继续推进关键领域的标准化，而 RPC 是下一个重点。

It takes a village to define a solid convention, especially for a space as
diverse as RPC technologies, which include gRPC, JSON-RPC, Apache Dubbo, and
many others. If you work on one of these frameworks, use them extensively, or
are simply interested in learning more, come join us—we’d love your help!

## 致力于构建可靠的遥测约定 {#towards-reliable-telemetry-conventions}

Reliable, well-defined conventions are the runway for richer telemetry
experiences. When signal and attribute names stay consistent, everyone can spend
their time building alerts, dashboards, and visualizations - not firefighting
breaking changes.

现有的实验性约定已被使用了一段时间，我们也意识到对相关探针做出破坏性更改将带来干扰。

但我们坚信，从长远来看，这些更改对于实现高质量、可操作的遥测数据是必不可少的。

为了平稳过渡，
我们将遵循一项[温和迁移计划](https://github.com/open-telemetry/semantic-conventions/blob/v1.34.0/docs/rpc/rpc-spans.md?plain=1#L26-L50)。
各类探针库将：
Instrumentation libraries will:

- Ship the new semantic conventions behind an opt-in flag, side-by-side with the
  existing ones,
- Maintain both versions of conventions for an extended period,
- 提供详细的迁移指南。

## 语义约定如何完成“稳定”？ {#how-does-semantic-convention-stabilization-work}

During the stabilization phase, we review existing conventions to ensure they
offer meaningful insights for most applications using the technology. We check
that the conventions enable generic instrumentation with reasonable performance
overhead, while also accounting for privacy, telemetry volume, consistency, and
correlation with higher-level application and lower-level transport telemetry.

We aim for conventions that are useful, usable, and extensible.

关于 RPC，我方将聚焦以下关键领域：

- **Essential signals**: We aim to define a core set of telemetry signals, such
  as client/server spans and call duration histograms, that can be recorded
  consistently across frameworks. These support common debugging workflows and
  RED (rate, errors, duration) metrics. We'll review existing conventions,
  identify core attributes, and document both their generic definitions and
  framework-specific applications.

- **Framework-specific telemetry**: We encourage frameworks to extend the
  generic conventions with additional attributes, spans, or metrics that reflect
  their specific features. **框架特定遥测**：我们鼓励各框架在通用约定基础上，扩展其特有属性、span 或指标。
  例如社区维护的 [gRPC metrics](https://grpc.io/docs/guides/opentelemetry-metrics/)。
  我们也将审查这些扩展内容。

- **适用范围**：双向流式调用天然存在可观测性限制，我们将评估哪些信号具有现实可行性。 We’ll evaluate which useful signals can realistically be
  captured.

- **一致性与最佳实践**：我们过去几年在命名、记录对端信息和错误方面积累了不少最佳实践，
  RPC 约定也将对齐这些新准则。 RPC conventions
  will be updated to align with these latest guidelines.

- **Prototyping**: A key requirement for stabilization is having real-world
  instrumentations and prototypes that follow the conventions. These
  implementations provide critical feedback on clarity, feasibility, and
  practical value, and help validate that the approach works across different
  libraries and protocols.

## 如何参与？ {#how-to-get-involved}

We're looking for contributors with experience in any popular RPC frameworks, as
well as anyone interested in building instrumentation prototypes. 我们正在寻找熟悉任何主流 RPC 框架的开发者，也欢迎希望参与原型探针开发的贡献者。
如果你有兴趣参与，请在
[RPC 稳定化项目提案](https://github.com/open-telemetry/community/issues/1859)下留言，
与我们一同推进这个项目。
