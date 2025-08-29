---
title: Lambda 自動計装
weight: 11
description: あなたのLambdaをOpenTelemetryで自動的に計装する
cSpell:ignore: Corretto regionalized
---

OpenTelemetryコミュニティは、以下の言語用のスタンドアロン計装Lambdaレイヤーを提供しています。

- Java
- JavaScript
- Python
- Ruby

These can be added to your Lambda using the AWS portal to automatically
instrument your application. These layers do not include the Collector which is
a required addition unless you configure an external Collector instance to send
your data.

### OTel Collector LambdaレイヤーのARNを追加する {#add-the-arn-of-the-otel-collector-lambda-layer}

[Collector Lambdaレイヤーのガイダンス](../lambda-collector/)を参照して、アプリケーションにレイヤーを追加し、Collectorを設定してください。
これを最初に追加することをおすすめします。 We recommend you add this
first.

### 言語要件 {#language-requirements}

{{< tabpane text=true >}} {{% tab Java %}}

Lambdaレイヤーは、Java 8, 11, 17 (Corretto) Lambdaランタイムをサポートしています。
サポートされているJavaのバージョンについては、[OpenTelemetry Java ドキュメント](/docs/languages/java/) を参照してください。 For
more information about supported Java versions, see the
[OpenTelemetry Java documentation](/docs/languages/java/).

**注意:** Javaの自動計装エージェントがLambdaレイヤー内にあります - 自動計装エージェントはAWS Lambdaの起動時間に顕著な影響を与えるので、初期化中に最初のリクエストでタイムアウトを起こさずに本番のリクエストに対応するためには、一般的にプロビジョニングされた同時実行とウォームアップリクエストと共にこれを使用する必要があります。

デフォルトでは、レイヤーのOTel Javaエージェントは、アプリケーション内のすべてのコードを自動計装しようとします。
これはLambdaのコールドスタートの起動時間に悪影響を及ぼす可能性があります。 This can have a negative impact on the Lambda cold
startup time.

アプリケーションで使用するライブラリ／フレームワークの自動計装のみを有効にすることをおすすめします。

特定の計装だけを有効にするには、以下の環境変数を使用します。

- `OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED`: falseに設定すると、レイヤーの自動計装を無効にし、各計装を個別に有効にする必要があります。
- `OTEL_INSTRUMENTATION_<NAME>_ENABLED`: set to true to enable
  auto-instrumentation for a specific library or framework. Replace `<NAME>` by
  the instrumentation that you want to enable. For the list of available
  instrumentations, see [Suppressing specific agent instrumentation][1].

  [1]: /docs/zero-code/java/agent/disable/#suppressing-specific-agent-instrumentation

たとえば、LambdaとAWS SDKの自動計装だけを有効にするには、以下の環境変数を設定します。

```sh
OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED=false
OTEL_INSTRUMENTATION_AWS_LAMBDA_ENABLED=true
OTEL_INSTRUMENTATION_AWS_SDK_ENABLED=true
```

{{% /tab %}} {{% tab JavaScript %}}

Lambdaレイヤーは、Node.js v18+のLambdaランタイムをサポートしています。
サポートされるJavaScriptとNode.jsのバージョンの詳細については、[OpenTelemetry JavaScriptドキュメント](https://github.com/open-telemetry/opentelemetry-js)を参照してください。 For more information
about supported JavaScript and Node.js versions, see the
[OpenTelemetry JavaScript documentation](https://github.com/open-telemetry/opentelemetry-js).

{{% /tab %}} {{% tab Python %}}

The Lambda layer supports Python 3.9+ Lambda runtimes. LambdaレイヤーはPython 3.9+のLambdaランタイムをサポートしています。
サポートされているPythonのバージョンについては、[OpenTelemetry Pythonドキュメント](https://github.com/open-telemetry/opentelemetry-python/blob/main/README.md#supported-runtimes) と [PyPi](https://pypi.org/project/opentelemetry-api/) のパッケージを参照してください。

{{% /tab %}} {{% tab Ruby %}}

The Lambda layer supports Ruby 3.2 and 3.3 Lambda runtimes. Lambda レイヤーは、Ruby 3.2 と 3.3 の Lambda ランタイムをサポートしています。
サポートされる OpenTelemetry Ruby SDK と API バージョンの詳細については、[OpenTelemetry Rubyドキュメント](https://github.com/open-telemetry/opentelemetry-ruby/blob/main/README.md#compatibility) と [RubyGem](https://rubygems.org/search?query=opentelemetry) のパッケージを参照してください。

{{% /tab %}} {{< /tabpane >}}

### `AWS_LAMBDA_EXEC_WRAPPER` を設定する {#configure-aws_lambda_exec_wrapper}

Node.js、Java、Ruby、Pythonの場合は `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler` を設定して、アプリケーションのエントリーポイントを変更します。
このラッパースクリプトは、自動計装を適用したLambdaアプリケーションを起動します。
This wrapper script invokes your Lambda application with the automatic
instrumentation applied.

### 計装LambdaレイヤーのARNを追加する {#add-the-arn-of-instrumentation-lambda-layer}

Lambda関数でOTelの自動計装を有効にするには、計装レイヤーとコレクターレイヤーを追加して設定し、トレースを有効にする必要があります。

1. AWSコンソールで、計装するLambda関数を開く。
2. 「レイヤー」セクションで、「レイヤーの追加」を選択します。
3. 「ARNを指定」でレイヤーのARNを貼り付け、「追加」を選択します。

あなたの言語の[最新の計装レイヤーリリース](https://github.com/open-telemetry/opentelemetry-lambda/releases)を見つけ、そのARNを使用します。
`<region>`タグをあなたのラムダがあるリージョンに変更します。

注意: ラムダレイヤーはリージョンで分かれたリソースで、公開されているリージョンでのみ使用できます。Lambda関数と同じリージョンでレイヤーを使用するようにしてください。コミュニティは、利用可能なすべてのリージョンでレイヤーを公開しています。 Make sure to use the layer in
the same region as your Lambda functions. The community publishes layers in all
available regions.

### SDKのエクスポーターの設定 {#configure-your-sdk-exporters}

gRPC/HTTPレシーバーを持つコレクターが組み込まれている場合、Lambdaレイヤーで使用されるデフォルトのエクスポーターは変更なしで動作します。
環境変数を更新する必要はありません。
ただし、プロトコルのサポートレベルやデフォルト値は言語によって異なります。 The environment
variables do not need to be updated. However, there are varying levels of
protocol support and default values by language which are documented below.

{{< tabpane text=true >}} {{% tab Java %}}

`OTEL_EXPORTER_OTLP_PROTOCOL=grpc` は `grpc`、`http/protobuf` および `http/json`、`OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317` をサポートします。

{{% /tab %}} {{% tab JavaScript %}}

環境変数 `OTEL_EXPORTER_OTLP_PROTOCOL` はサポートされていません。ハードコードされたエクスポーターはプロトコル `http/protobuf` を使用します。`OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318`

{{% /tab %}} {{% tab Python %}}

`OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` は `http/protobuf` と `http/json` 、`OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318` をサポートします。

{{% /tab %}} {{% tab Ruby %}}

`OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` は `http/protobuf` `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318` をサポートします。

{{% /tab %}} {{< /tabpane >}}

### Lambdaを公開する {#publish-your-lambda}

Lambdaの新しいバージョンを公開して、新しい変更と計装をデプロイします。
