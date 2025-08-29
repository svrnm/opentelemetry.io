---
title: メトリクス
weight: 2
description: 実行時に取得された測定値
---

A **metric** is a **measurement** of a service captured at runtime. **メトリクス**とは、実行時に取得されるサービスの**測定値**のことです。
測定値を取得した瞬間は**メトリクスイベント**として知られており、測定値そのものだけでなく、キャプチャした時刻と関連するメタデータから構成されます。

Application and request metrics are important indicators of availability and
performance. Custom metrics can provide insights into how availability
indicators impact user experience or the business. Collected data can be used to
alert of an outage or trigger scheduling decisions to scale up a deployment
automatically upon high demand.

OpenTelemetryのメトリクスがどのように機能するのかを理解するために、コードの計装の一部を担うコンポーネントのリストを見てみましょう。

## メータープロバイダー {#meter-provider}

A Meter Provider (sometimes called `MeterProvider`) is a factory for `Meter`s.
In most applications, a Meter Provider is initialized once and its lifecycle
matches the application's lifecycle. Meter Provider initialization also includes
Resource and Exporter initialization. It is typically the first step in metering
with OpenTelemetry. In some language SDKs, a global Meter Provider is already
initialized for you.

## メーター {#meter}

メーターは[メトリクス計装](#metric-instruments)を作成し、実行時にサービスに関する測定値を取得します。
メーターはメータープロバイダーから作成されます。 Meters are created from Meter
Providers.

## メトリクスエクスポーター {#metric-exporter}

Metric Exporters send metric data to a consumer. This consumer can be standard
output for debugging during development, the OpenTelemetry Collector, or any
open source or vendor backend of your choice.

## メトリクス計装 {#metric-instruments}

OpenTelemetryでは、計測は **メトリクス計装** によって行われます。メトリクス計装は以下のように定義されます。 A metric
instrument is defined by:

- 名前
- Kind
- 単位（オプション）
- 説明（オプション）

名前、単位、説明は、開発者が自分で定義するか、リクエストやプロセスメトリクスのような一般的なものについては、[セマンティック規約](/docs/specs/semconv/general/metrics/)を介して定義されます。

The instrument kind is one of the following:

- **Counter（カウンター）**： 時間とともに蓄積される値。これは車のオドメーターのようなものだと考えられます。
- **Asynchronous Counter（非同期カウンター）**： **カウンター** と同じですが、各エクスポートに対して一度だけ収集されます。
  連続したインクリメントにアクセスできず、集約された値のみにアクセスできる場合に使用できます。 Could be used if you don't have access to the continuous
  increments, but only to the aggregated value.
- **UpDownCounter（アップダウンカウンター）**: 時間の経過とともに蓄積されるけれども、減少することもある値。
  たとえば、キューの長さは、キュー内のワークアイテムの数によって増減します。 An example could be a queue length, it will increase and decrease with
  the number of work items in the queue.
- **Asynchronous UpDownCounter（非同期アップダウンカウンター）**: **アップダウンカウンター**と同じですが、各エクスポートに対して一度だけ収集されます。
  連続的な変更にアクセスできず、集約された値（たとえば、現在のキューのサイズ）のみにアクセスできる場合に使用できます。 Could be used if you don't have access to the
  continuous changes, but only to the aggregated value (e.g., current queue
  size).
- **Gauge（ゲージ）**: 読み取った時点での現在の値を測定します。たとえば、自動車の燃料計など。ゲージは同期しています。 An example would
  be the fuel gauge in a vehicle. Gauges are synchronous.
- **Asynchronous Gauge（非同期ゲージ）**: **ゲージ**と同じですが、各エクスポートに対して一度だけ収集されます。
  連続的な変更にアクセスできず、集約された値のみにアクセスできる場合に使用できます。 Could be used if you don't have access to the continuous changes, but
  only to the aggregated value.
- **Histogram**: A client-side aggregation of values, such as request latencies.
  A histogram is a good choice if you are interested in value statistics. For
  example: How many requests take fewer than 1s?

同期と非同期の計装、またどの種類の計装があなたのユースケースにもっとも適しているかについては、[補足ガイドライン](/docs/specs/otel/metrics/supplementary-guidelines/)を参照してください。

## 集約（アグリゲーション） {#aggregation}

In addition to the metric instruments, the concept of **aggregations** is an
important one to understand. An aggregation is a technique whereby a large
number of measurements are combined into either exact or estimated statistics
about metric events that took place during a time window. The OTLP protocol
transports such aggregated metrics. The OpenTelemetry API provides a default
aggregation for each instrument which can be overridden using the Views. The
OpenTelemetry project aims to provide default aggregations that are supported by
visualizers and telemetry backends.

[リクエストトレース](../traces/)が、リクエストのライフサイクルを捕捉し、リクエストの個々の部分にコンテキストを提供することを意図しているのとは異なり、メトリクスは、集約された統計情報を提供することを意図しています。
メトリクスの使用例には、次のようなものがあります。 Some examples of
use cases for metrics include:

- プロトコルの種類ごとに、サービスによって読み取られた総バイト数を報告する。
- 読み込んだ総バイト数とリクエストごとのバイト数を報告する。
- システムコールの継続時間を報告する。
- 傾向を把握するためにリクエストサイズを報告する。
- プロセスのCPUまたはメモリ使用量を報告する。
- 口座の平均残高値を報告する。
- 現在処理中のアクティブなリクエストを報告する。

## ビュー {#views}

ビューは、SDKによって出力されるメトリクスをカスタマイズする柔軟性をSDKのユーザーに提供します。
どのメトリクス計装を処理するか、または無視するかをカスタマイズできます。
また、集約をカスタマイズしたり、メトリクスにどのような属性をレポートするかをカスタマイズすることもできます。 You can customize which metric instruments are to be processed or
ignored. You can also customize aggregation and what attributes you want to
report on metrics.

## 言語サポート {#language-support}

メトリクスはOpenTelemetry仕様の[stable](/docs/specs/otel/versioning-and-stability/#stable)シグナルです。
Metrics APIとSDKの各言語固有の実装については、ステータスは以下の通りです。 For the individual language specific
implementations of the Metrics API & SDK, the status is as follows:

{{% signal-support-table "metrics" %}}

## 仕様 {#specification}

OpenTelemetryのメトリクスの詳細については、[メトリクス仕様](/docs/specs/otel/overview/#metric-signal)を参照してください。
