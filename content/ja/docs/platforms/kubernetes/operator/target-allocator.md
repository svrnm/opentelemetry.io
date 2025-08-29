---
title: ターゲットアロケーター
description: デプロイされたすべてのコレクターインスタンスでPrometheusレシーバーのターゲットを分散するツール
cSpell:ignore: labeldrop labelmap statefulset
---

OpenTelemetryオペレーターはオプションのコンポーネントである[ターゲットアロケーター](https://github.com/open-telemetry/opentelemetry-operator/tree/main/cmd/otel-allocator)(TA)を提供します。
簡単に言うと、TAはPrometheusのサービスディスカバリーとメトリクス収集機能を分離するメカニズムであり、それらを独立してスケールさせることができます。
コレクターは、PrometheusをインストールすることなくPrometheusメトリクスを収集します。
TAは、コレクターのPrometheusレシーバーの設定を管理します。 In a nutshell, the TA is a mechanism for decoupling the service discovery
and metric collection functions of Prometheus such that they can be scaled
independently. The Collector manages Prometheus metrics without needing to
install Prometheus. The TA manages the configuration of the Collector's
Prometheus Receiver.

TAは2つの機能を提供します。

1. Prometheusターゲットをコレクターのプール間で均等に分散する
2. Prometheusのカスタムリソースを検出する

## Getting Started {#getting-started}

When creating an OpenTelemetryCollector Custom Resource (CR) and setting the TA
as enabled, the Operator will create a new deployment and service to serve
specific `http_sd_config` directives for each Collector pod as part of that CR.
It will also change the Prometheus receiver configuration in the CR, so that it
uses the [http_sd_config](https://prometheus.io/docs/prometheus/latest/http_sd/)
from the TA. The following example shows how to get started with the Target
Allocator:

```yaml
apiVersion: opentelemetry.io/v1alpha1
kind: OpenTelemetryCollector
metadata:
  name: collector-with-ta
spec:
  mode: statefulset
  targetAllocator:
    enabled: true
  config: |
    receivers:
      prometheus:
        config:
          scrape_configs:
          - job_name: 'otel-collector'
            scrape_interval: 10s
            static_configs:
            - targets: [ '0.0.0.0:8888' ]
            metric_relabel_configs:
            - action: labeldrop
              regex: (id|name)
              replacement: $$1
            - action: labelmap
              regex: label_(.+)
              replacement: $$1

    exporters:
      # NOTE: v0.86.0より前のバージョンでは `debug` の代わりに `logging` を使用してください。
      debug:

    service:
      pipelines:
        metrics:
          receivers: [prometheus]
          processors: []
          exporters: [debug]
```

この背後では、OpenTelemetryオペレーターがリコンシレーション後にコレクター設定を次のように変換します。

```yaml
receivers:
  prometheus:
    config:
      scrape_configs:
        - job_name: otel-collector
          scrape_interval: 10s
          http_sd_configs:
            - url: http://collector-with-ta-targetallocator:80/jobs/otel-collector/targets?collector_id=$POD_NAME
          metric_relabel_configs:
            - action: labeldrop
              regex: (id|name)
              replacement: $$1
            - action: labelmap
              regex: label_(.+)
              replacement: $$1

exporters:
  debug:

service:
  pipelines:
    metrics:
      receivers: [prometheus]
      processors: []
      exporters: [debug]
```

Note how the Operator removes any existing service discovery configurations
(e.g., `static_configs`, `file_sd_configs`, etc.) オペレーターが `scrape_configs` セクションから既存のサービスディスカバリー構成(たとえば `static_configs`、 `file_sd_configs` など)を削除し、プロビジョニングしたターゲットアロケーターインスタンスを指す `http_sd_configs` 構成を追加することに注意してください。

ターゲットアロケーターの詳細については、[ターゲットアロケーター](https://github.com/open-telemetry/opentelemetry-operator/tree/main/cmd/otel-allocator)を参照してください。
