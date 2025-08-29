---
title: Pythonゼロコード・計装
linkTitle: Python
weight: 30
aliases: [ /docs/languages/python/automatic ]
cSpell:ignore: distro myapp
---

Automatic instrumentation with Python uses a Python agent that can be attached
to any Python application. This agent primarily uses
[monkey patching](https://en.wikipedia.org/wiki/Monkey_patch) to modify library
functions at runtime, allowing for the capture of telemetry data from many
popular libraries and frameworks.

## セットアップ {#setup}

以下のコマンドを実行して、適切なパッケージをインストールします。

```sh
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap -a install
```

`opentelemetry-distro` パッケージは API、SDK、`opentelemetry-bootstrap` と `opentelemetry-instrument` ツールをインストールします。

{{% alert title="Note" %}}

You must install a distro package to get auto instrumentation working. The
`opentelemetry-distro` package contains the default distro to automatically
configure some of the common options for users. {{% alert title="Note" %}}
自動計装を動作させるには、distro パッケージをインストールする必要があります。
`opentelemetry-distro` パッケージには、デフォルトの distro が含まれており、いくつかの一般的なオプションを自動的に設定できます。
詳しくは、[OpenTelemetry distro](/docs/languages/python/distro/) を参照してください。
{{% /alert %}}

{{% /alert %}}

The `opentelemetry-bootstrap -a install` command reads through the list of
packages installed in your active `site-packages` folder, and installs the
corresponding instrumentation libraries for these packages, if applicable. `opentelemetry-bootstrap -a install` コマンドは、アクティブな `site-packages` フォルダにインストールされているパッケージのリストを読み込んで、該当するパッケージがあれば、対応する計装ライブラリをインストールします。
たとえば、既に `flask` パッケージをインストールしている場合、 `opentelemetry-bootstrap -a install` を実行すると、かわりに `opentelemetry-instrumentation-flask` がインストールされます。
OpenTelemetry Python エージェントはモンキーパッチを使って、実行時にこれらのライブラリの関数を変更します。 The OpenTelemetry Python agent
will use monkey patching to modify functions in these libraries at runtime.

Running `opentelemetry-bootstrap` without arguments lists the recommended
instrumentation libraries to be installed. 引数なしで `opentelemetry-bootstrap` を実行すると、インストールされる推奨計装ライブラリが一覧表示されます。
詳細については、[`opentelemetry-bootstrap`](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/opentelemetry-instrumentation#opentelemetry-bootstrap) を参照してください。

{{% alert title="<code>uv</code>を使いますか?" color="warning" %}}
[uv](https://docs.astral.sh/uv/)パッケージマネージャーを使用している場合、`opentelemetry-bootstrap -a install` を実行する際に何らかの困難に直面するかもしれません。
詳しくは[uvを使ったブートストラップ](troubleshooting/#bootstrap-using-uv)を参照してください。
{{% /alert %}} For details, see
[Bootstrap using uv](troubleshooting/#bootstrap-using-uv). {{% /alert %}}

エージェントの設定 {#configuring-the-agent}

Pythonによる自動計装は、任意のPythonアプリケーションにアタッチ可能なPythonエージェントを使用します。
このエージェントは、主に[モンキーパッチ](https://en.wikipedia.org/wiki/Monkey_patch)を使用して、実行時にライブラリ関数を変更し、多くの一般的なライブラリとフレームワークからのテレメトリーデータのキャプチャを可能にします。
-------------------------------------------------------------------------------------------------------------------------------------

エージェントは高度に設定可能です。

選択肢の1つめは、CLIから設定プロパティによってエージェントを設定することです。

```sh
opentelemetry-instrument \
    --traces_exporter console,otlp \
    --metrics_exporter console \
    --service_name your-service-name \
    --exporter_otlp_endpoint 0.0.0.0:4317 \
    python myapp.py
```

あるいは、環境変数を使ってエージェントを設定することも可能です。

```sh
OTEL_SERVICE_NAME=your-service-name \
OTEL_TRACES_EXPORTER=console,otlp \
OTEL_METRICS_EXPORTER=console \
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=0.0.0.0:4317
opentelemetry-instrument \
    python myapp.py
```

設定オプションの全範囲を見るには、[エージェント設定](configuration)を参照してください。

## サポートされるライブラリとフレームワーク {#supported-libraries-and-frameworks}

[Flask](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-flask) や [Django](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-django) など、人気のある Python ライブラリの多くが自動計装に対応しています。
全リストは [レジストリ](/ecosystem/registry/?language=python&component=instrumentation) を参照してください。
For the full list, see the
[Registry](/ecosystem/registry/?language=python&component=instrumentation).

## トラブルシューティング {#troubleshooting}

一般的なトラブルシューティングの手順と特定の問題に対する解決策については、[トラブルシューティング](./troubleshooting/) を参照してください。
