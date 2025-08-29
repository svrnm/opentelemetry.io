---
title: 信号
description: 了解 OpenTelemetry 支持的遥测类别
aliases: [ data-sources, otel-concepts ]
weight: 11
---

The purpose of OpenTelemetry is to collect, process, and export [signals].
Signals are system outputs that describe the underlying activity of the
operating system and applications running on a platform. A signal can be
something you want to measure at a specific point in time, like temperature or
memory usage, or an event that goes through the components of your distributed
system that you'd like to trace. You can group different signals together to
observe the inner workings of the same piece of technology under different
angles.

目前，OpenTelemetry 支持以下类型的信号：

- [链路（Trace）](/docs/concepts/signals/traces)
- [指标 (Metric)](/docs/concepts/signals/metrics)
- [日志 (Log)](/docs/concepts/signals/logs)
- [行李 (Baggage)](/docs/concepts/signals/baggage)

正在开发或处于[提案][proposal]阶段的信号：

- [事件][Events]，一种特定类型的[日志](logs)
- [性能分析数据][Profiles]，由 Profiling 工作组负责推进。

[Events]: /docs/specs/otel/logs/data-model/#events
[Profiles]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/oteps/profiles/0212-profiling-vision.md
[proposal]: https://github.com/open-telemetry/opentelemetry-specification/tree/main/oteps/#readme
[signals]: /docs/specs/otel/glossary/#signals
