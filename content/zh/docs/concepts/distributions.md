---
title: Distributions（发行版）
description: >-
  发行版是 OpenTelemetry 组件的定制版本，不应与“分支（fork）”混淆。
weight: 190
---

OpenTelemetry 项目由多个支持不同[信号](../signals)的[组件](../components)构成。
其官方参考实现包括： The reference implementation of
OpenTelemetry is available as:

- 各语言的[自动插桩库](../instrumentation)
- 一个 [Collector 二进制文件](/docs/concepts/components/#collector)

任何参考实现都可以进行定制，形成一个发行版（Distribution）。

## What is a distribution?

A distribution is a customized version of an OpenTelemetry component. A
distribution is a wrapper around an upstream OpenTelemetry repository with some
customizations. Distributions are not to be confused with forks.

发行版中的定制内容可能包括：

- 用于简化使用流程或对某个后端/厂商环境定制的脚本
- 为了适配特定后端、厂商或最终用户而修改的默认设置
- 面向厂商或最终用户的额外打包选项
- 比 OpenTelemetry 原生实现更广的测试、性能或安全覆盖
- OpenTelemetry 尚未提供的附加功能
- 注意：**发行版的技术支持由发行版的作者负责，非 OpenTelemetry 官方团队。**

发行版大致可分为以下几类：

- **"Pure":** These distributions provide the same functionality as upstream and
  are 100% compatible. Customizations typically enhance the ease of use or
  packaging. These customizations may be backend, vendor, or end-user specific.
- **"Plus":** These distributions provide added functionalities on top of
  upstream through additional components. Examples include instrumentation
  libraries or vendor exporters not upstreamed to the OpenTelemetry project.
- **"Minus":** These distributions provide a subset of functionality from
  upstream. Examples of this include the removal of instrumentation libraries or
  receivers, processors, exporters, or extensions found in the OpenTelemetry
  Collector project. These distributions may be provided to increase
  supportability and security considerations.

## 谁可以创建发行版？{#who-can-create-a-distribution}

Anyone can create a distribution. Today, several [vendors](/ecosystem/vendors/)
offer [distributions](/ecosystem/distributions/). In addition, end-users can
consider creating a distribution if they want to use components in the
[Registry](/ecosystem/registry/) that are not upstreamed to the OpenTelemetry
project.

## 贡献还是发行？{#contribution-or-distribution}

在深入学习如何创建发行版之前，建议你先思考一下：
你对某个 OpenTelemetry 组件的改动是否对所有用户都有价值？是否应该合并到官方参考实现中？

- 你编写的“易用性脚本”能否被通用化？
- 你修改的默认设置是否对大多数用户都更合适？
- 你添加的打包方式是否确实特定于某个使用场景？
- 你增加的测试、性能或安全覆盖能否直接用于参考实现？
- 你新增的功能是否可能成为 OpenTelemetry 的标准部分？是否与社区沟通过？

## 创建你自己的发行版 {#creating-your-own-distribution}

### Collector 发行版 {#collector}

你可以参考以下博客文章了解如何创建属于你自己的 Collector 发行版：
[如何构建属于你的 OpenTelemetry Collector 发行版](https://medium.com/p/42337e994b63)

如果你正计划构建一个 Collector 发行版，可以使用官方的
[OpenTelemetry Collector Builder 工具](https://github.com/open-telemetry/opentelemetry-collector/tree/main/cmd/builder)
作为起点。

### 语言特定的自动插桩库 {#language-specific-instrumentation-libraries}

不同语言的自动插桩库也提供了定制扩展机制。例如：

- [Java agent 扩展机制](/docs/zero-code/java/agent/extensions)

## Follow the guidelines

如果你在发行版中使用了 OpenTelemetry 项目的标识（如 logo、名称等），
请务必遵循 [OpenTelemetry 品牌使用指南][guidelines]。

The OpenTelemetry project does not certify distributions at this time. 目前，OpenTelemetry 项目**尚未提供发行版认证机制**。未来可能会效仿 Kubernetes 项目，
引入认证与合作伙伴机制。在评估某个发行版时，请确保它不会导致供应商锁定（Vendor Lock-in）。 When evaluating a distribution, ensure using the
distribution does not result in vendor lock-in.

> Any support for a distribution comes from the distribution authors and not the
> OpenTelemetry authors.

[guidelines]: https://github.com/open-telemetry/community/blob/main/marketing-guidelines.md
