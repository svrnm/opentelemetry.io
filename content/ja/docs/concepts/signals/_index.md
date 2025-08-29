---
title: シグナル
description: OpenTelemetryがサポートするテレメトリーのカテゴリについて学ぶ
aliases: [ data-sources, otel-concepts ]
weight: 11
---

OpenTelemetryの目的は、**[シグナル][signals]** を収集、処理、エクスポートすることです。
シグナルは、オペレーティングシステムやプラットフォーム上で動作しているアプリケーションの基本的な活動を記述するシステム出力です。
シグナルは、温度やメモリ使用量のような特定の時点で測定したいもの、またはあなたが追跡したい分散システムのコンポーネントを通過するイベントです。
異なるシグナルをグループ化して、同じテクノロジーの内部動作を異なる角度から観察することもできる。
Signals are system outputs that describe the underlying activity of the
operating system and applications running on a platform. A signal can be
something you want to measure at a specific point in time, like temperature or
memory usage, or an event that goes through the components of your distributed
system that you'd like to trace. You can group different signals together to
observe the inner workings of the same piece of technology under different
angles.

OpenTelemetry は現在、下記をサポートしています。

- [トレース](traces)
- [メトリクス](metrics)
- [ログ](logs)
- [バゲッジ](baggage)

同様に、下記は開発中または[提案][proposal]の段階です。

- [イベント][Events]は、特定の[ログ](logs)のタイプです。
- [プロファイル][Profiles] は、Profiling Working Group によって現在策定中です。

[Events]: /docs/specs/otel/logs/data-model/#events
[Profiles]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/oteps/profiles/0212-profiling-vision.md
[proposal]: https://github.com/open-telemetry/opentelemetry-specification/tree/main/oteps/#readme
[signals]: /docs/specs/otel/glossary/#signals
