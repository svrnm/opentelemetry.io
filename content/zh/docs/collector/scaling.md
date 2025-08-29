---
title: Collector 扩容
weight: 26
# prettier-ignore
cSpell:ignore: fluentd hostmetrics Linkerd loadbalancer loadbalancing statefulset
---

在使用 OpenTelemetry Collector 规划可观测性数据收集管道时，你应当考虑如何随着遥测数据收集量的增长来扩容这个管道。

以下各节将引导你完成规划阶段，讨论应当扩容哪些组件、如何判断是否需要扩容、以及如何执行扩容计划。

## What to Scale

While the OpenTelemetry Collector handles all telemetry signal types in a single
binary, the reality is that each type may have different scaling needs and might
require different scaling strategies. Start by looking at your workload to
determine which signal type is expected to have the biggest share of the load
and which formats are expected to be received by the Collector. For instance,
scaling a scraping cluster differs significantly from scaling log receivers.
Think also about how elastic the workload is: do you have peaks at specific
times of the day, or is the load similar across all 24 hours? Once you gather
that information, you will understand what needs to be scaled.

For example, suppose you have hundreds of Prometheus endpoints to be scraped, a
terabyte of logs coming from fluentd instances every minute, and some
application metrics and traces arriving in OTLP format from your newest
microservices. In that scenario, you’ll want an architecture that can scale each
signal individually: scaling the Prometheus receivers requires coordination
among the scrapers to decide which scraper goes to which endpoint. In contrast,
we can horizontally scale the stateless log receivers on demand. Having the OTLP
receiver for metrics and traces in a third cluster of Collectors would allow us
to isolate failures and iterate faster without fear of restarting a busy
pipeline. Given that the OTLP receiver enables the ingestion of all telemetry
types, we can keep the application metrics and traces on the same instance,
scaling them horizontally when needed.

## When to Scale

同样，我们应当深入了解工作负载，以决定何时扩容或收缩 Collector，但
Collector 本身输出的一些指标可以很好地提示你是否需要采取行动。

One helpful hint the Collector can give you when the memory_limiter processor is
part of the pipeline is the metric `otelcol_processor_refused_spans` . This
processor allows you to restrict the amount of memory the Collector can use.
While the Collector may consume a bit more than the maximum amount configured in
this processor, new data will eventually be blocked from passing through the
pipeline by the memory_limiter, which will record the fact in this metric. The
same metric exists for all other telemetry data types. If data is being refused
from entering the pipeline too often, you’ll probably want to scale up your
Collector cluster. You can scale down once the memory consumption across the
nodes is significantly lower than the limit set in this processor.

