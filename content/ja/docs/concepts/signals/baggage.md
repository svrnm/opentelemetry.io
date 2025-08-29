---
title: Baggage
weight: 4
description: シグナル間でやり取りされるコンテキスト情報
---

In OpenTelemetry, Baggage is contextual information that resides next to
context. OpenTelemetryでは、バゲッジ（Baggage）はコンテキストの隣にあるコンテキスト情報です。
バゲッジはキーバリューストアなので、[コンテキスト](../../context-propagation/#context)と一緒に好きなデータを[伝搬](../../context-propagation/#propagation)できます。

バゲッジは、サービスやプロセス間でデータを受け渡し、それらのサービス内の[トレース](../traces/)、[メトリクス](../metrics/)、[ログ](../logs/)に追加できるようにします。

## 例 {#example}

バゲッジは、トレースで、サービス間で追加データを伝搬するためによく使用されます。

たとえば、リクエストの最初に `clientId` があるとします。
しかし、そのIDをトレース内のすべてのスパン、別のサービスのいくつかのメトリクス、そして途中のいくつかのログで利用できるようにしたいとします。
トレースは複数のサービスにまたがる可能性があるため、 `clientId` を多くのサービスにコピーすることなくデータを伝搬する方法が必要です。
`clientId` をコードベースのあちこちにコピーすることなく、そのデータを伝搬する方法が必要です。 Because the trace may span
multiple services, you need some way to propagate that data without copying the
`clientId` across many places in your codebase.

[コンテキスト伝搬](../traces/#context-propagation)を使用して、これらのサービス間でバゲッジを渡すことで、 `clientId` を追加のスパン、メトリクス、またはログに追加できます。
さらに、計装は自動的にバゲッジを伝搬してくれます。 Additionally, instrumentations automatically propagate
baggage for you.

![OTel Baggage](../otel-baggage.svg)

## OTelバゲッジの使い道 {#what-should-otel-baggage-be-used-for}

Baggage is best used to include information typically available only at the
start of a request further downstream. This can include things like Account
Identification, User IDs, Product IDs, and origin IPs, for example.

Propagating this information using baggage allows for deeper analysis of
telemetry in a backend. For example, if you include information like a User ID
on a span that tracks a database call, you can much more easily answer questions
like "which users are experiencing the slowest database calls?" You can also log
information about a downstream operation and include that same User ID in the
log data.

![OTel Baggage](../otel-baggage-2.svg)

## バゲッジのセキュリティに関する懸念事項 {#baggage-security-considerations}

Sensitive Baggage items can be shared with unintended resources, like
third-party APIs. This is because automatic instrumentation includes Baggage in
most of your service’s network requests. Specifically, Baggage and other parts
of trace context are sent in HTTP headers, making it visible to anyone
inspecting your network traffic. If traffic is restricted within your network,
then this risk may not apply, but keep in mind that downstream services could
propagate Baggage outside your network.

また、バゲッジのアイテムがあなたのものであることを確認するための完全性チェックは組み込まれていません。そのため、読み取る際には注意が必要です。

## バゲッジは属性とは異なる {#baggage-is-not-the-same-as-attributes}

An important thing to note about baggage is that it is a separate key-value
store and is unassociated with attributes on spans, metrics, or logs without
explicitly adding them.

To add baggage entries to attributes, you need to explicitly read the data from
baggage and add it as attributes to your spans, metrics, or logs.

バゲッジの一般的な使用例は、トレース全体にわたって[スパン属性](../traces/#attributes)にデータを追加することなので、いくつかの言語には、スパン作成時にバゲッジからデータを属性として追加するバゲッジスパンプロセッサがあります。

> 詳細は[バゲッジ仕様][baggage specification]を参照のこと。

[baggage specification]: /docs/specs/otel/overview/#baggage-signal
