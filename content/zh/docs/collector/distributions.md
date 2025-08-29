---
title: Distributions
weight: 25
---

OpenTelemetry 项目目前提供了 Collector 的预构建[发行版][distributions]。
每个发行版中包含的组件可以在该发行版的 `manifest.yaml` 文件中找到。 The components included in the distributions can be found by in the
`manifest.yaml` of each distribution.

[distributions]: https://github.com/open-telemetry/opentelemetry-collector-releases/tree/main/distributions

{{% ecosystem/distributions-table filter="first-party-collector" %}}

## 自定义发行版 {#custom-distributions}

Existing distributions provided by the OpenTelemetry project may not meet your
needs. For example, you may want a smaller binary or need to implement custom
functionality like
[authenticator extensions](../building/authenticator-extension),
[receivers](../building/receiver), processors, exporters or
[connectors](../building/connector). The tool used to build distributions
[ocb](../custom-collector) (OpenTelemetry Collector Builder) is available to
build your own distributions.

## 第三方发行版 {#third-party-distributions}

Some organizations provide a Collector distribution with additional capabilities
or for improved ease of use. What follows is a list of Collector distributions
maintained by third parties.

{{% ecosystem/distributions-table filter="third-party-collector" %}}

## 添加你的 Collector 发行版 {#how-to-add}

如需将你的 Collector 发行版列入上述列表，请[提交一个 PR][submit a PR]，
在[发行版列表][distributions list]中添加一个条目。该条目应包含以下内容： The entry should include the following:

- 指向你的发行版主页的链接
- 指向说明如何使用该发行版的文档的链接
- GitHub 账号或电子邮箱地址，作为联系方式，以便我们在有问题时与你联系

[submit a PR]: /docs/contributing/pull-requests/
[distributions list]: https://github.com/open-telemetry/opentelemetry.io/tree/main/data/ecosystem/distributions.yaml
