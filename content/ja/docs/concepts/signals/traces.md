---
title: トレース
weight: 1
description: アプリケーションを通過するリクエストの経路
cSpell:ignore: Guten
---

**Traces** give us the big picture of what happens when a request is made to an
application. **トレース** は、リクエストがアプリケーションに投げられたときに何が起こるかの全体像を教えてくれます。
あなたのアプリケーションが、単一のデータベースを持つモノリスであろうと、洗練されたメッシュサービスであろうと、トレースは、リクエストがアプリケーションの中でたどる完全な「経路」を理解するために不可欠です。

Let's explore this with three units of work, represented as [Spans](#spans):

{{% alert title="Note" %}}

以下のJSONの例は、特定のフォーマット、特に[OTLP/JSON](/docs/specs/otlp/#json-protobuf-encoding)を表すものではありません。OTLP/JSONは、より冗長です。

{{% /alert %}}

`hello` スパンは次のとおりです。

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
これはルートスパンであり、オペレーション全体の始まりと終わりを示します。
トレースを示す `trace_id` フィールドがありますが、`parent_id` がないことに注意してください。
これがルートスパンであることを示します。 That's how you know it's the root span.

`hello-greetings` スパンは次のとおりです。

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

`hello-salutations` スパンは次のとおりです。

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

このスパンはこのトレースにおける3つ目の操作を表し、前のスパンと同様に`hello`スパンの子です。
また、`hello-greetings`スパンの兄弟でもあります。 That also makes it a sibling of the
`hello-greetings` span.

これらの3つのJSONブロックはすべて同じ `trace_id` を共有していて、`parent_id` フィールドは階層を表しています。
これは1つのトレースになります！ That makes it a Trace!

Another thing you'll note is that each Span looks like a structured log. That's
because it kind of is! One way to think of Traces is that they're a collection
of structured logs with context, correlation, hierarchy, and more baked in.
However, these "structured logs" can come from different processes, services,
VMs, data centers, and so on. This is what allows tracing to represent an
end-to-end view of any system.

OpenTelemetryでのトレースがどのように機能するかを理解するために、コードの計装の一翼を担う一連のコンポーネントを見てみましょう。

## トレーサープロバイダー {#tracer-provider}

A Tracer Provider (sometimes called `TracerProvider`) is a factory for
`Tracer`s. In most applications, a Tracer Provider is initialized once and its
lifecycle matches the application's lifecycle. Tracer Provider initialization
also includes Resource and Exporter initialization. It is typically the first
step in tracing with OpenTelemetry. In some language SDKs, a global Tracer
Provider is already initialized for you.

## トレーサー {#tracer}

トレーサーは、サービス内のリクエストなど、与えられた操作で何が起こっているかについての詳細な情報を含むスパンを作成します。
トレーサーはトレーサープロバイダーから作成されます。 Tracers are created from Tracer
Providers.

## トレースエクスポーター {#trace-exporters}

Trace Exporters send traces to a consumer. This consumer can be standard output
for debugging and development-time, the OpenTelemetry Collector, or any open
source or vendor backend of your choice.

## コンテキスト伝搬 {#context-propagation}

コンテキスト伝搬（プロパゲーション）は、分散トレースを可能にする中心となる概念です。 With
Context Propagation, Spans can be correlated with each other and assembled into
a trace, regardless of where Spans are generated. To learn more about this
topic, see the concept page on [Context Propagation](../../context-propagation).

## Spans

A **span** represents a unit of work or operation. Spans are the building blocks
of Traces. In OpenTelemetry, they include the following information:

- 名前
- 親のスパンID（ルートスパンなら空）
- 開始と終了のタイムスタンプ
- [スパンコンテキスト](#span-context)
- [属性](#attributes)
- [スパンイベント](#span-events)
- [スパンリンク](#span-links)
- [スパンステータス](#span-status)

Sample span:

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

### スパンコンテキスト {#span-context}

スパンコンテキストは、各スパンの不変オブジェクトであり、以下を含みます。

- スパンが属するトレースを表すトレースID
- スパンのスパンID
- トレースフラグ。これはトレースに関する情報を含むバイナリエンコーディングです。
- ベンダ固有のトレース情報を保持するキーと値のペアのリスト

スパンコンテキストは、[分散コンテキスト](#context-propagation)や[バゲッジ](../baggage)と共にシリアライズされ、伝搬されるスパンの一部です。

スパンコンテキストにはトレースIDが含まれているため、[スパンリンク](#span-links)を作成する際に使用されます。

### 属性 {#attributes}

属性（アトリビュート）はキーと値のペアで、スパンに注釈を付けるためのメタデータを含んでいます。このメタデータは追跡している操作に関する情報を伝えるためのものです。

たとえば、eコマースシステムでユーザーのショッピングカートに商品を追加する操作をスパンが追跡する場合、ユーザーのID、カートに追加する商品のID、カートIDを捕捉できます。

You can add attributes to spans during or after span creation. Prefer adding
attributes at span creation to make the attributes available to SDK sampling. If
you have to add a value after span creation, update the span with the value.

属性には、各言語SDKが実装する以下のルールがあります。

- キーは非NULL文字列値でなければならない
- 値は、非NULL文字列、ブール値、浮動小数点値、整数、またはこれらの値の配列でなければならない

さらに、[セマンティック属性](/docs/specs/semconv/general/trace/)があり、これは一般的な操作に通常存在するメタデータのための既知の命名規則です。
システム間で共通の種類のメタデータが標準化されるように、可能な限りセマンティック属性の命名を使用することは有用です。
It's helpful to use semantic attribute naming wherever possible so that common
kinds of metadata are standardized across systems.

### スパンイベント {#span-events}

スパンイベントは、スパン上の構造化ログメッセージ（または注釈）と考えられます。通常、スパンの期間中、意味のある特異な時点を示すために使われます。

たとえば、ウェブブラウザでの2つのシナリオを考えてみましょう。

1. ページ読み込みの追跡
2. ページがインタラクティブになるタイミングを示す

スパンは、開始と終了がある操作なので、最初のシナリオに最も適しています。

スパンイベントは、意味のある特定の時点を表すため、2つ目のシナリオを追跡するのに最も適しています。

#### スパンイベントとスパン属性の使い分け

Since span events also contain attributes, the question of when to use events
instead of attributes might not always have an obvious answer. To inform your
decision, consider whether a specific timestamp is meaningful.

たとえば、スパンで操作を追跡していて、操作が完了した時、操作からのデータをテレメトリーに追加したいと思うかもしれません。

- 操作が完了したタイムスタンプに意味がある場合、または関連性がある場合は、データをスパンイベントに添付する。
- タイムスタンプに意味がない場合は、スパン属性としてデータを添付する。

### スパンリンク {#span-links}

Links exist so that you can associate one span with one or more spans, implying
a causal relationship. For example, let’s say we have a distributed system where
some operations are tracked by a trace.

In response to some of these operations, an additional operation is queued to be
executed, but its execution is asynchronous. We can track this subsequent
operation with a trace as well.

後続の操作のトレースを最初のトレースに関連付けたいと思っても、後続の操作がいつ始まるかは予測できません。
この2つのトレースを関連付ける必要があるので、スパンリンクを使用します。 We
need to associate these two traces, so we will use a span link.

You can link the last span from the first trace to the first span in the second
trace. Now, they are causally associated with one another.

リンクは必須ではありませんが、トレーススパン同士を関連付ける良い方法として役立ちます。

詳細は[スパンリンク](/docs/specs/otel/trace/api/#link)を参照してください。

### スパンステータス {#span-status}

Each span has a status. The three possible values are:

- `Unset`
- `Error`
- `Ok`

The default value is `Unset`. デフォルト値は `Unset` です。
スパンのステータスが `Unset` である場合は、追跡した操作がエラーなしで正常に完了したということです。

スパンのステータスが `Error` である場合、そのスパンが追跡する操作で何らかのエラーが発生したことを意味します。
たとえば、リクエストを処理するサーバーでHTTP 500エラーが発生した場合などです。 For example, this could be due to an HTTP 500 error on a
server handling a request.

When a span status is `Ok`, then that means the span was explicitly marked as
error-free by the developer of an application. Although this is unintuitive,
it's not required to set a span status as `Ok` when a span is known to have
completed without error, as this is covered by `Unset`. What `Ok` does is
represent an unambiguous "final call" on the status of a span that has been
explicitly set by a user. This is helpful in any situation where a developer
wishes for there to be no other interpretation of a span other than
"successful".

To reiterate: `Unset` represents a span that completed without an error. `Ok`
represents when a developer explicitly marks a span as successful. In most
cases, it is not necessary to explicitly mark a span as `Ok`.

### スパンの種類（SpanKind） {#span-kind}

When a span is created, it is one of `Client`, `Server`, `Internal`, `Producer`,
or `Consumer`. This span kind provides a hint to the tracing backend as to how
the trace should be assembled. According to the OpenTelemetry specification, the
parent of a server span is often a remote client span, and the child of a client
span is usually a server span. Similarly, the parent of a consumer span is
always a producer and the child of a producer span is always a consumer. If not
provided, the span kind is assumed to be internal.

SpanKindの詳細については、[SpanKind](/docs/specs/otel/trace/api/#spankind)を参照してください。

#### Client（クライアント） {#client}

A client span represents a synchronous outgoing remote call such as an outgoing
HTTP request or database call. Note that in this context, "synchronous" does not
refer to `async/await`, but to the fact that it is not queued for later
processing.

#### Server（サーバー） {#server}

サーバースパンは、HTTPリクエストやリモートプロシージャコールのような、 同期的に着信するリモートコールを表します。

#### Internal（内部） {#internal}

Internal spans represent operations which do not cross a process boundary.
Things like instrumenting a function call or an Express middleware may use
internal spans.

#### Producer（プロデューサー） {#producer}

Producer spans represent the creation of a job which may be asynchronously
processed later. It may be a remote job such as one inserted into a job queue or
a local job handled by an event listener.

#### Consumer（コンシューマー） {#consumer}

Consumer spans represent the processing of a job created by a producer and may
start long after the producer span has already ended.

## 仕様 {#specification}

詳細は[トレース仕様](/docs/specs/otel/overview/#tracing-signal)を参照してください。
