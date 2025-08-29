---
title: 迁移
description: 如何迁移到 OpenTelemetry
weight: 950
---

## OpenTracing 和 OpenCensus

OpenTelemetry 是 OpenTracing 和 OpenCensus 的合并版本。
从一开始，OpenTelemetry 就被定位\[成为 OpenTracing 和 OpenCensus 的下一个主要版本]\[]。
因此，OpenTelemetry 项目的\[关键目标]\[]之一是提供与两个项目的向后兼容性以及为现有用户提供迁移方案。 From the
start, OpenTelemetry was considered [to be the next major version of both
OpenTracing and OpenCensus][]. Because of that, one of the [key goals][] of the
OpenTelemetry project is to provide backward compatibility with both projects
and a migration story for existing users.

如果你来自其中一个项目，你可以遵循 [OpenTracing](opentracing/) 和
[OpenCensus](opencensus/) 的迁移指南。

## Jaeger 客户端

[Jaeger 社区](https://www.jaegertracing.io/)弃用了他们的客户端库并建议[迁移为使用](https://www.jaegertracing.io/docs/latest/migration/)
OpenTelemetry 的 API、SDK 和插桩器。

The Jaeger backend can receive trace data via the OpenTelemetry Protocol (OTLP)
since v1.35. 自 v1.35 起，Jaeger 后端可以通过 OpenTelemetry 协议（OTLP）接收链路数据。
因此，你可以将 OpenTelemetry SDK 和收集器从使用 Jaeger 导出器迁移到 OTLP 导出器。

[to be the next major version of both OpenTracing and OpenCensus]: https://www.cncf.io/blog/2019/05/21/a-brief-history-of-opentelemetry-so-far/
[key goals]: https://medium.com/opentracing/merging-opentracing-and-opencensus-f0fe9c7ca6f0
