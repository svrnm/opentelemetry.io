---
title: ログ
description: イベントの記録
weight: 3
cSpell:ignore: filelogreceiver semistructured transformprocessor
---

**ログ**は、構造化（推奨）または非構造化された、任意のメタデータを含む、タイムスタンプ付きのテキストレコードです。
すべてのテレメトリーシグナルの中で、ログは最も大きな遺産を持っています。
ほとんどのプログラミング言語には、組み込みのログ機能があるか、もしくはよく知られ、広く使われているログライブラリがあります。 Of all telemetry signals, logs have the
biggest legacy. Most programming languages have built-in logging capabilities or
well-known, widely used logging libraries.

## OpenTelemetry のログ {#opentelemetry-logs}

OpenTelemetry はログを作成するための独自の API や SDK を定義しません。
かわりに、OpenTelemetry のログは、ログフレームワークやインフラコンポーネントから得られるログを指します。
OpenTelemetry SDK と自動計装は、複数のコンポーネントを活用しログを[トレース](../traces)と関連付けます。 Instead,
OpenTelemetry logs are the existing logs you already have from a logging
framework or infrastructure component. OpenTelemetry SDKs and
autoinstrumentation utilize several components to automatically correlate logs
with [traces](../traces).

OpenTelemetry のログサポートは、既存のログと完全に互換性を持つように設計されており、追加のコンテキストを付与したり、さまざまなソースからのログを共通のフォーマットに解析・変換するための統一ツールキットを提供します。

### OpenTelemetry コレクターの OpenTelemetry のログ {#opentelemetry-logs-in-the-opentelemetry-collector}

[OpenTelemetry コレクター](/docs/collector/) はログを作業するための複数のツールを提供します。

- 既知の特定のログデータソースを解析する複数のレシーバー
- 任意のファイルからログを読み取り、異なるフォーマットの解析や正規表現の解析が可能な `filelogreceiver`
- ネストされたデータの解析、構造のフラット化、値の追加/削除/更新などを実行できる `transformprocessor` などのプロセッサー
- OpenTelemetry のフォーマットでログデータを送信できるエクスポーター

OpenTelemetry を採用する最初のステップとして、汎用的なログエージェントとしてコレクターをデプロイがよく含まれます。

### アプリケーションの OpenTelemetry {#opentelemetry-logs-for-applications}

アプリケーションにおいて、OpenTelemetry のログは任意のログライブラリやビルトインのログ機能を仕様して作成されます。
自動計装を追加したりSDKを活用したりすると、OpenTelemetry は既存のログをアクティブなトレースやスパンと自動的に関連付け、それらの ID をログの本体に含めます。
つまり、OpenTelemetry はログとトレースを自動的に関連付けます。 When you add autoinstrumentation or activate an
SDK, OpenTelemetry will automatically correlate your existing logs with any
active trace and span, wrapping the log body with their IDs. In other words,
OpenTelemetry automatically correlates your logs and traces.

### 言語サポート {#language-support}

