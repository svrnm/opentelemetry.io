---
title: Baggage（行李）
weight: 4
description: 在信号之间传递的上下文信息。
---

In OpenTelemetry, Baggage is contextual information that resides next to
context. 在 OpenTelemetry 中，Baggage 是在 Span 之间传递的上下文信息。Baggage 是一个键值对存储，
这意味着它允许你在传递[上下文](../../context-propagation/#context)的同时
[传播](../../context-propagation/#propagation)任何你想传递的数据。

Baggage 允许你在服务和进程之间传递数据，
从而可以将其添加到这些服务中的[链路](../traces/)、[指标](../metrics/)或[日志](../logs/)中。

## 示例 {#example}

Baggage 通常用于链路，以在服务之间传播附加数据。

例如，假设你在请求开始时拥有一个 `clientId`，但你希望该 ID 能在链路中的所有
Span、中间某个服务的指标，以及沿途的一些日志中都能使用。由于链路可能跨越多个服务，
因此你需要一种方法来传播该数据，而无需在代码库的多个位置复制 `clientId`。 Because the trace may span
multiple services, you need some way to propagate that data without copying the
`clientId` across many places in your codebase.

通过使用[上下文传播](../traces/#context-propagation)在这些服务之间传递
Baggage，`clientId` 就可以用于添加到任何额外的 Span、指标或日志中。此外，
插桩会自动为你传播 Baggage。 Additionally, instrumentations automatically propagate
baggage for you.

![OTel Baggage](../otel-baggage.svg)

## OTel Baggage 应该用于什么？ {#why-should-otel-baggage-be-used-for}

Baggage is best used to include information typically available only at the
start of a request further downstream. This can include things like Account
Identification, User IDs, Product IDs, and origin IPs, for example.

Propagating this information using baggage allows for deeper analysis of
telemetry in a backend. For example, if you include information like a User ID
on a span that tracks a database call, you can much more easily answer questions
like "which users are experiencing the slowest database calls?" You can also log
information about a downstream operation and include that same User ID in the
log data.

![OTel Baggage](../otel-baggage-2.svg)

## Baggage 的安全注意事项 {#baggage-security-considerations}

Sensitive Baggage items can be shared with unintended resources, like
third-party APIs. This is because automatic instrumentation includes Baggage in
most of your service’s network requests. Specifically, Baggage and other parts
of trace context are sent in HTTP headers, making it visible to anyone
inspecting your network traffic. If traffic is restricted within your network,
then this risk may not apply, but keep in mind that downstream services could
propagate Baggage outside your network.

此外，没有内建的完整性检查机制来确保 Baggage 项确实是你的，因此在读取时需小心谨慎。

## Baggage 不等同于属性 {#baggage-is-not-the-same-as-attributes}

关于 Baggage 的一个重要说明是，它是一个独立的键值对存储，默认不会与
Span、指标或日志上的属性关联，除非你显式地将其添加。

要将 Baggage 条目添加为属性，你需要显式地从 Baggage 中读取数据，
并将其作为属性添加到你的 Span、指标或日志中。

由于 Baggage 的常见用例之一是将数据添加到整个链路的
[Span 属性](../traces/#attributes)中，因此一些语言提供了
Baggage Span Processor，可在创建 Span 时将 Baggage 中的数据作为属性添加。

> 更多信息，请参阅 [Baggage 规范][baggage specification]。

[baggage specification]: /docs/specs/otel/overview/#baggage-signal
