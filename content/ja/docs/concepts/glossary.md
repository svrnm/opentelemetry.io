---
title: 用語集
description: OpenTelemetry で使用されるテレメトリー用語の定義と規則
weight: 200
---

この用語集は、OpenTelemetry プロジェクトに対して新しい、用語と[概念](/docs/concepts/)を定義し、オブザーバビリティの分野で一般的に使われている OpenTelemetry 特有の使用法を明確にします。
また、役に立つように、スペルや大文字かについてもコメントしました。
たとえば、[OpenTelemetry](#opentelemetry) と [OTel](#otel) を参照してください。

We also comment on spelling and capitalization when helpful. For example, see
[OpenTelemetry](#opentelemetry) and [OTel](#otel).

## Terms

### 集約（集計、アグリゲーション） {#aggregation}

複数の測定値を組み合わせて、プログラム実行中のある時間間隔に行われた測定値に関する正確な統計値または推定統計値にするプロセス。
[メトリクス](#metric)の[データソース](#data-source) で使用されます。 Used by the [Metric](#metric)
[Data source](#data-source).

### API {#api}

Application Programming Interface. アプリケーション・プログラミング・インターフェース。
OpenTelemetryプロジェクトでは、[データソース](#data-source)ごとにどのようにテレメトリーデータを生成するかを定義するために使用されます。

### アプリケーション {#application}

エンドユーザーや他のアプリケーションのために設計された1つ以上の[サービス](#service)。

### APM {#apm}

アプリケーション・パフォーマンス・モニタリングは、ソフトウェアアプリケーション、そのパフォーマンス（スピード、信頼性、可用性など）を監視し、問題を検出し、根本原因を見つけるためのアラートとツールを提供することを指します。

### 属性（アトリビュート） {#attribute}

[メトリクス](#metric)で特に使われる用語。
[メタデータ](#metadata)を参照。 Adds key-value information to the
entity producing telemetry. Used across [Signals](#signal) and
[Resources](#resource). See [attribute spec][attribute].

### 自動計装 {#automatic-instrumentation}

エンドユーザーがアプリケーションのソースコードを変更する必要のないテレメトリー収集方法を指します。
方法はプログラミング言語によって異なり、バイトコードインジェクションやモンキーパッチがその例です。 Methods vary by programming language, and
examples include bytecode injection or monkey patching.

### バゲッジ {#baggage}

イベントとサービスの因果関係を確立するための[メタデータ](#metadata)を伝搬するメカニズム。
[バゲッジ仕様][baggage]を参照のこと。 See [baggage spec][baggage].

### カーディナリティ {#cardinality}

The number of unique values for a given [Attribute](#attribute) or set of
attributes. High cardinality means many unique values, which can impact the
performance and storage requirements of telemetry backends. For example, a
`user_id` attribute would have high cardinality, while a `status_code` attribute
with values like "200", "404", "500" would have low cardinality.

### クライアントライブラリ {#client-library}

[計装済みライブラリ](#instrumented-library).

### クライアントサイドアプリケーション

[アプリケーション](#application)のコンポーネントで、プライベートなインフラストラクチャ内で実行されておらず、通常エンドユーザーが直接使用するもの。
クライアントサイドアプリの例としては、ブラウザアプリ、モバイルアプリ、IoTデバイス上で動作するアプリなどがあります。 Examples of
client-side apps are browser apps, mobile apps, and apps running on IoT devices.

### コレクター {#collector}

[OpenTelemetry コレクター][OpenTelemetry Collector]または短くしてコレクターは、テレメトリーデータの受信、処理、エクスポート方法に関するベンダー非依存の実装です。
エージェントまたはゲートウェイとしてデプロイ可能な単一のバイナリです。 A single
binary that can be deployed as an agent or gateway.

> OpenTelemetry コレクターを指す場合は、常に「コレクター」と大文字で記載してください。「コレクター」を形容詞として使用する場合（例：「コレクターの設定」）も、「コレクター」と記載してください（英語では大文字で Collector と書くことを示しているが、日本語の場合はコレクターと記述する）。 Use just "Collector" if you are using Collector as an
> adjective &mdash; for example, "Collector configuration".

[OpenTelemetry Collector]: /docs/collector/

### Contrib

いくつかの[計装ライブラリ](#instrumentation-library)と[コレクター](#collector)はコア機能のセットと、ベンダーの `エクスポーター` を含む非コア機能専用のcontribリポジトリを提供しています。

### コンテキスト伝搬（プロパゲーション） {#context-propagation}

すべての[データソース](#data-source)が、[トランザクション](#transaction)の寿命にわたって状態を保存したりデータにアクセスしたりするための基盤となるコンテキストメカニズムを共有できるようにします。
[コンテキスト伝搬仕様][context propagation]を参照。 See [context propagation
spec][context propagation].

### DAG {#dag}

[有向非巡回グラフ（Directed Acyclic Graph）][dag]のこと。

### データソース {#data-source}

[シグナル](#signal)を参照のこと。

### 次元（ディメンション） {#dimension}

A term used specifically by [Metrics](#metric). See [Attribute](#attribute).

### 分散トレース {#distributed-tracing}

[アプリケーション](#application)を構成する[サービス](#service)によって処理される、[トレース](#trace)と呼ばれる単一の[リクエスト](#request)の進行を追跡します。
[分散トレース](#distributed-tracing)は、プロセス、ネットワーク、セキュリティの境界を越えます。 A [Distributed trace](#distributed-tracing)
transverses process, network and security boundaries.

[分散トレース][distributed tracing]を参照してください。

### ディストリビューション {#distribution}

ディストリビューションとは、アップストリームのOpenTelemetryリポジトリのラッパーで、いくつかのカスタマイズが施されています。
詳細は[ディストリビューション][Distributions]を参照してください。 See [Distributions].

### イベント {#event}

イベントは、イベント名とよく知られた構造の[ログレコード](#log-record)です。
たとえば、OpenTelemetry のブラウザイベントは、特有の命名規則に従い、共通の構造における特有のデータを運びます。 For example, browser events in OpenTelemetry follow a particular
naming convention and carry particular data in a common structure.

### エクスポーター {#exporter}

Provides functionality to emit telemetry to consumers. Exporters can be push- or
pull-based.

### フィールド {#field}

A term used specifically by [Log Records](#log-record). [ログレコード](#log-record)で特に使われる用語。
[メタデータ](#metadata)は、[属性](#attribute)や[リソース](#resource)などの定義されたフィールドを通して追加できます。
重大度やトレース情報など、他のフィールドも `Metadata` とみなされるかもしれません。
[フィールド仕様][field]を参照してください。 Other fields may also be considered `Metadata`, including
severity and trace information. See the [field spec][field].

### gRPC {#grpc}

高性能でオープンソースのユニバーサル [RPC](#rpc) フレームワーク。
詳細は[gRPC](https://grpc.io)を参照してください。 See
[gRPC](https://grpc.io).

### HTTP {#http}

[Hypertext Transfer Protocol（ハイパーテキスト・トランスファー・プロトコル）][http]の略。

### 計装済みライブラリ {#instrumented-library}

テレメトリーシグナル([トレース](#trace)、[メトリクス](#metric)、[ログ](#log))を収集する[ライブラリ](#library)を表します。
詳細は[計装済みライブラリ][Instrumented library]を参照してください。 See
[Instrumented library][].

### 計装ライブラリ {#instrumentation-library}

Denotes the [Library](#library) that provides the instrumentation for a given
[Instrumented library](#instrumented-library).
特定の[計装済みライブラリ](#instrumented-library)に計装を提供する[ライブラリ](#library)を表します。
[計装済みライブラリ](#instrumented-library)と[計装ライブラリ](#instrumentation-library)は、ビルトインのOpenTelemetry計装をしている場合、同一の[ライブラリ](#library)になります。
詳細は[ライブラリ仕様][spec-instrumentation-lib]を参照してください。 See [the
lib specification][spec-instrumentation-lib].

### JSON {#json}

[JavaScript Object Notation][json]の略。

### ラベル {#label}

A term used specifically by [Metrics](#metric). See [Metadata](#metadata).

### 言語 {#language}

プログラミング言語のこと。

### ライブラリ {#library}

インターフェイスによって呼び出される動作の言語固有のコレクション。

### ログ {#log}

Sometimes used to refer to a collection of [Log records](#log-record). [ログレコード](#log-record)の集まりを指すのに使われることもあります。
また、単一の[ログ記録](#log-record)を指すために[ログ](#log)を使うこともあるので、曖昧になる可能性があります。
曖昧になる可能性がある場合は、追加の修飾子、たとえば`ログレコード`を使用してください。
詳細は[ログ][log]を参照してください。 Where ambiguity is possible, use additional
qualifiers, for example, `Log record`. See [Log].

### ログレコード {#log-record}

A recording of data with a timestamp and a severity. May also have a
[Trace ID](#trace) and [Span ID](#span) when correlated with a trace. See [Log
record][].

### メタデータ {#metadata}

A key-value pair, for example `foo="bar"`, added to an entity producing
telemetry. OpenTelemetry calls these pairs [Attributes](#attribute). In
addition, [Metrics](#metric) have [Dimensions](#dimension) an [Labels](#label),
while [Logs](#log) have [Fields](#field).

### メトリクス {#metric}

生の測定値または事前定義された集計値のいずれかのデータポイントを、[メタデータ](#metadata)付きの時系列として記録します。
詳細は[メトリクス][metric]を参照してください。 See [Metric].

### OC {#oc}

[OpenCensus](#opencensus)の略称。

### Observability backend

The component of an observability platform that is responsible for receiving,
processing, storing, and querying telemetry data. Examples include open source
tools like [Jaeger] and [Prometheus], as well as commercial offerings.
OpenTelemetry is not an observability backend.

### Observability frontend

テレメトリーデータの可視化と分析のためのユーザーインターフェースを提供するオブザーバビリティプラットフォームのコンポーネントです。
特に商用製品を検討すると、オブザーバビリティバックエンドの一部である場合がしばしばあります。 It can be often a part of an
observability backend, particularly when considering commercial offerings.

### OpAMP {#opamp}

[Open Agent Management Protocol](/docs/collector/management/#opamp) の省略形。

> **スペル** 説明または指示においては `OPAMP` や `opamp` でもなく OpAMP と書いてください。

### OpenCensus {#opencensus}

Precursor to OpenTelemetry. For details, see
[History](/docs/what-is-opentelemetry/#history).

### OpenTelemetry {#opentelemetry}

OpenTelemetry は、[OpenTracing](#opentracing) と [OpenCensus](#opencensus) プロジェクトの[統合][merger]によって生まれました。
OpenTelemetry &mdash; 本サイトの主題である &mdash;は、[API](#api)、[SDK](#sdk)、および各種ツールの集合体であり、[計装](/docs/concepts/instrumentation/)を行い、[メトリクス](#metric)、[ログ](#log)、[トレース](#trace)などの[テレメトリーデータ](/docs/concepts/signals/)を生成、[収集](/docs/concepts/components/#collector)、および[エクスポート](/docs/concepts/components/#exporters)するために使用できます。

> **スペル** OpenTelemetry は常にハイフンなしの一語で記述し、例のように大文字で表記してください。

[merger]: /docs/what-is-opentelemetry/#history

### OpenTracing {#opentracing}

Precursor to OpenTelemetry. OpenTelemetry の前身です。詳細については、[歴史](/docs/what-is-opentelemetry/#history) を参照してください。

### OT {#ot}

[OpenTracing](#opentracing)の略称。

### OTel {#otel}

[OpenTelemetry](/docs/what-is-opentelemetry/)の略称。

> **スペル** OTel と書いてください。`OTEL` ではありません。

### OTelCol {#otelcol}

[OpenTelemetryコレクター](#collector)の略称。

### OTEP {#otep}

[OpenTelemetry Enhancement Proposal] の頭字語。

> **Spelling**: "OTEPs" は複数形で記述してください。
> 説明で `OTep` または `otep` と書かないでください。 Don't write `OTep` or `otep` in
> descriptions.

[OpenTelemetry Enhancement Proposal]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/oteps/README.md

### OTLP {#otlp}

[OpenTelemetryプロトコル](/docs/specs/otlp/)の略称。

### Propagators

[スパン](#span)内のスパンコンテキストや[バゲッジ](#baggage)など、テレメトリーデータの特定の部分をシリアライズおよびデシリアライズするために使用します。
詳細は[プロパゲーター][Propagators]を参照してください。 See [Propagators].

### Proto {#proto}

Language independent interface types. See [opentelemetry-proto].

### レシーバー {#receiver}

[コレクター](/docs/collector/configuration/#receivers)が使用する用語で、テレメトリーデータの受信方法を定義します。
レシーバーはプッシュベースとプルベースがあります。
詳細は[レシーバー][Receiver]を参照してください。 Receivers can be push- or pull-based. See
[Receiver].

### リクエスト {#request}

[分散トレース](#distributed-tracing)を参照のこと。

### リソース {#resource}

テレメトリーを生成するエンティティに関する情報を[属性](#attribute)として捕捉します。
たとえば、Kubernetes 上のコンテナで実行されているテレメトリーを生成するプロセスには、プロセス名、ポッド名、名前空間、そして場合によってはデプロイメント名があります。
これらすべての属性を `Resource` に含めることができます。 For example, a process producing telemetry that is
running in a container on Kubernetes has a process name, a pod name, a
namespace, and possibly a deployment name. All these attributes can be included
in the `Resource`.

### REST {#rest}

[Representational State Transfer][rest]の略称。

### RPC {#rpc}

[Remote Procedure Call（リモートプロシージャーコール、遠隔手続き呼び出し）][rpc]の略称。

### サンプリング {#sampling}

A mechanism to control the amount of data exported. Most commonly used with the
[Tracing](#trace) [Data Source](#data-source). See [Sampling].

### SDK {#sdk}

Short for Software Development Kit. ソフトウェア開発キット（Software Development Kit）の略称。
OpenTelemetryの[API](#api)を実装する[ライブラリ](#library)を示すテレメトリーSDKを指します。

### セマンティック規約 {#semantic-conventions}

ベンダー非依存のテレメトリーデータを提供するために、[メタデータ](#metadata)の標準的な名前と値を定義します。

### サービス {#service}

A component of an [Application](#application). Multiple instances of a
[Service](#service) are typically deployed for high availability and
scalability. A [Service](#service) can be deployed in multiple locations.

### シグナル {#signal}

OpenTelemetryにおいては[トレース](#trace)、[メトリクス](#metric)、[ログ](#log)のいずれか。
詳細は[シグナル][Signals]を参照してください。 See [Signals].

### Span

[トレース](#trace)内の単一の操作を表します。
詳細は[スパン][Span]参照してください。 See [Span].

### スパンリンク {#span-link}

A span link is a link between causally-related spans. スパンリンクは、因果関係のあるスパン間のリンクです。
詳細は[スパン間のリンク](/docs/specs/otel/overview#links-between-spans)と[リンクの指定](/docs/specs/otel/trace/api#specifying-links)を参照してください。

### 仕様 {#specification}

すべての実装に対する言語横断的な要求と期待を記述しています。
詳細は[仕様][Specification]を参照してください。 See [Specification].

### ステータス {#status}

The result of the operation. Typically used to indicate whether an error
occurred. See [Status].

### タグ {#tag}

[メタデータ](#metadata)を参照のこと。

### トレース {#trace}

[スパン](#span)の[DAG](#dag)で、[スパン](#span)間のエッジ（辺）は親子関係として定義されます。
詳細は[トレース][Traces]を参照してください。 See [Traces].

### トレーサー {#tracer}

Responsible for creating [Spans](#span). See [Tracer].

### トランザクション {#transaction}

[分散トレース](#distributed-tracing)を参照のこと。

### zPages {#zpages}

An in-process alternative to external exporters. When included, they collect and
aggregate tracing and metrics information in the background; this data is served
on web pages when requested. See [zPages].

[attribute]: /docs/specs/otel/common/#attributes
[baggage]: /docs/specs/otel/baggage/api/
[context propagation]: /docs/specs/otel/overview#context-propagation
[dag]: https://en.wikipedia.org/wiki/Directed_acyclic_graph
[distributed tracing]: ../signals/traces/
[distributions]: ../distributions/
[field]: /docs/specs/otel/logs/data-model#field-kinds
[http]: https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol
[instrumented library]: /docs/specs/otel/glossary/#instrumented-library
[Jaeger]: https://www.jaegertracing.io/
[json]: https://en.wikipedia.org/wiki/JSON
[log record]: /docs/specs/otel/glossary#log-record
[log]: /docs/specs/otel/glossary#log
[metric]: ../signals/metrics/
[opentelemetry-proto]: https://github.com/open-telemetry/opentelemetry-proto
[propagators]: /docs/languages/go/instrumentation/#propagators-and-context
[Prometheus]: https://prometheus.io/
[receiver]: /docs/collector/configuration/#receivers
[rest]: https://en.wikipedia.org/wiki/Representational_state_transfer
[rpc]: https://en.wikipedia.org/wiki/Remote_procedure_call
[sampling]: /docs/specs/otel/trace/sdk#sampling
[signals]: ../signals/
[span]: /docs/specs/otel/trace/api#span
[spec-instrumentation-lib]: /docs/specs/otel/glossary/#instrumentation-library
[specification]: ../components/#specification
[status]: /docs/specs/otel/trace/api#set-status
[tracer]: /docs/specs/otel/trace/api#tracer
[traces]: /docs/specs/otel/overview#traces
[zpages]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/development/trace/zpages.md
