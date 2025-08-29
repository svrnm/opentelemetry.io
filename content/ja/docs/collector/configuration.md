---
title: 設定
weight: 20
description: ニーズに合わせてコレクターを設定する方法を確認してください
# prettier-ignore
cSpell:ignore: cfssl cfssljson fluentforward gencert genkey hostmetrics initca oidc otlphttp pprof prodevent prometheusremotewrite spanevents upsert zpages
---

<!-- markdownlint-disable link-fragments -->

観測のニーズに合わせて OpenTelemetry Collector を設定できます。
コレクターの設定方法を学ぶ前に、以下の内容を理解してください。
Before you learn how Collector configuration works, familiarize yourself with
the following content:

- [データ収集の概念][dcc]、OpenTelemetry コレクターに適用可能なリポジトリを理解します。
- [エンドユーザー向けセキュリティガイダンス](/docs/security/config-best-practices/)
- [コンポーネント開発者のためのセキュリティガイダンス](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/security-best-practices.md)

## ロケーション {#location}

デフォルトでは、コレクターの設定は `/etc/<otel-directory>/config.yaml` に配置されます。
ここで、 `<otel-directory>` はコレクターのバージョンや使っているコレクターのディストリビューションによって `otelcol` 、 `otelcol-contrib` あるいは他の値となります。

`--config` オプションを使用して、1つまたは複数の設定を指定できます。
たとえば次のように行います。 For
example:

```shell
otelcol --config=customconfig.yaml
```

また、異なるパスにある複数のファイルを使用して、複数の設定を提供できます。
各ファイルは完全な構成でも部分的な構成でもよく、ファイルは互いのコンポーネントを参照できます。
ファイルの結合が完全な設定を構成しない場合、必要なコンポーネントがデフォルトで追加されないため、エラーとなります。
コマンドラインで次のように複数のファイルパスを渡します。 Each file can be a full or partial configuration, and the files can
reference components from each other. If the merger of files does not constitute
a complete configuration, the user receives an error since required components
are not added by default. Pass in multiple file paths at the command line as
follows:

```shell
otelcol --config=file:/path/to/first/file --config=file:/path/to/second/file
```

環境変数、HTTP URI、YAMLパスを使って設定を提供することもできます。
たとえば次のように行います。 For example:

```shell
otelcol --config=env:MY_CONFIG_IN_AN_ENVVAR --config=https://server/config.yaml
otelcol --config="yaml:exporters::debug::verbosity: normal"
```

{{% alert title="Tip" %}}

YAML パスでネストされたキーを参照するとき、ドットを含む名前空間との混乱を避けるために、必ずダブルコロン (::) を使います。
たとえば `receivers::docker_stats::metrics::container.cpu.utilization::enabled: false` などです。 For example:
`receivers::docker_stats::metrics::container.cpu.utilization::enabled: false`.

{{% /alert %}}

設定ファイルを検証するには、 `validate` コマンドを使用します。
たとえば次のような形です。 For example:

```shell
otelcol validate --config=customconfig.yaml
```

## 設定の構造 {#basics}

コレクターの設定ファイルの構造は、テレメトリーデータにアクセスするパイプラインコンポーネントの4つのクラスで構成されます。

