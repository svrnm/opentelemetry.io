---
title: コードベース
description: コードベース計装のセットアップに不可欠なステップを学ぶ
weight: 20
aliases: [ manual ]
cSpell:ignore: proxying
---

## OpenTelemetry APIとSDKをインポートする {#import-the-opentelemetry-api-and-sdk}

You'll first need to import OpenTelemetry to your service code. If you're
developing a library or some other component that is intended to be consumed by
a runnable binary, then you would only take a dependency on the API. If your
artifact is a standalone process or service, then you would take a dependency on
the API and the SDK. For more information about the OpenTelemetry API and SDK,
see the [specification](/docs/specs/otel/).

## OpenTelemetry API を設定する {#configure-the-opentelemetry-api}

In order to create traces or metrics, you'll need to first create a tracer
and/or meter provider. In general, we recommend that the SDK should provide a
single default provider for these objects. You'll then get a tracer or meter
instance from that provider, and give it a name and version. The name you choose
here should identify what exactly is being instrumented -- if you're writing a
library, for example, then you should name it after your library (for example
`com.example.myLibrary`) as this name will namespace all spans or metric events
produced. It is also recommended that you supply a version string (i.e.,
`semver:1.0.0`) that corresponds to the current version of your library or
service.

## OpenTelemetry SDK を設定する {#configure-the-opentelemetry-sdk}

サービスプロセスを構築している場合、テレメトリーデータを解析バックエンドにエクスポートするための適切なオプションをSDKに設定する必要もあります。
この設定は、設定ファイルまたはその他のメカニズムを通じてプログラムで処理することを推奨します。
また、場合によっては使いたくなるであろう、言語ごとのチューニングオプションもあります。
We recommend that this configuration be handled programmatically through a
configuration file or some other mechanism. There are also per-language tuning
options you may wish to take advantage of.

## テレメトリーデータの作成 {#create-telemetry-data}

APIとSDKを設定したら、プロバイダーから取得したトレーサーオブジェクトとメーターオブジェクトを通して、トレースとメトリクスイベントを自由に作成できるようになります。
依存関係のために計装ライブラリを利用しましょう。これらの詳細については、[レジストリ](/ecosystem/registry/) やあなたの言語のレポジトリをチェックしてください。 Make use of Instrumentation Libraries for your dependencies -- check
out the [registry](/ecosystem/registry/) or your language's repository for more
information on these.

## データのエクスポート {#export-data}

Once you've created telemetry data, you'll want to send it somewhere.
テレメトリーデータを作成したら、それをどこかに送信したいでしょう。
OpenTelemetryは、プロセスから分析バックエンドにデータをエクスポートする2つの主要な方法をサポートしています。
プロセスから直接エクスポートするか、[OpenTelemetryコレクター](/docs/collector)を通してプロキシする方法です。

プロセス内からのエクスポートでは、1つ以上の _エクスポーター_ をインポートして依存する必要があります。
エクスポーターとは、OpenTelemetry のメモリ内のスパンやメトリクスオブジェクトを、JaegerやPrometheusのようなテレメトリー分析ツールに適したフォーマットに変換するライブラリです。
さらに、OpenTelemetry は `OTLP` として知られるワイヤプロトコルをサポートしていて、これはすべての OpenTelemetry SDK でサポートされています。
このプロトコルは、OpenTelemetryコレクターにデータを送るために使用できます。
OpenTelemetryコレクターはスタンドアローンのバイナリプロセスで、サービスインスタンスのプロキシやサイドカーとして実行したり、別のホストで実行したりできます。
コレクターは、このデータを転送し、好きな分析ツールにエクスポートするように設定できます。 In addition, OpenTelemetry supports a wire protocol known as `OTLP`,
which is supported by all OpenTelemetry SDKs. This protocol can be used to send
data to the OpenTelemetry Collector, a standalone binary process that can be run
as a proxy or sidecar to your service instances or run on a separate host. The
Collector can then be configured to forward and export this data to your choice
of analysis tools.

JaegerやPrometheusのようなオープンソースツールに加えて、OpenTelemetryからのテレメトリーデータの取り込みをサポートする企業のリストが増えています。
詳細は、[ベンダー](/ecosystem/vendors/)のページを参照してください。 For details, see
[Vendors](/ecosystem/vendors/).
