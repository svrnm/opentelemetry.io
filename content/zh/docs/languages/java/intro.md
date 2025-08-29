---
title: OpenTelemetry Java 入门
description: OpenTelemetry Java 生态系统入门
weight: 9
---

OpenTelemetry Java 是为 Java 生态系统打造的一套 OpenTelemetry 可观测性工具集。
从宏观层面来看，它由 API、SDK 和插桩（instrumentation）三部分组成。 At a high level, it consists of the API, the SDK, and
instrumentation.

本页面将介绍该生态系统，包括概念性的[概述](#overview)、一份[文档导航](#navigating-the-docs)指南
，以及一份含发版信息和构件等关键详情的[仓库](#repositories)清单。

## 概述 {#overview}

The API is a set of classes and interfaces for recording telemetry across key
observability signals. It supports multiple implementations, with a low-overhead
minimalist Noop (i.e. pronounced "no-op") and SDK reference implementation
provided out of the box. It is designed to be taken as a direct dependency by
libraries, frameworks, and application owners looking to add instrumentation. It
comes with strong backwards compatibility guarantees, zero transitive
dependencies, and supports Java 8+.

The SDK is the built-in reference implementation of the API, processing and
exporting telemetry produced by instrumentation API calls. SDK 是 API 的内置参考实现，用于处理和导出由插桩 API 调用生成的遥测数据。
配置 SDK 以进行适当的处理和导出是将 OpenTelemetry 集成到应用程序中的重要步骤。
SDK 提供自动配置和编程式配置选项。 The SDK has autoconfiguration and
programmatic configuration options.

Instrumentation records telemetry using the API. There are a variety of
categories of instrumentation, including: zero-code Java agent, zero-code Spring
Boot starter, library, native, manual, and shims.

若需与编程语言无关的概述，请参阅 [OpenTelemetry 概念](/docs/concepts/)。

## 文档导航 {#navigating-the-docs}

OpenTelemetry Java 文档的组织结构如下：

- [通过示例快速入门](../getting-started/)：一个帮助你快速上手 OpenTelemetry Java 的示例，
  演示如何将 OpenTelemetry Java 代理集成到简单的 Web 应用中。
- [插桩生态系统](../instrumentation/)：一份关于 OpenTelemetry Java 插桩生态系统的指南。
  这是供希望将 OpenTelemetry Java 集成到应用程序中的开发者使用的核心资源。
  了解插桩的不同类型，并确定最适合你的方案。 This is a key resource for application authors
  looking to integrate OpenTelemetry Java into applications. Learn about the
  different categories of instrumentation, and decide which is right for you.
- [使用 API 记录遥测数据](../api/)：一份关于 OpenTelemetry API 的技术参考文档，其中通过
  可运行的代码示例探讨了该 API 的所有关键方面。
  大多数用户会将本页面当作工具书使用，根据需求查阅各章节索引，而非从头至尾通读。 Most users will use this page like an encyclopedia, consulting the
  index of sections as needed, rather than reading front to back.
- [使用 SDK 管理遥测数据](../sdk/)：一份关于 OpenTelemetry SDK 的技术参考文档，其中通过
  可运行的代码示例，探讨了 SDK 的所有插件扩展点以及编程式配置 API。
  大多数用户会将本页面当作工具书使用，根据需求查阅各章节索引，而非从头至尾通读。 Most users will use
  this page like an encyclopedia, consulting the index of sections as needed,
  rather than reading front to back.
- [Configure the SDK](../configuration/): A technical reference for configuring
  the SDK, focussing on zero-code autoconfiguration. Includes a reference of all
  supported environment variables and system properties for configuring the SDK.
  Explores all programmatic customization points with working code examples.
  Most users will use this page like an encyclopedia, consulting the index of
  sections as needed, rather than reading front to back.
- **了解更多**：补充资源包括端到端
  [示例](../examples/)、 [Java 文档](../api/)、 组件[注册表](../registry/)和
  [性能参考文档](/docs/zero-code/java/agent/performance/)。

## 仓库 {#repositories}

OpenTelemetry Java 的源代码被组织在多个代码仓库中：

| 仓库                                                                                                         | 描述                                                 | Group ID                           | 当前 版本                                | Release cadence                                                                                                             |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| [opentelemetry-java](https://github.com/open-telemetry/opentelemetry-java)                                 | API 和 SDK 核心组件                                     | `io.opentelemetry`                 | `{{% param vers.otel %}}`            | [每月第一个周一之后的周五](https://github.com/open-telemetry/opentelemetry-java/blob/main/RELEASING.md#release-cadence)                 |
| [opentelemetry-java-instrumentation](https://github.com/open-telemetry/opentelemetry-java-instrumentation) | 由 OpenTelemetry 官方维护的插桩工具，包括 OpenTelemetry Java 代理 | `io.opentelemetry.instrumentation` | `{{% param vers.instrumentation %}}` | [每月第二个周一之后的周三](https://github.com/open-telemetry/opentelemetry-java-instrumentation/blob/main/RELEASING.md#release-cadence) |
| [opentelemetry-java-contrib](https://github.com/open-telemetry/opentelemetry-java-contrib)                 | 由社区维护的组件，这些组件不适合纳入其他仓库的明确范围                        | `io.opentelemetry.contrib`         | `{{% param vers.contrib %}}`         | [每月第二个周一之后的周五](https://github.com/open-telemetry/opentelemetry-java-contrib/blob/main/RELEASING.md#release-cadence)         |
| [semantic-conventions-java](https://github.com/open-telemetry/semantic-conventions-java)                   | 为实现语义约定而自动生成的代码                                    | `io.opentelemetry.semconv`         | `{{% param vers.semconv %}}`         | 紧随[语义约定（semantic-conventions）](https://github.com/open-telemetry/semantic-conventions)的发布之后                                 |
| [opentelemetry-proto-java](https://github.com/open-telemetry/opentelemetry-proto-java)                     | 为 OTLP 协议自动生成的绑定代码                                 | `io.opentelemetry.proto`           | `1.3.2-alpha`                        | 紧随 [OpenTelemetry 协议定义（opentelemetry-proto）](https://github.com/open-telemetry/opentelemetry-proto)的发布之后                    |
| [opentelemetry-java-examples](https://github.com/open-telemetry/opentelemetry-java-examples)               | 展示使用 API、SDK 和插装工具的多种模式的端到端代码示例                    | n/a                                | n/a                                  | n/a                                                                                                                         |

`opentelemetry-java`、`opentelemetry-java-instrumentation` 和 `opentelemetry-java-contrib` 各自均发布了大量的构件。
请查阅各代码仓库获取详细信息，或查看[物料清单](#dependencies-and-boms)表格中的“管理依赖项”列，以获取完整的管理依赖列表。 Please
consult repositories for details, or see the "Managed Dependencies" column in
the [Bill of Materials](#dependencies-and-boms) table to see a full list of
managed dependencies.

As a general rule, artifacts published from the same repository have the same
version. 一般而言，从同一代码仓库发布的构件具有相同的版本号。
这一规则的例外是 opentelemetry-java-contrib，它可被视为一组独立项目的集合，
这些项目共处同一代码仓库是为了利用共享工具链。
目前，opentelemetry-java-contrib 的构件版本保持一致，但这只是巧合，未来这种情况将会改变。 For now, the artifacts of
`opentelemetry-java-contrib` are aligned but this is a coincidence and will
change in the future.

各代码仓库的发布节奏与其高层级依赖结构相匹配，具体如下：

- `opentelemetry-java` 是核心仓库，每月最先发布。
- `opentelemetry-java-instrumentation` 依赖于 `opentelemetry-java`，随后进行发布。
- `opentelemetry-java-contrib` 依赖于 `opentelemetry-java-instrumentation`
  和 `opentelemetry-java` ，是最后发布的。
- 虽然 `semantic-conventions-java` 是 `opentelemetry-java-instrumentation` 的一个依赖,
  但是它是一个独立构件，拥有独立的发布计划。

## Dependencies and BOMs

[物料清单](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#Bill_of_Materials_.28BOM.29_POMs)，简称 BOM，
是一种用于帮助保持相关依赖项版本一致的构件。
OpenTelemetry Java 发布了多个 BOM，以满足不同的使用场景，按范围从小到大的顺序列出如下。
我们强烈建议使用 BOM。 OpenTelemetry Java publishes several BOMs catering to
different use cases, listed below in order of increasing scope. We highly
recommend using a BOM.

{{% alert %}} 由于这些 BOM 是层级化的，因此不建议依赖多个 BOM，因为这会造成冗余，还可能导致依赖版本解析出现不符合预期的结果。 {{% /alert %}} {{% /alert %}}

点击 “管理依赖项” 列中的链接，即可查看该 BOM 所管理的构件列表。

| 概述                                                     | 仓库                                   | Group ID                           | Artifact ID                               | 当前版本                                       | 管理依赖项                                                 |
| ------------------------------------------------------ | ------------------------------------ | ---------------------------------- | ----------------------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| API 和 SDK 的稳定核心构件                                      | `opentelemetry-java`                 | `io.opentelemetry`                 | `opentelemetry-bom`                       | `{{% param vers.otel %}}`                  | [最新 pom.xml][opentelemetry-bom]                       |
| API 和 SDK 的实验性核心构件, 包括 `opentelemetry-bom` 的全部内容       | `opentelemetry-java`                 | `io.opentelemetry`                 | `opentelemetry-bom-alpha`                 | `{{% param vers.otel %}}-alpha`            | [最新 pom.xml][opentelemetry-bom-alpha]                 |
| 插桩的稳定构件, 包括 `opentelemetry-bom` 的全部内容                  | `opentelemetry-java-instrumentation` | `io.opentelemetry.instrumentation` | `opentelemetry-instrumentation-bom`       | `{{% param vers.instrumentation %}}`       | [最新 pom.xml][opentelemetry-instrumentation-bom]       |
| 插桩的实验性构件, 包括 `opentelemetry-instrumentation-bom` 的全部内容 | `opentelemetry-java-instrumentation` | `io.opentelemetry.instrumentation` | `opentelemetry-instrumentation-bom-alpha` | `{{% param vers.instrumentation %}}-alpha` | [最新 pom.xml][opentelemetry-instrumentation-alpha-bom] |

以下代码片段演示了如何添加 BOM 依赖，
其中 `{{bomGroupId}}`、`{{bomArtifactId}}` 和 `{{bomVersion}}` 分别对应表格中 “Group ID”、“Artifact ID” 和“当前版本”列的值。

{{< tabpane text=true >}} {{% tab "Gradle" %}}

```kotlin
dependencies {
  implementation(platform("{{bomGroupId}}:{{bomArtifactId}}:{{bomVersion}}"))
  // 在构件上添加一个依赖，其版本由该 BOM 管理。
  implementation("io.opentelemetry:opentelemetry-api")
}
```

{{% /tab %}} {{% tab Maven %}}

```xml
<project>
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>{{bomGroupId}}</groupId>
        <artifactId>{{bomArtifactId}}</artifactId>
        <version>{{bomVersion}}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <!-- 在构件上添加一个依赖，其版本由该 BOM 管理。 -->
  <dependencies>
    <dependency>
      <groupId>io.opentelemetry</groupId>
      <artifactId>opentelemetry-api</artifactId>
    </dependency>
  </dependencies>
</project>
```

{{% /tab %}} {{< /tabpane >}}

[opentelemetry-bom]: <https://repo1.maven.org/maven2/io/opentelemetry/opentelemetry-bom/{{% param vers.otel %}}/opentelemetry-bom-{{% param vers.otel %}}.pom>
[opentelemetry-bom-alpha]: <https://repo1.maven.org/maven2/io/opentelemetry/opentelemetry-bom-alpha/{{% param vers.otel %}}-alpha/opentelemetry-bom-alpha-{{% param vers.otel %}}-alpha.pom>
[opentelemetry-instrumentation-bom]: <https://repo1.maven.org/maven2/io/opentelemetry/instrumentation/opentelemetry-instrumentation-bom/{{% param vers.instrumentation %}}/opentelemetry-instrumentation-bom-{{% param vers.instrumentation %}}.pom>
[opentelemetry-instrumentation-alpha-bom]: <https://repo1.maven.org/maven2/io/opentelemetry/instrumentation/opentelemetry-instrumentation-bom-alpha/{{% param vers.instrumentation %}}-alpha/opentelemetry-instrumentation-bom-alpha-{{% param vers.instrumentation %}}-alpha.pom>
