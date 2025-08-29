---
title: エージェント設定
linkTitle: Configuration
weight: 10
aliases:
  - /docs/languages/python/automatic/configuration
  - /docs/languages/python/automatic/agent-config
cSpell:ignore: healthcheck instrumentor myapp pyproject Starlette urllib
---

エージェントは次のいずれかの方法で高度に設定可能です。

- CLIから設定プロパティを渡す
- [環境変数](/docs/specs/otel/configuration/sdk-environment-variables/)の設定

## 設定プロパティ {#configuration-properties}

以下は、設定プロパティによるエージェント設定の例です。

```sh
opentelemetry-instrument \
    --traces_exporter console,otlp \
    --metrics_exporter console \
    --service_name your-service-name \
    --exporter_otlp_endpoint 0.0.0.0:4317 \
    python myapp.py
```

ここでは、それぞれの設定が何をするのかを説明します。

- `traces_exporter` specifies which traces exporter to use. In this case, traces
  are being exported to `console` (stdout) and with `otlp`. The `otlp` option
  tells `opentelemetry-instrument` to send the traces to an endpoint that
  accepts OTLP via gRPC. In order to use HTTP instead of gRPC, add
  `--exporter_otlp_protocol http/protobuf`. The full list of available options
  for traces_exporter, see the Python contrib
  [OpenTelemetry Instrumentation](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/opentelemetry-instrumentation).
- `metrics_exporter` specifies which metrics exporter to use. In this case,
  metrics are being exported to `console` (stdout). It is currently required for
  your to specify a metrics exporter. If you aren't exporting metrics, specify
  `none` as the value instead.
- `service_name` はテレメトリーに関連するサービス名を設定し、[オブザーバビリティバックエンド](/ecosystem/vendors/) に送信します。
- `exporter_otlp_endpoint`は、テレメトリーをエクスポートするエンドポイントを設定します。
  省略した場合は、デフォルトの [コレクター](/docs/collector/) のエンドポイントが使用され、gRPC の場合は `0.0.0.0:4317`、HTTP の場合は `0.0.0.0:4318` となります。 If
  omitted, the default [Collector](/docs/collector/) endpoint will be used,
  which is `0.0.0.0:4317` for gRPC and `0.0.0.0:4318` for HTTP.
