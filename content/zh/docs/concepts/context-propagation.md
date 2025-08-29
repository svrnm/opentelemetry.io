---
title: 上下文传播
weight: 10
description: 了解实现分布式追踪的概念。
---

With context propagation, [signals](../signals/) can be correlated with each
other, regardless of where they are generated. 通过上下文传播，[信号](/docs/concepts/signals)可以相互关联，
无论它们是在何处生成的。
尽管它不仅限于链路追踪，但它允许 [trace](/docs/concepts/signals/traces)
跨进程和网络边界任意分布的服务构建相关系统的关联信息。

我们通过两个子概念来定义上下文传播：上下文和传播。

## 上下文

**上下文**是一个对象，它包含发送和接收服务
（或[执行单元](/docs/specs/otel/glossary/#execution-unit)）
用于将一个信号与另一个信号关联起来的信息。

When Service A calls Service B, it includes a trace ID and a span ID as part of
the context. Service B uses these values to create a new span that belongs to
the same trace, setting the span from Service A as its parent. This makes it
possible to track the full flow of a request across service boundaries.

## 传播

Propagation is the mechanism that moves context between services and processes.
It serializes or deserializes the context object and provides the relevant
information to be propagated from one service to another.

Propagation is usually handled by instrumentation libraries and is transparent
to the user. In the event that you need to manually propagate context, you can
use the [Propagators API](/docs/specs/otel/context/api-propagators/).

OpenTelemetry maintains several official propagators. OpenTelemetry 维护着几个官方传播器。
默认传播器使用 [W3C 追踪上下文](https://www.w3.org/TR/trace-context/)
规范指定的标头。

## 规范

要了解有关上下文传播的更多信息，请参阅[上下文规范](/docs/specs/otel/context/)。