Logs are a [stable](/docs/specs/otel/versioning-and-stability/#stable) signal in
the OpenTelemetry specification. For the individual language specific
implementations of the Logs API & SDK, the status is as follows:

{{% signal-support-table "logs" %}}

## 構造化、非構造化、半構造化ログ {#structured-unstructured-and-semistructured-logs}

OpenTelemetry は構造化ログと非構造化ログを技術的に区別していません。
OpenTelemetry では既存のどのようなログも利用できます。
しかし、すべてのログフォーマットは等しく有用ではありません！
特に、構造化ログは大規模な解析や分析がしやすいため、本番環境のオブザーバビリティに推奨されます。
後述するセクションは構造化、非構造化、半構造化ログの違いを説明します。 You can use any log you have with OpenTelemetry. However, not
all log formats are equally useful! Structured logs, in particular, are
recommended for production observability because they are easy to parse and
analyze at scale. The following section explains the differences between
structured, unstructured, and semistructured logs.

### 構造化ログ {#structured-logs}

構造化ログは、一貫性のある機械が読みやすいフォーマットに従ったテキスト形式のログです。
アプリケーションにおいて、最も一般的なフォーマットの 1 つは JSON です。 For applications, one of the most common formats is
JSON:

```json
{
  "timestamp": "2024-08-04T12:34:56.789Z",
  "level": "INFO",
  "service": "user-authentication",
  "environment": "production",
  "message": "User login successful",
  "context": {
    "userId": "12345",
    "username": "johndoe",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
  },
  "transactionId": "abcd-efgh-ijkl-mnop",
  "duration": 200,
  "request": {
    "method": "POST",
    "url": "/api/v1/login",
    "headers": {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    "body": {
      "username": "johndoe",
      "password": "******"
    }
  },
  "response": {
    "statusCode": 200,
    "body": {
      "success": true,
      "token": "jwt-token-here"
    }
  }
}
```

そして、インフラストラクチャーのコンポーネントには、Common Log Format（CLF） が一般的に利用されます。

```text
127.0.0.1 - johndoe [04/Aug/2024:12:34:56 -0400] "POST /api/v1/login HTTP/1.1" 200 1234
```

It is also common to have different structured log formats mixed together. 異なる構造化ログのフォーマットが混在することも一般的です。
たとえば、Extended Log Format （ELF） は JSON と 共に CLF ログの空白区切りのデータが混在することがあります。

```text
192.168.1.1 - johndoe [04/Aug/2024:12:34:56 -0400] "POST /api/v1/login HTTP/1.1" 200 1234 "http://example.com" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36" {"transactionId": "abcd-efgh-ijkl-mnop", "responseTime": 150, "requestBody": {"username": "johndoe"}, "responseHeaders": {"Content-Type": "application/json"}}
```

このログを最大限に活用するには、オブザーバビリティバックエンドの分析を簡単にするために、JSON と ELF に関連する部分の両方を共通したフォーマットに解析します。
[OpenTelemetry コレクター](/docs/collector)の `filelogreceiver` はこのようにログを分析する標準化された方法が含まれています。 The
`filelogreceiver` in the [OpenTelemetry Collector](/docs/collector) contains
standardized ways to parse logs like this.

Structured logs are the preferred way to use logs. 構造化ログはログの利用において推奨される方法です。
構造化ログは一貫したフォーマットで出力されるため、解析が率直であり、OpenTelemetry コレクターでの前処理や他のデータとの関連付けがしやすく、そして最終的に Observability バックエンドでの解析が容易になります。

### 非構造化ログ {#unstructured-logs}

非構造化ログは一貫した構造に従わないログです。
人が読みやすい場合が多く、開発において頻繁に利用されます。
しかし、大規模な分析と解析が非常に困難なため、本番環境のオブザーバビリティの目的に対して、非構造化ログの使用は推奨されません。 They may be
more human-readable, and are often used in development. However, it is not
preferred to use unstructured logs for production observability purposes, since
they are much more difficult to parse and analyze at scale.

以下は非構造化ログの例です。

```text
[ERROR] 2024-08-04 12:45:23 - Failed to connect to database. Exception: java.sql.SQLException: Timeout expired. Attempted reconnect 3 times. Server: db.example.com, Port: 5432

System reboot initiated at 2024-08-04 03:00:00 by user: admin. Reason: Scheduled maintenance. Services stopped: web-server, database, cache. Estimated downtime: 15 minutes.

DEBUG - 2024-08-04 09:30:15 - User johndoe performed action: file_upload. Filename: report_Q3_2024.pdf, Size: 2.3 MB, Duration: 5.2 seconds. Result: Success
```

It is possible to store and analyze Unstructured logs in production, although
you may need to do substantial work to parse or otherwise pre-process them to be
machine-readable. For example, the above three logs will require a regular
expression to parse their timestamps and custom parsers to consistently extract
the bodies of the log message. This will typically be necessary for a logging
backend to know how to sort and organize the logs by timestamp. Although it's
possible to parse unstructured logs for analysis purposes, doing this may be
more work than switching to structured logging, such as via a standard logging
framework in your applications.

### 半構造化ログ {#semistructured-logs}

半構造化ログとは、データを識別するために一定の一貫したパターンを使用し、機械が読みやすくしているものの、異なるシステム間でデータのフォーマットや区切り文字が統一されていないログのことを指します。

以下は、準構造かログの例です。

```text
2024-08-04T12:45:23Z level=ERROR service=user-authentication userId=12345 action=login message="Failed login attempt" error="Invalid password" ipAddress=192.168.1.1 userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
```

機会が読みやすいですが、半構造化ログは大規模に分析を可能にするには、複数の異なるパーサーを必要になる場合があります。

## OpenTelemetry ログコンポーネント {#opentelemetry-logging-components}

以下の概念とコンポーネントのリストは、OpenTelemetry のロギングサポートを支えています。

### ログアペンダー（Log Appender）／ブリッジ（Bridge） {#log-appender--bridge}

アプリケーション開発者としては、**Log Bridge API** はログアペンダー/ブリッジを構築するためのロギングライブラリ作者のために提供されているので、直接呼び出すべきではありません。
かわりに、好みのロギングライブラリを使い、OpenTelemetryのログレコードエクスポーターにログを出力できるログアペンダー（またはログブリッジ）を使うように設定するだけです。 Instead, you just use your preferred logging library and configure it
to use a log appender (or log bridge) that is able to emit logs into an
OpenTelemetry LogRecordExporter.

OpenTelemetry言語SDKはこの機能を提供します。

### ロガープロバイダー {#logger-provider}

> **Logs Bridge API**の一部であり、ロギングライブラリの作者である場合にのみ使用すべきです。

A Logger Provider (sometimes called `LoggerProvider`) is a factory for
`Logger`s. In most cases, the Logger Provider is initialized once and its
lifecycle matches the application's lifecycle. Logger Provider initialization
also includes Resource and Exporter initialization.

### ロガー {#logger}

> **Logs Bridge API**の一部であり、ロギングライブラリの作者である場合にのみ使用すべきです。

ロガーはログレコードを作成します。ロガーはログプロバイダーから作成されます。 Loggers are created from Log Providers.

### ログレコードエクスポーター {#log-record-exporter}

Log Record Exporters send log records to a consumer. This consumer can be
standard output for debugging and development-time, the OpenTelemetry Collector,
or any open source or vendor backend of your choice.

### ログレコード {#log-record}

A log record represents the recording of an event. ログレコードはイベントの記録を表します。
OpenTelemetryでは、ログレコードには2種類のフィールドがあります。

- 特定の型と意味を持つ名前付きトップレベルフィールド
- 任意の値と型のリソースと属性フィールド

トップレベルのフィールドは以下の通りです。

| フィールド名               | 説明                                                        |
| -------------------- | --------------------------------------------------------- |
| Timestamp            | イベントが発生した時刻                                               |
| ObservedTimestamp    | イベントが観測された時刻                                              |
| TraceId              | リクエストトレースID                                               |
| SpanId               | リクエストスパンID                                                |
| TraceFlags           | W3Cトレースフラグ                                                |
| SeverityText         | 重要度テキスト（ログレベルとも呼ばれる）                                      |
| SeverityNumber       | 重要度の数値                                                    |
| Body                 | ログレコードの本文                                                 |
| Resource             | ログのソース                                                    |
| InstrumentationScope | Describes the scope that emitted the log. |
| Attributes           | イベントに関する追加情報                                              |

ログレコードとログフィールドの詳細については、[ログデータモデル](/docs/specs/otel/logs/data-model/) を参照してください。

### 仕様 {#specification}

OpenTelemetryのログについての詳細は、[ログ仕様][logs specification] を参照してください。

[logs specification]: /docs/specs/otel/overview/#log-signal
