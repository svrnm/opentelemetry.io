---
title: Resiliency
description: 如何配置一个具有自适应性的 OTel Collector 数据管道
---

OpenTelemetry Collector 通过组件和配置设计，旨在尽可能减少遥测数据在处理和导出过程中的丢失。
然而，理解可能导致数据丢失的场景及其应对措施，对于构建一个具有自适应性的可观测性数据管道至关重要。 However,
understanding the potential scenarios where data loss can occur and how to
mitigate them is crucial for a resilient observability pipeline.

## 理解 Collector 的自适应性 {#understanding-collector-resilience}

一个具有自适应性的 Collector 能够在面临不利条件时依然保持遥测数据的流动和处理能力，确保整体的可观测性管道仍然可用。

Collector 的自适应性主要体现在以下场景：当配置的终端（即链路、指标或日志的目标接收方）不可用，或者
Collector 实例本身发生崩溃等问题时，它是如何处理数据的。

## 发送队列（内存缓冲） {#sending-queue-in-memory-buffering}

Collector 导出器中内建的最基本的自适应性机制是发送队列。

- 工作原理：当配置一个导出器时，通常会包含一个发送队列，它在将数据发送到下游终端前，
  会先在内存中进行缓冲。如果终端是可用的，数据会快速通过。 If the endpoint is available, data passes through quickly.
- Handling Endpoint Unavailability: If the endpoint becomes unavailable, for
  example due to network issues or a backend restart, the exporter cannot send
  data immediately. Instead of dropping the data, it adds it to the in-memory
  sending queue.
- Retry Mechanism: The Collector employs a retry mechanism with exponential
  backoff and jitter. It will repeatedly attempt to send the buffered data after
  waiting intervals. By default, it retries for up to 5 minutes.
- 数据丢失场景：
  - 队列满：内存队列的大小是可配置的（默认通常为 1000 批/请求）。如果终端持续不可用且持续有新数据进入，
    队列可能会被填满。一旦队列满，为防止 Collector 内存耗尽，新的数据将被丢弃。 If the endpoint remains unavailable and new data
    keeps arriving, the queue can fill up. Once the queue is full, incoming data
    is dropped to prevent the Collector from running out of memory.
  - 重试超时：如果终端不可用时间超过配置的最大重试时长（默认 5 分钟），Collector
    会停止重试队列中最早的数据并将其丢弃。
- 配置方式：你可以在导出器设置中配置队列大小和重试行为：

  ```yaml
  exporters:
    otlp:
      endpoint: otlp.example.com:4317
      sending_queue:
        storage: file_storage
        queue_size: 5_000 # 增大队列容量（默认是 1000）
      retry_on_failure:
        initial_interval: 5s
        max_interval: 30s
        max_elapsed_time: 10m # 增大最大重试时长（默认是 300 秒）
  ```

{{% alert title="Tip: Use sending queues for remote exporters" %}} Enable
sending queues for any exporter sending data over a network. Adjust `queue_size`
and `max_elapsed_time` based on expected data volume, available Collector
memory, and acceptable downtime for the endpoint. Monitor queue metrics
(`otelcol_exporter_queue_size`, `otelcol_exporter_queue_capacity`).
{{% /alert %}}

## 持久化存储（预写日志 - WAL） {#persistent-storage-write-ahead-log-wal}

为了在 Collector 实例本身崩溃或重启时防止数据丢失，可以为发送队列启用持久化存储，使用 `file_storage` 扩展。

- 工作原理：发送队列不仅在内存中缓冲数据，还会在尝试导出前将数据写入磁盘上的预写日志（WAL）。
- 处理 Collector 崩溃：如果 Collector 在数据仍在队列中时崩溃，数据会被保存在磁盘上。当
  Collector 重启后，它会从 WAL 读取数据并继续尝试将其发送到终端。 When the Collector restarts, it reads
  the data from the WAL and resumes attempts to send it to the endpoint.
- Data Loss Scenario: Data loss can still occur if the disk fails or runs out of
  space, or if the endpoint remains unavailable beyond the retry limits even
  after the Collector restarts. Guarantees might not be as strong as dedicated
  message queues.
- 配置方式：

  1. 定义 `file_storage` 扩展。
  2. 在导出器的 `sending_queue` 配置中引用该存储 ID。

  ```yaml
  extensions:
    file_storage: # 定义扩展实例
      directory: /var/lib/otelcol/storage # 选择一个持久目录

  exporters:
    otlp:
      endpoint: otlp.example.com:4317
      sending_queue:
        storage: file_storage # 引用该存储扩展实例

  service:
    extensions: [file_storage] # 在 service 配置中启用扩展
    pipelines:
      traces:
        receivers: [otlp]
        exporters: [otlp]
  ```

{{% alert title="提示：为关键 Collector 启用 WAL" %}}
对于关键的 Collector（如 Gateway 实例或负责采集关键数据的 Agent），在无法接受 Collector
崩溃导致数据丢失的情况下，使用持久化存储。确保所选目录拥有足够的磁盘空间和正确权限。
{{% /alert %}} Ensure
the chosen directory has sufficient disk space and appropriate permissions.
{{% /alert %}}

## 消息队列 {#message-queues}

