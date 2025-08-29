---
title: 承認者およびメンテナーのための SIG のプラクティス
linkTitle: SIG のプラクティス
description: 承認者およびメンテナーがどのようにイシューやコントリビューションを管理するかを学びます。
weight: 999
cSpell:ignore: chalin docsy
---

このページでは、承認者およびメンテナーが使用するガイドラインと一般的なプラクティスについて説明します。

## オンボーディング {#onboarding}

コントリビューターがドキュメントに対する責任の大きい役割（承認者、メンテナー）を引き受ける場合、既存の承認者およびメンテナーによってオンボーディングが行われます。

- `docs-approvers`（または `docs-maintainers`）グループに追加されます
- `#otel-comms`、`#otel-maintainers`、およびチーム内のプライベート Slack チャンネルに追加されます
- [SIG Comm ミーティング](https://groups.google.com/a/opentelemetry.io/g/calendar-comms)と[メンテナーミーティング](https://groups.google.com/a/opentelemetry.io/g/calendar-maintainer-meeting)のカレンダー招待への登録を求められます
- SIG Comm の現在のミーティング時間が適しているかを確認し、適さない場合は既存の承認者およびメンテナーと調整して、全員に適した時間を決定します
- They are asked to review the different resources available for contributors:
  - [コミュニティリソース](https://github.com/open-telemetry/community/)。
    特に、[コミュニティメンバーシップ](https://github.com/open-telemetry/community/blob/main/community-membership.md) と
    [ソーシャルメディアガイド](https://github.com/open-telemetry/community/blob/main/social-media-guide.md) に関するドキュメント
  - [コントリビューションガイドライン](/docs/contributing)。この一環として、これらのドキュメントをレビューし、イシューやプルリクエストを通じて改善するためのフィードバックを提供します

Additional valuable resources to review are

- [Hugo ドキュメント](https://gohugo.io/documentation/)
- [Docsy ドキュメント](https://www.docsy.dev/docs/)
- [マーケティングガイドライン](/community/marketing-guidelines/)。これは、Linux Foundation のブランドおよび
  [商標使用ガイドライン](https://www.linuxfoundation.org/legal/trademark-usage) 含みます。
  これらは、レジストリ、インテグレーション、ベンダー、導入事例、ディストリビューションのエントリーをレビューする際に特に重要です
  Those are especially valuable when reviewing entries to the registry,
  integrations, vendors, adopters or distributions.

## コラボレーション {#collaboration}

- Approvers and maintainers have different work schedules and circumstances.
  承認者およびメンテナーは、それぞれ異なる勤務時間や状況です。
  そのため、すべてのコミュニケーションは非同期とみなされ、通常のスケジュール外で返信する義務はありません
- 承認者またはメンテナーが長期間（数日または1週間以上）不在となる場合は、
  [#otel-comms](https://cloud-native.slack.com/archives/C02UN96HZH6) チャンネルでの通知や GitHub ステータスの更新を行います。
- 承認者およびメンテナーは、[OTel 行動規範](https://github.com/open-telemetry/community/?tab=coc-ov-file#opentelemetry-community-code-of-conduct) と[コミュニティの価値観](/community/mission/#community-values)に従います。
  彼らはコントリビューターに対して親切かつ協力的であり、何らかの対立や誤解、不快になるような状況が承認者またはメンテナーに生じた場合は、会話、イシューまたは PR から一歩引いて別の承認者やメンテナーに対応を依頼できます They are
  friendly and helpful towards contributors. In the case of a conflict,
  misunderstanding or any other kind of situation that makes an
  approver/maintainer feel uncomfortable they can step back from a conversation,
  issue or PR and ask another approver/maintainer to step in.

## コードレビュー {#code-reviews}

### 一般 {#general}

- PR のブランチが `out-of-date with the base branch`（ベースブランチと同期していない）場合、継続的に更新する必要はありません。
  各更新ごとに CI チェックが再実行されます！
  マージ前に更新すれば十分です
  It's often enough to update them before merging.
- 非メンテナーによる PR で git サブモジュールを**決して**更新しないでください。
  これは時々誤って起こります。
  PR 作成者にその必要はないことを伝えてください。
  マージ前にこれを修正しますが、将来的には最新のフォークから作業する必要があります This happens
  by accident from time to time. Let the PR author know that they should not
  worry about it, we will fix this before merging, but in the future they should
  make sure that they work from an up-to-date fork.
- コントリビューターが CLA に署名できない場合、またはコミットの 1 つで誤って間違ったメールアドレスを使用した場合は、問題を修正するか、プルリクエストをリベースするように依頼してください。
  最悪の場合、PR を閉じて再度開き、新しい CLA チェックをトリガーします Worst case scenario, close and re-open the PR to trigger a new
  CLA check.
- `cspell` に未知の単語は、PR 作成者によってページごとに `cspell` の ignore リストに追加される必要があります。
  承認者とメンテナーのみが、よく使用される用語をグローバルリストに追加します Only approvers and maintainers will add commonly used terms to the
  global list.

### 共同所有 PR {#co-owned-prs}

SIG が共同所有するドキュメント（コレクター、デモ、言語固有など）を変更する PR は、ドキュメント承認者による承認と SIG 承認者による承認の 2 つの承認を目指す必要があります。 should aim for two approvals: one by a docs approver and
one by a SIG approver:

- ドキュメント承認者は PR に `sig:<name>` ラベルを付与し、SIG `-approvers` グループのタグ付与します
- ドキュメント承認者が PR を承認した後、[`sig-approval-missing`](https://github.com/open-telemetry/opentelemetry.io/labels/sig-approval-missing) ラベルを追加します。
  これにより SIG に対応を促します
  This signals to the SIG that they need to handle the PR.
- If no SIG approval is given within a certain grace period (two weeks in
  general, but may be less in urgent cases), docs maintainer may use their own
  judgement to merge that PR.

### ボットによる PR {#prs-from-bots}

ボットが作成した PR は以下の方法でマージできます。

- レジストリのバージョンを自動更新する PR は、即座に修正、承認、マージ可能です
- SDK、ゼロコード計装、またはコレクターのバージョンを自動更新する PR は、対応する SIG がマージを延期する必要があることを通知しない限り、承認およびマージできます
- PRs that auto-update the version of any specification often require updates to
  scripts for the CI checks to pass. In that case
  [@chalin](https://github.com/chalin/) will handle the PR. Otherwise those PRs
  can as well be approved and merged except the corresponding SIG signals that
  merging should be postponed.

### 翻訳 PR {#translation-prs}

翻訳の変更を含む PR は、2 人の承認を目指します。
1 人はドキュメント承認者で、1 人は翻訳承認者です。
共同所有 PR の手順と同様のプラクティスが適用されます。 Similar practices apply as suggested
for the co-owned PRs.

### Merging PRs

メンテナーは以下のワークフローを適用して PR をマージできます。

- PR がすべての承認を得ており、CI チェックが通っていることを確認します
- ブランチが最新でない場合、GitHub UI からリベースで更新を行います
- 更新により CI チェックが再実行されるため、チェックが成功するのを待つか、次のようなスクリプトを使用してバックグラウンドで実行します。

  ```shell
  export PR=<PR の ID>; gh pr checks ${PR} --watch && gh pr merge ${PR} --squash
  ```
