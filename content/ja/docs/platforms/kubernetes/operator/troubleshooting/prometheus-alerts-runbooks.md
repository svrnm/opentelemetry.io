---
title: Prometheusアラートのランブック
---

## マネージャールール {#manager-rules}

### ReconcileErrors {#reconcile-errors}

|            |                                                                                   |
| ---------: | --------------------------------------------------------------------------------- |
|         意味 | OpenTelemetryコレクターの構成が誤っている可能性があり、OpenTelemetryオペレーターがリコンシレーションステップを成功することができません。 |
|         影響 | すでに実行中または新しい正しいDeploymentには影響しません。                                                |
|         診断 | 発生する理由をマネージャーログで確認する。                                                             |
| Mitigation | エラーの原因となっているOpenTelemetryコレクターを特定し、構成を修正する。                                       |

### WorkqueueDepth {#workqueue-depth}

|            |                                                                                                                       |
| ---------: | --------------------------------------------------------------------------------------------------------------------- |
|         意味 | オペレーターのワークキューが0より大きい。                                                                                                 |
|         影響 | キューの深さがすぐに0に戻れば、影響はありません。問題が継続する場合は、さらに調査が必要です。 More investigation is needed if the problem persists. |
|         診断 | 発生する理由をマネージャーログで確認する。                                                                                                 |
| Mitigation | This could be caused by many errors. Act based on what the logs are showing.          |
