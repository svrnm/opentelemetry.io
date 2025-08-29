---
title: OpenTelemetryデモチャート
linkTitle: デモチャート
---

The [OpenTelemetry Demo](/docs/demo/) is a microservice-based distributed system
intended to illustrate the implementation of OpenTelemetry in a near real-world
environment. [OpenTelemetry Demo](/docs/demo/) は、実世界に近い環境での OpenTelemetry の実装を説明することを意図した、マイクロサービスベースの分散システムです。
その一環として、OpenTelemetryコミュニティは、[OpenTelemetryデモHelmチャート](https://github.com/open-telemetry/opentelemetry-helm-charts/tree/main/charts/opentelemetry-demo) を作成し、Kubernetesに簡単にインストールできるようにしています。

## 設定 {#configuration}

The Demo helm chart's default `values.yaml` is ready to be installed. All
components have had their memory limits tuned to optimize performance, which may
cause issues if your cluster is not large enough. The entire installation is
restricted to ~4 Gigabytes of memory, but may use less.

チャートで利用可能なすべての設定オプション（コメント付き）は [`values.yaml` ファイル](https://github.com/open-telemetry/opentelemetry-helm-charts/blob/main/charts/opentelemetry-demo/values.yaml)で見ることができ、詳細な説明は[チャートのREADME](https://github.com/open-telemetry/opentelemetry-helm-charts/tree/main/charts/opentelemetry-demo#chart-parameters)で確認できます。

## インストール {#installation}

OpenTelemetry Helmリポジトリを追加します。

```shell
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
```

リリース名 `my-otel-demo` のチャートをインストールするには、以下のコマンドを実行してください。

```sh
helm install my-otel-demo open-telemetry/opentelemetry-demo
```

インストールが完了したら、以下のコマンドを実行することで、すべてのサービスがフロントエンドプロキシ (<http://localhost:8080>) 経由で利用可能になります。

```sh
kubectl port-forward svc/my-otel-demo-frontendproxy 8080:8080
```

プロキシが公開されたら、以下のパスにアクセスすることもできます。

| コンポーネント   | パス                                                                                         |
| --------- | ------------------------------------------------------------------------------------------ |
| ウェブストア    | <http://localhost:8080>           |
| Grafana   | <http://localhost:8080/grafana>   |
| 機能フラグUI   | <http://localhost:8080/feature>   |
| 負荷生成UI    | <http://localhost:8080/loadgen>   |
| Jaeger UI | <http://localhost:8080/jaeger/ui> |

ウェブストアからのスパンを収集するには、OpenTelemetryコレクターOTLP/HTTPレシーバーを公開する必要があります。

```sh
kubectl port-forward svc/my-otel-demo-otelcol 4318:4318
```

Kubernetesでデモを使用する詳細については、[Kubernetesデプロイメント](/docs/demo/kubernetes-deployment/)を参照してください。
