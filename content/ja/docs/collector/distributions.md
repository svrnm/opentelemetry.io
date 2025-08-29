---
title: ディストリビューション
weight: 25
---

OpenTelemetryプロジェクトは現在、コレクターの事前ビルド済み[ディストリビューション][distributions]を提供しています。
ディストリビューションに含まれるコンポーネントは、それぞれのディストリビューションの`manifest.yaml`で確認できます。 The components included in the distributions can be found by in the
`manifest.yaml` of each distribution.

[distributions]: https://github.com/open-telemetry/opentelemetry-collector-releases/tree/main/distributions

{{% ecosystem/distributions-table filter="first-party-collector" %}}

## カスタムディストリビューション {#custom-distributions}

Existing distributions provided by the OpenTelemetry project may not meet your
needs. For example, you may want a smaller binary or need to implement custom
functionality like
[authenticator extensions](../building/authenticator-extension),
[receivers](../building/receiver), processors, exporters or
[connectors](../building/connector). The tool used to build distributions
[ocb](../custom-collector) (OpenTelemetry Collector Builder) is available to
build your own distributions.

## サードパーティディストリビューション {#third-party-distributions}

Some organizations provide a Collector distribution with additional capabilities
or for improved ease of use. What follows is a list of Collector distributions
maintained by third parties.

{{% ecosystem/distributions-table filter="third-party-collector" %}}

## コレクターディストリビューションの追加 {#how-to-add}

あなたのコレクターディストリビューションをリストに追加するには、[ディストリビューションリスト][distributions list]にエントリを追加した[PRを提出][submit a PR]してください。
エントリには以下を含める必要があります。 The entry should include the following:

- ディストリビューションのメインページへのリンク
- ディストリビューションの使用方法を説明するドキュメントへのリンク
- 質問がある場合に連絡できるよう、連絡先としてのGitHubハンドルまたはメールアドレス

[submit a PR]: /docs/contributing/pull-requests/
[distributions list]: https://github.com/open-telemetry/opentelemetry.io/tree/main/data/ecosystem/distributions.yaml
