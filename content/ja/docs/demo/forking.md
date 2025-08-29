---
title: デモリポジトリをフォークする
linkTitle: フォーク
---

[demo repository][]は、OpenTelemetryを使用した実装例を紹介するためのツールとして、フォークして使用できるように設計されています。

フォークやデモの環境構築は、通常いくつかの環境変数の上書きと、場合によってはコンテナイメージの置き換えのみで済みます。

実際のデモは[README](https://github.com/open-telemetry/opentelemetry-demo/blob/main/README.md?plain=1)に追加することができます。

## フォークメンテナーへの提案 {#suggestions-for-fork-maintainers}

- デモによって発信または収集されるテレメトリーデータを強化したい場合は、変更内容をこのリポジトリにバックポートすることを強く推奨します。
  ベンダーや実装固有の変更については、コードの根本的な変更よりも、設定によってパイプライン内でテレメトリーを変更する方針が望ましいです。
  For vendor or implementation specific changes, a strategy of modifying
  telemetry in the pipeline via config is preferable to underlying code changes.
- Extend rather than replace. 置き換えるのではなく、拡張してください。
  既存のAPIと連携する全く新しいサービスを追加することは、テレメトリーの変更では実現できないベンダー固有またはツール固有の機能を追加する優れた方法です。
- 拡張性をサポートするため、キュー、データベース、キャッシュなどのリソースにはリポジトリパターンまたはファサードパターンを使用してください。
  そうすることで、異なるプラットフォームに対してこれらのサービスの異なる実装を組み込むことができます。 This will allow for different
  implementations of these services to be shimmed in for different platforms.
- ベンダーやツール固有の拡張機能をこのリポジトリにバックポートしないでください。

If you have any questions or would like to suggest ways that we can make your
life easier as a fork maintainer, please open an issue.

[demo repository]: <{{% param repo %}}>
