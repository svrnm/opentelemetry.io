---
title: 管理
description: OpenTelemetry Collectorのデプロイメントを大規模に管理する方法
weight: 23
cSpell:ignore: hostmetrics opampsupervisor
---

このドキュメントでは、OpenTelemetry コレクターのデプロイを大規模に管理する方法について説明します。

このページを最大限に活用するには、コレクターのインストールと設定方法を知っている必要があります。
これらのトピックは、別の場所でカバーされています。 These topics are covered elsewhere:

- [クイックスタート](/docs/collector/quick-start/) は OpenTelemetry コレクターのインストール方法を説明します。
- [設定][Configuration] では、OpenTelemetry コレクターの設定方法、テレメトリーパイプラインの設定方法を説明します。

## 基礎 {#basics}

大規模なテレメトリー収集には、エージェントを管理するための構造的なアプローチが必要です。
典型的なエージェント管理タスクは以下の通りです。
Typical agent management tasks include:

1. Querying the agent information and configuration. The agent information can
   include its version, operating system related information, or capabilities.
   The configuration of the agent refers to its telemetry collection setup, for
   example, the OpenTelemetry Collector [configuration].
2. エージェントのアップグレードやダウングレードと、基本的なエージェント機能とプラグインを含むエージェント固有のパッケージの管理。
3. Applying new configurations to agents. This might be required because of
   changes in the environment or due to policy changes.
4. エージェントのヘルスとパフォーマンスの監視。通常、CPU とメモリの使用量、またエージェント固有のメトリクス（たとえば、処理速度やバックプレッシャー関連情報）。
5. TLS証明書の処理（失効とローテーション）のような、コントロールプレーンとエージェント間の接続管理。

すべてのユースケースが、上記のエージェント管理タスクのすべてのサポートを必要とするわけではありません。
OpenTelemetryのコンテキストでは、タスク _4.ヘルスとパフォーマンスの監視_ は、OpenTelemetryを使うのが理想的です。
In the context of OpenTelemetry task _4. Health and performance monitoring_ is
ideally done using OpenTelemetry.

## OpAMP

Observability vendors and cloud providers offer proprietary solutions for agent
management. In the open source observability space, there is an emerging
standard that you can use for agent management: [Open Agent Management Protocol]
(OpAMP).

[OpAMPの仕様][OpAMP specification]では、テレメトリーデータエージェントのフリート管理方法を定義しています。
これらのエージェントは、[OpenTelemetry コレクター](/docs/collector/)、Fluent Bit、または他のエージェントを任意の組み合わせで使用できます。 These agents can be [OpenTelemetry Collectors](/docs/collector/), Fluent
Bit or other agents in any arbitrary combination.

> **注意** 「エージェント」という用語は、ここではOpAMPに応答するOpenTelemetryコンポーネントの総称として使われています。
> つまりコレクターはもちろん、SDKコンポーネントでもありえます。

OpAMPは、HTTPとWebSocketでの通信をサポートするクライアント/サーバープロトコルです。

- **OpAMPサーバ**はコントロールプレーンの一部であり、オーケストレータとして機能し、テレメトリーエージェントのフリートを管理します。
- The **OpAMP client** is part of the data plane. The client side of OpAMP can
  be implemented in-process, for example, as the case in [OpAMP support in the
  OpenTelemetry Collector][opamp-in-otel-collector]. The client side of OpAMP
  could alternatively be implemented out-of-process. For this latter option, you
  can use a supervisor that takes care of the OpAMP specific communication with
  the OpAMP server and at the same time controls the telemetry agent, for
  example to apply a configuration or to upgrade it. Note that the
  supervisor/telemetry communication is not part of OpAMP.

Let's have a look at a concrete setup:

![OpAMPのセットアップ例](../img/opamp.svg)

1. OpenTelemetry コレクターが、次のようなパイプラインで構成されているとする
   - (A) ダウンストリームのソースからシグナルを受信する
   - (B) シグナルをアップストリームの宛先にエクスポートする。ここではコレクター自体のテレメトリーを含む可能性がある。（OpAMP `own_xxx` 接続設定で表されます）。
2. サーバ側のOpAMPパートを実装するコントロールプレーンと、クライアント側のOpAMPを実装するコレクター（またはコレクターを制御するスーパーバイザー）の間の双方向のOpAMP制御フロー。

### Try it out

