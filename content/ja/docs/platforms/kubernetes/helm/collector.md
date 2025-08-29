---
title: OpenTelemetryコレクターチャート
linkTitle: コレクターチャート
# prettier-ignore
cSpell:ignore: debugexporter filelog filelogreceiver hostmetricsreceiver kubelet kubeletstats kubeletstatsreceiver otlphttp sattributesprocessor sclusterreceiver sobjectsreceiver statefulset
---

## はじめに {#introduction}

The [OpenTelemetry Collector](/docs/collector) is an important tool for
monitoring a Kubernetes cluster and all the services that in within. [OpenTelemetryコレクター](/docs/collector)は、Kubernetesクラスタとその中のすべてのサービスを監視するための重要なツールです。
Kubernetesへのコレクターのデプロイメントを容易にし、管理するために、OpenTelemetryコミュニティは[OpenTelemetryコレクターHelmチャート](https://github.com/open-telemetry/opentelemetry-helm-charts/tree/main/charts/opentelemetry-collector)を作成しました。
このHelmチャートは、コレクターをデプロイメント、DaemonSet、またはStatefulSetとしてインストールするために使用できます。
This helm chart can be used to install a collector as a Deployment, Daemonset,
or Statefulset.

### チャートのインストール {#installing-the-chart}

リリース名 `my-opentelemetry-collector` のチャートをインストールするには、以下のコマンドを実行します。

```sh
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm install my-opentelemetry-collector open-telemetry/opentelemetry-collector \
   --set image.repository="otel/opentelemetry-collector-k8s" \
   --set mode=<daemonset|deployment|statefulset> \
```

### 設定 {#configuration}

OpenTelemetryコレクターチャートでは `mode` が設定されている必要があります。
`mode` には、ユースケースに応じたKubernetesデプロイメントに依存して `daemonset` 、 `deployment` 、 `statefulset` のいずれかを指定します。 `mode` can be
either `daemonset`, `deployment`, or `statefulset` depending on which kind of
Kubernetes deployment your use case requires.

インストールされると、チャートはいくつかのデフォルトのコレクターコンポーネントを提供します。
デフォルトでは、コレクターの設定は以下のようになります。 By default, the collector's config will look like:

```yaml
exporters:
  # 注意: v0.86.0 より前のバージョンでは、`debug` のかわりに `logging` を使用すること
  debug: {}
extensions:
  health_check: {}
processors:
  batch: {}
  memory_limiter:
    check_interval: 5s
    limit_percentage: 80
    spike_limit_percentage: 25
receivers:
  jaeger:
    protocols:
      grpc:
        endpoint: ${env:MY_POD_IP}:14250
      thrift_compact:
        endpoint: ${env:MY_POD_IP}:6831
      thrift_http:
        endpoint: ${env:MY_POD_IP}:14268
  otlp:
    protocols:
      grpc:
        endpoint: ${env:MY_POD_IP}:4317
      http:
        endpoint: ${env:MY_POD_IP}:4318
  prometheus:
    config:
      scrape_configs:
        - job_name: opentelemetry-collector
          scrape_interval: 10s
          static_configs:
            - targets:
                - ${env:MY_POD_IP}:8888
  zipkin:
    endpoint: ${env:MY_POD_IP}:9411
service:
  extensions:
    - health_check
  pipelines:
    logs:
      exporters:
        - debug
      processors:
        - memory_limiter
        - batch
      receivers:
        - otlp
    metrics:
      exporters:
        - debug
      processors:
        - memory_limiter
        - batch
      receivers:
        - otlp
        - prometheus
    traces:
      exporters:
        - debug
      processors:
        - memory_limiter
        - batch
      receivers:
        - otlp
        - jaeger
        - zipkin
  telemetry:
    metrics:
      address: ${env:MY_POD_IP}:8888
```

The chart will also enable ports based on the default receivers. Default
configuration can be removed by setting the value to `null` in your
`values.yaml`. Ports can be disabled in the `values.yaml` as well.

`values.yaml` の `config` セクションを使用して、設定の任意の部分を追加/変更できます。
パイプラインを変更する場合は、デフォルトのコンポーネントを含め、パイプラインに含まれるすべてのコンポーネントを明示的にリストアップする必要があります。 When changing a pipeline, you must explicitly list all the
components that are in the pipeline, including any default components.

たとえば、メトリクスとロギングパイプラインと非OTLPレシーバーを無効にするには次のように設定します。

```yaml
config:
  receivers:
    jaeger: null
    prometheus: null
    zipkin: null
  service:
    pipelines:
      traces:
        receivers:
          - otlp
      metrics: null
      logs: null
ports:
  jaeger-compact:
    enabled: false
  jaeger-thrift:
    enabled: false
  jaeger-grpc:
    enabled: false
  zipkin:
    enabled: false
```

チャートで利用可能なすべての設定オプション（コメント付き）は、その[values.yamlファイル](https://github.com/open-telemetry/opentelemetry-helm-charts/blob/main/charts/opentelemetry-collector/values.yaml)で確認できます。

### プリセット {#presets}

OpenTelemetryコレクターがKubernetesを監視するために使用する重要なコンポーネントの多くは、コレクター自身のKubernetesデプロイメントで特別なセットアップを必要とします。
これらのコンポーネントをより簡単に使用するために、OpenTelemetryコレクターチャートには、有効にするとこれらの重要なコンポーネントの複雑なセットアップを処理するいくつかのプリセットが付属しています。
In order to make using these components easier, the OpenTelemetry Collector
Chart comes with some presets that, when enabled, handle the complex setup for
these important components.

Presets should be used as a starting point. They configure basic, but rich,
functionality for their related components. If your use case requires extra
configuration of these components it is recommend to NOT use the preset and
instead manually configure the component and anything it requires (volumes,
RBAC, etc.).

#### ログコレクションプリセット {#logs-collection-preset}

OpenTelemetryコレクターは、Kubernetesコンテナによって標準出力に送られるログを収集するために使用できます。

This feature is disabled by default. It has the following requirements in order
to be safely enabled:

- [ファイルログレシーバー](/docs/platforms/kubernetes/collector/components/#filelog-receiver)が[コレクターのContribディストリビューション](https://github.com/open-telemetry/opentelemetry-collector-releases/pkgs/container/opentelemetry-collector-releases%2Fopentelemetry-collector-contrib)などのコレクターイメージに含まれている必要があります。
- Although not a strict requirement, it is recommended this preset be used with
  `mode=daemonset`. 厳密な要件ではありませんが、このプリセットは `mode=daemonset` と共に使用することを推奨します。
  `filelogreceiver`はコレクターが動作しているノード上のログのみを収集することができ、同じノード上に設定された複数のコレクターは重複したデータを生成します。

To enable this feature, set the `presets.logsCollection.enabled` property to
`true`. When enabled, the chart will add a `filelogreceiver` to the `logs`
pipeline. This receiver is configured to read the files where Kubernetes
container runtime writes all containers' console output
(`/var/log/pods/*/*/*.log`).

以下に `values.yaml` の例を示します。

```yaml
mode: daemonset
presets:
  logsCollection:
    enabled: true
```

チャートのデフォルトのログパイプラインは `debugexporter` を使用します。
`logsCollection` プリセットの `filelogreceiver` と組み合わせると、エクスポートしたログを誤ってコレクターに戻してしまい、「ログの爆発」を引き起こす可能性があります。 Paired with the
`logsCollection` preset's `filelogreceiver` it is easy to accidentally feed the
exported logs back into the collector, which can cause a "log explosion".

To prevent the looping, the default configuration of the receiver excludes the
collector's own logs. ループを防止するために、レシーバーのデフォルト設定ではコレクター自身のログを除外しています。
コレクターのログを含めたい場合は、 `debug` エクスポーターをコレクターの標準出力にログを送信しないエクスポーターに置き換えてください。

以下は `values.yaml` の例で、`logs` パイプラインのデフォルトの `debug` エクスポーターを、コンテナのログを `https://example.com:55681` エンドポイントに送信する `otlphttp` エクスポーターに置き換えたものです。
また、`presets.logsCollection.includeCollectorLogs` を使用して、コレクターのログの収集を有効にするようにプリセットに指示します。 It also uses
`presets.logsCollection.includeCollectorLogs` to tell the preset to enable
collection of the collector's logs.

```yaml
mode: daemonset

presets:
  logsCollection:
    enabled: true
    includeCollectorLogs: true

config:
  exporters:
    otlphttp:
      endpoint: https://example.com:55681
  service:
    pipelines:
      logs:
        exporters:
          - otlphttp
```

#### Kubernetes属性プリセット {#kubernetes-attributes-preset}

OpenTelemetryコレクター は `k8s.pod.name`、`k8s.namespace.name`、`k8s.node.name` などの Kubernetes メタデータをログ、メトリクス、トレースに追加するように設定できます。
プリセットを使用するか、手動で `k8sattributesprocessor` を有効にすることを強く推奨します。 It is highly recommended to use the preset, or enable the
`k8sattributesprocessor` manually.

RBACを考慮し、この機能はデフォルトでは無効になっています。
この機能には以下の要件があります。 It has the
following requirements:

- [Kubernetes属性プロセッサー](/docs/platforms/kubernetes/collector/components/#kubernetes-attributes-processor)が[コレクターのContribディストリビューション](https://github.com/open-telemetry/opentelemetry-collector-releases/pkgs/container/opentelemetry-collector-releases%2Fopentelemetry-collector-contrib)などのコレクターイメージに含まれている必要があります。

To enable this feature, set the `presets.kubernetesAttributes.enabled` property
to `true`. この機能を有効にするには、`presets.kubernetesAttributes.enabled` プロパティを `true` に設定します。
有効にすると、チャートはClusterRoleに必要なRBACロールを追加し、有効にした各パイプラインに `k8sattributesprocessor` を追加します。

以下に `values.yaml` の例を示します。

```yaml
mode: daemonset
presets:
  kubernetesAttributes:
    enabled: true
```

#### Kubeletメトリクスプリセット {#kubelet-metrics-preset}

OpenTelemetryコレクター は、kubelet 上の API サーバーからノード、ポッド、コンテナのメトリクスを収集するように設定できます。

この機能はデフォルトでは無効になっています。
この機能には以下の条件があります。 It has the following requirements:

- [Kubeletstatsレシーバー](/docs/platforms/kubernetes/collector/components/#kubeletstats-receiver)が[コレクターのContribディストリビューション](https://github.com/open-telemetry/opentelemetry-collector-releases/pkgs/container/opentelemetry-collector-releases%2Fopentelemetry-collector-contrib)などのコレクターイメージに含まれている必要があります。
- Although not a strict requirement, it is recommended this preset be used with
  `mode=daemonset`. The `kubeletstatsreceiver` will only be able to collect
  metrics on the node the Collector is running and multiple configured
  Collectors on the same node will produce duplicate data.

To enable this feature, set the `presets.kubeletMetrics.enabled` property to
`true`. この機能を有効にするには、`presets.kubeletMetrics.enabled` プロパティを `true` に設定します。
有効にすると、チャートはClusterRoleに必要なRBACロールを追加し、メトリクスパイプラインに `kubeletstatsreceiver` を追加します。

以下に`values.yaml`の例を示します。

```yaml
mode: daemonset
presets:
  kubeletMetrics:
    enabled: true
```

#### クラスターメトリクスプリセット {#cluster-metrics-preset}

OpenTelemetryコレクターは、Kubernetes APIサーバーからクラスタレベルのメトリクスを収集するように設定できます。
これらのメトリクスには、Kube State Metricsで収集されるメトリクスの多くが含まれます。 These metrics include many of the metrics
collected by Kube State Metrics.

この機能はデフォルトでは無効になっています。
この機能には以下の条件があります。 It has the following requirements:

- [Kubernetesクラスターレシーバー](/docs/platforms/kubernetes/collector/components/#kubernetes-cluster-receiver)が[コレクターのContribディストリビューション](https://github.com/open-telemetry/opentelemetry-collector-releases/pkgs/container/opentelemetry-collector-releases%2Fopentelemetry-collector-contrib)などのコレクターイメージに含まれている必要があります。
- Although not a strict requirement, it is recommended this preset be used with
  `mode=deployment` or `mode=statefulset` with a single replica. Running
  `k8sclusterreceiver` on multiple Collectors will produce duplicate data.

To enable this feature, set the `presets.clusterMetrics.enabled` property to
`true`. この機能を有効にするには、 `presets.clusterMetrics.enabled` プロパティを `true` に設定します。
有効にすると、チャートは必要なRBACロールをClusterRoleに追加し、 `k8sclusterreceiver` をメトリクスパイプラインに追加します。

以下に `values.yaml` の例を示します。

```yaml
mode: deployment
replicaCount: 1
presets:
  clusterMetrics:
    enabled: true
```

#### Kubernetesイベントプリセット {#kubernetes-events-preset}

OpenTelemetryコレクターはKubernetesイベントを収集するように設定できます。

この機能はデフォルトでは無効になっています。
この機能には以下の条件があります。 It has the following requirements:

- [Kubernetesオブジェクトレシーバー](/docs/platforms/kubernetes/collector/components/#kubernetes-objects-receiver)が[コレクターのContribディストリビューション](https://github.com/open-telemetry/opentelemetry-collector-releases/pkgs/container/opentelemetry-collector-releases%2Fopentelemetry-collector-contrib)などのコレクターイメージに含まれている必要があります。
- Although not a strict requirement, it is recommended this preset be used with
  `mode=deployment` or `mode=statefulset` with a single replica. Running
  `k8sclusterreceiver` on multiple Collectors will produce duplicate data.

To enable this feature, set the `presets.kubernetesEvents.enabled` property to
`true`. この機能を有効にするには、`presets.kubernetesEvents.enabled` プロパティを `true` に設定します。
有効にすると、チャートは ClusterRole に必要な RBAC ロールを追加し、ログパイプラインに `k8sobjectsreceiver` を追加してコレクターイベントのみに設定します。

以下に `values.yaml` の例を示します。

```yaml
mode: deployment
replicaCount: 1
presets:
  kubernetesEvents:
    enabled: true
```

#### ホストメトリクスプリセット {#host-metrics-preset}

OpenTelemetryコレクターは、Kubernetesノードからホストメトリクスを収集するように設定できます。

この機能はデフォルトでは無効になっています。
この機能には以下の条件があります。 It has the following requirements:

- [コレクターのContribディストリビューション](https://github.com/open-telemetry/opentelemetry-collector-releases/pkgs/container/opentelemetry-collector-releases%2Fopentelemetry-collector-contrib)などのコレクターイメージに[ホストメトリクスレシーバー](/docs/platforms/kubernetes/collector/components/#host-metrics-receiver)が含まれている必要があります。
- Although not a strict requirement, it is recommended this preset be used with
  `mode=daemonset`. The `hostmetricsreceiver` will only be able to collect
  metrics on the node the Collector is running and multiple configured
  Collectors on the same node will produce duplicate data.

To enable this feature, set the `presets.hostMetrics.enabled` property to
`true`. When enabled, the chart will add the necessary volumes and volumeMounts
and will add a `hostmetricsreceiver` to the metrics pipeline. By default metrics
will be scrapped every 10 seconds and the following scrappers are enabled:

- cpu
- load
- memory
- disk
- filesystem[^1]
- network

以下に`values.yaml`の例を示します。

```yaml
mode: daemonset
presets:
  hostMetrics:
    enabled: true
```

[^1] `kubeletMetrics` プリセットと重複する部分があるため、デフォルトでは一部のファイルシステムタイプとマウントポイントは除外されています。
