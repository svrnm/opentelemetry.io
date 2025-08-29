---
title: Kubernetes 部署
linkTitle: Kubernetes
aliases: [ kubernetes_deployment ]
cSpell:ignore: loadgen otlphttp spanmetrics
---

我们提供了一个 [OpenTelemetry 演示所用的 Helm Chart](/docs/platforms/kubernetes/helm/demo/)，
以帮助你将演示程序部署到现有的 Kubernetes 集群中。

要使用该 Helm Chart，你需要先安装 [Helm](https://helm.sh)。请参考
Helm 的[官方文档](https://helm.sh/docs/)开始使用。 Please refer to
Helm's [documentation](https://helm.sh/docs/) to get started.

## 前置条件 {#prerequisites}

- Kubernetes 1.24+
- 6 GB 可用内存供应用使用
- Helm 3.14+（仅适用于 Helm 安装方式）

## 使用 Helm 安装（推荐方式） {#install-using-helm-recommended}

添加 OpenTelemetry 的 Helm 仓库：

```shell
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
```

使用以下命令以 `my-otel-demo` 作为发布名称安装 Chart：

```shell
helm install my-otel-demo open-telemetry/opentelemetry-demo
```

{{% alert title="注意" %}}

OpenTelemetry 演示所用的 Helm Chart 不支持从一个版本升级到另一个版本。
如果需要升级 Chart，必须先删除现有发布，然后安装新版本。 If you need to upgrade the chart, you must first delete the
existing release and then install the new version.

{{% /alert %}}

{{% alert title="注意" %}}

要使用下述所有方式，必须使用 OpenTelemetry 演示所用的 Helm Chart v0.11.0 或更高版本。

{{% /alert %}}

## 使用 kubectl 安装 {#install-using-kubectl}

以下命令会将演示应用安装到你的 Kubernetes 集群中：

```shell
kubectl create --namespace otel-demo -f https://raw.githubusercontent.com/open-telemetry/opentelemetry-demo/main/kubernetes/opentelemetry-demo.yaml
```

{{% alert title="注意" %}}

OpenTelemetry 演示所用的 Kubernetes 清单文件不支持从一个版本升级到另一个版本。
如果需要升级演示应用，必须先删除已有资源再重新安装新版本。 If you need to upgrade the demo, you must first delete
the existing resources and then install the new version.

{{% /alert %}}

{{% alert title="注意" %}}

These manifests are generated from the Helm chart and are provided for
convenience. It is recommended to use the Helm chart for installation.

{{% /alert %}}

## 使用演示应用 {#use-the-demo}

The demo application will need the services exposed outside of the Kubernetes
cluster in order to use them. You can expose the services to your local system
using the `kubectl port-forward` command or by configuring service types (ie:
LoadBalancer) with optionally deployed ingress resources.

### 使用 kubectl port-forward 暴露服务 {#expose-services-using-kubectl-port-forward}

要暴露 `frontend-proxy` 服务，请使用以下命令（将 `default` 替换为你的 Helm Chart 所在的命名空间）：

```shell
kubectl --namespace default port-forward svc/frontend-proxy 8080:8080
```

{{% alert title="注意" %}}

`kubectl port-forward` 会持续代理端口直到该进程终止。你可能需要为每次端口转发单独打开终端，
并在完成后使用 <kbd>Ctrl-C</kbd> 终止进程。 You might
need to create separate terminal sessions for each use of
`kubectl port-forward`, and use <kbd>Ctrl-C</kbd> to terminate the process when
done.

{{% /alert %}}

设置好 frontend-proxy 的端口转发后，你可以访问以下地址：

- Web 商店：[http://localhost:8080/](http://localhost:8080/)
- Grafana：[http://localhost:8080/grafana/](http://localhost:8080/grafana/)
- 负载生成器 UI：[http://localhost:8080/loadgen/](http://localhost:8080/loadgen/)
- Jaeger UI：[http://localhost:8080/jaeger/ui/](http://localhost:8080/jaeger/ui/)
- Flagd 配置器 UI：[http://localhost:8080/feature](http://localhost:8080/feature)

### 使用 Service 或 Ingress 配置暴露演示组件

推荐在安装 Helm Chart 时使用 values 文件以便进行额外配置。
{{% alert title="注意" %}}

#### 配置 Ingress 资源 {#configure-ingress-resources}

{{% alert title="注意" %}}

Kubernetes clusters might not have the proper infrastructure components to
enable LoadBalancer service types or ingress resources. Verify your cluster has
the proper support before using these configuration options.

{{% /alert %}}

Each demo component (ie: frontend-proxy) offers a way to have its Kubernetes
service type configured. By default, these will not be created, but you can
enable and configure them through the `ingress` property of each component.

以下示例配置将为 frontend-proxy 组件启用 Ingress 资源，可添加到你的 values 文件中：

```yaml
components:
  frontend-proxy:
    ingress:
      enabled: true
      annotations: {}
      hosts:
        - host: otel-demo.my-domain.com
          paths:
            - path: /
              pathType: Prefix
              port: 8080
```

Some ingress controllers require special annotations or service types. Refer to
the documentation from your ingress controller for more information.

#### 配置服务类型

每个演示组件（如 frontend-proxy）都可以配置其 Kubernetes 服务类型。
默认是 `ClusterIP`，你可以通过每个组件的 `service.type` 属性进行更改。 By default, these will be `ClusterIP` but you can
change each one using the `service.type` property of each component.

以下示例配置将 frontend-proxy 组件的服务类型更改为 LoadBalancer，可添加到你的 values 文件中：

```yaml
components:
  frontend-proxy:
    service:
      type: LoadBalancer
```

#### 配置浏览器端遥测

In order for spans from the browser to be properly collected, you will also need
to specify the location where the OpenTelemetry Collector is exposed. The
frontend-proxy defines a route for the collector with a path prefix of
`/otlp-http`. 为了正确收集来自浏览器的 span，你还需要指定 OpenTelemetry Collector 的访问地址。
frontend-proxy 定义了一个前缀为 `/otlp-http` 的路由，你可以通过设置 frontend 组件的以下环境变量来配置 Collector 端点：

```yaml
components:
  frontend:
    envOverrides:
      - name: PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
        value: http://otel-demo.my-domain.com/otlp-http/v1/traces
```

## Bring your own backend

你可能希望将 Web 商店作为演示应用，连接到你已有的可观测性后端
（例如已有的 Jaeger、Zipkin 实例，或[你选择的其他厂商](/ecosystem/vendors/)）。

OpenTelemetry Collector 的配置在 Helm Chart 中是可暴露的。
你进行的任何添加都会被合并到默认配置中。这可以让你添加自定义导出器，并将其加入到需要的管道中： Any
additions you do will be merged into the default configuration. You can use this
to add your own exporters, and add them to the desired pipeline(s)

```yaml
opentelemetry-collector:
  config:
    exporters:
      otlphttp/example:
        endpoint: <your-endpoint-url>

    service:
      pipelines:
        traces:
          exporters: [spanmetrics, otlphttp/example]
```

{{% alert title="Note" %}} When merging YAML values with Helm, objects are
merged and arrays are replaced. The `spanmetrics` exporter must be included in
the array of exporters for the `traces` pipeline if overridden. Not including
this exporter will result in an error. {{% alert title="注意" %}}

Vendor backends might require you to add additional parameters for
authentication, please check their documentation. 某些厂商的后端可能要求添加额外的认证参数，请参考相关文档。部分后端需要使用不同的导出器，你可以在
[opentelemetry-collector-contrib/exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter)
中找到这些导出器及其文档。

使用自定义的 `my-values-file.yaml` values 文件安装 Helm Chart 的命令如下：

```shell
helm install my-otel-demo open-telemetry/opentelemetry-demo --values my-values-file.yaml
```