[GoによるOpAMPプロトコル実装][opamp-go]を使えば、簡単なOpAMPセットアップを自分で試すことができます。
以下のチュートリアルでは、Go 1.22以上が必要です。 For the following walkthrough you will need Go
1.22+.

OpAMPサーバの例で構成されるシンプルなOpAMPコントロールプレーンをセットアップし、OpenTelemetryコレクターを[OpAMPスーパーバイザー][opamp-supervisor]を使って接続させます。

#### ステップ1 - OpAMPサーバーの起動 {#step-1---start-the-opamp-server}

`open-telemetry/opamp-go` リポジトリをクローンします。

```sh
git clone https://github.com/open-telemetry/opamp-go.git
```

`./opamp-go/internal/examples/server` ディレクトリで、OpAMPサーバーを起動します。

```console
$ go run .
2025/04/20 15:10:35.307207 [MAIN] OpAMP Server starting...
2025/04/20 15:10:35.308201 [MAIN] OpAMP Server running...
```

#### ステップ 2 - OpenTelemetry コレクターのインストール {#step-2---install-the-opentelemetry-collector}

OpAMPスーパーバイザーが管理できるOpenTelemetryコレクターのバイナリが必要です。
そのために、[OpenTelemetry Collector Contrib][otelcolcontrib]ディストーションをインストールします。
コレクターバイナリをインストールしたパスは、以下の設定では `$OTEL_COLLECTOR_BINARY` として参照されます。
For that, install the [OpenTelemetry Collector Contrib][otelcolcontrib] distro.
The path where you installed the Collector binary is referred to as
`$OTEL_COLLECTOR_BINARY` in the following configuration.

#### ステップ3 - OpAMPスーパーバイザーのインストール {#step-3---install-the-opamp-supervisor}

`opampsupervisor` バイナリは、OpenTelemetry コレクター [`cmd/opampsupervisor` タグが付いたリリース][tags]からダウンロード可能なアセットとして入手できます。
OSとチップセットに基づいて命名されたアセットのリストがありますので、あなたの構成に合うものをダウンロードしてください。 You
will find a list of assets named based on OS and chipset, so download the one
that fits your configuration:

{{< tabpane text=true >}}

{{% tab "Linux (AMD 64)" %}}

```sh
curl --proto '=https' --tlsv1.2 -fL -o opampsupervisor \
"https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fopampsupervisor%2F{{% version-from-registry collector-cmd-opampsupervisor %}}/opampsupervisor_{{% version-from-registry collector-cmd-opampsupervisor noPrefix %}}_linux_amd64"
chmod +x opampsupervisor
```

{{% /tab %}} {{% tab "Linux (ARM 64)" %}}

```sh
curl --proto '=https' --tlsv1.2 -fL -o opampsupervisor \
"https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fopampsupervisor%2F{{% version-from-registry collector-cmd-opampsupervisor %}}/opampsupervisor_{{% version-from-registry collector-cmd-opampsupervisor noPrefix %}}_linux_arm64"
chmod +x opampsupervisor
```

{{% /tab %}} {{% tab "Linux (ppc64le) "%}}

```sh
curl --proto '=https' --tlsv1.2 -fL -o opampsupervisor \
"https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fopampsupervisor%2F{{% version-from-registry collector-cmd-opampsupervisor %}}/opampsupervisor_{{% version-from-registry collector-cmd-opampsupervisor noPrefix %}}_linux_ppc64le"
chmod +x opampsupervisor
```

{{% /tab %}} {{% tab "macOS (AMD 64)" %}}

```sh
curl --proto '=https' --tlsv1.2 -fL -o opampsupervisor \
"https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fopampsupervisor%2F{{% version-from-registry collector-cmd-opampsupervisor %}}/opampsupervisor_{{% version-from-registry collector-cmd-opampsupervisor noPrefix %}}_darwin_amd64"
chmod +x opampsupervisor
```

{{% /tab %}} {{% tab "macOS (ARM 64)" %}}

```sh
curl --proto '=https' --tlsv1.2 -fL -o opampsupervisor \
"https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fopampsupervisor%2F{{% version-from-registry collector-cmd-opampsupervisor %}}/opampsupervisor_{{% version-from-registry collector-cmd-opampsupervisor noPrefix %}}_darwin_arm64"
chmod +x opampsupervisor
```

{{% /tab %}} {{% tab "Windows (AMD 64)" %}}

