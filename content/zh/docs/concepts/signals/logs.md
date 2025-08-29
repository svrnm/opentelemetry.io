---
title: 日志
description: 对事件的记录。
weight: 3
cSpell:ignore: filelogreceiver semistructured transformprocessor
---

A **log** is a timestamped text record, either structured (recommended) or
unstructured, with optional metadata. Of all telemetry signals, logs have the
biggest legacy. Most programming languages have built-in logging capabilities or
well-known, widely used logging libraries.

## OpenTelemetry 日志 {#opentelemetry-logs}

OpenTelemetry 并未定义专用的 API 或 SDK 来创建日志。相反，OpenTelemetry 日志指的是你已有的日志，
这些日志来自现有的日志框架或基础设施组件。OpenTelemetry SDK 和自动注入功能利用多个组件，
自动将日志与[链路](../traces)关联。 Instead,
OpenTelemetry logs are the existing logs you already have from a logging
framework or infrastructure component. OpenTelemetry SDKs and
autoinstrumentation utilize several components to automatically correlate logs
with [traces](../traces).

OpenTelemetry 的日志支持旨在与你已有的日志完全兼容，提供了能力来为这些日志添加上下文，
并提供统一的工具包，将来自不同来源的日志解析并转换为统一格式。

### OpenTelemetry Collector 中的 OpenTelemetry 日志 {#opentelemetry-logs-in-the-opentelemetry-collector}

[OpenTelemetry Collector](/docs/collector/) 提供了多个处理日志的工具：

- 多种接收器，可从特定的、已知的数据源解析日志。
- `filelogreceiver`，可从任意文件读取日志，并支持多种日志格式解析或使用正则表达式。
- 类似 `transformprocessor` 的处理器，可解析嵌套数据、扁平化结构、添加/移除/更新值等。
- 多种导出器（exporters），可将日志数据导出为非 OpenTelemetry 格式。

采纳 OpenTelemetry 的第一步通常是部署 Collector 作为通用日志代理。

### 应用中的 OpenTelemetry 日志 {#opentelemetry-logs-for-applications}

In applications, OpenTelemetry logs are created with any logging library or
built-in logging capabilities. When you add autoinstrumentation or activate an
SDK, OpenTelemetry will automatically correlate your existing logs with any
active trace and span, wrapping the log body with their IDs. In other words,
OpenTelemetry automatically correlates your logs and traces.

### 语言支持情况 {#language-support}