- [レシーバー](#receivers) <img width="32" alt="" class="img-initial" src="/img/logos/32x32/Receivers.svg">
- [プロセッサー](#processors) <img width="32" alt="" class="img-initial" src="/img/logos/32x32/Processors.svg">
- [エクスポーター](#exporters) <img width="32" alt="" class="img-initial" src="/img/logos/32x32/Exporters.svg">
- [コネクター](#connectors) <img width="32" alt="" class="img-initial" src="/img/logos/32x32/Load_Balancer.svg">

各パイプラインコンポーネントを設定した後、設定ファイルの[service](#service)節内のパイプラインを使用して有効にする必要があります。

パイプラインコンポーネントの他に、[拡張機能](#extensions)を設定することもできます。
[拡張機能](#extensions)は、診断ツールなど、コレクターに追加できる機能を提供します。
拡張機能はテレメトリーデータに直接アクセスする必要はなく、[service](#service) 節で有効にできます。 Extensions don't require direct access to telemetry data and
are enabled through the [service](#service) section.

<a id="endpoint-0.0.0.0-warning"></a>以下は、レシーバー、プロセッサー、エクスポーター、3つの拡張機能を持つコレクターの設定例です。

{{% alert title="Important" color="warning" %}}

While it is generally preferable to bind endpoints to `localhost` when all
clients are local, our example configurations use the "unspecified" address
`0.0.0.0` as a convenience. The Collector currently defaults to `0.0.0.0`, but
the default will be changed to `localhost` in the near future. For details
concerning either of these choices as endpoint configuration value, see
[Safeguards against denial of service attacks].

[Safeguards against denial of service attacks]: https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/security-best-practices.md#safeguards-against-denial-of-service-attacks

{{% /alert %}}

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  batch:

exporters:
  otlp:
    endpoint: otelcol:4317

extensions:
  health_check:
  pprof:
  zpages:

service:
  extensions: [health_check, pprof, zpages]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
```

Note that receivers, processors, exporters and pipelines are defined through
component identifiers following the `type[/name]` format, for example `otlp` or
`otlp/2`. You can define components of a given type more than once as long as
the identifiers are unique. For example:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
  otlp/2:
    protocols:
      grpc:
        endpoint: 0.0.0.0:55690

processors:
  batch:
  batch/test:

exporters:
  otlp:
    endpoint: otelcol:4317
  otlp/2:
    endpoint: otelcol2:4317

extensions:
  health_check:
  pprof:
  zpages:

service:
  extensions: [health_check, pprof, zpages]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    traces/2:
      receivers: [otlp/2]
      processors: [batch/test]
      exporters: [otlp/2]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
```

設定は他のファイルを含むこともでき、コレクターはそれらをYAML設定の単一のメモリ内表現にマージします。

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

exporters: ${file:exporters.yaml}

service:
  extensions: []
  pipelines:
    traces:
      receivers: [otlp]
      processors: []
      exporters: [otlp]
```

そして `exporters.yaml` ファイルが次のようになっているとします。

```yaml
otlp:
  endpoint: otelcol.observability.svc.cluster.local:443
```

メモリの最終結果はこうなります。

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

exporters:
  otlp:
    endpoint: otelcol.observability.svc.cluster.local:443

service:
  extensions: []
  pipelines:
    traces:
      receivers: [otlp]
      processors: []
      exporters: [otlp]
```

## レシーバー <img width="35" class="img-initial" alt="" src="/img/logos/32x32/Receivers.svg"> {#receivers}

Receivers collect telemetry from one or more sources. They can be pull or push
based, and may support one or more [data sources](/docs/concepts/signals/).

Receivers are configured in the `receivers` section. Many receivers come with
default settings, so that specifying the name of the receiver is enough to
configure it. If you need to configure a receiver or want to change the default
configuration, you can do so in this section. Any setting you specify overrides
the default values, if present.

> Configuring a receiver does not enable it. Receivers are enabled by adding
> them to the appropriate pipelines within the [service](#service) section.

The Collector requires one or more receivers. The following example shows
various receivers in the same configuration file:

```yaml
receivers:
  # データソース: ログ
  fluentforward:
    endpoint: 0.0.0.0:8006

  # データソース: メトリクス
  hostmetrics:
    scrapers:
      cpu:
      disk:
      filesystem:
      load:
      memory:
      network:
      process:
      processes:
      paging:

  # データソース: トレース
  jaeger:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      thrift_binary:
      thrift_compact:
      thrift_http:

  # データソース: トレース、メトリクス、ログ
  kafka:
    protocol_version: 2.0.0

  # データソース: トレース、メトリクス
  opencensus:

  # データソース: トレース、メトリクス、ログ
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
        tls:
          cert_file: cert.pem
          key_file: cert-key.pem
      http:
        endpoint: 0.0.0.0:4318

  # データソース: メトリクス
  prometheus:
    config:
      scrape_configs:
        - job_name: otel-コレクター
          scrape_interval: 5s
          static_configs:
            - targets: [localhost:8888]

  # データソース: トレース
  zipkin:
```

> 詳細なレシーバー設定については、[レシーバーのREADME](https://github.com/open-telemetry/opentelemetry-collector/blob/main/receiver/README.md)を参照してください。

## プロセッサー <img width="35" class="img-initial" alt="" src="/img/logos/32x32/Processors.svg"> {#processors}

Processors take the data collected by receivers and modify or transform it
before sending it to the exporters. Data processing happens according to rules
or settings defined for each processor, which might include filtering, dropping,
renaming, or recalculating telemetry, among other operations. The order of the
processors in a pipeline determines the order of the processing operations that
the Collector applies to the signal.

プロセッサーはオプションですが、いくつかは[推奨](https://github.com/open-telemetry/opentelemetry-collector/tree/main/processor#recommended-processors)です。

コレクター構成ファイルの `processors` セクションを使用してプロセッサーを構成できます。
指定した設定は、デフォルト値がある場合はそれを上書きします。 Any setting you specify overrides the default values, if
present.

> Configuring a processor does not enable it. プロセッサーを設定しても、そのプロセッサーが有効になるわけではありません。
> プロセッサーは、[service](#service)セクション内の適切なパイプラインに追加することで有効になります。

The following example shows several default processors in the same configuration
file. 以下の例では、同じ設定ファイルの中にデフォルトのプロセッサーをいくつか示しています。
[opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor)のリストと[opentelemetry-collector](https://github.com/open-telemetry/opentelemetry-collector/tree/main/processor)のリストを組み合わせることで、プロセッサーの完全なリストを見つけられます。

```yaml
processors:
  # データソース: トレース
  attributes:
    actions:
      - key: environment
        value: production
        action: insert
      - key: db.statement
        action: delete
      - key: email
        action: hash

  # データソース: トレース、メトリクス、ログ
  batch:

  # データソース: メトリクス、トレース、ログ
  filter:
    error_mode: ignore
    traces:
      span:
        - 'attributes["container.name"] == "app_container_1"'
        - 'resource.attributes["host.name"] == "localhost"'
        - 'name == "app_3"'
      spanevent:
        - 'attributes["grpc"] == true'
        - 'IsMatch(name, ".*grpc.*")'
    metrics:
      metric:
        - 'name == "my.metric" and resource.attributes["my_label"] == "abc123"'
        - 'type == METRIC_DATA_TYPE_HISTOGRAM'
      datapoint:
        - 'metric.type == METRIC_DATA_TYPE_SUMMARY'
        - 'resource.attributes["service.name"] == "my_service_name"'
    logs:
      log_record:
        - 'IsMatch(body, ".*password.*")'
        - 'severity_number < SEVERITY_NUMBER_WARN'

  # データソース: トレース、メトリクス、ログ
  memory_limiter:
    check_interval: 5s
    limit_mib: 4000
    spike_limit_mib: 500

  # データソース: トレース
  resource:
    attributes:
      - key: cloud.zone
        value: zone-1
        action: upsert
      - key: k8s.cluster.name
        from_attribute: k8s-cluster
        action: insert
      - key: redundant-attribute
        action: delete

  # データソース: トレース
  probabilistic_sampler:
    hash_seed: 22
    sampling_percentage: 15

  # データソース: トレース
  span:
    name:
      to_attributes:
        rules:
          - ^\/api\/v1\/document\/(?P<documentId>.*)\/update$
      from_attributes: [db.svc, operation]
      separator: '::'
```

> プロセッサー設定の詳細については、[プロセッサーのREADME](https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/README.md)を参照してください。

## エクスポーター <img width="35" class="img-initial" alt="" src="/img/logos/32x32/Exporters.svg"> {#exporters}

エクスポーターはデータを1つ以上のバックエンドや宛先に送信します。
また、1つ以上の[データソース](/docs/concepts/signals/)をサポートすることもあります。 Exporters can be
pull or push based, and may support one or more
[data sources](/docs/concepts/signals/).

`exporters` セクション内の各キーはエクスポーターインスタンスを定義します。
キーは `type/name` の形式にしたがい、`type` はエクスポータータイプを指定します(例: `otlp`、 `kafka`、`prometheus`)。
また、`name` （オプション）を追加して、同じタイプの複数のインスタンスに対して一意の名前を指定することもできます。

Most exporters require configuration to specify at least the destination, as
well as security settings, like authentication tokens or TLS certificates. Any
setting you specify overrides the default values, if present.

> Configuring an exporter does not enable it. エクスポーターを設定しても、それが有効になるわけではありません。
> エクスポート機能は、[service](#service)セクション内の適切なパイプラインに追加することで有効になります。

The Collector requires one or more exporters. The following example shows
various exporters in the same configuration file:

```yaml
exporters:
  # データソース: トレース、メトリクス、ログ
  file:
    path: ./filename.json

  # データソース: トレース
  otlp/jaeger:
    endpoint: jaeger-server:4317
    tls:
      cert_file: cert.pem
      key_file: cert-key.pem

  # データソース: トレース、メトリクス、ログ
  kafka:
    protocol_version: 2.0.0

  # データソース: トレース、メトリクス、ログ
  # NOTE: v0.86.0 以前では `debug` ではなく `logging` とする
  debug:
    verbosity: detailed

  # データソース: トレース、メトリクス
  opencensus:
    endpoint: otelcol2:55678

  # データソース: トレース、メトリクス、ログ
  otlp:
    endpoint: otelcol2:4317
    tls:
      cert_file: cert.pem
      key_file: cert-key.pem

  # データソース: トレース、メトリクス
  otlphttp:
    endpoint: https://otlp.example.com:4318

  # データソース: メトリクス
  prometheus:
    endpoint: 0.0.0.0:8889
    namespace: default

  # データソース: メトリクス
  prometheusremotewrite:
    endpoint: http://prometheus.example.com:9411/api/prom/push
    # 公式の Prometheus (Docker経由で動作) の
    # エンドポイントを使う場合は: 'http://prometheus:9090/api/v1/write' 次を追加
    # tls:
    #   insecure: true

  # # データソース: トレース
  zipkin:
    endpoint: http://zipkin.example.com:9411/api/v2/spans
```

[証明書の設定](#setting-up-certificates)で説明されているように、安全な接続を確立するためにx.509証明書を必要とするエクスポーターもあることに注意してください。

> エクスポーターの設定については、[エクスポーターのREADME.md](https://github.com/open-telemetry/opentelemetry-collector/blob/main/exporter/README.md)を参照してください。

## コネクター <img width="32" class="img-initial" alt="" src="/img/logos/32x32/Load_Balancer.svg"> {#connectors}

Connectors join two pipelines, acting as both exporter and receiver. A connector
consumes data as an exporter at the end of one pipeline and emits data as a
receiver at the beginning of another pipeline. The data consumed and emitted may
be of the same type or of different data types. You can use connectors to
summarize consumed data, replicate it, or route it.

コレクター構成ファイルの `connectors` セクションを使用して、1つまたは複数のコネクターを構成できます。
デフォルトでは、コネクターは構成されていません。
コネクターの各タイプは、1つまたは複数のデータ型のペアで動作するように設計されており、パイプラインの接続にのみ使用できます。 By default, no connectors are configured. Each
type of connector is designed to work with one or more pairs of data types and
may only be used to connect pipelines accordingly.

> Configuring a connector doesn't enable it. コネクターは[service](#service)セクション内のパイプラインを通じて有効になります。

次の例は、`count` コネクターと、`pipelines` 節での設定方法を示しています。
このコネクターは、トレースのエクスポーターとして、またメトリクスのレシーバーとして機能し、両方のパイプラインを接続していることに注意してください。 Notice that the connector acts as an exporter for traces
and as a receiver for metrics, connecting both pipelines:

```yaml
receivers:
  foo:

exporters:
  bar:

connectors:
  count:
    spanevents:
      my.prod.event.count:
        description: The number of span events from my prod environment.
        conditions:
          - 'attributes["env"] == "prod"'
          - 'name == "prodevent"'

service:
  pipelines:
    traces:
      receivers: [foo]
      exporters: [count]
    metrics:
      receivers: [count]
      exporters: [bar]
```

> コネクターの詳細な設定については、[コネクターのREADME](https://github.com/open-telemetry/opentelemetry-collector/blob/main/connector/README.md)を参照。

## Extensions <img width="32" class="img-initial" alt="" src="/img/logos/32x32/Extensions.svg"> {#extensions}

拡張機能は、コレクターの機能を拡張して、テレメトリーデータの処理に直接関係しないタスクを実行するオプションのコンポーネントです。
たとえば、コレクターのヘルス監視、サービスディスカバリ、データ転送などの拡張機能を追加できます。 For
example, you can add extensions for Collector health monitoring, service
discovery, or data forwarding, among others.

コレクター設定ファイルの `extensions` セクションで拡張機能を設定できます。
ほとんどの拡張機能にはデフォルトの設定が付属しているため、拡張機能の名前を指定するだけで設定できます。
指定した設定は、デフォルト値がある場合はそれを上書きします。 Most extensions come with default settings, so you can
configure them just by specifying the name of the extension. Any setting you
specify overrides the default values, if present.

> Configuring an extension doesn't enable it. 拡張機能を設定しても有効にはなりません。
> 拡張機能は[service](#service)セクションで有効になります。

デフォルトでは、拡張機能は設定されていません。
次の例では、同じファイルに複数の拡張機能が設定されています。 The following example shows several
extensions configured in the same file:

```yaml
extensions:
  health_check:
  pprof:
  zpages:
```

> 詳細な拡張機能の設定については、[拡張機能のREADME](https://github.com/open-telemetry/opentelemetry-collector/blob/main/extension/README.md)を参照してください。

## サービスセクション {#service}

The `service` section is used to configure what components are enabled in the
Collector based on the configuration found in the receivers, processors,
exporters, and extensions sections. `service` セクションは、レシーバー、プロセッサー、エクスポーター、および拡張機能のセクションの構成に基づいて、コレクターで有効になるコンポーネントを構成するために使用されます。
コンポーネントが設定されているけれど、`service` セクションで定義されていない場合、そのコンポーネントは有効になりません。

サービス部門は3つのサブ節で構成されています。

- extensions
- pipelines
- telemetry

### 拡張機能 {#service-extensions}

`extensions` サブセクションは、有効にする拡張のリストで構成されます。
たとえば次のようになります。 For example:

```yaml
service:
  extensions: [health_check, pprof, zpages]
```

### パイプライン {#pipelines}

The `pipelines` subsection is where the pipelines are configured, which can be
of the following types:

- `traces:` トレースデータの収集と処理を行います
- `metrics:` メトリクスデータの収集と処理を行います
- `logs:` ログデータの収集と処理を行います

A pipeline consists of a set of receivers, processors and exporters. Before
including a receiver, processor, or exporter in a pipeline, make sure to define
its configuration in the appropriate section.

同じレシーバー、プロセッサー、エクスポーターを複数のパイプラインで使用できます。
プロセッサーが複数のパイプラインで参照される場合、各パイプラインはプロセッサーの個別のインスタンスを取得します。
When a processor is referenced in multiple pipelines, each pipeline gets a
separate instance of the processor.

The following is an example of pipeline configuration. Note that the order of
processors dictates the order in which data is processed:

```yaml
service:
  pipelines:
    metrics:
      receivers: [opencensus, prometheus]
      processors: [batch]
      exporters: [opencensus, prometheus]
    traces:
      receivers: [opencensus, jaeger]
      processors: [batch, memory_limiter]
      exporters: [opencensus, zipkin]
```

コンポーネントと同様に、`type[/name]` 構文を使用して、指定したタイプのパイプラインを追加作成します。
前述の設定を拡張した例を示します。 Here is an example extending the previous configuration:

```yaml
service:
  pipelines:
    # ...
    traces:
      # ...
    traces/2:
      receivers: [opencensus]
      processors: [batch]
      exporters: [zipkin]
```

### テレメトリー {#telemetry}

The `telemetry` config section is where you can set up observability for the
Collector itself. It consists of two subsections: `logs` and `metrics`. `telemetry` 設定セクションでは、コレクター自体のオブザーバビリティを設定します。
これは2つのサブセクションで構成されます。
`logs` および `metrics` です。
これらのシグナルの設定方法については、[コレクター内部のテレメトリーを有効にする](/docs/collector/internal-telemetry#activate-internal-telemetry-in-the-collector) を参照してください。

## その他の情報 {#other-information}

### 環境変数 {#environment-variables}

The use and expansion of environment variables is supported in the Collector
configuration. コレクター設定では、環境変数の使用と拡張がサポートされています。
たとえば、`DB_KEY` および `OPERATION` 環境変数に格納されている値を使用するには、以下のように記述します。

```yaml
processors:
  attributes/example:
    actions:
      - key: ${env:DB_KEY}
        action: ${env:OPERATION}
```

You can pass defaults to an environment variable using the bash syntax:
`${env:DB_KEY:-some-default-var}`

```yaml
processors:
  attributes/example:
    actions:
      - key: ${env:DB_KEY:-mydefault}
        action: ${env:OPERATION:-}
```

リテラル `$` を示すには `$$` を使用します。
たとえば、`$DataVisualization` 使うときは、次のようになります。 For example, representing
`$DataVisualization` would look like the following:

```yaml
exporters:
  prometheus:
    endpoint: prometheus:8889
    namespace: $$DataVisualization
```

### プロキシ対応 {#proxy-support}

[`net/http`](https://pkg.go.dev/net/http) パッケージを使用するエクスポーターは、以下のプロキシ環境変数を尊重します。

- `HTTP_PROXY`: HTTPプロキシのアドレス
- `HTTPS_PROXY`: HTTPSプロキシのアドレス
- `NO_PROXY`: プロキシを使ってはいけないアドレス

コレクターの開始時に設定されている場合、エクスポーターはプロトコルに関係なく、これらの環境変数によって定義されたプロキシトラフィックまたはバイパスプロキシトラフィックを使用します。

### 認証 {#authentication}

HTTPまたはgRPCポートを公開しているほとんどのレシーバーは、コレクターの認証メカニズムを使用して保護できます。
同様に、HTTP または gRPC クライアントを使用するほとんどのエクスポーターは、送信リクエストに認証を追加できます。 Similarly, most exporters using HTTP or
gRPC clients can add authentication to outgoing requests.

コレクターの認証メカニズムは拡張メカニズムを使用しており、カスタム認証機能をコレクターディストリビューションにプラグインできます。
各認証拡張機能には2つの使用法があります。
Each authentication extension has two possible usages:

- エクスポーターのクライアント認証機能として、送信リクエストに認証データを追加します。
- レシーバーのサーバー認証機能として、着信接続を認証します。

既知の認証機能のリストについては、[レジストリ](/ecosystem/registry/?s=authenticator&component=extension)を参照してください。
カスタムの認証機能を開発したい場合は、[認証機能の拡張を開発する](../building/authenticator-extension) を参照してください。 If you're
interested in developing a custom authenticator, see
[Building an authenticator extension](../building/authenticator-extension).

コレクターのレシーバーにサーバー認証機能を追加するには、以下の手順にしたがいます。

1. 認証機能拡張とその設定を `.extensions` に追加します。
2. 認証機能への参照を `.services.extensions` に追加し、コレクターで読み込まれるようにします。
3. `.receivers.<your-receiver>.<http-or-grpc-config>.auth` に認証子への参照を追加します。

以下の例では、レシーバー側でOIDC認証を使用しているため、エージェントとして動作する OpenTelemetryコレクターからデータを受信するリモート コレクターに適しています。

```yaml
extensions:
  oauth2client:
    client_id: agent
    client_secret: some-secret
    token_url: http://localhost:8080/auth/realms/opentelemetry/protocol/openid-connect/token

receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

processors:

exporters:
  otlp/auth:
    endpoint: remote-コレクター:4317
    auth:
      authenticator: oauth2client

service:
  extensions:
    - oauth2client
  pipelines:
    traces:
      receivers:
        - otlp
      processors: []
      exporters:
        - otlp/auth
```

エージェント側では、OTLPエクスポーターにOIDCトークンを取得させ、リモートコレクターへのすべてのRPCに追加する例です。

```yaml
extensions:
  oidc:
    issuer_url: http://localhost:8080/auth/realms/opentelemetry
    audience: collector

receivers:
  otlp/auth:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
        auth:
          authenticator: oidc

processors:

exporters:
  # NOTE: v0.86.0 以前では `debug` ではなく `logging` を使うこと
  debug:

service:
  extensions:
    - oidc
  pipelines:
    traces:
      receivers:
        - otlp/auth
      processors: []
      exporters:
        - debug
```

### 証明書の設定 {#setting-up-certificates}

本番環境では、セキュアな通信にTLS証明書を使用するか、相互認証にmTLSを使用します。
以下の手順にしたがって、この例のように自己署名証明書を生成します。
現在使用している証明書のプロビジョニング手順を使用して、本番環境で使用する証明書を調達するといいでしょう。 Follow these steps to generate self-signed
certificates as in this example. You might want to use your current cert
provisioning procedures to procure a certificate for production usage.

[`cfssl`](https://github.com/cloudflare/cfssl)をインストールし、以下の `csr.json` ファイルを作成します。

```json
{
  "hosts": ["localhost", "127.0.0.1"],
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "O": "OpenTelemetry Example"
    }
  ]
}
```

そして以下のコマンドを実行します。

```sh
cfssl genkey -initca csr.json | cfssljson -bare ca
cfssl gencert -ca ca.pem -ca-key ca-key.pem csr.json | cfssljson -bare cert
```

これで2つの証明書が作成されます。

- `ca.pem` の "OpenTelemetry Example" 認証局（CA）とそれに紐づく `ca-key.pem` のキー
- OpenTelemetry Example CA が署名した `cert.pem` のクライアント証明書、およびそれに紐づいた `cert-key.pem` のキー

[dcc]: /docs/concepts/components/#collector

## 設定を上書きする {#override-settings}

`--set` オプションを使用してコレクター設定をオーバーライドできます。
この方法で定義した設定は、すべての `--config` ソースが解決されてマージされた後に最終的な設定にマージされます。 The settings you
define with this method are merged into the final configuration after all
`--config` sources are resolved and merged.

以下の例では、ネストされた節の内部で設定を上書きする方法を示します。

```sh
otelcol --set "exporters::debug::verbosity=detailed"
otelcol --set "receivers::otlp::protocols::grpc={endpoint:localhost:4317, compression: gzip}"
```

{{% alert title="Important" color="warning" %}}

`--set` オプションは、ドットまたは等号を含むキーの設定に対応していません。

{{% /alert %}}
