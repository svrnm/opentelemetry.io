---
title: 从 OpenTracing 迁移
linkTitle: OpenTracing
weight: 2
cSpell:ignore: codebases
---

Backward compatibility with [OpenTracing][] has been a priority for the
OpenTelemetry project from the start. OpenTelemetry 项目自从诞生以来，[OpenTracing][] 的向后兼容性就是优先事项之一。
为了简化迁移过程，OpenTelemetry 支持在同一代码库中同时使用 OpenTelemetry **和**
OpenTracing API。这样就可以使用 OpenTelemetry SDK 记录 OpenTracing 的插桩数据。
This allows OpenTracing instrumentation to be recorded using OpenTelemetry SDKs.

为实现这一点，每个 OpenTelemetry SDK 都提供了一个 **OpenTracing Shim**，
它充当 OpenTracing API 和 OpenTelemetry SDK 之间的桥梁。请注意，OpenTracing Shim 默认是禁用的。
Note that OpenTracing shims are disabled by default.

## 语言版本支持 {#language-version-support}

Before using an OpenTracing shim, check your project's language and runtime
component versions, and update if necessary. 在使用 OpenTracing Shim 之前，请检查你的编程语言和运行时组件版本，
并在必要时进行更新。下表列出了 OpenTracing 和 OpenTelemetry API 的最低**语言**版本要求：

| 语言             | OpenTracing API      | OpenTelemetry API    |
| -------------- | -------------------- | -------------------- |
| [Go][]         | 1.13 | 1.16 |
| [Java][]       | 7                    | 8                    |
| [Python][]     | 2.7  | 3.6  |
| [JavaScript][] | 6                    | 8.5  |
| [.NET][]       | 1.3  | 1.4  |
| [C++][]        | 11                   | 11                   |

请注意，OpenTelemetry API 和 SDK 通常比 OpenTracing 要求更高的语言版本。

## 迁移概述 {#migration-overview}

Many codebases are currently instrumented with OpenTracing. 目前许多代码库都使用 OpenTracing 进行了插桩。这些代码库使用 OpenTracing API
来对应用代码进行插桩，并/或安装 OpenTracing 插件以对其使用的库和框架进行插桩。

迁移到 OpenTelemetry 的通用方法总结如下：

1. 安装 OpenTelemetry SDK，并移除当前的 OpenTracing 实现，例如 Jaeger 客户端。
2. 安装 OpenTelemetry 的插桩库，并移除对应的 OpenTracing 版本。
3. 更新插桩盘、告警等以消费新的 OpenTelemetry 数据。
4. 编写新应用代码时，全部使用 OpenTelemetry API 进行插桩。
5. 逐步用 OpenTelemetry API 重新对应用进行插桩。并不强制移除已有的
   OpenTracing API 调用，它们仍然可以正常工作。
   There is no hard requirement to remove existing OpenTracing API calls from
   your application, they will continue to work.

如上所述，迁移一个大型应用可能需要显著的工作量，我们建议 OpenTracing
用户逐步迁移他们的应用代码。这样可以减轻迁移负担，避免可观测性中断。 This will ease the burden of migration and help avoid breaks
in observability.

以下步骤展示了一种谨慎的、渐进式的 OpenTelemetry 迁移路径。

### 第 1 步：安装 OpenTelemetry SDK {#step-1-install-the-opentelemetry-sdk}

在更改任何插桩之前，请确保可以切换到 OpenTelemetry SDK，而不会导致当前应用发送的遥测数据中断。
单独完成这一步（不引入任何新插桩）是推荐做法，因为这样更容易判断是否出现了插桩中断。 Doing this step on its own – without simultaneously introducing
any new instrumentation – is recommended, as it makes it easier to determine
whether there is any kind of break in instrumentation.

1. 用 OpenTelemetry SDK 替换你当前使用的 OpenTracing Tracer 实现。例如，
   如果你在使用 Jaeger，请移除 Jaeger 客户端并安装对应的 OpenTelemetry 客户端。 For example, if you are using the Jaeger, remove the
   Jaeger client and install the equivalent OpenTelemetry client.
2. Install the OpenTracing Shim. 安装 OpenTracing Shim。该 shim 允许 OpenTelemetry SDK 消费 OpenTracing 的插桩数据。
3. 配置 OpenTelemetry SDK，以使用与之前 OpenTracing 客户端相同的协议和格式导出数据。
   例如，如果你使用的是以 Zipkin 格式导出数据的 OpenTracing 客户端，请将 OpenTelemetry 客户端配置为使用相同格式。 For example, if you were using
   an OpenTracing client that exported tracing data in Zipkin format, configure
   the OpenTelemetry client to do the same.
4. 或者，将 OpenTelemetry SDK 配置为发出 OTLP 数据，并将其发送至 Collector，在 Collector 中管理以多种格式导出数据。

安装好 OpenTelemetry SDK 后，请确认你可以部署应用并继续接收基于 OpenTracing
的遥测数据。换句话说，确认你的插桩盘、告警和其他基于追踪的分析工具仍能正常工作。 In other
words, confirm that your dashboards, alerts, and other tracing-based analysis
tools are still working.

### 第 2 步：逐步替换插桩 {#step-2-progressively-replace-instrumentation}

