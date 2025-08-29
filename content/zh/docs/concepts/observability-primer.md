---
title: 可观测性入门
description: 可观测性的核心概念
weight: 9
cSpell:ignore: webshop
---

## 什么是可观测性？ {#what-is-observability}

可观测性让你能够从外部理解一个系统，它允许你在不了解系统内部运作的情况下，对该系统提出问题。更重要的是，
它能帮你轻松排查和处理新出现的问题，也就是所谓的"未知的未知"。它还能帮你回答"为什么会发生这种情况？"这样的问题。 Furthermore, it
allows you to easily troubleshoot and handle novel problems, that is, "unknown
unknowns”. It also helps you answer the question "Why is this happening?"

To ask those questions about your system, your application must be properly
instrumented. 要对你的系统提出这些问题，你的应用程序必须进行适当的插桩。也就是说，应用程序代码必须能够发出[信号](/docs/concepts/signals/)，
例如[链路](/docs/concepts/signals/traces/)、
[指标](/docs/concepts/signals/metrics/)和
[日志](/docs/concepts/signals/logs/)。当开发人员不需要添加更多插桩就能排查问题时，
我们就可以说这个应用程序已经完成了适当的插桩，因为他们已经拥有了所需的所有信息。 An application is properly instrumented
when developers don't need to add more instrumentation to troubleshoot an issue,
because they have all of the information they need.

[OpenTelemetry](/docs/what-is-opentelemetry/)就是一种为应用程序代码进行插桩的机制，它的目的是帮助使系统变得可观测。

## 可靠性和指标

**Telemetry** 指的是系统及其行为发出的数据。这些数据可以是[链路](/docs/concepts/signals/traces/)、[指标](/docs/concepts/signals/metrics/)和[日志](/docs/concepts/signals/logs/)的形式。 The data
can come in the form of [traces](/docs/concepts/signals/traces/),
[metrics](/docs/concepts/signals/metrics/), and
[logs](/docs/concepts/signals/logs/).

**Reliability** answers the question: "Is the service doing what users expect it
to be doing?” **可靠性** 回答了这个问题："服务是否在按用户期望的方式运行？"一个系统可能 100% 的时间都在运行，但如果当用户点击"加入购物车"来添加一双黑色鞋子时，系统并不总是能准确地添加黑色鞋子，那么这个系统就可能是**不**可靠的。

**Metrics** are aggregations over a period of time of numeric data about your
infrastructure or application. Examples include: system error rate, CPU
utilization, and request rate for a given service. For more on metrics and how
they relate to OpenTelemetry, see [Metrics](/docs/concepts/signals/metrics/).

**SLI**，即服务水平指标（Service Level Indicator），代表对服务行为的衡量。一个好的SLI应该从用户的角度来衡量你的服务。SLI的一个例子可以是网页加载的速度。 A good SLI measures your service from the perspective of your users.
An example SLI can be the speed at which a web page loads.

**SLO**，服务水平目标（Service Level Objective）是一种向组织内部或其他团队传达服务可靠性的方法。它通过将具体的技术指标（SLI）与业务目标关联起来，使技术性能变得对业务有意义。例如，"网站页面加载时间（SLI）必须在3秒内，以确保良好的用户体验和提高转化率（业务价值）"。 This is accomplished by
attaching one or more SLIs to business value.

## 理解分布式链路

Distributed tracing lets you observe requests as they propagate through complex,
distributed systems. Distributed tracing improves the visibility of your
application or system's health and lets you debug behavior that is difficult to
reproduce locally. It is essential for distributed systems, which commonly have
nondeterministic problems or are too complicated to reproduce locally.

要理解分布式链路，你需要了解其各个组成部分的角色：日志、span（跨度）和 trace（链路）。

### 日志

A **log** is a timestamped message emitted by services or other components.
Unlike [traces](#distributed-traces), they aren't necessarily associated with
any particular user request or transaction. You can find logs almost everywhere
in software. Logs have been heavily relied on in the past by both developers and
operators to help them understand system behavior.

日志样例：

```text
I, [2021-02-23T13:26:23.505892 #22473]  INFO -- : [6459ffe1-ea53-4044-aaa3-bf902868f730] Started GET "/" for ::1 at 2021-02-23 13:26:23 -0800
```

日志虽然有用，但仅靠它们来追踪代码执行还不够，因为日志通常缺乏上下文信息，比如它们是从哪里被调用的。

当日志作为 [span](#spans)（跨度）的一部分，或者与 trace（链路）和 span 关联起来时，它们的价值就会大大增加。

要深入了解日志以及它们与OpenTelemetry的关系，请参阅[日志](/docs/concepts/signals/logs/)章节。

### Spans

A **span** represents a unit of work or operation. Spans track specific
operations that a request makes, painting a picture of what happened during the
time in which that operation was executed.

一个 span 包含名称、时间相关的数据、[结构化的日志消息](/docs/concepts/signals/traces/#span-events)，以及其他[元数据（属性）](/docs/concepts/signals/traces/#attributes)，这些信息共同描绘了该操作的完整画面。

#### Span 属性

Span attributes are metadata attached to a span.

下面的表格列出了一些 span 属性的例子：

| 键                           | 值                                                                                  |
| :-------------------------- | :--------------------------------------------------------------------------------- |
| `http.request.method`       | `"GET"`                                                                            |
| `network.protocol.version`  | `"1.1"`                                                                            |
| `url.path`                  | `"/webshop/articles/4"`                                                            |
| `url.query`                 | `"?s=1"`                                                                           |
| `server.address`            | `"example.com"`                                                                    |
| `server.port`               | `8080`                                                                             |
| `url.scheme`                | `"https"`                                                                          |
| `http.route`                | `"/webshop/articles/:article_id"`                                                  |
| `http.response.status_code` | `200`                                                                              |
| `client.address`            | `"192.0.2.4"`                                                                      |
| `client.socket.address`     | `"192.0.2.5"` (the client goes through a proxy)                 |
| `user_agent.original`       | `"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0"` |

要深入了解 spans 及其与 OpenTelemetry 的关系，请查看 [Spans](/docs/concepts/signals/traces/#spans)。

### 分布式链路

**分布式链路**，通常简称为**链路**，记录了请求（无论是来自应用程序还是终端用户）在多服务架构（如微服务和无服务器应用）中传播的路径。

A trace is made of one or more spans. The first span represents the root span.
Each root span represents a request from start to finish. The spans underneath
the parent provide a more in-depth context of what occurs during a request (or
what steps make up a request).

Without tracing, finding the root cause of performance problems in a distributed
system can be challenging. Tracing makes debugging and understanding distributed
systems less daunting by breaking down what happens within a request as it flows
through a distributed system.

许多可观测性后端会将链路可视化为瀑布图，如下所示：

![链路示例](/img/waterfall-trace.svg "链路瀑布图")

瀑布图清晰地展示了根 span 与其子 span 之间的父子关系。当一个 span 包含另一个 span 时，这种关系就表现为嵌套结构。 When a span encapsulates another span, this also represents a
nested relationship.

想要更深入地了解链路，以及它如何在 OpenTelemetry 中发挥作用，欢迎查阅[链路](/docs/concepts/signals/traces/)。
