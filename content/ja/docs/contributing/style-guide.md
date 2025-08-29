---
title: ドキュメントスタイルガイド
description: OpenTelemetry のドキュメントを書く際の用語とスタイル。
linkTitle: スタイルガイド
weight: 20
cSpell:ignore: open-telemetry postgre style-guide textlintrc
---

公式のスタイルガイドはまだありませんが、現在の OpenTelemetry ドキュメントのスタイルは以下のスタイルガイドに触発されています。

- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [Kubernetes Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)

後述するセクションは、OpenTelemetry プロジェクト特有のガイドを含んでいます。

{{% alert title="Note" %}}

スタイルガイドの多くの要件されることは、自動化で強制されています。
[pull request](https://docs.github.com/en/get-started/learning-about-github/github-glossary#pull-request)(PR) を提出する前に、ローカルで `npm run fix:all` を実行して、変更をコミットしてください。

エラーまたは [failed PR checks](../pr-checks) に遭遇した場合、スタイルガイドを読んで特定の一般的な問題を修正するのにできることを学んでください。

{{% /alert %}}

## OpenTelemetry.io ワードリスト {#opentelemetryio-word-list}

OpenTelemetry 特有の用語や単語の一覧であり、サイト全体で一貫して利用されるべきもの。

- [OpenTelemetry](/docs/concepts/glossary/#opentelemetry) と [OTel](/docs/concepts/glossary/#otel)
- [コレクター](/docs/concepts/glossary/#collector)
- [OTEP](/docs/concepts/glossary/#otep)
- [OpAMP](/docs/concepts/glossary/#opamp)

OpenTelemetry の用語と定義の完璧なリストには、[用語集](/docs/concepts/glossary/) を参照してください。

Make sure that proper nouns, such as other CNCF projects or third-party tools,
are properly written and use the original capitalization. For example, write
"PostgreSQL" instead of "postgre". For a full list, check the
[`.textlintrc.yml`](https://github.com/open-telemetry/opentelemetry.io/blob/main/.textlintrc.yml)
file.

## マークダウン規約 {#markdown-standards}

マークダウンファイルに規約と一貫性を確保するために、[markdownlint] によって定められたルールに従う必要があります。
すべてのルールの一覧は、[.markdownlint.json] ファイルを確認してください。 For a full list, check the
[.markdownlint.json] file.

We also enforce Markdown [file format](#file-format) and strip files of trailing
whitespace. This precludes the [line break syntax] of 2+ spaces; use `<br>`
instead or reformat your text.

## スペルチェック {#spell-checking}

Use [CSpell](https://github.com/streetsidesoftware/cspell) to make sure that all
your text is spelled correctly. すべてのテキストが適切に表記されているあ確認するために、[CSpell](https://github.com/streetsidesoftware/cspell) を使用します。
OpenTelemetry ウェブサイト固有の単語一覧は、[`.cspell.yml`](https://github.com/open-telemetry/opentelemetry.io/blob/main/.cspell.yml) ファイルを確認してください。

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

ほかのファイルの場合は、そのファイルの状況に適したコメント行に `cSpell:ignore <word>` を追加してください。
たとえば、[レジストリ](/ecosystem/registry/) エントリー YAML ファイルでは、次のように記述します。 For a [registry](/ecosystem/registry/) entry YAML file, it
might look like this:

```yaml
# cSpell:ignore <word>
title: registryEntryTitle
```

## ファイルのフォーマット {#file-format}

We enforce file formatting using [Prettier]. [Prettier] を利用することでファイルフォーマットを強制します。
`npm run fix:format` を実行して、フォーマットを適用してください。

## ファイル名 {#file-names}

すべてのファイル名は、[kebab case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case) である必要があります。

## 検証問題の修正 {#fixing-validation-issues}

検証問題の修正方法については、[プルリクエストのチェック](../pr-checks) を参照してください。

[.markdownlint.json]: https://github.com/open-telemetry/opentelemetry.io/blob/main/.markdownlint.json
[line break syntax]: https://www.markdownguide.org/basic-syntax/#line-breaks
[markdownlint]: https://github.com/DavidAnson/markdownlint
[Prettier]: https://prettier.io