安装 OpenTelemetry SDK 后，所有新插桩现在都可以使用 OpenTelemetry API 编写。
除少数情况外，OpenTelemetry 与 OpenTracing 的插桩可以无缝协同工作
（见下文的[兼容性限制](#limits-on-compatibility)）。 With few exceptions, OpenTelemetry and
OpenTracing instrumentation will work together seamlessly (see
[limits on compatibility](#limits-on-compatibility) below).

What about existing instrumentation? There is no hard requirement to migrate
existing application code to OpenTelemetry. However, we do recommend migrating
from any OpenTracing instrumentation libraries – libraries used to instrument
web frameworks, HTTP clients, database clients, etc. – to their OpenTelemetry
equivalents. This will improve support, as many OpenTracing libraries will be
retired and may no longer be updated.

It is important to note that when switching to an OpenTelemetry instrumentation
library, the data which is produced will change. OpenTelemetry has an improved
model for how we instrument software (what we refer to as our "semantic
conventions"). In many cases, OpenTelemetry produces better, more comprehensive
tracing data. However, "better" also means "different." This means that existing
dashboards, alerts, etc. based on older OpenTracing instrumentation libraries
may no longer work when those libraries are replaced.

对于现有的插桩，建议按照以下步骤操作：

1. 将某一部分 OpenTracing 插桩替换为其 OpenTelemetry 等价物。
2. Observe how this changes the telemetry which your application produces.
3. Create new dashboards, alerts, etc which consume this new telemetry. 创建新的插桩盘、告警等以消费这些新数据。务必在将新的 OpenTelemetry
   库部署到生产环境之前设置好这些插桩盘。
4. Optionally, add processing rules to the Collector which converts the new
   telemetry back into the old telemetry. The Collector can then be configured
   to emit both versions of the same telemetry, creating a data overlap. This
   allows new dashboards to populate themselves while you continue to use the
   old dashboards.

## 兼容性限制 {#limits-on-compatibility}

本节将描述除前述[语言版本限制](#language-version-support)之外的兼容性限制。

### 语义约定 {#semantic-conventions}

As mentioned above, OpenTelemetry has an improved model for instrumenting
software. 如前所述，OpenTelemetry 提供了改进的软件插桩模型。这意味着，OpenTracing 设置的
“tags” 可能与 OpenTelemetry 设置的 “attributes” 不同。换句话说，替换现有插桩时，
OpenTelemetry 产生的数据可能与 OpenTracing 不一致。 In other words, when replacing existing instrumentation, the data
OpenTelemetry produces may be different from the data OpenTracing produces.

再次强调：更改插桩时，请同步更新所有依赖旧数据的插桩盘、告警等内容。

### Baggage

在 OpenTracing 中，Baggage 是与 Span 关联的 SpanContext 对象一起携带的。而在
OpenTelemetry 中，上下文和传播是更底层的概念：Span、Baggage、指标工具等都是通过上下文对象传递的。 In OpenTelemetry, context and propagation are lower-level concepts –
spans, baggage, metrics instruments, and other items are carried within a
context object.

由于这种设计上的变化，通过 OpenTracing API 设置的 Baggage 无法被 OpenTelemetry
的 Propagator 访问。因此，在使用 Baggage 时不建议混用 OpenTelemetry 和 OpenTracing API。 As a result, mixing the
OpenTelemetry and OpenTracing APIs is not recommended when using baggage.

具体来说，当使用 OpenTracing API 设置 Baggage 时：

- 无法通过 OpenTelemetry API 访问；
- 无法通过 OpenTelemetry Propagator 进行注入。

如果你在使用 Baggage，建议所有与 Baggage 相关的 API 调用同时切换到 OpenTelemetry。
在部署这些变更前，请确认所有关键的 Baggage 项仍能正确传递。 Be sure to check that any
critical baggage items are still being propagated before rolling these changes
into production.

### JavaScript 中的上下文管理 {#context-management-in-javascript}

在 JavaScript 中，OpenTelemetry API 使用了通用的上下文管理器，比如 Node.js 的
`async_hooks` 和浏览器中的 `Zones.js`。与需要手动将 Span 参数传递给每个方法相比，
这些上下文管理器使追踪更易于实现，侵入性更低。
These context managers make tracing instrumentation a much less invasive and
onerous task, compared to adding a span as a parameter to every method which
needs to be traced.

However, the OpenTracing API predates the common use of these context managers.
OpenTracing code which passes the current active span as a parameter may create
problems when mixed with OpenTelemetry code that stores the active span in a
context manager. Using both methods within the same trace may create broken or
mismatched spans, and is not recommended.

我们建议你按完整的代码路径将 OpenTracing 迁移至 OpenTelemetry，避免在同一链路中混用两套 API。

## 规范与实现细节 {#specification-and-implementation-details}

For details on how each OpenTracing shim works, see the appropriate
language-specific documentation. 关于各语言中 OpenTracing Shim 的工作原理，请参阅对应的语言文档。关于
OpenTracing Shim 的设计细节，请参阅 [OpenTracing 兼容性文档][ot_spec]。

[.net]: /docs/languages/dotnet/shim/
[go]: https://pkg.go.dev/go.opentelemetry.io/otel/bridge/opentracing
[java]: https://github.com/open-telemetry/opentelemetry-java/tree/main/opentracing-shim
[javascript]: https://www.npmjs.com/package/@opentelemetry/shim-opentracing
[opentracing]: https://opentracing.io
[ot_spec]: /docs/specs/otel/compatibility/opentracing/
[python]: https://opentelemetry-python.readthedocs.io/en/stable/shim/opentracing_shim/opentracing_shim.html
[c++]: https://github.com/open-telemetry/opentelemetry-cpp/tree/main/opentracing-shim
