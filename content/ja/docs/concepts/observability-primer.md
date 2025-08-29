---
title: Observability入門
description: 重要なオブザーバビリティに関する概念
weight: 9
cSpell:ignore: webshop
---

## What is Observability?

Observability lets you understand a system from the outside by letting you ask
questions about that system without knowing its inner workings. Furthermore, it
allows you to easily troubleshoot and handle novel problems, that is, "unknown
unknowns”. It also helps you answer the question "Why is this happening?"

To ask those questions about your system, your application must be properly
instrumented. That is, the application code must emit
[signals](/docs/concepts/signals/) such as
[traces](/docs/concepts/signals/traces/),
[metrics](/docs/concepts/signals/metrics/), and
[logs](/docs/concepts/signals/logs/). An application is properly instrumented
when developers don't need to add more instrumentation to troubleshoot an issue,
because they have all of the information they need.

[OpenTelemetry](/docs/what-is-opentelemetry/)は、システムをオブザーバビリティがある状態にするために、アプリケーションコードの計装を手助けする仕組みです。

## 信頼性とメトリクス

**テレメトリー** とは、システムやその動作から送出されるデータのことです。
データは[トレース](/docs/concepts/signals/traces/)、[メトリクス](/docs/concepts/signals/metrics/)、[ログ](/docs/concepts/signals/logs/)などの形式で得られます。 The data
can come in the form of [traces](/docs/concepts/signals/traces/),
[metrics](/docs/concepts/signals/metrics/), and
[logs](/docs/concepts/signals/logs/).

**Reliability** answers the question: "Is the service doing what users expect it
to be doing?” **信頼性** は「サービスがユーザーの期待通りに動いているでしょうか」といった疑問に答えてくれます。
システムは常に100％稼働していても、ユーザーがショッピングカートに黒い靴を追加するために「カートに追加」をクリックしたときに、システムが常に黒い靴を追加するとは限らない場合、システムは **信頼性がない** と言えるでしょう。

**Metrics** are aggregations over a period of time of numeric data about your
infrastructure or application. Examples include: system error rate, CPU
utilization, and request rate for a given service. For more on metrics and how
they relate to OpenTelemetry, see [Metrics](/docs/concepts/signals/metrics/).

**SLI**（サービスレベル指標）は、サービスの動作の計測値を表します。
優れたSLIは、ユーザーの視点からサービスを計測します。
SLIの例として、ウェブページの読み込み速度が挙げられます。 A good SLI measures your service from the perspective of your users.
An example SLI can be the speed at which a web page loads.

**SLO**（サービスレベル目標）は、信頼性を組織や他のチームに伝達する手段を表します。
これは、1つ以上のSLIをビジネス価値に付加することで達成されます。 This is accomplished by
attaching one or more SLIs to business value.

## 分散トレースを理解する

Distributed tracing lets you observe requests as they propagate through complex,
distributed systems. Distributed tracing improves the visibility of your
application or system's health and lets you debug behavior that is difficult to
reproduce locally. It is essential for distributed systems, which commonly have
nondeterministic problems or are too complicated to reproduce locally.

分散トレースを理解するには、ログ、スパン、トレースといった各要素の役割を理解する必要があります。

### ログ

A **log** is a timestamped message emitted by services or other components.
Unlike [traces](#distributed-traces), they aren't necessarily associated with
any particular user request or transaction. You can find logs almost everywhere
in software. Logs have been heavily relied on in the past by both developers and
operators to help them understand system behavior.

次にあるのはログの例です。

```text
I, [2021-02-23T13:26:23.505892 #22473]  INFO -- : [6459ffe1-ea53-4044-aaa3-bf902868f730] Started GET "/" for ::1 at 2021-02-23 13:26:23 -0800
```

ログはコードの実行を追跡するには十分ではありません。
ログには通常、どこから呼び出されたかといったコンテキスト情報が欠けているからです。

They become far more useful when they are included as part of a [span](#spans),
or when they are correlated with a trace and a span.

ログの詳細とOpenTelemetryとの関係については、[ログ](/docs/concepts/signals/logs/)のページを参照してください。

### Spans

A **span** represents a unit of work or operation. Spans track specific
operations that a request makes, painting a picture of what happened during the
time in which that operation was executed.

スパンには、名前、時間関連データ、[構造化ログメッセージ](/docs/concepts/signals/traces/#span-events)、[その他のメタデータ(つまり属性)](/docs/concepts/signals/traces/#attributes)が含まれ、追跡する操作に関する情報を提供します。

#### スパン属性

スパン属性はスパンに紐づけられたメタデータです。

次の表はスパン属性の例を列挙しています。

| キー                          | 値                                                                                  |
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
| `client.socket.address`     | `"192.0.2.5"` （クライアントはプロキシ経由）                                                      |
| `user_agent.original`       | `"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0"` |

スパンと OpenTelemetry との関係については、[スパン](/docs/concepts/signals/traces/#spans)の節を参照してください。

### 分散トレース {#distributed-traces}

一般的に**トレース**として知られている**分散トレース**は、マイクロサービスやサーバーレスアプリケーションのようなマルチサービスアーキテクチャを伝搬するリクエスト（アプリケーションまたはエンドユーザーによって行われる）が辿った経路を記録します。

A trace is made of one or more spans. The first span represents the root span.
Each root span represents a request from start to finish. The spans underneath
the parent provide a more in-depth context of what occurs during a request (or
what steps make up a request).

Without tracing, finding the root cause of performance problems in a distributed
system can be challenging. Tracing makes debugging and understanding distributed
systems less daunting by breaking down what happens within a request as it flows
through a distributed system.

Many Observability backends visualize traces as waterfall diagrams that look
like this:

![トレースの例](/img/waterfall-trace.svg "トレースのウォーターフォール図")

ウォーターフォール図は、ルートスパンとその子スパンの親子関係を示しています。
スパンが別のスパンを含む場合も、入れ子関係を表します。 When a span encapsulates another span, this also represents a
nested relationship.

トレースとOpenTelemetryとの関係については、[トレース](/docs/concepts/signals/traces/)のページを参照してください。
