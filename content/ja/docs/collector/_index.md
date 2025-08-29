---
title: コレクター
description: テレメトリーデータを受信、処理、エクスポートするためのベンダー非依存な方法
aliases: [ ./about ]
cascade:
  vers: 0.132.0
weight: 270
---

![Jaeger、OTLP、Prometheusを統合したOpenTelemetryコレクターのダイアグラム](img/otel-collector.svg)

## はじめに {#introduction}

OpenTelemetryコレクターは、テレメトリーデータの受信、処理、エクスポート方法について、ベンダーにとらわれない実装を提供します。
複数のエージェント／コレクターの実行、操作、メンテナンスの必要性を取り除きます。
これはスケーラビリティを向上させ、1つ以上のオープンソースまたは商用バックエンドに送信するオープンソースのオブザーバビリティデータフォーマット（Jaeger、Prometheus、Fluent Bitなど）をサポートします。 It removes the need to run, operate,
and maintain multiple agents/collectors. This works with improved scalability
and supports open source observability data formats (e.g. Jaeger, Prometheus,
Fluent Bit, etc.) sending to one or more open source or commercial backends.

## 目的 {#objectives}

- _利便性_: 合理的なデフォルト設定、一般的なプロトコルのサポート、ダウンロードしてすぐの実行と収集が可能
- _パフォーマンス_: さまざまな負荷や構成の下でも高い安定性とパフォーマンスを発揮
- _オブザーバビリティ_: オブザーバビリティがあるサービスの模範例
- _拡張性_: コアコードに触れることなくカスタマイズ可能
- _統一性_: 単一のコードベース、エージェントまたはコレクターとしてデプロイ可能、トレース、メトリクス、ログをサポート

## コレクターを使う場面 {#when-to-use-a-collector}

ほとんどの言語固有の計装ライブラリには、一般的なバックエンドやOTLP用のエクスポーターがあります。
ですので、あなたは次のように不思議に思うかもしれません。 You might wonder,

> 各サービスがバックエンドに直接データを送信するのではなく、どのような状況でコレクターを使ってデータを送信するのだろう

OpenTelemetryを試したり始めたりするには、バックエンドに直接データを送ることは、素早く価値を得るための素晴らしい方法です。
また、開発環境や小規模な環境では、コレクターなしでも十分な結果を得られます。 Also, in a
development or small-scale environment you can get decent results without a
collector.

しかし、一般的には、サービスとともにコレクターを使用することをおすすめします。理由は、サービスが素早くコレクターにデータをオフロードして、コレクターが再試行、バッチ処理、暗号化、機密データのフィルタリングなどの追加処理を行えるからです。

[コレクターのセットアップ](quick-start)も、思っているより簡単です。
各言語のデフォルトのOTLPエクスポーターは、ローカルコレクターのエンドポイントを想定しているので、コレクターを起動すると、自動的にテレメトリーの受信を開始します。

## コレクターのセキュリティ {#collector-security}

ベストプラクティスに従い、コレクターが安全に[ホスト][hosted]と[設定][configured]されていることを確認してください。

## ステータス {#status}

**コレクター**のステータスは、コレクターのコアコンポーネントが現在、[安定性レベル][stability levels]がまちまちであるため、 [混合状態（mixed）][mixed] となっています。

**Collector components** differ in their maturity levels. Each component has its
stability documented in its `README.md`. You can find a list of all available
Collector components in the [registry][].

Support is guaranteed for Collector software artifacts for a certain time period
based on the artifact's intended audience. This support includes, at minimum,
fixes for critical bugs and security issues. See the
[support policies](https://github.com/open-telemetry/opentelemetry-collector/blob/main/VERSIONING.md)
for more details.

## ディストリビューションとリリース {#releases}

[最新のリリース][latest release] を含むコレクターの配布とリリースについての情報は、[ディストリビューション](distributions/) を確認してください。

[configured]: /docs/security/config-best-practices/
[hosted]: /docs/security/hosting-best-practices/
[latest release]: https://github.com/open-telemetry/opentelemetry-collector-releases/releases/latest
[mixed]: /docs/specs/otel/document-status/#mixed
[registry]: /ecosystem/registry/?language=collector
[stability levels]: https://github.com/open-telemetry/opentelemetry-collector#stability-levels