```sh
Invoke-WebRequest -Uri "https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/cmd%2Fopampsupervisor%2F{{% version-from-registry collector-cmd-opampsupervisor %}}/opampsupervisor_{{% version-from-registry collector-cmd-opampsupervisor noPrefix %}}_windows_amd64.exe" -OutFile "opampsupervisor.exe"
Unblock-File -Path "opampsupervisor.exe"
```

{{% /tab %}} {{< /tabpane >}}

#### ステップ4 - OpAMPスーパーバイザーの設定ファイルの作成 {#step-4---create-an-opamp-supervisor-configuration-file}

以下の内容で `supervisor.yaml` という名前のファイルを作成します。

```yaml
server:
  endpoint: wss://127.0.0.1:4320/v1/opamp
  tls:
    insecure_skip_verify: true

capabilities:
  accepts_remote_config: true
  reports_effective_config: true
  reports_own_metrics: false
  reports_own_logs: true
  reports_own_traces: false
  reports_health: true
  reports_remote_config: true

agent:
  executable: $OTEL_COLLECTOR_BINARY

storage:
  directory: ./storage
```

{{% alert color="primary" title="NOTE" %}}

Make sure to replace `$OTEL_COLLECTOR_BINARY` with the actual file path. `$OTEL_COLLECTOR_BINARY` を実際のファイルパスに置き換えてください。
たとえば、LinuxまたはmacOSでは、コレクターを `/usr/local/bin/` にインストールした場合、 `$OTEL_COLLECTOR_BINARY` を `/usr/local/bin/otelcol` に置き換えます。

{{% /alert %}}

#### ステップ5 - OpAMPスーパーバイザーの実行 {#step-5---run-the-opamp-supervisor}

さて、いよいよスーパーバイザーを起動し、OpenTelemetry コレクターを起動します。

```console
$ ./opampsupervisor --config=./supervisor.yaml
{"level":"info","ts":1745154644.746028,"logger":"supervisor","caller":"supervisor/supervisor.go:340","msg":"Supervisor starting","id":"01965352-9958-72da-905c-e40329c32c64"}
{"level":"info","ts":1745154644.74608,"logger":"supervisor","caller":"supervisor/supervisor.go:1086","msg":"No last received remote config found"}
```