- `exporter_otlp_headers` is required depending on your chosen Observability
  backend. `exporter_otlp_headers`は、選択したオブザーバビリティバックエンドに応じて必要となります。
  OTLPエクスポーターヘッダーの詳細については、[OTEL_EXPORTER_OTLP_HEADERS](/docs/languages/sdk-configuration/otlp-exporter/#otel_exporter_otlp_headers)を参照してください。

## 環境変数 {#environment-variables}

場合によっては、[環境変数](/docs/languages/sdk-configuration/)を使って設定する方が望ましいこともあります。
コマンドライン引数で設定可能なすべての設定は、環境変数でも設定できます。
Any setting configurable with a command-line argument can also be configured
with an Environment Variable.

以下の手順を適用して、目的の構成プロパティの正しい名前マッピングを決定できます。

- 設定プロパティを大文字に変換します。
- 環境変数のプレフィックスを `OTEL_` にします。

たとえば、`exporter_otlp_endpoint` は `OTEL_EXPORTER_OTLP_ENDPOINT` に変換されます。

## Python 固有の設定 {#python-specific-configuration}

環境変数の前に `OTEL_PYTHON_` を付けて設定できる Python 固有の設定オプションがいくつかあります。

### 除外されるURL {#excluded-urls}

カンマ区切りの正規表現で、すべての計装で除外するURLを表します。

- `OTEL_PYTHON_EXCLUDED_URLS`

変数 `OTEL_PYTHON_<library>_EXCLUDED_URLS` を使って、特定の計装の URL を除外することもできます。
ここで `library` は Django、Falcon、FastAPI、Flask、Pyramid、Requests、Starlette、Tornado、urllib、 urllib3 のいずれかのライブラリ名を大文字化したものです。

例を挙げましょう。

```sh
export OTEL_PYTHON_EXCLUDED_URLS="client/.*/info,healthcheck"
export OTEL_PYTHON_URLLIB3_EXCLUDED_URLS="client/.*/info"
export OTEL_PYTHON_REQUESTS_EXCLUDED_URLS="healthcheck"
```

### リクエスト属性名 {#request-attribute-names}

リクエストオブジェクトから抽出され、スパンの属性として設定される名前のカンマ区切りリスト。

- `OTEL_PYTHON_DJANGO_TRACED_REQUEST_ATTRS`
- `OTEL_PYTHON_FALCON_TRACED_REQUEST_ATTRS`
- `OTEL_PYTHON_TORNADO_TRACED_REQUEST_ATTRS`

例を挙げましょう。

```sh
export OTEL_PYTHON_DJANGO_TRACED_REQUEST_ATTRS='path_info,content_type'
export OTEL_PYTHON_FALCON_TRACED_REQUEST_ATTRS='query_string,uri_template'
export OTEL_PYTHON_TORNADO_TRACED_REQUEST_ATTRS='uri,query'
```

### ロギング {#logging}

出力されるログを制御するための設定オプションがいくつかあります。

- `OTEL_PYTHON_LOG_CORRELATION`: ログへのトレースコンテキストの注入を有効にする (true、false)。
- `OTEL_PYTHON_LOG_FORMAT`: カスタムログフォーマットを使うように設定します。
- `OTEL_PYTHON_LOG_LEVEL`: カスタムのログレベル (情報、エラー、デバッグ、警告) を設定します。
- `OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED`: to enable
  auto-instrumentation of logs. Attaches OTLP handler to Python root logger. For
  an example, see
  [Logs Auto-Instrumentation](/docs/zero-code/python/logs-example/).

例を挙げましょう。

```sh
export OTEL_PYTHON_LOG_CORRELATION=true
export OTEL_PYTHON_LOG_FORMAT="%(msg)s [span_id=%(span_id)s]"
export OTEL_PYTHON_LOG_LEVEL=debug
export OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED=true
```

### その他 {#other}

特定のカテゴリーに分類されない設定オプションもいくつかあります。

- `OTEL_PYTHON_DJANGO_INSTRUMENT`: Django 計装のデフォルトの有効状態を無効にするために `false` を設定します。
- `OTEL_PYTHON_ELASTICSEARCH_NAME_PREFIX`: Elasticsearch の操作名のデフォルトのプレフィックスを "Elasticsearch" からここで設定したものに変更します。
- `OTEL_PYTHON_GRPC_EXCLUDED_SERVICES`: gRPC 計装から除外するサービスをカンマ区切りで指定します。
- `OTEL_PYTHON_ID_GENERATOR`: グローバルトレーサプロバイダーに使用する ID ジェネレータを指定します。
- `OTEL_PYTHON_INSTRUMENTATION_SANITIZE_REDIS`: クエリーのサニタイズ処理を有効にします。

例を挙げましょう。

```sh
export OTEL_PYTHON_DJANGO_INSTRUMENT=false
export OTEL_PYTHON_ELASTICSEARCH_NAME_PREFIX=my-custom-prefix
export OTEL_PYTHON_GRPC_EXCLUDED_SERVICES="GRPCTestServer,GRPCHealthServer"
export OTEL_PYTHON_ID_GENERATOR=xray
export OTEL_PYTHON_INSTRUMENTATION_SANITIZE_REDIS=true
```

## 特定の計装を無効にする {#disabling-specific-instrumentations}

デフォルトのPythonエージェントは、Pythonプログラムのパッケージを検出し、可能な限りのパッケージを計装します。
これは計装を簡単にしますが、結果的にデータが多すぎたり、不要になったりすることがあります。 This makes instrumentation easy, but can result
in too much or unwanted data.

You can omit specific packages from instrumentation by using the
`OTEL_PYTHON_DISABLED_INSTRUMENTATIONS` environment variable. The environment
variable can be set to a comma-separated list of instrumentations entry point
names to exclude from instrumentation. `OTEL_PYTHON_DISABLED_INSTRUMENTATIONS` 環境変数を使うことで、特定のパッケージを計装から除外できます。
この環境変数には、計装から除外する計装のエントリーポイント名をカンマ区切りで指定します。
ほとんどの場合、エントリーポイント名はパッケージ名と同じで、パッケージの `pyproject.toml` ファイル内の `project.entry-points.opentelemetry_instrumentor` テーブルに設定されます。

たとえば、Python プログラムが `redis`、`kafka-python`、`grpc` パッケージを使用している場合、デフォルトではエージェントは `opentelemetry-instrumentation-redis`、`opentelemetry-instrumentation-kafka-python`、`opentelemetry-instrumentation-grpc` パッケージを使用して計装を行います。
これを無効にするには、`OTEL_PYTHON_DISABLED_INSTRUMENTATIONS=redis,kafka,grpc_client` を設定します。 To disable
this, you can set
`OTEL_PYTHON_DISABLED_INSTRUMENTATIONS=redis,kafka,grpc_client`.
