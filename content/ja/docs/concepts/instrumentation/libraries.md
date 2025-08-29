---
title: ライブラリ
description: ライブラリにネイティブ計装を追加する方法を紹介します。
aliases: [ ../instrumenting-library ]
weight: 40
---

OpenTelemetryは、多くのライブラリに[計装ライブラリ][instrumentation libraries]を提供していて、これは通常、ライブラリフックやモンキーパッチライブラリコードを通して行われます。

OpenTelemetry を使ったネイティブのライブラリ計装は、ユーザにより良いオブザーバビリティと開発者体験を提供し、ライブラリがフックを公開して、ドキュメントを書く必要性を取り除きます。 Other advantages provided by native instrumentation include:

- カスタムロギングフックは、一般的で使いやすいOpenTelemetry APIに置き換えられ、ユーザーはOpenTelemetryとだけやり取りすることになります。
- ライブラリとアプリケーションコードからのトレース、ログ、メトリクスを相関させ、一貫性を持たせられます。
- 共通規約により、ユーザーは同じ技術内、ライブラリや言語間で類似した一貫性のあるテレメトリーを得られます。
- テレメトリーシグナルは、さまざまな消費シナリオのために、十分にドキュメントが用意された多種多様なOpenTelemetry拡張ポイントを使用して、微調整（フィルター、処理、集約）できます。

![ Native Instrumentation vs instrumentation libraries](../native-vs-libraries.svg)

## セマンティック規約 {#semantic-conventions}

[Semantic conventions](/docs/specs/semconv/general/trace/) are the main source
of truth about what information is included on spans produced by web frameworks,
RPC clients, databases, messaging clients, infrastructure, and more. Conventions
make instrumentation consistent: users who work with telemetry don't have to
learn library specifics and observability vendors can build experiences for a
wide variety of technologies, for example databases or messaging systems. When
libraries follow conventions, many scenarios can be enabled without the user's
input or configuration.

