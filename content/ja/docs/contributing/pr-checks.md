---
title: プルリクエストのチェック
description: プルリクエストがすべてのチェックをパスする方法学ぶ
weight: 40
---

[opentelemetry.io リポジトリ](https://github.com/open-telemetry/opentelemetry.io)に[pull request](https://docs.github.com/en/get-started/learning-about-github/github-glossary#pull-request)（PR）を作成した際に、一連のチェックが実行されます。
PR のチェックは次のことを検証します。 The PR checks verify that:

- [CLA](#easy-cla) の署名しているか
- PR が[Netlify を通じてデプロイ](#netlify-deployment)に成功しているか
- [スタイルガイド](#checks)に変更が従っているか

{{% alert title="Note" %}}

もし何らかの PR チェックが失敗していれば、最初にローカルで `npm run fix:all` を実行することで[内容の問題を修正](../pull-requests/#fix-issues)してください。

You can also add the comment `/fix:all` to your PR. This will trigger the
OpenTelemetry Bot to run that command on your behalf and update the PR. Make
sure that you pull those changes locally.

問題が残り続けている場合のみ、以下を読んで様々なチェックの内容と、失敗した状態からの修正する方法を確認してください。

{{% /alert %}}

## `Easy CLA` {#easy-cla .notranslate lang=en}

[CLA に署名](../prerequisites/#cla)していなかった場合は、このチェックが失敗します。

## Netlify deployment {#netlify-deployment}

[Netlify](https://www.netlify.com/)のビルドが失敗した場合は、詳細については **Details** を選択してください。

## GitHub PR チェック {#checks}

コントリビューションが [スタイルガイド](../style-guide/) に従っていることを検証するために、スタイルガイドのルールを検証し、問題が見つかった場合に失敗する一連のチェックを実装しています。

後述のリストでは、現在のチェック内容と、それに関連するエラーを修正する方法について説明します。

### `TEXT linter` {#text-linter .notranslate lang=en}

このチェックは、[OpenTelemetry 固有の用語や単語がサイト全体で一貫して使用されていること](../style-guide/#opentelemetryio-word-list)を検証します。

If any issues are found, annotations are added to your files in the
`files changed` view of your PR. Fix those to turn the check green. As an
alternative, you can run `npm run check:text -- --fix` locally to fix most
issues. Run `npm run check:text` again and manually fix the remaining issues.

### `MARKDOWN linter` {#markdown-linter .notranslate lang=en}

このチェックは、[Markdown ファイルの標準と一貫性が強制されていること](../style-guide/#markdown-standards)を検証します。

問題が見つかった場合、`npm run fix:markdown` を実行すると、ほとんどの問題を自動的に修正できます。
残りの問題については、`npm run check:markdown` を実行し、提案された変更を手動で適用してください。 For any remaining issues, run `npm run check:markdown` and apply
the suggested changes manually.

### `SPELLING check` {#spelling-check .notranslate lang=en}

このチェックは、[すべての単語が正しく綴られていること](../style-guide/#spell-checking) を検証します。

このチェックが失敗した場合、`npm run check:spelling` をローカルで実行して、スペルミスのある単語を確認してください。
単語のスペルが正しい場合は、ファイルのフロントマターの `cSpell:ignore` セクションに追加する必要があるかもしれません。 If a word is spelled correctly, you may need to add it to the
`cSpell:ignore` section in the front matter of the file.

### `CSPELL` check {#cspell-check .notranslate lang=en}

このチェックは、cSpell の ignore リストに含まれるすべての単語が正規化されていることを検証します。

このチェックが失敗した場合、`npm run fix:dict` をローカルで実行し、新しいコミットの変更をプッシュしてください。

### `FILENAME check` {#filename-check .notranslate lang=en}

このチェックは、[すべてのファイルが Prettier によってフォーマットされていること](../style-guide/#file-format) を検証します。

このチェックが失敗した場合、`npm run fix:format` をローカルで実行し、新しいコミットで変更をプッシュしてください。

### `FILE FORMAT` {#file-format .notranslate lang=en}

このチェックは、[すべてのファイル名が kebab-case になっていること](../style-guide/#file-names) を検証します。

このチェックが失敗した場合、`npm run fix:filenames` をローカルで実行し、新しいコミットで変更をプッシュしてください。

### `BUILD and CHECK LINKS` {#build-and-check-links .notranslate lang=en}

このチェックは、ウェブサイトをビルドしてすべてのリンクが有効であることを検証します。

ローカルでリンクをチェックするには、`npm run check:links` を実行してください。
このコマンドは参照キャッシュも更新します。
refcache に変更があれば、新しいコミットでプッシュしてください。 This command also updates the
reference cache. Push any changes to the refcache in a new commit.

#### 404 エラーの修正 {#fix-404s}

リンクチェッカーによって **invalid**（HTTPステータス **404**）として報告された URL を修正する必要があります。

#### 有効な外部リンクの処理 {#handling-valid-external-links}

リンクチェッカーは、チェッカーをブロックするサーバーによって、200（成功）以外の HTTP ステータスを取得することがあります。
このようなサーバーは、404 以外の 400 番台の HTTP ステータス（401、403、406 が最も一般的）を返すことがよくあります。
LinkedIn などの一部のサーバーは 999 を報告します。 Such servers will often return an HTTP status in
the 400 range other than 404, such as 401, 403, or 406, which are the most
common. Some servers, link LinkedIn, report 999.

チェッカーが成功ステータスを取得できない外部リンクを手動で検証した場合は、URL にクエリパラメーター`?no-link-check`を追加して、リンクチェッカーに無視させることができます。
たとえば、<https:/some-example.org?no-link-check> はリンクチェッカーによって無視されます。 For example,
<https:/some-example.org?no-link-check> will be ignored by the link checker.

{{% alert title="メンテナーのヒント" %}}

メンテナーは、リンクチェッカーを実行した直後に次のスクリプトを実行して、Puppeteer に成功ステータスでないリンクの検証を試みさせることができます。

```sh
./scripts/double-check-refcache-400s.mjs -f --max-num-to-update 99
```

このスクリプトは、リンクチェッカーが実行しない URL フラグメントも検証します。

{{% /alert %}}

### `WARNINGS in build log?` {#warnings-in-build-log .notranslate lang=en}

このチェックが失敗した場合、`npm run log:check:links` ステップの `BUILD and CHECK LINKS` ログを確認して、他の潜在的な問題を特定してください。
復旧方法がわからない場合は、メンテナーに助けを求めてください。 Ask maintainers
for help, if you are unsure how to recover.
