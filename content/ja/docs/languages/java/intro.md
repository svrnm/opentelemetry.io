---
title: OpenTelemetry Java入門
description: OpenTelemetry Javaエコシステム入門
weight: 9
---

OpenTelemetry JavaはJavaエコシステム向けのOpenTelemetryオブザーバビリティツールのセットです。
大まかに言えば、API、SDK、および計装で構成されています。 At a high level, it consists of the API, the SDK, and
instrumentation.

このページでは、概念的な[概要](#overview)、[ドキュメントのナビゲート](#navigating-the-docs)ガイド、リリースとアーティファクトに関する主要な詳細を含む[リポジトリ](#repositories)のリストを使用して、エコシステムを紹介します。

## 概要 {#overview}

The API is a set of classes and interfaces for recording telemetry across key
observability signals. It supports multiple implementations, with a low-overhead
minimalist Noop (i.e. pronounced "no-op") and SDK reference implementation
provided out of the box. It is designed to be taken as a direct dependency by
libraries, frameworks, and application owners looking to add instrumentation. It
comes with strong backwards compatibility guarantees, zero transitive
dependencies, and supports Java 8+.

SDKはAPIの組み込みリファレンス実装であり、計装APIコールによって生成されたテレメトリーを処理およびエクスポートします。
SDKを適切に処理およびエクスポートするように構成することは、OpenTelemetryをアプリケーションに統合するための重要なステップです。
SDKには、自動構成とプログラムを書いて構成するオプションがあります。 Configuring the SDK
to process and export appropriately is an essential step to integrating
OpenTelemetry into an application. The SDK has autoconfiguration and
programmatic configuration options.

Instrumentation records telemetry using the API. There are a variety of
categories of instrumentation, including: zero-code Java agent, zero-code Spring
Boot starter, library, native, manual, and shims.

言語にとらわれない概要については、[OpenTelemetryの概念](/docs/concepts/)を参照してください。

## ドキュメントのナビゲート {#navigating-the-docs}

OpenTelemetry Javaドキュメントは次のように整理されています。

- [Getting Started by Example](../getting-started/)：OpenTelemetry Javaで素早く始めるためのクイックサンプルで、シンプルなWebアプリケーションへのOpenTelemetry Javaエージェントの統合をデモンストレーションします。
- [計装エコシステム](../instrumentation/)：OpenTelemetry Java計装エコシステムへのガイドです。これは、OpenTelemetry Javaをアプリケーションに統合しようとしているアプリケーション作成者にとって重要なリソースです。さまざまなカテゴリの計装について学び、どれが適しているか決定してください。 This is a key resource for application authors
  looking to integrate OpenTelemetry Java into applications. Learn about the
  different categories of instrumentation, and decide which is right for you.
- [APIでテレメトリーを記録](../api/)：動作するコード例を使用して、APIのすべての主要な側面を探るOpenTelemetry APIの技術リファレンスです。ほとんどのユーザーは、最初から最後まで読むかわりに、必要に応じてセクションのインデックスを参照しながら、百科事典のようにこのページを使用します。 Most users will use this page like an encyclopedia, consulting the
  index of sections as needed, rather than reading front to back.
- [SDKでテレメトリーを管理](../sdk/)：動作するコード例を使用して、すべてのSDKプラグイン拡張ポイントとプログラム構成APIを探るOpenTelemetry SDKの技術リファレンスです。ほとんどのユーザーは、最初から最後まで読むかわりに、必要に応じてセクションのインデックスを参照しながら、百科事典のようにこのページを使用します。 Most users will use
  this page like an encyclopedia, consulting the index of sections as needed,
  rather than reading front to back.
- [SDKの設定](../configuration/)：ゼロコード自動構成に焦点を当てたSDKを構成するための技術リファレンスです。SDKを構成するためのすべてのサポートされている環境変数とシステムプロパティのリファレンスが含まれています。動作するコード例を使用して、すべてのプログラムカスタマイゼーションポイントを探ります。ほとんどのユーザーは、最初から最後まで読むかわりに、必要に応じてセクションのインデックスを参照しながら、百科事典のようにこのページを使用します。 Includes a reference of all
  supported environment variables and system properties for configuring the SDK.
  Explores all programmatic customization points with working code examples.
  Most users will use this page like an encyclopedia, consulting the index of
  sections as needed, rather than reading front to back.
- **さらに詳しく**：エンドツーエンドの[例](../examples/)、[Javadoc](../api/)、コンポーネント[レジストリ](../registry/)、および[パフォーマンスリファレンス](/docs/zero-code/java/agent/performance/)を含む補足リソース。

## リポジトリ {#repositories}

OpenTelemetry Javaソースコードはいくつかのリポジトリに整理されています。

| リポジトリ                                                                                                      | 説明                                                    | グループID                             | 現在のバージョン                             | リリース頻度                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [opentelemetry-java](https://github.com/open-telemetry/opentelemetry-java)                                 | コアAPIとSDKコンポーネント                                      | `io.opentelemetry`                 | `{{% param vers.otel %}}`            | [月の第1月曜日の後の金曜日](https://github.com/open-telemetry/opentelemetry-java/blob/main/RELEASING.md#release-cadence)                 |
| [opentelemetry-java-instrumentation](https://github.com/open-telemetry/opentelemetry-java-instrumentation) | OpenTelemetry Javaエージェントを含む、OpenTelemetryによって保守される計装  | `io.opentelemetry.instrumentation` | `{{% param vers.instrumentation %}}` | [月の第2月曜日の後の水曜日](https://github.com/open-telemetry/opentelemetry-java-instrumentation/blob/main/RELEASING.md#release-cadence) |
| [opentelemetry-java-contrib](https://github.com/open-telemetry/opentelemetry-java-contrib)                 | 他のリポジトリの明示的な範囲に適合しないコミュニティによって保守されるコンポーネント            | `io.opentelemetry.contrib`         | `{{% param vers.contrib %}}`         | [月の第2月曜日の後の金曜日](https://github.com/open-telemetry/opentelemetry-java-contrib/blob/main/RELEASING.md#release-cadence)         |
| [semantic-conventions-java](https://github.com/open-telemetry/semantic-conventions-java)                   | セマンティック規約用に生成されたコード                                   | `io.opentelemetry.semconv`         | `{{% param vers.semconv %}}`         | [semantic-conventions](https://github.com/open-telemetry/semantic-conventions)のリリースに従う                                       |
| [opentelemetry-proto-java](https://github.com/open-telemetry/opentelemetry-proto-java)                     | OTLP用に生成されたバインディング                                    | `io.opentelemetry.proto`           | `1.3.2-alpha`                        | [opentelemetry-proto](https://github.com/open-telemetry/opentelemetry-proto)のリリースに従う                                         |
| [opentelemetry-java-examples](https://github.com/open-telemetry/opentelemetry-java-examples)               | API、SDK、および計装を使用したさまざまなパターンをデモンストレーションするエンドツーエンドのコード例 | n/a                                | n/a                                  | n/a                                                                                                                          |

`opentelemetry-java`、`opentelemetry-java-instrumentation`、および`opentelemetry-java-contrib`はそれぞれアーティファクトの大きなカタログを公開しています。
詳細についてはリポジトリを参照するか、管理された依存関係の完全なリストを見るために[Bill of Materials](#dependencies-and-boms)テーブルの「管理された依存関係」列を参照してください。 Please
consult repositories for details, or see the "Managed Dependencies" column in
the [Bill of Materials](#dependencies-and-boms) table to see a full list of
managed dependencies.

As a general rule, artifacts published from the same repository have the same
version. 一般的なルールとして、同じリポジトリから公開されたアーティファクトは同じバージョンを持ちます。
この例外は`opentelemetry-java-contrib`で、共有ツールを活用するために同じリポジトリに共同配置された独立したプロジェクトのグループと考えることができます。
現在、`opentelemetry-java-contrib`のアーティファクトは整列していますが、これは偶然であり、将来変更される予定です。 For now, the artifacts of
`opentelemetry-java-contrib` are aligned but this is a coincidence and will
change in the future.

リポジトリには、高レベルの依存関係構造を反映するリリース頻度があります。

- `opentelemetry-java`はコアであり、毎月最初にリリースされます。
- `opentelemetry-java-instrumentation`は`opentelemetry-java`に依存し、次に公開されます。
- `opentelemetry-java-contrib`は`opentelemetry-java-instrumentation`と`opentelemetry-java`に依存し、最後に公開されます。
- `semantic-conventions-java`は`opentelemetry-java-instrumentation`の依存関係ですが、独立したリリーススケジュールを持つ独立したアーティファクトです。

## 依存関係とBOM {#dependencies-and-boms}

[bill of materials（ソフトウェア部品表）](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#Bill_of_Materials_.28BOM.29_POMs)、または略してBOMは、関連する依存関係のバージョンを整列させるのに役立つアーティファクトです。
OpenTelemetry Javaは、さまざまなユースケースに対応するいくつかのBOMを公開しており、スコープが増加する順序で以下にリストされています。
BOMの使用を強く推奨します。 OpenTelemetry Java publishes several BOMs catering to
different use cases, listed below in order of increasing scope. We highly
recommend using a BOM.

{{% alert %}}
BOMは階層的であるため、複数のBOMへの依存関係を追加することは推奨されません。
冗長であり、直感的でない依存関係バージョンの解決につながる可能性があるためです。
{{% /alert %}} {{% /alert %}}

BOMによって管理されるアーティファクトのリストを見るには、「管理された依存関係」列のリンクをクリックしてください。

| 説明                                                       | リポジトリ                                | グループID                             | アーティファクトID                                | 現在のバージョン                                   | 管理された依存関係                                             |
| -------------------------------------------------------- | ------------------------------------ | ---------------------------------- | ----------------------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| 安定したコアAPIとSDKアーティファクト                                    | `opentelemetry-java`                 | `io.opentelemetry`                 | `opentelemetry-bom`                       | `{{% param vers.otel %}}`                  | [最新のpom.xml][opentelemetry-bom]                       |
| `opentelemetry-bom`のすべてを含む実験的なコアAPIとSDKアーティファクト          | `opentelemetry-java`                 | `io.opentelemetry`                 | `opentelemetry-bom-alpha`                 | `{{% param vers.otel %}}-alpha`            | [最新のpom.xml][opentelemetry-bom-alpha]                 |
| `opentelemetry-bom`のすべてを含む安定した計装アーティファクト                 | `opentelemetry-java-instrumentation` | `io.opentelemetry.instrumentation` | `opentelemetry-instrumentation-bom`       | `{{% param vers.instrumentation %}}`       | [最新のpom.xml][opentelemetry-instrumentation-bom]       |
| `opentelemetry-instrumentation-bom`のすべてを含む実験的な計装アーティファクト | `opentelemetry-java-instrumentation` | `io.opentelemetry.instrumentation` | `opentelemetry-instrumentation-bom-alpha` | `{{% param vers.instrumentation %}}-alpha` | [最新のpom.xml][opentelemetry-instrumentation-alpha-bom] |

次のコードスニペットは、BOM依存関係を追加する方法を示しています。
`{{bomGroupId}}`、`{{bomArtifactId}}`、および`{{bomVersion}}`は、それぞれテーブルの「グループID」、「アーティファクトID」、および「現在のバージョン」列を参照しています。

{{< tabpane text=true >}} {{% tab "Gradle" %}}

```kotlin
dependencies {
  implementation(platform("{{bomGroupId}}:{{bomArtifactId}}:{{bomVersion}}"))
  // BOMによってバージョンが管理されているアーティファクトへの依存関係を追加
  implementation("io.opentelemetry:opentelemetry-api")
}
```

{{% /tab %}} {{% tab Maven %}}

```xml
<project>
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>{{bomGroupId}}</groupId>
        <artifactId>{{bomArtifactId}}</artifactId>
        <version>{{bomVersion}}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <!-- BOMによってバージョンが管理されているアーティファクトへの依存関係を追加 -->
  <dependencies>
    <dependency>
      <groupId>io.opentelemetry</groupId>
      <artifactId>opentelemetry-api</artifactId>
    </dependency>
  </dependencies>
</project>
```

{{% /tab %}} {{< /tabpane >}}

[opentelemetry-bom]: <https://repo1.maven.org/maven2/io/opentelemetry/opentelemetry-bom/{{% param vers.otel %}}/opentelemetry-bom-{{% param vers.otel %}}.pom>
[opentelemetry-bom-alpha]: <https://repo1.maven.org/maven2/io/opentelemetry/opentelemetry-bom-alpha/{{% param vers.otel %}}-alpha/opentelemetry-bom-alpha-{{% param vers.otel %}}-alpha.pom>
[opentelemetry-instrumentation-bom]: <https://repo1.maven.org/maven2/io/opentelemetry/instrumentation/opentelemetry-instrumentation-bom/{{% param vers.instrumentation %}}/opentelemetry-instrumentation-bom-{{% param vers.instrumentation %}}.pom>
[opentelemetry-instrumentation-alpha-bom]: <https://repo1.maven.org/maven2/io/opentelemetry/instrumentation/opentelemetry-instrumentation-bom-alpha/{{% param vers.instrumentation %}}-alpha/opentelemetry-instrumentation-bom-alpha-{{% param vers.instrumentation %}}-alpha.pom>