日志信号在 OpenTelemetry 规范中是[稳定的](/docs/specs/otel/versioning-and-stability/#stable)。
各语言对 Logs API 和 SDK 的支持情况如下： For the individual language specific
implementations of the Logs API & SDK, the status is as follows:

{{% signal-support-table "logs" %}}

## 结构化、非结构化与半结构化日志 {#structured-unstructured-and-semistructured-logs}

OpenTelemetry 在技术上并不区分结构化与非结构化日志。你可以使用任何已有的日志配合 OpenTelemetry。不过，
并非所有日志格式都同样有用！尤其是在生产环境中，推荐使用结构化日志，因为它们易于解析和大规模分析。
以下部分将解释三种类型日志的差异。 You can use any log you have with OpenTelemetry. However, not
all log formats are equally useful! Structured logs, in particular, are
recommended for production observability because they are easy to parse and
analyze at scale. The following section explains the differences between
structured, unstructured, and semistructured logs.

### 结构化日志 {#structured-logs}

结构化日志是指其文本格式具有一致性、可被机器读取的日志。在应用中，最常见的结构化格式是 JSON： For applications, one of the most common formats is
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
    "userAgent": "Mozilla/5.0 ..."
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

对于基础设施组件，通常使用通用日志格式（CLF）：

```text
127.0.0.1 - johndoe [04/Aug/2024:12:34:56 -0400] "POST /api/v1/login HTTP/1.1" 200 1234
```

It is also common to have different structured log formats mixed together. 也可以混用不同结构化格式。例如扩展日志格式（ELF）可以将 JSON 与空格分隔的 CLF 数据混合：

```text
192.168.1.1 - johndoe [04/Aug/2024:12:34:56 -0400] "POST /api/v1/login HTTP/1.1" 200 1234 "http://example.com" "Mozilla/5.0 ..." {"transactionId": "abcd-efgh...", ...}
```

为了充分利用这类日志，需要将 JSON 和 ELF 部分都解析为统一格式，便于在可观测性后端分析。
OpenTelemetry Collector 中的 `filelogreceiver` 提供了解析这类日志的标准方法。 The
`filelogreceiver` in the [OpenTelemetry Collector](/docs/collector) contains
standardized ways to parse logs like this.

结构化日志是最推荐的日志使用方式。由于格式一致，它们更易于解析，从而便于在 Collector
中预处理、与其他数据关联，并在后端平台分析。 Because structured logs are
emitted in a consistent format, they are straightforward to parse, which makes
them easier to preprocess in an OpenTelemetry Collector, correlate with other
data, and ultimate analyze in an Observability backend.

### 非结构化日志 {#unstructured-logs}

非结构化日志指没有一致结构的日志。它们可能更易读，因此在开发中常用。
但在生产可观测性中不推荐使用，因为很难大规模解析和分析。 They may be
more human-readable, and are often used in development. However, it is not
preferred to use unstructured logs for production observability purposes, since
they are much more difficult to parse and analyze at scale.

非结构化日志示例：

```text
[ERROR] 2024-08-04 12:45:23 - Failed to connect to database. Exception: java.sql.SQLException: Timeout expired. ...

System reboot initiated at 2024-08-04 03:00:00 by user: admin. Reason: Scheduled maintenance. ...

DEBUG - 2024-08-04 09:30:15 - User johndoe performed action: file_upload. Filename: report_Q3_2024.pdf, Size: 2.3 MB ...
```

在生产环境中也可以存储和分析非结构化日志，尽管你可能需要进行大量解析或预处理工作，使其具备机器可读性。
例如，前面提到的三条日志就需要使用正则表达式解析时间戳，并编写自定义解析器来稳定地提取日志消息的正文。
这通常是日志后端根据时间戳对日志进行排序和组织所必需的。虽然解析非结构化日志以便分析是可行的，
但所需工作量往往比直接采用结构化日志要大，比如通过在应用中使用标准的日志记录框架来实现结构化日志。 For example, the above three logs will require a regular
expression to parse their timestamps and custom parsers to consistently extract
the bodies of the log message. This will typically be necessary for a logging
backend to know how to sort and organize the logs by timestamp. Although it's
possible to parse unstructured logs for analysis purposes, doing this may be
more work than switching to structured logging, such as via a standard logging
framework in your applications.

### 半结构化日志 {#semistructured-logs}

半结构化日志具有某种自一致的模式以便被机器读取，但不同系统之间的数据格式和分隔符可能不一致。

半结构化日志示例：

```text
2024-08-04T12:45:23Z level=ERROR service=user-authentication userId=12345 action=login message="Failed login attempt" error="Invalid password" ...
```

尽管机器可读，但为了实现大规模分析，仍可能需要多个解析器。

## OpenTelemetry 日志组件 {#opentelemetry-logging-components}

以下是构成 OpenTelemetry 日志支持的核心概念和组件。

### 日志附加器/桥接器 {#log-appender--bridge}

As an application developer, the **Logs Bridge API** should not be called by you
directly, as it is provided for logging library authors to build log appenders /
bridges. 作为应用开发者，你无需直接调用 **Logs Bridge API**，该 API 是为日志库作者构建日志附加器或桥接器而设。
你只需使用喜欢的日志库，并配置其使用能将日志传递给 OpenTelemetry LogRecordExporter 的附加器。

OpenTelemetry 各语言 SDK 提供了此功能。

### Logger Provider

> 属于 **Logs Bridge API**，仅供日志库作者使用。

A Logger Provider (sometimes called `LoggerProvider`) is a factory for
`Logger`s. Logger Provider（有时叫 `LoggerProvider`）是 `Logger` 的工厂。
一般在应用启动时初始化一次，其生命周期与应用相同。初始化时也包括 Resource 和 Exporter 的初始化。 Logger Provider initialization
also includes Resource and Exporter initialization.

### Logger

> 属于 **Logs Bridge API**，仅供日志库作者使用。

Logger 用于创建日志记录，Logger 实例由 Logger Provider 生成。 Loggers are created from Log Providers.

### 日志记录导出器 {#log-record-exporter}

Log Record Exporter 将日志记录发送到某个消费者。
消费者可以是标准输出（用于调试或开发），也可以是 OpenTelemetry Collector，或你选择的任何开源或商业后端。 This consumer can be
standard output for debugging and development-time, the OpenTelemetry Collector,
or any open source or vendor backend of your choice.

### 日志记录 {#log-record}

A log record represents the recording of an event. 日志记录代表对事件的记录。在 OpenTelemetry 中，日志记录包含两类字段：

- 具备特定含义的命名顶级字段；
- 可任意定义的 Resource 和 Attributes 字段。

顶级字段如下：

| 字段名                  | 描述                                                        |
| -------------------- | --------------------------------------------------------- |
| Timestamp            | 事件发生的时间                                                   |
| ObservedTimestamp    | 观察到事件的时间                                                  |
| TraceId              | 请求的链路 ID                                                  |
| SpanId               | 请求的 Span ID                                               |
| TraceFlags           | W3C 链路标志                                                  |
| SeverityText         | 严重性文本（也称日志级别）                                             |
| SeverityNumber       | 严重性的数值表示                                                  |
| Body                 | The body of the log record.               |
| Resource             | 日志来源                                                      |
| InstrumentationScope | Describes the scope that emitted the log. |
| Attributes           | 事件的附加信息                                                   |

更多有关日志记录与字段的细节，请参阅[日志数据模型](/docs/specs/otel/logs/data-model/)。

### 规范 {#specification}

如需进一步了解 OpenTelemetry 中的日志，请参阅[日志规范][logs specification]。

[logs specification]: /docs/specs/otel/overview/#log-signal