在 Collector 层之间（例如 Agent 到 Gateway）或 Collector 到供应商后端之间，
为实现最高级别的自适应性，可以引入像 Kafka 这样的专用消息队列。

- How it works: One Collector instance (Agent) exports data to a Kafka topic
  using the Kafka exporter. 工作原理：一个 Collector 实例（Agent）使用 Kafka 导出器将数据发送到 Kafka 主题，另一个
  Collector 实例（Gateway）使用 Kafka 接收器从该主题中消费数据。
- 处理终端/Collector 不可用的情况：
  - 如果消费方 Collector（Gateway）宕机，消息会积压在 Kafka 主题中（直到 Kafka 的保留时间达到）。
    只要 Kafka 正常，生产方 Collector（Agent）不会受影响。 The producing Collector
    (Agent) is unaffected as long as Kafka is up.
  - 如果生产方 Collector（Agent）宕机，队列中不会有新数据，但消费方可以继续处理已有消息。
  - 如果 Kafka 本身宕机，生产方 Collector 需要使用自身的自适应性机制（如发送队列 + WAL）对发送到 Kafka 的数据进行缓冲。
- 数据丢失场景：数据丢失主要发生在 Kafka 本身（集群故障、主题配置错误、数据过期）或生产方
  Collector 无足够本地缓冲而发送失败的情况下。
- 配置方式：
  - **Agent Collector 配置（生产方）：**

    ```yaml
    exporters:
      kafka:
        brokers: ['kafka-broker1:9092', 'kafka-broker2:9092']
        topic: otlp_traces

    receivers:
      otlp:
        protocols:
          grpc:

    service:
      pipelines:
        traces:
          receivers: [otlp]
          exporters: [kafka]
    ```

  - **Gateway Collector 配置（消费方）：**

    ```yaml
    receivers:
      kafka:
        brokers: ['kafka-broker1:9092', 'kafka-broker2:9092']
        topic: otlp_traces
        initial_offset: earliest # 处理积压数据

    exporters:
      otlp:
        endpoint: otlp.example.com:4317
        # 可考虑为 Gateway 到后端的导出也配置队列/重试

    service:
      pipelines:
        traces:
          receivers: [kafka]
          exporters: [otlp]
    ```

{{% alert title="Tip: Use message queues for critical hops" %}} Use a message
queue for critical data paths requiring high durability, especially across
network boundaries (e.g., between data centers, availability zones, or to a
cloud vendor). This approach leverages the robust, built-in resilience of
systems like Kafka but adds operational complexity and requires expertise in
managing the message queue system. {{% /alert %}}

## 数据丢失的可能场景 {#circumstances-of-data-loss}

以下情况可能导致数据丢失：

1. **网络不可用 + 超时**：下游终端不可用时间超过 `retry_on_failure` 设置中的 `max_elapsed_time`。
2. **网络不可用 + 队列溢出**：下游终端不可用，且发送队列（内存或持久）被填满，在终端恢复前产生的新数据被丢弃。 New data is dropped.
3. **Collector 崩溃（未使用持久化）**：Collector 实例崩溃或被终止，且仅使用了内存发送队列，内存中的数据将丢失。 Data in memory
   is lost.
4. **持久存储故障**：`file_storage` 使用的磁盘发生故障或空间不足。
5. **消息队列故障**：外部消息队列（如 Kafka）发生故障或数据丢失事件，且生产方 Collector 未配置足够的本地缓冲。
6. **配置错误**：导出器或接收器配置错误，阻止数据流动。
7. Disabled Resilience: Sending queues or retry mechanisms are explicitly
   disabled in the configuration.

## 预防数据丢失的建议 {#recommendations-for-preventing-data-loss}

遵循以下建议以最小化数据丢失并确保遥测数据采集的可靠性：

1. **始终使用发送队列**：为通过网络发送数据的导出器启用 `sending_queue`。
2. **监控 Collector 指标**：主动监控 `otelcol_exporter_queue_size`、`otelcol_exporter_queue_capacity`、
   `otelcol_exporter_send_failed_spans`（以及指标/日志的等价对象）以早期发现问题。
3. **调整队列大小与重试参数**：根据预期负载、内存/磁盘资源和可接受的终端宕机时间调整 `queue_size` 和 `retry_on_failure` 参数。
4. **使用持久化存储（WAL）**：对于不允许 Collector 重启导致数据丢失的 Agent 或 Gateway，配置 `file_storage` 扩展。
5. **考虑使用消息队列**：若跨网络段或 Collector 层解耦需要最大持久性，并且能接受运维开销，可以使用 Kafka 等托管消息队列。
6. Use Appropriate Deployment Patterns:
   - Employ an Agent + Gateway architecture. Agents handle local collection,
     Gateways handle processing, batching, and resilient export.
   - 将自适应性机制（队列、WAL、Kafka）集中用于网络跳点：Agent -> Gateway，Gateway -> 后端。
   - 应用程序（SDK）与本地代理 Agent（边车/DaemonSet）之间通常网络可靠，
     此处添加队列有时可能适得其反，若 Agent 不可用，反而影响应用程序。

通过理解这些机制并合理配置，可以显著增强你的 OpenTelemetry Collector 部署的自适应性，最大限度减少数据丢失。
