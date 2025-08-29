---
title: OpenTelemetryオペレーターを使用して自動計装を注入する
linkTitle: Operator
aliases: [ /docs/languages/python/automatic/operator ]
weight: 30
cSpell:ignore: grpcio myapp psutil PYTHONPATH
---

KubernetesでPythonサービスを実行する場合、[OpenTelemetryオペレーター](https://github.com/open-telemetry/opentelemetry-operator)を活用することで、各サービスを直接修正することなく自動計装を注入できます。
[詳細はOpenTelemetryオペレーターによる自動計装のドキュメントを参照してください](/docs/platforms/kubernetes/operator/automatic/)
[See the OpenTelemetry Operator Auto-instrumentation docs for more details.](/docs/platforms/kubernetes/operator/automatic/)

### Python 固有のトピック {#python-specific-topics}

#### バイナリwheel付きライブラリ {#libraries-with-binary-wheels}

私たちが計装を行ったり、計装ライブラリで必要とするPythonのパッケージの中には、バイナリコードが同梱されていることがあります。
たとえば、`grpcio` や `psutil` (`opentelemetry-instrumentation-system-metrics` で使われている) がそうです。 This is the case, for example, of `grpcio` and
`psutil` (used in `opentelemetry-instrumentation-system-metrics`).

The binary code is tied to a specific C library version (glibc or musl) and to a
specific Python version. バイナリコードは、特定のCライブラリのバージョン（glibcまたはmusl）と特定のPythonのバージョンに関連付けられています。
[OpenTelemetryオペレーター](https://github.com/open-telemetry/opentelemetry-operator)は、glibc Cライブラリに基づいた単一のPythonバージョン用のイメージを提供します。
もしこれを使いたいのであれば、Python自動計装用のオペレーターDockerイメージを自分で構築する必要があるかもしれません。 If you
want to use it you might need to build your own image operator Docker image for
Python auto-instrumentation.

オペレーター v0.113.0以降、glibcとmuslベースの自動計装の両方を持つイメージをビルドし、[実行時に設定する](/docs/platforms/kubernetes/operator/automatic/#annotations-python-musl)ことが可能です。

#### Django アプリケーション {#django-applications}

Django のように独自の実行ファイルから実行されるアプリケーションでは、デプロイファイルに2つの環境変数を設定する必要があります。

- `PYTHONPATH` には Django アプリケーションのルートディレクトリへのパスを指定します（例: "/app"）。
- `DJANGO_SETTINGS_MODULE` に Django 設定モジュールの名前を指定します（例: "myapp.settings"）。
