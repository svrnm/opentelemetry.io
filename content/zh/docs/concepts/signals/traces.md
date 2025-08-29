---
title: 链路（Trace）
weight: 1
description: 请求通过应用的路径。
cSpell:ignore: Guten
---

**Traces** give us the big picture of what happens when a request is made to an
application. Whether your application is a monolith with a single database or a
sophisticated mesh of services, traces are essential to understanding the full
"path" a request takes in your application.

让我们通过三个用 [Span](#spans) 表示的工作单元来探讨这个问题：

{{% alert title="Note" %}}

以下 JSON 示例不表示特定格式，尤其是不表示
[OTLP/JSON](/docs/specs/otlp/#json-protobuf-encoding)，因为 OTLP/JSON 更详细。

{{% /alert %}}

`hello` span:

```json
{
  "name": "hello",
  "context": {
    "trace_id": "5b8aa5a2d2c872e8321cf37308d69df2",
    "span_id": "051581bf3cb55c13"
  },
  "parent_id": null,
  "start_time": "2022-04-29T18:52:58.114201Z",
  "end_time": "2022-04-29T18:52:58.114687Z",
  "attributes": {
    "http.route": "some_route1"
  },
  "events": [
    {
      "name": "Guten Tag!",
      "timestamp": "2022-04-29T18:52:58.114561Z",
      "attributes": {
        "event_attributes": 1
      }
    }
  ]
}
```

This is the root span, denoting the beginning and end of the entire operation.
这是根 Span，表示整个操作的开始和结束。请注意，它有一个 `trace_id` 字段指示链路，
但没有 `parent_id`。因此这是一个根 Span。 That's how you know it's the root span.

`hello-greetings` span:

```json
{
  "name": "hello-greetings",
  "context": {
    "trace_id": "5b8aa5a2d2c872e8321cf37308d69df2",
    "span_id": "5fb397be34d26b51"
  },
  "parent_id": "051581bf3cb55c13",
  "start_time": "2022-04-29T18:52:58.114304Z",
  "end_time": "2022-04-29T22:52:58.114561Z",
  "attributes": {
    "http.route": "some_route2"
  },
  "events": [
    {
      "name": "hey there!",
      "timestamp": "2022-04-29T18:52:58.114561Z",
      "attributes": {
        "event_attributes": 1
      }
    },
    {
      "name": "bye now!",
      "timestamp": "2022-04-29T18:52:58.114585Z",
      "attributes": {
        "event_attributes": 1
      }
    }
  ]
}
```

This span encapsulates specific tasks, like saying greetings, and its parent is
the `hello` span. Note that it shares the same `trace_id` as the root span,
indicating it's a part of the same trace. Additionally, it has a `parent_id`
that matches the `span_id` of the `hello` span.

`hello-salutations` Span:

```json
{
  "name": "hello-salutations",
  "context": {
    "trace_id": "5b8aa5a2d2c872e8321cf37308d69df2",
    "span_id": "93564f51e1abe1c2"
  },
  "parent_id": "051581bf3cb55c13",
  "start_time": "2022-04-29T18:52:58.114492Z",
  "end_time": "2022-04-29T18:52:58.114631Z",
  "attributes": {
    "http.route": "some_route3"
  },
  "events": [
    {
      "name": "hey there!",
      "timestamp": "2022-04-29T18:52:58.114561Z",
      "attributes": {
        "event_attributes": 1
      }
    }
  ]
}
```

此 Span 表示此链路中的第三个操作，与上一个操作一样，它是 `hello` Span 的子级，
因此它与 `hello-greetings` Span 同级。 That also makes it a sibling of the
`hello-greetings` span.

这三个 JSON 块的 `trace_id` 都相同，并且 `parent_id` 属性表示层次结构，它们构成了整个链路！ That makes it a Trace!

你可能会发现，每个 Span 看起来都像一个结构化的日志，这就是 Span ！
将链路视为结构化日志的集合，其中包含上下文、关联关系、层次结构等。但是，
这些“结构化日志”可能来自不同的进程、服务、虚拟机、数据中心等。因此链路可以表示任何系统的端到端视图。 That's
because it kind of is! One way to think of Traces is that they're a collection
of structured logs with context, correlation, hierarchy, and more baked in.
However, these "structured logs" can come from different processes, services,
VMs, data centers, and so on. This is what allows tracing to represent an
end-to-end view of any system.

为了了解 OpenTelemetry 中的链路是如何工作的，接下来看看在代码插桩中涉及到的几个组件。

## Tracer 提供者 {#tracer-provider}

Tracer Provider（有时称为 `TracerProvider`）是 `Trace` 的生产工厂。
在大多数应用中，Tracer Provider 初始化一次，其生命周期与应用的生命周期一致。
Tracer Provider 初始化还包括 Resource 和 Exporter 初始化。这通常是使用
OpenTelemetry 进行跟踪的第一步。在某些语言 SDK 中，已为你初始化了全局 Tracer Provider。 In most applications, a Tracer Provider is initialized once and its
lifecycle matches the application's lifecycle. Tracer Provider initialization
also includes Resource and Exporter initialization. It is typically the first
step in tracing with OpenTelemetry. In some language SDKs, a global Tracer
Provider is already initialized for you.

## Tracer

Tracer 创建的 Span 的中包含指定操作（例如服务中的请求）执行的更多信息。
Tracer 是从 Tracer Provider 创建的。 Tracers are created from Tracer
Providers.

## 链路 Exporter {#trace-exporters}

Trace Exporters send traces to a consumer. This consumer can be standard output
for debugging and development-time, the OpenTelemetry Collector, or any open
source or vendor backend of your choice.

## 上下文传播 {#context-propagation}

Context Propagation is the core concept that enables Distributed Tracing. With
Context Propagation, Spans can be correlated with each other and assembled into
a trace, regardless of where Spans are generated. To learn more about this
topic, see the concept page on [Context Propagation](../../context-propagation).

## Span {#spans}

A **span** represents a unit of work or operation. Spans are the building blocks
of Traces. In OpenTelemetry, they include the following information:

- 名字
- 父 Span ID（根 Span 为空）
- 开始和结束时间
- [Span 上下文](#span-context)
- [属性](#attributes)
- [Span 事件](#span-events)
- [Span 链接](#span-links)
- [Span 状态](#span-status)

Span 样例:

```json
{
  "name": "/v1/sys/health",
  "context": {
    "trace_id": "7bba9f33312b3dbb8b2c2c62bb7abe2d",
    "span_id": "086e83747d0e381e"
  },
  "parent_id": "",
  "start_time": "2021-10-22 16:04:01.209458162 +0000 UTC",
  "end_time": "2021-10-22 16:04:01.209514132 +0000 UTC",
  "status_code": "STATUS_CODE_OK",
  "status_message": "",
  "attributes": {
    "net.transport": "IP.TCP",
    "net.peer.ip": "172.17.0.1",
    "net.peer.port": "51820",
    "net.host.ip": "10.177.2.152",
    "net.host.port": "26040",
    "http.method": "GET",
    "http.target": "/v1/sys/health",
    "http.server_name": "mortar-gateway",
    "http.route": "/v1/sys/health",
    "http.user_agent": "Consul Health Check",
    "http.scheme": "http",
    "http.host": "10.177.2.152:26040",
    "http.flavor": "1.1"
  },
  "events": [
    {
      "name": "",
      "message": "OK",
      "timestamp": "2021-10-22 16:04:01.209512872 +0000 UTC"
    }
  ]
}
```

Spans can be nested, as is implied by the presence of a parent span ID: child
spans represent sub-operations. This allows spans to more accurately capture the
work done in an application.

### Span 上下文 {#span-context}

Span 上下文是每个 Span 上的不可变对象，其中包含以下内容：

- The Trace ID representing the trace that the span is a part of
- The span's Span ID
- 链路标志，包含有关链路信息的二进制编码的值
- 链路状态，可以携带供应商特定链路信息的键值对列表

Span 上下文是 Span 的一部分，它与 Span 一起序列化和传递[分布式上下文](#context-propagation)和[透传数据](../baggage)。

由于 Span Context 包含链路 ID，因此可以用来创建 [Span 链接](#span-links)。

### 属性 {#attributes}

属性是包含元数据的键值对，你可以使用这些元数据对 Span 进行注释，以携带有关它正在跟踪的操作的信息。

例如，如果 Span 跟踪了将商品添加到电子商务系统中用户购物车的操作，
则可以捕获用户的 ID、要添加到购物车的商品的 ID 以及购物车 ID。

You can add attributes to spans during or after span creation. Prefer adding
attributes at span creation to make the attributes available to SDK sampling. If
you have to add a value after span creation, update the span with the value.

针对属性的键值对，每种语言 SDK 都适用以下规则：

- 键必须是非 null 字符串值
- 值必须是非 null 字符串、布尔值、浮点值、整数或这些值的数组

此外，还有[语义化属性](/docs/specs/semconv/general/trace/)，这是通常存在的元数据的已知命名约定。
尽可能使用语义化属性命名会很有帮助，这样就可以跨系统标准化常见类型的元数据。
It's helpful to use semantic attribute naming wherever possible so that common
kinds of metadata are standardized across systems.

### Span 事件 {#span-events}

可以将 Span 事件视为 Span 上的结构化日志消息（或注释），通常用于表示 Span 持续时间内有意义的单个时间点。

例如，考虑 Web 浏览器中的两个场景：

1. 跟踪页面加载
2. 表示页面何时变为可交互的

Span 最适合用于第一种情况，因为它是一个具有开始和结束的操作。

Span Event 最适合用于跟踪第二种情况，因为它表示有意义的单一时间点。

#### 何时使用 Span 事件与 Span 属性 {#when-to-use-span-events-versus-span-attributes}

由于 Span 事件也包含属性，因此何时使用事件而不是属性的问题答案可能并不唯一。
为了做出明智的决定，请考虑特定时间戳是否有意义。 To inform your
decision, consider whether a specific timestamp is meaningful.

例如，当你使用 Span 跟踪操作并且操作完成时，你可能希望将操作中的数据添加到你的 telemetry 中。

- 如果操作完成的时间戳有意义或相关，请将数据附加到 Span 事件。
- 如果时间戳没有意义，请将数据附加为 Span 属性。

### Span 链接 {#span-links}

链接的存在以便你可以将一个 Span 与一个或多个 Span 相关联，从而表示因果关系。
例如，假设我们有一个分布式系统，其中某些操作包含链路跟踪。 For example, let’s say we have a distributed system where
some operations are tracked by a trace.

In response to some of these operations, an additional operation is queued to be
executed, but its execution is asynchronous. We can track this subsequent
operation with a trace as well.

我们希望将后续操作的链路与第一个链路相关联，但无法预测后续操作何时开始。
我们需要关联这两个链路，因此我们将使用 Span 链接。 We
need to associate these two traces, so we will use a span link.

You can link the last span from the first trace to the first span in the second
trace. Now, they are causally associated with one another.

链接是可选的，但它可以很好地将跟踪的 Span 彼此关联起来。

有关 Span 链接的更多信息，请参阅[Span 链接](/docs/specs/otel/trace/api/#link)。

### Span 状态 {#span-status}

Each span has a status. The three possible values are:

- `Unset`
- `Error`
- `Ok`

The default value is `Unset`. 默认值为 `Unset`。Span 状态为 Unset 表示它跟踪的操作已成功完成，没有错误。

当 Span 状态为 `Error` 时，这意味着它跟踪的操作中发生了一些错误。例如，
这可能是由于处理请求的服务器上的 HTTP 500 错误造成的。 For example, this could be due to an HTTP 500 error on a
server handling a request.

当 Span 状态为 `Ok`（正常） 时，这意味着应用开发人员已将该 Span 显式标记为无错误。
虽然这不直观，但当已知 Span 已完成且没有错误时，不需要将 Span 状态设置为 `Ok`，因为
`Unset` 涵盖了这一点。`Ok` 的作用是表示对用户**显式**设置的 Span 状态的明确“调用”。
这在开发人员希望除了 “successful” 之外没有其他 Span 状态的情况下非常有用。 Although this is unintuitive,
it's not required to set a span status as `Ok` when a span is known to have
completed without error, as this is covered by `Unset`. What `Ok` does is
represent an unambiguous "final call" on the status of a span that has been
explicitly set by a user. This is helpful in any situation where a developer
wishes for there to be no other interpretation of a span other than
"successful".

To reiterate: `Unset` represents a span that completed without an error. `Ok`
represents when a developer explicitly marks a span as successful. In most
cases, it is not necessary to explicitly mark a span as `Ok`.

### Span 类型 {#span-kind}

When a span is created, it is one of `Client`, `Server`, `Internal`, `Producer`,
or `Consumer`. This span kind provides a hint to the tracing backend as to how
the trace should be assembled. According to the OpenTelemetry specification, the
parent of a server span is often a remote client span, and the child of a client
span is usually a server span. Similarly, the parent of a consumer span is
always a producer and the child of a producer span is always a consumer. If not
provided, the span kind is assumed to be internal.

有关 SpanKind 的更多信息，请参阅 [Span 类型](/docs/specs/otel/trace/api/#spankind)。

#### Client

A client span represents a synchronous outgoing remote call such as an outgoing
HTTP request or database call. Note that in this context, "synchronous" does not
refer to `async/await`, but to the fact that it is not queued for later
processing.

#### Server

Server Span 表示同步的远程调用，例如响应 HTTP 请求或远程过程调用。

#### Internal

Internal Span 表示不跨越进程边界的操作。诸如检测函数调用或 Express 中间件之类的操作可能会使用 Internal Span。
Things like instrumenting a function call or an Express middleware may use
internal spans.

#### Producer

Producer spans represent the creation of a job which may be asynchronously
processed later. It may be a remote job such as one inserted into a job queue or
a local job handled by an event listener.

#### Consumer

Consumer spans represent the processing of a job created by a producer and may
start long after the producer span has already ended.

## 规范 {#specification}

有关更多信息，请参阅[链路规范](/docs/specs/otel/overview/#tracing-signal)。
