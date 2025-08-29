---
title: Docker 部署
linkTitle: Docker
aliases: [ docker_deployment ]
cSpell:ignore: otlphttp spanmetrics tracetest tracetesting
---

<!-- markdownlint-disable code-block-style ol-prefix -->

## 前置条件 {#prerequisites}

- Docker
- [Docker Compose](https://docs.docker.com/compose/install/)，版本需为 v2.0.0+
- Make（可选）
- 应用需占用 6 GB 内存

## 获取并运行演示程序 {#get-and-run-the-demo}

1. 克隆演示仓库：

    ```shell
    git clone https://github.com/open-telemetry/opentelemetry-demo.git
    ```

2. 进入演示文件夹：

    ```shell
    cd opentelemetry-demo/
    ```

3. 开始演示[^1]：

       {{< tabpane text=true >}} {{% tab Make %}}

```shell
make start
```

    ```
    {{% /tab %}} {{% tab Docker %}}
    ```

```shell
docker compose up --force-recreate --remove-orphans --detach
```

    ```
    {{% /tab %}} {{< /tabpane >}}
    ```

4. （可选）启用基于 API 可观测性的测试[^1]：

    ```
    {{< tabpane text=true >}} {{% tab Make %}}
    ```

```shell
make run-tracetesting
```

    ```
    {{% /tab %}} {{% tab Docker %}}
    ```

```shell
docker compose -f docker-compose-tests.yml run traceBasedTests
```

    ```
    {{% /tab %}} {{< /tabpane >}}
    ```

## 验证 Web 商店和遥测数据 {#verify-the-web-store-and-telemetry}

当镜像构建完成并容器启动后，你可以访问以下地址：

- Web 商店：[http://localhost:8080/](http://localhost:8080/)
- Grafana：[http://localhost:8080/grafana/](http://localhost:8080/grafana/)
- 负载生成器 UI：[http://localhost:8080/loadgen/](http://localhost:8080/loadgen/)
- Jaeger UI：[http://localhost:8080/jaeger/ui/](http://localhost:8080/jaeger/ui/)
- Tracetest UI：[http://localhost:11633/](http://localhost:11633/)，仅在使用 `make run-tracetesting` 时可用
- Flagd 配置器 UI：[http://localhost:8080/feature](http://localhost:8080/feature)

## 修改演示的默认端口号 {#changing-the-demos-primary-port-number}

默认情况下，演示应用将为所有浏览器流量启动一个绑定在 8080 端口的代理服务。
如需更换端口号，请在启动演示前设置环境变量 `ENVOY_PORT`。 To change the port number, set the `ENVOY_PORT` environment
variable before starting the demo.

- 例如，使用 8081 端口[^1]：

    {{< tabpane text=true >}} {{% tab Make %}}

```shell
ENVOY_PORT=8081 make start
```

    ```
    {{% /tab %}} {{% tab Docker %}}
    ```

```shell
ENVOY_PORT=8081 docker compose up --force-recreate --remove-orphans --detach
```

    ```
    {{% /tab %}} {{< /tabpane >}}
    ```

## Bring your own backend

你可能希望将 Web 商店作为演示应用，用于连接你已有的可观测性后端服务
（例如你已有的 Jaeger、Zipkin 实例，或[你选择的其他厂商](/ecosystem/vendors/)）。

OpenTelemetry Collector 可用于将遥测数据导出到多个后端。默认情况下，演示应用中的 Collector 会合并以下两个配置文件的内容： By default, the collector in the demo application will merge the
configuration from two files:

- `otelcol-config.yml`
- `otelcol-config-extras.yml`

如需添加自己的后端服务，请使用编辑器打开文件
[src/otel-collector/otelcol-config-extras.yml](https://github.com/open-telemetry/opentelemetry-demo/blob/main/src/otel-collector/otelcol-config-extras.yml)。

- Start by adding a new exporter. 首先添加一个新的导出器。例如，如果你的后端支持通过 HTTP 的 OTLP 协议，添加如下内容：

  ```yaml
  exporters:
    otlphttp/example:
      endpoint: <your-endpoint-url>
  ```

- 然后重写要连接到你后端的遥测管道中的 `exporters` 配置：

  ```yaml
  service:
    pipelines:
      traces:
        exporters: [spanmetrics, otlphttp/example]
  ```

{{% alert title="Note" %}} When merging YAML values with the Collector, objects
are merged and arrays are replaced. The `spanmetrics` exporter must be included
in the array of exporters for the `traces` pipeline if overridden. Not including
this exporter will result in an error. {{% /alert %}}

Vendor backends might require you to add additional parameters for
authentication, please check their documentation. 某些厂商的后端可能要求你添加额外的认证参数，请参考相应文档。部分后端需要使用不同的导出器，你可以在
[opentelemetry-collector-contrib/exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter)
找到这些导出器及其文档。

更新完 `otelcol-config-extras.yml` 后，通过运行 `make start` 开始演示。
稍等片刻后，你应能看到数据流入你的后端服务。 After a while, you should see the traces flowing into your backend
as well.

[^1]: {{% param notes.docker-compose-v2 %}}
