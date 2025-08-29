---
title: Forking the demo repository
linkTitle: Forking
---

[演示仓库][demo repository]旨在被 Fork 使用，作为展示你如何使用 OpenTelemetry 的工具。

设置一个 Fork 或演示环境通常只需要覆盖一些环境变量，并可能替换一些容器镜像。

你可以将在线演示添加到该演示项目的
[README](https://github.com/open-telemetry/opentelemetry-demo/blob/main/README.md?plain=1)
中。

## 给 Fork 维护者的建议 {#suggestions-for-fork-maintainers}

- If you'd like to enhance the telemetry data emitted or collected by the demo,
  then we strongly encourage you to backport your changes to this repository.
  For vendor or implementation specific changes, a strategy of modifying
  telemetry in the pipeline via config is preferable to underlying code changes.
- Extend rather than replace. 拓展而非替换。新增与现有 API 交互的新服务，是添加特定厂商或工具功能的良好方式，
  尤其是在无法通过修改遥测实现目标的情况下。
- 为了支持可拓展性，请使用仓库（Repository）或门面（Facade）模式来封装诸如队列、数据库、缓存等资源。
  这样可以便于为不同平台替换或接入不同的实现。 This will allow for different
  implementations of these services to be shimmed in for different platforms.
- 请不要尝试将特定厂商或工具的增强功能反向合并到主仓库中。

如果你有任何问题，或者希望提出建议帮助我们更好地支持 Fork 维护者的工作，请提交一个 Issue。

[demo repository]: <{{% param repo %}}>