Another set of metrics to keep in sight are the ones related to the queue sizes
for exporters: `otelcol_exporter_queue_capacity` and
`otelcol_exporter_queue_size`. The Collector will queue data in memory while
waiting for a worker to become available to send the data. If there aren’t
enough workers or the backend is too slow, data starts piling up in the queue.
Once the queue has hit its capacity (`otelcol_exporter_queue_size` >
`otelcol_exporter_queue_capacity`) it rejects data
(`otelcol_exporter_enqueue_failed_spans`). Adding more workers will often make
the Collector export more data, which might not necessarily be what you want
(see [When NOT to scale](#when-not-to-scale)). The general guidance is to
monitor queue size and consider scaling up when it reaches 60-70% of capacity,
and scaling down if it's consistently low, while maintaining a minimum number of
replicas, for example three, for resilience.

It’s also worth getting familiar with the components that you intend to use, as
different components might produce other metrics. 你还应熟悉所使用的组件，因为不同组件可能暴露不同的指标。例如，
[负载均衡导出器会记录导出操作的时延信息](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/loadbalancingexporter#metrics)，
以直方图 `otelcol_loadbalancer_backend_latency` 的形式暴露。你可以据此判断各后端处理请求的时间是否相近：
若某个后端特别慢，可能是 Collector 之外的问题。
You can extract this information to determine whether all backends are taking a
similar amount of time to process requests: single backends being slow might
indicate problems external to the Collector.

对于抓取类型的接收器，例如 Prometheus 接收器，一旦抓取所有目标所需的时间接近或超过抓取间隔，
就需要对抓取进行扩容或分片。此时，应增加更多抓取程序，通常是新的 Collector 实例。 When that
happens, it’s time to add more scrapers, usually new instances of the Collector.

### 何时不能扩容 {#when-not-to-scale}

Perhaps as important as knowing when to scale is to understand which signs
indicate that a scaling operation won’t bring any benefits. One example is when
a telemetry database can’t keep up with the load: adding Collectors to the
cluster won’t help without scaling up the database. Similarly, when the network
connection between the Collector and the backend is saturated, adding more
Collectors might cause a harmful side effect.

Again, one way to catch this situation is by looking at the metrics
`otelcol_exporter_queue_size` and `otelcol_exporter_queue_capacity`. If you keep
having the queue size close to the queue capacity, it’s a sign that exporting
data is slower than receiving data. You can try to increase the queue capacity,
which will cause the Collector to consume more memory, but it will also give
some room for the backend to breathe without permanently dropping telemetry
data. But if you keep increasing the queue capacity and the queue size keeps
rising at the same proportion, it’s indicative that you might want to look
outside of the Collector. It’s also important to note that adding more workers
here would not be helpful: you’ll only be putting more pressure on a system
already suffering from a high load.

另一个后端出现问题的信号是指标 `otelcol_exporter_send_failed_spans` 的增长：
它表示数据导出操作永久失败。如果该现象持续出现，扩容 Collector 很可能只会加剧问题。 Scaling up the Collector will likely only worsen
the situation when this is consistently happening.

## How to Scale

At this point, we know which parts of our pipeline needs scaling. Regarding
scaling, we have three types of components: stateless, scrapers, and stateful.

大多数 Collector 组件是无状态的。即使它们在内存中保存一些状态，对于扩容来说也并不重要。 Even if they hold some state in memory,
it isn’t relevant for scaling purposes.

抓取程序（如 Prometheus 接收器）配置为从外部获取遥测数据，然后将其放入处理管道。 The receiver will then scrape target by target, putting
data into the pipeline.

某些组件如尾部采样处理器在内存中保留关键状态信息，因此不能轻易扩容。这类组件在扩容前需仔细考虑。 Those components require
some careful consideration before being scaled up.

### 扩容无状态 Collector 与使用负载均衡器 {#scaling-stateless-collectors-and-using-load-balancers}

好消息是，大多数情况下扩容 Collector 都很简单，只需添加新的副本，并通过负载均衡器将流量分发即可。

负载均衡器在以下场景非常关键：

- 在多个无状态 Collector 实例之间分发流量，避免单个实例被压垮；
- Improve the availability and fault tolerance of your collection pipeline. 提高采集管道的可用性和容错能力。如果某个 Collector 实例失败，负载均衡器可将流量引导至其他健康实例；
- 按需对 Collector 层进行水平扩容。

When operating in Kubernetes environments, leverage robust, off-the-shelf load
balancing and rate-limiting solutions provided by service meshes, such as Istio
or Linkerd, or cloud provider load balancers. These systems offer mature
features for traffic management, resilience, and observability that often go
beyond basic load distribution.

若使用 gRPC（OTLP 常见）接收数据，需使用理解 gRPC 协议的 L7 负载均衡器。传统 L4 负载均衡器可能与某个
Collector 后端建立持久连接，破坏扩容效果，因为客户端始终连接同一个实例。在设计时也要考虑管道的可靠性。
例如，在 Kubernetes 中运行工作负载时，可通过 DaemonSet 在每个物理节点部署一个 Collector，
同时使用远程中央 Collector 对数据预处理后再发送到存储。当节点较少而 Pod 数较多时，
边车模式更合适，可在 Collector 层实现更好的 gRPC 负载均衡，无需 gRPC 专用负载均衡器。此外，
边车模式还能避免 DaemonSet Pod 故障导致该节点所有 Pod 的关键组件宕机。 Standard L4 load balancers
might establish a persistent connection to a single backend Collector instance,
negating the benefits of scaling, as clients will always hit the same backing
Collector. You should still consider splitting your collection pipeline with
reliability in mind. For instance, when your workloads run on Kubernetes, you
might want to use DaemonSets to have a Collector on the same physical node as
your workloads and a remote central Collector responsible for pre-processing the
data before sending the data to the storage. When the number of nodes is low and
the number of pods is high, Sidecars might make more sense, as you’ll get a
better load balancing for the gRPC connections among Collector layers without
needing a gRPC-specific load balancer. Using a Sidecar also makes sense to avoid
bringing down a crucial component for all pods in a node when one DaemonSet pod
fails.

The sidecar pattern consists in adding a container into the workload pod. The
[OpenTelemetry Operator](/docs/platforms/kubernetes/operator/) can automatically
add that for you. 边车模式是将一个额外容器注入到工作负载的 Pod 中。
[OpenTelemetry Operator](/docs/platforms/kubernetes/operator/) 可自动完成此操作。
你需要创建一个 OpenTelemetry Collector CR，并在 PodSpec 或 Pod 上添加注解，告知 Operator 注入边车：

```yaml
---
apiVersion: opentelemetry.io/v1alpha1
kind: OpenTelemetryCollector
metadata:
  name: sidecar-for-my-workload
spec:
  mode: sidecar
  config: |
    receivers:
      otlp:
        protocols:
          grpc:
            endpoint: 0.0.0.0:4317
    processors:

    exporters:
      # Note: Prior to v0.86.0 use the `logging` instead of `debug`.
      debug:

    service:
      pipelines:
        traces:
          receivers: [otlp]
          processors: []
          exporters: [debug]
---
apiVersion: v1
kind: Pod
metadata:
  name: my-microservice
  annotations:
    sidecar.opentelemetry.io/inject: 'true'
spec:
  containers:
    - name: my-microservice
      image: my-org/my-microservice:v0.0.0
      ports:
        - containerPort: 8080
          protocol: TCP
```

如果你不想使用 Operator，也可以手动添加边车，示例如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-microservice
spec:
  containers:
    - name: my-microservice
      image: my-org/my-microservice:v0.0.0
      ports:
        - containerPort: 8080
          protocol: TCP
    - name: sidecar
      image: ghcr.io/open-telemetry/opentelemetry-collector-releases/opentelemetry-collector:0.69.0
      ports:
        - containerPort: 8888
          name: metrics
          protocol: TCP
        - containerPort: 4317
          name: otlp-grpc
          protocol: TCP
      args:
        - --config=/conf/collector.yaml
      volumeMounts:
        - mountPath: /conf
          name: sidecar-conf
  volumes:
    - name: sidecar-conf
      configMap:
        name: sidecar-for-my-workload
        items:
          - key: collector.yaml
            path: collector.yaml
```

### Scaling the Scrapers

Some receivers are actively obtaining telemetry data to place in the pipeline,
like the hostmetrics and prometheus receivers. While getting host metrics isn’t
something we’d typically scale up, we might need to split the job of scraping
thousands of endpoints for the Prometheus receiver. And we can’t simply add more
instances with the same configuration, as each Collector would try to scrape the
same endpoints as every other Collector in the cluster, causing even more
problems, like out-of-order samples.

解决方案是对端点进行分片，使每个 Collector 实例负责不同的一组端点。

一种方法是为每个 Collector 配置不同的配置文件，使其只发现自己负责的端点。
例如，可以按命名空间或工作负载上的标签进行划分。 For instance, each Collector could be responsible for one Kubernetes
namespace or specific labels on the workloads.

另一种方式是使用 [Target Allocator](/docs/platforms/kubernetes/operator/target-allocator/)，
这是 OpenTelemetry Operator 附带的一个组件，用于将 Prometheus 抓取目标在多个 Collector 间分配。使用方式如下： You can use a Custom Resource (CR) like the following to
make use of the Target Allocator:

```yaml
apiVersion: opentelemetry.io/v1alpha1
kind: OpenTelemetryCollector
metadata:
  name: collector-with-ta
spec:
  mode: statefulset
  targetAllocator:
    enabled: true
  config: |
    receivers:
      prometheus:
        config:
          scrape_configs:
          - job_name: 'otel-collector'
            scrape_interval: 10s
            static_configs:
            - targets: [ '0.0.0.0:8888' ]

    exporters:
      # Note: Prior to v0.86.0 use the `logging` instead of `debug`.
      debug:

    service:
      pipelines:
        metrics:
          receivers: [prometheus]
          processors: []
          exporters: [debug]
```

协调后，Operator 会将 Collector 的配置转换为如下形式：

```yaml
exporters:
   # 注意：对于 v0.86.0 之前到版本，要使用 `logging` 而不是使用 `debug`
   debug: null
 receivers:
   prometheus:
     config:
       global:
         scrape_interval: 1m
         scrape_timeout: 10s
         evaluation_interval: 1m
       scrape_configs:
       - job_name: otel-collector
         honor_timestamps: true
         scrape_interval: 10s
         scrape_timeout: 10s
         metrics_path: /metrics
         scheme: http
         follow_redirects: true
         http_sd_configs:
         - follow_redirects: false
           url: http://collector-with-ta-targetallocator:80/jobs/otel-collector/targets?collector_id=$POD_NAME
service:
   pipelines:
     metrics:
       exporters:
       - debug
       processors: []
       receivers:
       - prometheus
```

注意，Operator 添加了 `global` 设置和新的 `http_sd_configs`，这些配置指向由 Operator 自动部署的 Target Allocator 实例。
现在，只需修改 CR 的 “replicas” 字段即可扩容 Collector，Target Allocator 会自动根据每个 Pod 分配不同的抓取目标。 Now, to scale the collectors, change the “replicas” attribute of
the CR and the Target Allocator will distribute the load accordingly by
providing a custom `http_sd_config` per collector instance (pod).

### 扩容有状态 Collector {#scaling-stateful-collectors}

Certain components might hold data in memory, yielding different results when
scaled up. It is the case for the tail-sampling processor, which holds spans in
memory for a given period, evaluating the sampling decision only when the trace
is considered complete. Scaling a Collector cluster by adding more replicas
means that different collectors will receive spans for a given trace, causing
each collector to evaluate whether that trace should be sampled, potentially
coming to different answers. This behavior results in traces missing spans,
misrepresenting what happened in that transaction.

A similar situation happens when using the span-to-metrics processor to generate
service metrics. When different collectors receive data related to the same
service, aggregations based on the service name will be inaccurate.

To overcome this, you can deploy a layer of Collectors containing the
load-balancing exporter in front of your Collectors doing the tail-sampling or
the span-to-metrics processing. The load-balancing exporter will hash the trace
ID or the service name consistently and determine which collector backend should
receive spans for that trace. You can configure the load-balancing exporter to
use the list of hosts behind a given DNS A entry, such as a Kubernetes headless
service. When the deployment backing that service is scaled up or down, the
load-balancing exporter will eventually see the updated list of hosts.
Alternatively, you can specify a list of static hosts to be used by the
load-balancing exporter. You can scale up the layer of Collectors configured
with the load-balancing exporter by increasing the number of replicas. Note that
each Collector will potentially run the DNS query at different times, causing a
difference in the cluster view for a few moments. We recommend lowering the
interval value so that the cluster view is different only for a short period in
highly-elastic environments.

以下是使用 Kubernetes `observability` 命名空间中 `otelcol` 服务作为后端信息来源的示例配置：

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

processors:

exporters:
  loadbalancing:
    protocol:
      otlp:
    resolver:
      dns:
        hostname: otelcol.observability.svc.cluster.local

service:
  pipelines:
    traces:
      receivers:
        - otlp
      processors: []
      exporters:
        - loadbalancing
```