Semantic conventions are always evolving and new conventions are constantly
added. If some don't exist for your library, consider
[adding them](https://github.com/open-telemetry/semantic-conventions/issues).
Pay special attention to span names: strive to use meaningful names and consider
cardinality when defining them. Also set the
[`schema_url`](/docs/specs/otel/schemas/#schema-url) attribute that you can use
to record what version of the semantic conventions you're using.

何かフィードバックがあったり、新しい規約を追加したい場合は[計装チャンネル（ `#otel-instrumentation` ）](https://cloud-native.slack.com/archives/C01QZFGMLQ7)に参加してコントリビュートするか、[仕様のレポジトリ](https://github.com/open-telemetry/opentelemetry-specification)でイシューまたはプルリクエストを公開してください。

### スパンの定義 {#defining-spans}

ライブラリの利用者の視点からライブラリのことを考え、利用者がライブラリの動作やアクティビティについて何を知りたいと思うかを考えてみてください。
ライブラリのメンテナーであるあなたは内部構造を知っていますが、ユーザーはライブラリの内部構造にはあまり興味を持たず、自分のアプリケーションの機能に興味を持つでしょう。
ライブラリの使用状況を分析する上でどのような情報が役に立つかを考え、そのデータをモデル化する適切な方法を考えましょう。
考慮すべき観点は以下を含みます。
As the library maintainer, you know the internals, but the user will most likely
be less interested in the inner workings of the library and more interested in
the functionality of their application. Think about what information can be
helpful in analyzing the usage of your library, then think about an appropriate
way to model that data. Some aspects to consider include:

- スパンとスパンの階層
- 集約されたメトリクスの代替としてのスパンの数値属性
- スパンイベント
- Aggregated Metrics

For example, if your library is making requests to a database, create spans only
for the logical request to the database. The physical requests over the network
should be instrumented within the libraries implementing that functionality. You
should also favor capturing other activities, like object/data serialization as
span events, rather than as additional spans.

Follow the semantic conventions when setting span attributes.

## 計装すべきでないとき {#when-not-to-instrument}

Some libraries are thin clients wrapping network calls. Chances are that
OpenTelemetry has an instrumentation library for the underlying RPC client.
Check out the [registry](/ecosystem/registry/) to find existing libraries. If a
library exists, instrumenting the wrapper library might not be necessary.

As a general guideline, only instrument your library at its own level. Don't
instrument if all the following cases apply:

- あなたのライブラリは、ドキュメント化された、あるいは自明なAPIの上にある薄いプロキシです
- OpenTelemetryのエコシステムに、土台となるネットワーク呼び出しの計装があります
- テレメトリーを充実させるために、ライブラリがしたがうべき規約がありません

When in doubt, don't instrument. 迷ったら、計装はやめましょう。
もし、計装しないことを選択した場合でも、内部のRPCクライアントインスタンスに OpenTelemetryハンドラーを設定する方法を提供することは有用でしょう。
これは、完全な自動計装をサポートしていない言語では必須ですが、その他の言語でも有用です。 It's essential in languages that don't support fully
automatic instrumentation and still useful in others.

The rest of this document provides guidance on what and how to instrument your
application.

## OpenTelemetry API {#opentelemetry-api}

計装する際の最初のステップは、OpenTelemetry APIパッケージへ依存することです。

OpenTelemetry has [two main modules](/docs/specs/otel/overview/): API and SDK.
OpenTelemetry API is a set of abstractions and non-operational implementations.
OpenTelemetryには[2つの主要なモジュール](/docs/specs/otel/overview/)であるAPIとSDKがあります。
OpenTelemetry API は、抽象化と動作しない実装のセットです。
アプリケーションが OpenTelemetry SDKをインポートしない限り、あなたの計装は何もせず、アプリケーションのパフォーマンスに影響を与えません。

### ライブラリはOpenTelemetry APIのみを使用すべきです。 {#libraries-should-only-use-the-opentelemetry-api}

新しい依存関係を追加することを心配している場合は、依存の対立を最小限に抑える方法を決めるのに役立ついくつかの考慮事項を紹介しましょう。

- OpenTelemetry Trace APIは2021年初めに安定版に達しました。このAPIは[Semantic Versioning 2.0](/docs/specs/otel/versioning-and-stability/)にしがたっていて、開発チームはAPIの安定性を真剣に受け止めています。 It follows
  [Semantic Versioning 2.0](/docs/specs/otel/versioning-and-stability/).
- もっとも早い安定版の OpenTelemetry API (1.0.\*)を使用し、新機能を使用する必要がない限り、アップデートは避けてください。
- While your instrumentation stabilizes, consider shipping it as a separate
  package, so that it never causes issues for users who don't use it. あなたの計装が安定するまでの間、それを別のパッケージとしてリリースすることを検討してください。
  そうすることで、利用していないユーザーに対して問題を起こすことは決してありません。
  あなたのレポジトリに置いておくこともできますし、[OpenTelemetryに追加](https://github.com/open-telemetry/opentelemetry-specification/blob/main/oteps/0155-external-modules.md#contrib-components) して、他の計装パッケージと一緒にリリースすることもできます。
- Semantic conventions are [stable, but subject to evolution][]: while this does
  not cause any functional issues, you might need to update your instrumentation
  every once in a while. Having it in a preview plugin or in OpenTelemetry
  contrib repository may help keeping conventions up-to-date without breaking
  changes for your users.

  [stable, but subject to evolution]: /docs/specs/otel/versioning-and-stability/#semantic-conventions-stability

### トレーサーを取得する {#getting-a-tracer}

すべてのアプリケーションの設定は、Tracer API を通してライブラリから隠蔽されます。
ライブラリは、アプリケーションに `TracerProvider` のインスタンスを渡して依存性注入とテストの容易さを促進したり、[グローバルの `TracerProvider`](/docs/specs/otel/trace/api/#get-a-tracer) から取得したりできます。
OpenTelemetry 言語の実装は、インスタンスの受け渡しやグローバルへのアクセスについて、各プログラミング言語の慣用的なものに基づいて好みが異なるかもしれません。 Libraries might allow applications to pass instances of `TracerProvider` to
facilitate dependency injection and ease of testing, or obtain it from
[global `TracerProvider`](/docs/specs/otel/trace/api/#get-a-tracer).
OpenTelemetry language implementations might have different preferences for
passing instances or accessing the global based on what's idiomatic in each
programming language.

トレーサーを入手する際、ライブラリ（またはトレーシングプラグイン）の名前とバージョンを指定してください。
これらはテレメトリーに表示され、ユーザーがテレメトリーを処理してフィルタリングし、それがどこから来たのかを理解し、計装の問題をデバッグまたは報告するのに役立ちます。

## 何を計装すべきか {#what-to-instrument}

### パブリックAPI {#public-apis}

パブリックAPI呼び出し用に作成されたスパンによって、ユーザーはテレメトリーをアプリケーションコードにマッピングし、ライブラリ呼び出しの期間と結果を理解できます。
トレースすべき呼び出しは次を含みます。 Which calls to trace include:

- 内部でネットワークコールを行うパブリックメソッドや、時間がかかり失敗する可能性のあるローカル操作。たとえば IO など
- リクエストやメッセージを処理するハンドラー

#### 計装の例 {#instrumentation-example}

次の例は Java アプリケーションで計装する方法を示しています。

```java
private static Tracer tracer =  getTracer(TracerProvider.noop());

public static void setTracerProvider(TracerProvider tracerProvider) {
    tracer = getTracer(tracerProvider);
}

private static Tracer getTracer(TracerProvider tracerProvider) {
    return tracerProvider.getTracer("demo-db-client", "0.1.0-beta1");
}

private Response selectWithTracing(Query query) {
    // スパンの名前と属性に関する手引きについては、規約をチェックすること
    Span span = tracer.spanBuilder(String.format("SELECT %s.%s", dbName, collectionName))
            .setSpanKind(SpanKind.CLIENT)
            .setAttribute("db.name", dbName)
            ...
            .startSpan();

    // スパンをアクティブにし、ログとネストスパンの関連付けを可能にする
    try (Scope unused = span.makeCurrent()) {
        Response response = query.runWithRetries();
        if (response.isSuccessful()) {
            span.setStatus(StatusCode.OK);
        }

        if (span.isRecording()) {
           // レスポンスコードやその他の情報をレスポンス属性に入力する
        }
    } catch (Exception e) {
        span.recordException(e);
        span.setStatus(StatusCode.ERROR, e.getClass().getSimpleName());
        throw e;
    } finally {
        span.end();
    }
}
```

Follow conventions to populate attributes. 属性を入力するための規約に従ってください。
該当するものがない場合は、[一般的な規約](/docs/specs/semconv/general/attributes/)を参照してください。

### ネストされたネットワークとその他のスパン {#nested-network-and-other-spans}

ネットワーク呼び出しは通常、対応するクライアントの実装を通して、OpenTelemetry 自動計装でトレースされます。

![JaegerのUIでのネストされたデータベースとHTTPスパン](../nested-spans.svg)

OpenTelemetry が使用しているネットワーククライアントのトレースをサポートしていない場合、最適な対応を判断するための考慮事項を以下に示します。

- ネットワーク呼び出しをトレースすることで、ユーザーやあなたのサポート能力が向上するでしょうか
- あなたのライブラリは、公開され、ドキュメント化されたRPC API上のラッパーですか。問題が発生した場合、ユーザーは基礎となるサービスからサポートを受ける必要がありますか。 Would users
  need to get support from the underlying service in case of issues?
  - ライブラリーを計装し、個々のネットワークトライをトレースしましょう。
- Would tracing those calls with spans be very verbose? or would it noticeably
  impact performance?
  - 冗長性やスパンイベントにはログを使いましょう。ログは親（パブリックAPIコール）に関連付けられ、スパンイベントはパブリックAPIスパンに設定されるべきです。
  - スパンである必要がある場合（ユニークなトレースコンテキストを伝送し、伝搬するため）、設定オプションで指定するようにさせ、デフォルトでは無効にしましょう。

OpenTelemetryがすでにネットワーク呼び出しのトレースをサポートしているのであれば、おそらく、それを複製する必要はないでしょう。
以下のように例外もあります。 There might be some exceptions:

- 自動計装が特定の環境で動作しない場合や、ユーザーがモンキーパッチに懸念を持つ場合でも、ユーザーをサポートする場合
- 基礎となるサービスとのカスタムまたはレガシー相関およびコンテキスト伝搬プロトコルを有効にする場合
- 自動計装ではカバーされない、必要なライブラリまたはサービス固有の情報でRPCスパンを充実させる場合

重複を避けるための一般的なソリューションは現在作成中です。

### イベント {#events}

Traces are a kind of signal that your apps can emit. Events (or logs) and traces
complement, not duplicate, each other. Whenever you have something that should
have a certain level of verbosity, logs are a better choice than traces.

すでにロギングか、似たようなモジュールを使っている場合、ログモジュールは、すでに OpenTelemetry と統合されているかもしれません。
それを調べるには、[レジストリ](/ecosystem/registry/) を参照してください。
統合は通常、すべてのログにアクティブなトレースコンテキストを埋め込むことで、ユーザがそれらを関連付けられるようになります。 To find out, see the
[registry](/ecosystem/registry/). Integrations usually stamp active trace
context on all logs, so users can correlate them.

あなたの言語とエコシステムが共通のロギングサポートを持っていない場合、[スパンイベント][span events]を使って追加のアプリの詳細を共有します。
属性も追加したい場合は、イベントの方が便利かもしれません。 Events maybe more convenient if you
want to add attributes as well.

As a rule of thumb, use events or logs for verbose data instead of spans. Always
attach events to the span instance that your instrumentation created. Avoid
using the active span if you can, since you don't control what it refers to.

## コンテキスト伝搬 {#context-propagation}

### コンテキストの抽出 {#extracting-context}

If you work on a library or a service that receives upstream calls, such as a
web framework or a messaging consumer,extract context from the incoming request
or message. もしあなたがウェブフレームワークやメッセージングコンシューマーのようなライブラリやサービスなどの上流の呼び出しを受信するような仕事をしているなら、受信するリクエストまたはメッセージからコンテキストを抽出してください。
OpenTelemetryは `Propagator` APIを提供していて、これは特定の伝搬基準を隠して、トレースされた `Context` をワイヤーから読み取ります。
単一のレスポンスの場合、ワイヤー上のコンテキストは1つだけです。これはライブラリが作成する新しいスパンの親になります。 In case of a
single response, there is just one context on the wire, which becomes the parent
of the new span the library creates.

After you create a span, pass new trace context to the application code
(callback or handler), by making the span active; if possible, do this
explicitly. The following Java example shows how to add trace context and
activate a span. See the
[Context extraction in Java](/docs/languages/java/api/#contextpropagators), for
more examples.

```java
// コンテキストを抽出する
Context extractedContext = propagator.extract(Context.current(), httpExchange, getter);
Span span = tracer.spanBuilder("receive")
            .setSpanKind(SpanKind.SERVER)
            .setParent(extractedContext)
            .startSpan();

// スパンをアクティブにし、ネストされたテレメトリーが相関するようにする
try (Scope unused = span.makeCurrent()) {
  userCode();
} catch (Exception e) {
  span.recordException(e);
  span.setStatus(StatusCode.ERROR);
  throw e;
} finally {
  span.end();
}
```

In the case of a messaging system, you might receive more than one message at
once. Received messages become links on the span you create. Refer to
[messaging conventions](/docs/specs/semconv/messaging/messaging-spans/) for
details.

### コンテキストを注入する {#injecting-context}

When you make an outbound call, you usually want to propagate context to the
downstream service. In this case, create a new span to trace the outgoing call
and use `Propagator` API to inject context into the message. There might be
other cases where you might want to inject context, for example when creating
messages for async processing. The following Java example shows how to propagate
context. See
[Context injection in Java](/docs/languages/java/instrumentation/#context-propagation)
for more examples.

```java
Span span = tracer.spanBuilder("send")
            .setSpanKind(SpanKind.CLIENT)
            .startSpan();

// スパンをアクティブにすることで、ネスト化されたテレメトリを相関させる
// ネットワークコールでも、スパン、ログ、イベントのネスト化されたレイヤーがあるかもしれない
try (Scope unused = span.makeCurrent()) {
  // コンテキストを注入
  propagator.inject(Context.current(), transportLayer, setter);
  send();
} catch (Exception e) {
  span.recordException(e);
  span.setStatus(StatusCode.ERROR);
  throw e;
} finally {
  span.end();
}
```

下記のようにコンテキストを伝搬させる必要がない例外もあるかもしれません。

- 下流のサービスはメタデータをサポートしていないか、未知のフィールドを禁止している。
- 下流のサービスが相関プロトコルを定義していない。将来のバージョンで、コンテキスト伝搬をサポートの追加を検討してください。 Consider adding
  support for context propagation in a future version.
- 下流のサービスは、カスタム相関プロトコルをサポートしている。
  - カスタムプロパゲーターでベストエフォートで対応している。互換性があればOpenTelemetryトレースコンテキストを使用するか、スパンにカスタム相関IDを生成して埋め込みましょう。

### プロセス内 {#in-process}

- Make your spans active or current, as this enables correlating spans with logs
  and any nested auto-instrumentations.
- ライブラリーにコンテキストの概念がある場合、アクティブスパンに加えて、任意で明示的なトレースコンテキストの伝搬をサポートしましょう。
  - ライブラリが作成したスパン（トレースコンテキスト）を明示的にコンテキストに置き、そのアクセス方法をドキュメント化しましょう。
  - ユーザーが自分のコンテキストにトレースコンテキストを渡せるようにしましょう。
- Within the library, propagate trace context explicitly. Active spans might
  change during callbacks.
  - パブリックAPIの上のユーザーからアクティブなコンテキストをできるだけ早く取得し、それをスパンの親コンテキストとして使用します。
  - コンテキストを受け渡し、明示的に伝搬されたインスタンスに属性、例外、イベントを埋め込みます。
  - これは、スレッドを明示的に開始したり、バックグラウンド処理を行ったり、その他、使用する言語の非同期コンテキストフローの制限によって壊れる可能性がある場合に不可欠です。

## 追加の検討事項 {#additional-considerations}

### 計装レジストリ {#instrumentation-registry}

[OpenTelemetryレジストリ](/ecosystem/registry/)にあなたの計装ライブラリを追加してください。

### パフォーマンス {#performance}

OpenTelemetryのAPIは、アプリケーションにSDKがない場合、no-opで、非常にパフォーマンスが良いです。
OpenTelemetry SDK が設定されると、[バインドされたリソースを消費します](/docs/specs/otel/performance/)。 When OpenTelemetry SDK is configured, it
[consumes bound resources](/docs/specs/otel/performance/).

Real-life applications, especially on the high scale, would frequently have
head-based sampling configured. Sampled-out spans are affordable and you can
check if the span is recording to avoid extra allocations and potentially
expensive calculations while populating attributes. The following Java example
shows to provide attributes for sampling and check span recording.

```java
// サンプリングに重要な属性がある場合は、作成時に提供する必要がある
Span span = tracer.spanBuilder(String.format("SELECT %s.%s", dbName, collectionName))
        .setSpanKind(SpanKind.CLIENT)
        .setAttribute("db.name", dbName)
        ...
        .startSpan();

// スパンが記録される場合は、他の属性、特に計算コストのかかる属性を追加する必要がある
if (span.isRecording()) {
    span.setAttribute("db.statement", sanitize(query.statement()))
}
```

### エラーハンドリング {#error-handling}

OpenTelemetry API は、無効な引数では失敗せず、決して例外をスローせずに飲み込みます。
これは、[実行時に寛容である](/docs/specs/otel/error-handling/#basic-error-handling-principles)ことを意味します。
このようにして、計装の問題がアプリケーションロジックに影響を与えないようにします。
OpenTelemetry が実行時に隠す問題に気づくために、計装をテストしてください。
This way instrumentation issues do not affect application logic. Test the
instrumentation to notice issues OpenTelemetry hides at runtime.

### テスト {#testing}

OpenTelemetry にはさまざまな自動計装があるので、あなたの計装が他のテレメトリー（受信リクエスト、送信リクエスト、ログなど）とどのように相互作用するかを試してください。
計装を試すときは、一般的なフレームワークとライブラリを使い、すべてのトレースを有効にした典型的なアプリケーションを使ってください。
あなたのライブラリと似たライブラリがどのように表示されるかをチェックしてください。 Use a typical application, with popular frameworks
and libraries and all tracing enabled when trying out your instrumentation.
Check out how libraries similar to yours show up.

ユニットテストでは、次の Java の例のように通常、`SpanProcessor`と`SpanExporter`をモックまたはフェイクできます。

```java
@Test
public void checkInstrumentation() {
  SpanExporter exporter = new TestExporter();

  Tracer tracer = OpenTelemetrySdk.builder()
           .setTracerProvider(SdkTracerProvider.builder()
              .addSpanProcessor(SimpleSpanProcessor.create(exporter)).build()).build()
           .getTracer("test");
  // テストを実行...

  validateSpans(exporter.exportedSpans);
}

class TestExporter implements SpanExporter {
  public final List<SpanData> exportedSpans = Collections.synchronizedList(new ArrayList<>());

  @Override
  public CompletableResultCode export(Collection<SpanData> spans) {
    exportedSpans.addAll(spans);
    return CompletableResultCode.ofSuccess();
  }
  ...
}
```

[instrumentation libraries]: /docs/specs/otel/overview/#instrumentation-libraries
[span events]: /docs/specs/otel/trace/api/#add-events
