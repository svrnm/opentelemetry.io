---
title: コンテキスト伝搬
weight: 10
description: 分散トレーシングを可能にする概念について学ぶ
---

With context propagation, [signals](../signals/) can be correlated with each
other, regardless of where they are generated. Although not limited to tracing,
context propagation allows [traces](../signals/traces/) to build causal
information about a system across services that are arbitrarily distributed
across process and network boundaries.

コンテキストの伝搬を理解するには、コンテキストと伝搬（プロパゲーション）という、2つの別々の概念を理解する必要があります。

## コンテキスト {#context}

コンテキストは、送受信サービスまたは[実行ユニット](/docs/specs/otel/glossary/#execution-unit)が、あるシグナルと別のシグナルを関連付けるための情報を含むオブジェクトです。

When Service A calls Service B, it includes a trace ID and a span ID as part of
the context. Service B uses these values to create a new span that belongs to
the same trace, setting the span from Service A as its parent. This makes it
possible to track the full flow of a request across service boundaries.

## Propagation

Propagation is the mechanism that moves context between services and processes.
伝搬は、サービスとプロセス間でコンテキストを移動させる仕組みです。
コンテキストオブジェクトをシリアライズまたはデシリアライズし、あるサービスから別のサービスに伝搬される関連情報を提供します。

Propagation is usually handled by instrumentation libraries and is transparent
to the user. 伝搬は通常、計装ライブラリによって処理され、ユーザーには透過的です。
手動でコンテキストを伝搬する必要がある場合は、[伝搬API](/docs/specs/otel/context/api-propagators/)を使用できます。

OpenTelemetry maintains several official propagators. OpenTelemetryはいくつかの公式プロパゲーターを保守しています。
デフォルトのプロパゲーターは[W3C TraceContext](https://www.w3.org/TR/trace-context/)仕様で指定されたヘッダーを使用しています。

## 仕様

コンテキスト伝搬の詳細については、[コンテキストの仕様](/docs/specs/otel/context/)を参照してください。