If everything worked out, you should now be able to go to
[http://localhost:4321/](http://localhost:4321/) and access the OpAMP server UI.
You should see your Collector listed among the agents managed by the Supervisor:

![OpAMPの設定例](../img/opamp-server-ui.png)

#### ステップ 6 - OpenTelemetry コレクターをリモートで設定する {#step-6---configure-the-opentelemetry-collector-remotely}

サーバーUIでコレクターをクリックし、`Additional Configuration` ボックスに以下の内容を貼り付けます。

```yaml
receivers:
  hostmetrics:
    collection_interval: 10s
    scrapers:
      cpu:

exporters:
  # NOTE: Prior to v0.86.0 use `logging` instead of `debug`.
  debug:
    verbosity: detailed

service:
  pipelines:
    metrics:
      receivers: [hostmetrics]
      exporters: [debug]
```

`Save and Send to Agent` をクリックします。

![OpAMP追加設定](../img/opamp-server-additional-config.png)

ページをリロードし、エージェントのステータスが`Up: true`を表示していることを確認します。

![OpAMPエージェント](../img/opamp-server-agent.png)

コレクターに、エクスポートされたメトリクスを照会できます（ラベル値に注意してください）。

```console
$ curl localhost:8888/metrics
# HELP otelcol_exporter_send_failed_metric_points Number of metric points in failed attempts to send to destination. [alpha]
# TYPE otelcol_exporter_send_failed_metric_points counter
otelcol_exporter_send_failed_metric_points{exporter="debug",service_instance_id="01965352-9958-72da-905c-e40329c32c64",service_name="otelcol-contrib",service_version="0.124.1"} 0
# HELP otelcol_exporter_sent_metric_points Number of metric points successfully sent to destination. [alpha]
# TYPE otelcol_exporter_sent_metric_points counter
otelcol_exporter_sent_metric_points{exporter="debug",service_instance_id="01965352-9958-72da-905c-e40329c32c64",service_name="otelcol-contrib",service_version="0.124.1"} 132
# HELP otelcol_process_cpu_seconds Total CPU user and system time in seconds [alpha]
# TYPE otelcol_process_cpu_seconds counter
otelcol_process_cpu_seconds{service_instance_id="01965352-9958-72da-905c-e40329c32c64",service_name="otelcol-contrib",service_version="0.124.1"} 0.127965
...
```

コレクターのログを調べることもできます。

```console
$ cat ./storage/agent.log
{"level":"info","ts":"2025-04-20T15:11:12.996+0200","caller":"service@v0.124.0/service.go:199","msg":"Setting up own telemetry..."}
{"level":"info","ts":"2025-04-20T15:11:12.996+0200","caller":"builders/builders.go:26","msg":"Development component. May change in the future."}
{"level":"info","ts":"2025-04-20T15:11:12.997+0200","caller":"service@v0.124.0/service.go:266","msg":"Starting otelcol-contrib...","Version":"0.124.1","NumCPU":11}
{"level":"info","ts":"2025-04-20T15:11:12.997+0200","caller":"extensions/extensions.go:41","msg":"Starting extensions..."}
{"level":"info","ts":"2025-04-20T15:11:12.997+0200","caller":"extensions/extensions.go:45","msg":"Extension is starting..."}
{"level":"info","ts":"2025-04-20T15:11:13.022+0200","caller":"extensions/extensions.go:62","msg":"Extension started."}
{"level":"info","ts":"2025-04-20T15:11:13.022+0200","caller":"extensions/extensions.go:45","msg":"Extension is starting..."}
{"level":"info","ts":"2025-04-20T15:11:13.022+0200","caller":"healthcheckextension@v0.124.1/healthcheckextension.go:32","msg":"Starting health_check extension","config":{"Endpoint":"localhost:58760","TLSSetting":null,"CORS":null,"Auth":null,"MaxRequestBodySize":0,"IncludeMetadata":false,"ResponseHeaders":null,"CompressionAlgorithms":null,"ReadTimeout":0,"ReadHeaderTimeout":0,"WriteTimeout":0,"IdleTimeout":0,"Path":"/","ResponseBody":null,"CheckCollectorPipeline":{"Enabled":false,"Interval":"5m","ExporterFailureThreshold":5}}}
{"level":"info","ts":"2025-04-20T15:11:13.022+0200","caller":"extensions/extensions.go:62","msg":"Extension started."}
{"level":"info","ts":"2025-04-20T15:11:13.024+0200","caller":"healthcheck/handler.go:132","msg":"Health Check state change","status":"ready"}
{"level":"info","ts":"2025-04-20T15:11:13.024+0200","caller":"service@v0.124.0/service.go:289","msg":"Everything is ready. Begin running and processing data."}
{"level":"info","ts":"2025-04-20T15:11:14.025+0200","msg":"Metrics","resource metrics":1,"metrics":1,"data points":44}
```

## その他の情報 {#other-information}

- ブログ記事
  - [Open Agent Management Protocol (OpAMP) State of the Nation
    2023][blog-opamp-status]
  - [Using OpenTelemetry OpAMP to modify service telemetry on the
    go][blog-opamp-service-telemetry]
- YouTube動画
  - [Smooth Scaling With the OpAMP Supervisor: Managing Thousands of
    OpenTelemetry Collectors][video-opamp-smooth-scaling]
  - [Remote Control for Observability Using the Open Agent Management
    Protocol][video-opamp-remote-control]
  - [What is OpAMP & What is BindPlane][video-opamp-bindplane]
  - [Lightning Talk: Managing OpenTelemetry Through the OpAMP
    Protocol][video-opamp-lt]

[configuration]: /docs/collector/configuration/
[Open Agent Management Protocol]: https://github.com/open-telemetry/opamp-spec
[OpAMP specification]: /docs/specs/opamp/
[opamp-in-otel-collector]: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/cmd/opampsupervisor/specification/README.md
[opamp-go]: https://github.com/open-telemetry/opamp-go
[opamp-supervisor]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/cmd/opampsupervisor
[otelcolcontrib]: https://github.com/open-telemetry/opentelemetry-collector-releases/releases
[tags]: https://github.com/open-telemetry/opentelemetry-collector-releases/tags
[blog-opamp-status]: /blog/2023/opamp-status/
[blog-opamp-service-telemetry]: /blog/2022/opamp/
[video-opamp-smooth-scaling]: https://www.youtube.com/watch?v=g8rtqqNTL9Q
[video-opamp-remote-control]: https://www.youtube.com/watch?v=t550FzDi054
[video-opamp-bindplane]: https://www.youtube.com/watch?v=N18z2dOJSd8
[video-opamp-lt]: https://www.youtube.com/watch?v=LUsfZFRM4yo
