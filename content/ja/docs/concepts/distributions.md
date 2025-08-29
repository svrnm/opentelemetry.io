---
title: ディストリビューション
description: >-
  フォークと混同されがちですが、ディストリビューションは、OpenTelemetryコンポーネントのカスタマイズバージョンです。
weight: 190
---

OpenTelemetryプロジェクトは、複数の[シグナル](../signals)をサポートする複数の[コンポーネント](../components)から構成されています。
OpenTelemetryの参照実装は以下の通りです。 The reference implementation of
OpenTelemetry is available as:

- [言語固有の計装ライブラリ](../instrumentation)
- [コレクターのバイナリ](/docs/concepts/components/#collector)

どの参照実装も、ディストリビューションとしてカスタマイズできます。

## ディストリビューションとは何か {#what-is-a-distribution}

A distribution is a customized version of an OpenTelemetry component. ディストリビューションとは、OpenTelemetryコンポーネントのカスタマイズバージョンです。
ディストリビューションは、アップストリームのOpenTelemetryリポジトリに、いくつかのカスタマイズを施したラッパーです。
ディストリビューションをフォークと混同しないでください。 Distributions are not to be confused with forks.

Customizations in a distribution may include:

- 特定のバックエンドやベンダーの使用を容易にしたり、カスタマイズしたりするスクリプト
- バックエンド、ベンダー、エンドユーザーに必要なデフォルト設定の変更
- ベンダーまたはエンドユーザー固有の追加パッケージングオプション
- OpenTelemetryが提供する以上のテスト、パフォーマンス、セキュリティカバレッジ
- OpenTelemetryが提供する以上の追加機能
- OpenTelemetryが提供するより少ない機能

ディストリビューションは大まかに以下のカテゴリーに分類されます。

- **"Pure":** These distributions provide the same functionality as upstream and
  are 100% compatible. Customizations typically enhance the ease of use or
  packaging. These customizations may be backend, vendor, or end-user specific.
- **"プラス（Plus）":** これらのディストリビューションは、アップストリームの上に、追加コンポーネントによって追加機能を提供します。
  例としては、OpenTelemetryプロジェクトにアップストリームで提供して計装ライブラリやベンダーのエクスポーターなどがあります。 Examples include instrumentation
  libraries or vendor exporters not upstreamed to the OpenTelemetry project.
- **"Minus":** These distributions provide a subset of functionality from
  upstream. Examples of this include the removal of instrumentation libraries or
  receivers, processors, exporters, or extensions found in the OpenTelemetry
  Collector project. These distributions may be provided to increase
  supportability and security considerations.

## 誰がディストリビューションを作成できますか {#who-can-create-a-distribution}

Anyone can create a distribution. Today, several [vendors](/ecosystem/vendors/)
offer [distributions](/ecosystem/distributions/). In addition, end-users can
consider creating a distribution if they want to use components in the
[Registry](/ecosystem/registry/) that are not upstreamed to the OpenTelemetry
project.

## コントリビューターかディストリビューションか {#contribution-or-distribution}

この先を読み、あなた自身のディストリビューションを作成する方法を学ぶ前に、OpenTelemetryコンポーネントにあなたが追加しようと思うものが、誰にとっても有益で、それゆえ、参照実装に含まれるべきかどうか、検討してみてください。

- 「使いやすさ」のためのスクリプトは一般化できるか
- デフォルト設定への変更は、すべての人にとってより良い選択肢となり得るのか
- 追加のパッケージングのオプションは本当に特別なものか
- テスト、パフォーマンス、セキュリティのカバレッジは、参照実装でもうまくいくか
- あなたの追加機能が標準の一部となり得るかどうか、コミュニティに確認したか

## 独自のディストリビューションを作成する {#creating-your-own-distribution}

### コレクター {#collector}

独自のディストリビューションを作成する方法については、[『独自のOpenTelemetryコレクターディストリビューションの構築』](https://medium.com/p/42337e994b63)のブログ記事を参照してください。

独自のディストリビューションを構築する場合、[OpenTelemetry Collector Builder](https://github.com/open-telemetry/opentelemetry-collector/tree/main/cmd/builder)が良い出発点になるかもしれません。

### 言語固有の計装ライブラリ {#language-specific-instrumentation-libraries}

計装ライブラリをカスタマイズするための言語固有の拡張メカニズムがあります。

- [Javaエージェント](/docs/zero-code/java/agent/extensions)

## ガイドラインを守ろう {#follow-the-guidelines}

ロゴや名称といったOpenTelemetryプロジェクトの付随物を配布物に使用する際は、[OpenTelemetry Marketing Guidelines for Contributing Organizations][guidelines]に沿っていることを確認してください。

OpenTelemetryプロジェクトは現時点ではディストリビューションを認証していません。
将来、OpenTelemetryはKubernetesプロジェクトと同様にディストリビューションやパートナーを認証するかもしれません。
ディストリビューションを評価する際には、そのディストリビューションを使用することがベンダーロックインにならないことを確認してください。 In the
future, OpenTelemetry may certify distributions and partners similarly to the
Kubernetes project. When evaluating a distribution, ensure using the
distribution does not result in vendor lock-in.

> ディストリビューションのサポートは、OpenTelemetryの作者ではなく、ディストリビューションの作者から提供されます。

[guidelines]: https://github.com/open-telemetry/community/blob/main/marketing-guidelines.md
