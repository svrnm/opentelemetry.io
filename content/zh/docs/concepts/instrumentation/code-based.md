---
title: 基于代码的方式
description: 了解设置基于代码插桩的基本步骤
weight: 20
aliases: [ manual ]
cSpell:ignore: proxying
---

## 导入 OpenTelemetry API 和 SDK {#import-the-opentelemetry-api-and-sdk}

你首先需要在服务代码中导入 OpenTelemetry。如果你正在开发一个库或其他打算被可运行二进制文件使用的组件，
那么你只需要依赖 API。如果你的构件是一个独立的进程或服务，那么你需要同时依赖 API 和 SDK。
有关 OpenTelemetry API 和 SDK 的更多信息，请参阅[规范](/docs/specs/otel/)。 If you're
developing a library or some other component that is intended to be consumed by
a runnable binary, then you would only take a dependency on the API. If your
artifact is a standalone process or service, then you would take a dependency on
the API and the SDK. For more information about the OpenTelemetry API and SDK,
see the [specification](/docs/specs/otel/).

## 配置 OpenTelemetry API {#configure-the-opentelemetry-api}

In order to create traces or metrics, you'll need to first create a tracer
and/or meter provider. In general, we recommend that the SDK should provide a
single default provider for these objects. You'll then get a tracer or meter
instance from that provider, and give it a name and version. The name you choose
here should identify what exactly is being instrumented -- if you're writing a
library, for example, then you should name it after your library (for example
`com.example.myLibrary`) as this name will namespace all spans or metric events
produced. It is also recommended that you supply a version string (i.e.,
`semver:1.0.0`) that corresponds to the current version of your library or
service.

## 配置 OpenTelemetry SDK {#configure-the-opentelemetry-sdk}

如果你正在构建一个服务进程，你还需要使用适当的选项来配置 SDK，以便将你的遥测数据导出到某个分析后端。
我们建议通过配置文件或其他机制以编程方式处理该配置。每种语言还提供可供调整的选项，你可能希望加以利用。
We recommend that this configuration be handled programmatically through a
configuration file or some other mechanism. There are also per-language tuning
options you may wish to take advantage of.

## 创建遥测数据 {#create-telemetry-data}

在你配置好 API 和 SDK 后，你就可以通过从提供程序获取的 tracer 和 meter
对象来创建链路和指标事件。请为你的依赖项使用插桩库，
即查看[镜像仓库](/ecosystem/registry/)或你所使用语言的代码仓库，以获取更多信息。 Make use of Instrumentation Libraries for your dependencies -- check
out the [registry](/ecosystem/registry/) or your language's repository for more
information on these.

## 导出数据 {#export-data}

Once you've created telemetry data, you'll want to send it somewhere.
一旦你创建了遥测数据，你就需要将它发送出去。OpenTelemetry 支持两种主要的数据导出方式：
直接从进程导出，或通过 [OpenTelemetry Collector](/docs/collector) 代理导出。

进程内导出要求你导入并依赖一个或多个**导出器**，这些库将 OpenTelemetry 的内存中
Span 和指标对象转换为适用于遥测分析工具（如 Jaeger 或 Prometheus）的格式。此外，
OpenTelemetry 支持一种称为 `OTLP` 的传输协议，所有 OpenTelemetry SDK 都支持该协议。
此协议可用于将数据发送到 OpenTelemetry Collector，这是一种独立的二进制进程，
可以作为服务实例的代理或边车运行，也可以在单独的主机上运行。
Collector 可配置为将这些数据转发并导出到你选择的分析工具中。 In addition, OpenTelemetry supports a wire protocol known as `OTLP`,
which is supported by all OpenTelemetry SDKs. This protocol can be used to send
data to the OpenTelemetry Collector, a standalone binary process that can be run
as a proxy or sidecar to your service instances or run on a separate host. The
Collector can then be configured to forward and export this data to your choice
of analysis tools.

除了 Jaeger 或 Prometheus 等开源工具外，越来越多的公司也支持从 OpenTelemetry
接收遥测数据。详情请参阅[供应商](/ecosystem/vendors/)。 For details, see
[Vendors](/ecosystem/vendors/).
