---
title: Issues
description: 既存イシューの修正方法、またはバグ、セキュリティ、潜在的な改善の報告方法
weight: 10
_issues: https://github.com/open-telemetry/opentelemetry.io/issues
_issue: https://github.com/open-telemetry/opentelemetry.io/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A
cSpell:ignore: prepopulated
---

<style>
  /* Force all list to be compact. */
  li > p {
    margin-bottom: 0;
  }

  /* Style "first time" alert */
  .alert--first-timer {
    margin: 0.5rem 0 !important;

    > blockquote {
      margin-top: 1rem;
      margin-bottom: 0;
      border-left-color: var(--bs-warning);
      background-color: var(--bs-danger-bg-subtle);
      > *:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>

## 既存のイシューの修正 {#fixing-an-existing-issue}

OTel を改善するための最も良い方法の 1 つは、既存のイシューを修正することです。

1. [issues]({{% param _issues %}}) のリストを参照してください。

2. Select an issue that you would like to work on, ideally one that you can fix
   in a short amount of time. <a name="first-issue"></a>
   {{% alert title="最初のコントリビュートですか？" color="primary alert--first-timer" %}}

   以下のラベルのイシューを選択してください。

   - [Good first issue](<{{% param _issue %}}%22good+first+issue%22>)

   - [Help wanted](<{{% param _issue %}}%3A%22help+wanted%22>)

   > **NOTE**: メンターシップやオンボーディングプロセスの一部でない限り、私たちは、[OpenTelemetry organization][org] にまだコントリビュートしたことがない人に**イシューをアサインしません**。
   >
   > [org]: https://github.com/open-telemetry

   {{% /alert %}}

3. イシューにコメントがある場合、内容を読んでください。

4. Ask maintainers if this issue is still relevant, and ask any questions you
   need for clarification by posting comments over the issue.

5. この旨のコメントを追加して、問題に取り組む意向を共有してください。

6. Work on fixing the issue. Let maintainers know if you run into any problems.

7. 準備ができれば、[プルリクエストを通じてあなたの作業を提出してください](../pull-requests)。

## イシューの報告 {#reporting-an-issue}

エラーに気が付いたり既存の内容に改善を提案したい場合は、イシューを開いてください。

1. Click the **Create documentation issue** link on any document. 任意のドキュメントの**ドキュメントのissueを作成**のリンクをクリックしてください。これにより、ヘッダーがあらかじめ入力された GitHub のイシューページにリダイレクトされます。
2. 問題点または改善の提案を説明してください。できるだけ多くの詳細を提供してください。 Provide as many details as
   you can.
3. **作成** をクリックしてください。

After submitting, check in on your issue occasionally or turn on GitHub
notifications. It might take a few days until maintainers and approvers respond.
Reviewers and other community members might ask questions before they can take
action on your issue.

## 新しいコンテンツや機能の提案 {#suggesting-new-content-or-features}

If you have an idea for new content or a feature, but you aren't sure where it
should go, you can still file an issue. You can also report bugs and security
vulnerabilities.

1. [GitHub](https://github.com/open-telemetry/opentelemetry.io/issues/new/) に行って **Issues** タブ内の **New issue** を選択してください。

2. 要望または疑問に最も適したイシューの種類を選択してください。

3. テンプレートに入力してください。

4. Submit the issue.

### 優れたイシューの作成方法 {#how-to-file-great-issues}

Keep the following in mind when filing an issue:

- Provide a clear issue description. 明確な説明を提供してください。何が欠けていて、古くなっていて、間違っていて改善を必要としているのか説明してください。
- ユーザーへの具体的な影響を説明してください。
- Limit the scope of a given issue to a reasonable unit of work. For problems
  with a large scope, break them down into smaller issues. For example, "Fix the
  security docs" is too broad, but "Add details to the 'Restricting network
  access' topic" is specific enough to be actionable.
- Search the existing issues to see if there's anything related or similar to
  the new issue.
- 新しいイシューがほかのイシューやプルリクエストに関連している場合は、該当する URL 全文を記載するか、`#` をつけてイシュー番号やプルリクエスト番号を記述してください。たとえば、`Introduced by #987654` です。 For example, `Introduced by #987654`.
- [Code of Conduct](https://github.com/open-telemetry/community/blob/main/code-of-conduct.md) に従ってください。ほかのコントリビューターを尊重しましょう。「このドキュメントはひどい」のような発言は、有益でも礼儀正しくもありません。
  Respect your fellow contributors. For example, "The docs are terrible" is not
  helpful or polite feedback.
