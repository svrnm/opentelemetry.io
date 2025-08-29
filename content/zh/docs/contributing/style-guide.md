---
title: 文档风格指南
description: 编写 OpenTelemetry 文档时的术语和风格指南。
linkTitle: 风格指南
weight: 20
cSpell:ignore: open-telemetry postgre style-guide textlintrc
---

OpenTelemetry 还没有官方的风格指南，当前版本的 OpenTelemetry 文档风格受到以下风格指南的启发：

- [Google 开发者文档风格指南](https://developers.google.com/style)
- [Kubernetes 风格指南](https://kubernetes.io/docs/contribute/style/style-guide/)

以下部分包含针对 OpenTelemetry 项目的特定指导。

{{% alert title="说明" %}}

我们的风格指南中许多要求都可以通过命令来自动化执行：
在发起[拉取请求](https://docs.github.com/en/get-started/learning-about-github/github-glossary#pull-request)(PR) 之前，你可以在本地机器上运行 `npm run fix:all` 命令并提交更改。

如果你遇到错误或 [PR 检查失败](/docs/contributing/pr-checks)，请阅读以下关于我们的风格指南的内容以及了解你可以采取哪些措施来解决某些常见问题。

{{% /alert %}}

## OpenTelemetry.io 单词列表 {#opentelemetryio-word-list}

请在整个网站上统一使用以下 OpenTelemetry 特定术语和词语列表。

- OpenTelemetry 增强提案（OpenTelemetry Enhancement Proposal）。复数形式请写作 `OTEPs` 。请不要写成 `OTep` 或 `otep`。
- [Collector](/docs/concepts/glossary/#collector)
- [OTEP](/docs/concepts/glossary/#otep)
- [OpAMP](/docs/concepts/glossary/#opamp)

另请参阅 [词汇表](/docs/concepts/glossary/) 以获取 OpenTelemetry术语及其定义的列表。

Make sure that proper nouns, such as other CNCF projects or third-party tools,
are properly written and use the original capitalization. For example, write
"PostgreSQL" instead of "postgre". For a full list, check the
[`.textlintrc.yml`](https://github.com/open-telemetry/opentelemetry.io/blob/main/.textlintrc.yml)
file.

## Markdown 标准 {#markdown-standards}

To enforce standards and consistency for Markdown files, all files should follow
certain rules, enforced by [markdownlint]. For a full list, check the
[.markdownlint.json] file.

We also enforce Markdown [file format](#file-format) and strip files of trailing
whitespace. This precludes the [line break syntax] of 2+ spaces; use `<br>`
instead or reformat your text.

## 拼写检查 {#spell-checking}

Use [CSpell](https://github.com/streetsidesoftware/cspell) to make sure that all
your text is spelled correctly. 使用 [CSpell](https://github.com/streetsidesoftware/cspell) 确保所有文本拼写正确。
有关 OpenTelemetry 网站特定单词的列表，请参阅
[`.cspell.yml`](https://github.com/open-telemetry/opentelemetry.io/blob/main/.cspell.yml) 文件。

If `cspell` indicates an "Unknown word" error, check whether you wrote the word
correctly. If so, add the word to the `cSpell:ignore` section at the top of your
file. If no such section exists, you can add it to the front matter of a
Markdown file:

```markdown
---
title: PageTitle
cSpell:ignore: <word>
---
```

For any other file, add `cSpell:ignore <word>` in a comment line appropriate for
the file's context. 对于任何其他文件，请在适合文件上下文的注释行中添加 `cSpell:ignore <word>`。
对于 [registry](/ecosystem/registry/) 条目 YAML 文件，它可能看起来像这样：

```yaml
# cSpell:ignore <word>
title: registryEntryTitle
```

## 文件格式 {#file-format}

We enforce file formatting using [Prettier]. 运行 `npm run fix:markdown` 命令以修复与 Markdown 相关的格式问题。

## 文件名 {#file-names}

所有文件名都应采用[短横线命名](https://en.wikipedia.org/wiki/Letter_case#Kebab_case)。
运行 `npm run fix:filenames` 以自动重命名文件。

## Fixing validation issues

To learn how to fix validation issues, see [Pull request checks](../pr-checks).

[.markdownlint.json]: <为了增强 Markdown 文件的标准性和一致性，所有文件都应遵循&#xA;[markdownlint](https://github.com/DavidAnson/markdownlint)&#xA;确定的相关规则。有关完整列表，请查看&#xA;[`.markdownlint.json`](https://github.com/open-telemetry/opentelemetry.io/blob/main/.markdownlint.json)&#xA;文件。>
[line break syntax]: https://www.markdownguide.org/basic-syntax/#line-breaks
[markdownlint]: https://github.com/DavidAnson/markdownlint
[Prettier]: https://prettier.io
