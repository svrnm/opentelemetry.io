---
title: Metrics
weight: 2
description: 在运行时捕获的测量值。
---

一个 **metric** 是在运行时捕获的服务的**测量值**。捕获测量值的时刻称为 **metric 事件**，它不仅包括测量值本身，还包括捕获它的时间和相关的元数据。 The moment
of capturing a measurement is known as a **metric event**, which consists not
only of the measurement itself, but also the time at which it was captured and
associated metadata.

Application and request metrics are important indicators of availability and
performance. Custom metrics can provide insights into how availability
indicators impact user experience or the business. Collected data can be used to
alert of an outage or trigger scheduling decisions to scale up a deployment
automatically upon high demand.

要了解 OpenTelemetry 中的 metrics 是如何工作的，让我们看看在对代码进行观测时会涉及的一系列组件。

## Meter Provider {#meter-provider}

A Meter Provider (sometimes called `MeterProvider`) is a factory for `Meter`s.
In most applications, a Meter Provider is initialized once and its lifecycle
matches the application's lifecycle. Meter Provider initialization also includes
Resource and Exporter initialization. It is typically the first step in metering
with OpenTelemetry. In some language SDKs, a global Meter Provider is already
initialized for you.

## Meter {#meter}

Meter 创建 [metric instruments](#metric-instruments)，在运行时捕获有关服务的测量值。Meter 是由 Meter Provider 创建的。 Meters are created from Meter
Providers.

## Metric Exporter {#metric-exporter}

Metric Exporter 将度量数据发送给消费者。这个消费者可以是开发期间用于调试的标准输出、OpenTelemetry Collector，或您选择的任何开源或供应商后端。 This consumer can be standard
output for debugging during development, the OpenTelemetry Collector, or any
open source or vendor backend of your choice.

## Metric Instruments（测量仪器）{#metric-instruments}

在 OpenTelemetry 中，测量值是由 **metric instruments** 捕获的。Metric instruments 由以下部分定义： A metric
instrument is defined by:

- 名称
- Kind
- 单位（可选）
- 描述（可选）

名称、单位和描述由开发人员选择，或者通过[语义约定](/docs/specs/semconv/general/metrics/)为常见的如请求和进程指标定义。

仪器类型如下：

- **Counter**：随着时间的推移累积的值——您可以将其视为汽车的里程表；它只会增加。
- **Asynchronous Counter**：与 **Counter** 相同，但每次导出时收集一次。如果您无法访问连续的增量值，但只能访问聚合值，可以使用它。 Could be used if you don't have access to the continuous
  increments, but only to the aggregated value.
- **UpDownCounter**：随着时间的推移累积的值，但也可以再次下降。例如，队列长度会随着队列中工作项的数量而增加和减少。 An example could be a queue length, it will increase and decrease with
  the number of work items in the queue.
- **Asynchronous UpDownCounter**：与 **UpDownCounter** 相同，但每次导出时收集一次。如果您无法访问连续的变化值，但只能访问聚合值（例如当前队列大小），可以使用它。 Could be used if you don't have access to the
  continuous changes, but only to the aggregated value (e.g., current queue
  size).
- **Gauge**：在读取时测量当前值。例如，车辆中的燃油表。Gauges 是同步的。 An example would
  be the fuel gauge in a vehicle. Gauges are synchronous.
- **Asynchronous Gauge**：与 **Gauge** 相同，但每次导出时收集一次。如果您无法访问连续的变化值，但只能访问聚合值，可以使用它。 Could be used if you don't have access to the continuous changes, but
  only to the aggregated value.
- **Histogram**: A client-side aggregation of values, such as request latencies.
  A histogram is a good choice if you are interested in value statistics. For
  example: How many requests take fewer than 1s?

有关同步和异步仪器的更多信息，以及哪种类型最适合您的用例，请参见[补充指南](/docs/specs/otel/metrics/supplementary-guidelines/)。

## 聚合 {#aggregation}

In addition to the metric instruments, the concept of **aggregations** is an
important one to understand. An aggregation is a technique whereby a large
number of measurements are combined into either exact or estimated statistics
about metric events that took place during a time window. The OTLP protocol
transports such aggregated metrics. The OpenTelemetry API provides a default
aggregation for each instrument which can be overridden using the Views. The
OpenTelemetry project aims to provide default aggregations that are supported by
visualizers and telemetry backends.

与[请求链路追踪](../traces/)不同，后者旨在捕获请求生命周期并为请求的各个部分提供上下文，指标旨在汇总提供统计信息。一些指标的使用示例包括： Some examples of
use cases for metrics include:

- 报告一个服务的不同协议类型所读取的总字节数。
- 报告读取的总字节数和每次请求的字节数。
- 报告系统调用的持续时间。
- 报告请求大小以确定趋势。
- 报告进程的 CPU 或内存使用情况。
- 报告账户的平均余额值。
- 报告当前正在处理的活动请求。

## 视图 {#views}

视图为 SDK 用户提供了灵活性，可以自定义 SDK 输出的指标。您可以自定义要处理或忽略的度量仪器。您还可以自定义聚合和您希望在指标上报告的属性。 You can customize which metric instruments are to be processed or
ignored. You can also customize aggregation and what attributes you want to
report on metrics.

## 语言支持 {#language-support}

指标是 OpenTelemetry 规范中的[稳定性](/docs/specs/otel/versioning-and-stability/#stable)信号。有关 Metrics API 和 SDK 的各个语言特定实现，状态如下： For the individual language specific
implementations of the Metrics API & SDK, the status is as follows:

{{% signal-support-table "metrics" %}}

## 规范 {#specification}

要了解有关 OpenTelemetry 中指标的更多信息，请参见[指标规范](/docs/specs/otel/overview/#metric-signal)。
