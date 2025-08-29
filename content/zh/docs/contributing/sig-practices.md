---
title: SIG 审批者与维护者的实践指南
linkTitle: SIG 实践
description: 了解审批者和维护者如何管理 Issue 和贡献内容。
weight: 999
cSpell:ignore: chalin Comms docsy
---

本页包含审批者与维护者使用的指南和一些通用实践。

## Onboarding

当贡献者希望承担更大责任的角色（如成为文档的审批者或维护者）时，
现有的审批者与维护者会负责引导他们完成入职流程：

- 他们将被添加到 `docs-approvers`（或 `docs-maintainers`）组中。
- They are added to the `#otel-comms` and `#otel-maintainers` and private
  in-team slack channels.
- [SIG Comms 会议](https://groups.google.com/a/opentelemetry.io/g/calendar-comms)
- 他们需要确认当前 SIG Comms 的会议时间是否适合自己；
  如果不适合，应与现有的审批者和维护者协商，找出对大家都合适的时间。
- 他们需要查看并熟悉为贡献者提供的各类资源：
  - [社区资源](https://github.com/open-telemetry/community/)，
    特别是关于[社区成员制度](https://github.com/open-telemetry/community/blob/main/community-membership.md)的文档以及
    [社交媒体指南](https://github.com/open-telemetry/community/blob/main/social-media-guide.md)。
  - [Contributing Guidelines](/docs/contributing) As part of this, they will
    review those documents and provide feedback for improving them via issues or
    pull requests.

其他值得阅读的重要资源包括：

- [Hugo 文档](https://gohugo.io/documentation/)
- [Docsy 文档](https://www.docsy.dev/docs/)
- [市场推广指南](/community/marketing-guidelines/)，其中包括
  Linux 基金的品牌指南与[商标使用指南](https://www.linuxfoundation.org/legal/trademark-usage)。
  这些指南在审查镜像仓库、集成内容、厂商、采用者或发行版时尤其重要。
  Those are especially valuable when reviewing entries to the registry,
  integrations, vendors, adopters or distributions.

## 协作原则 {#collaboration}

- Approvers and maintainers have different work schedules and circumstances.
  That's why all communication is assumed to be asynchronous and they should not
  feel obligated to reply outside of their normal schedule.
- 如果审批者或维护者将在较长时间内（几天或一周以上）无法参与贡献，应在
  [#otel-comms](https://cloud-native.slack.com/archives/C02UN96HZH6)
  频道中说明，并更新 GitHub 的状态。
- 审批者和维护者应遵守
  [OTel 行为准则](https://github.com/open-telemetry/community/?tab=coc-ov-file#opentelemetry-community-code-of-conduct)
  和[社区价值观](/community/mission/#community-values)。
  他们应对贡献者保持友好与支持。若出现冲突、误解或任何使审批者/维护者感到不适的情况，
  他们可以选择退出相关讨论、Issue 或 PR，并请求其他人接手。 They are
  friendly and helpful towards contributors. In the case of a conflict,
  misunderstanding or any other kind of situation that makes an
  approver/maintainer feel uncomfortable they can step back from a conversation,
  issue or PR and ask another approver/maintainer to step in.

## 代码审查 {#code-reviews}

### General

- 如果 PR 分支 `落后于主分支（out-of-date with the base branch）`，不需要频繁更新，
  因为每次更新都会触发所有 CI 检查。通常只需在合并前更新即可。
  It's often enough to update them before merging.
- A PR by non-maintainers should **never** update git sub modules. This happens
  by accident from time to time. Let the PR author know that they should not
  worry about it, we will fix this before merging, but in the future they should
  make sure that they work from an up-to-date fork.
- 如果贡献者在签署 CLA 或提交中误用了错误的邮箱地址，应请他们修复该问题或重新 rebase PR。
  最坏情况是关闭并重新打开 PR 来触发 CLA 检查。 Worst case scenario, close and re-open the PR to trigger a new
  CLA check.
- PR 作者应将 cspell 无法识别的词添加到每页的忽略列表中。只有审批者和维护者可将常用术语添加到全局忽略列表。 Only approvers and maintainers will add commonly used terms to the
  global list.

### 联合拥有的 PR {#co-owned-prs}

对于由 SIG 与文档组共同拥有的 PR（例如 collector、demo、某语言相关文档），
建议获得两个审批：一位文档审批者和一位 SIG 审批者。 should aim for two approvals: one by a docs approver and
one by a SIG approver:

- 文档审批者应为此类 PR 添加 `sig:<name>` 标签，并在 PR 中 @ 提及该 SIG 的 `-approvers` 组。
- 在文档审批者完成审查并同意合并后，可添加标签
  [`sig-approval-missing`](https://github.com/open-telemetry/opentelemetry.io/labels/sig-approval-missing)，
  表示该 PR 需要由对应 SIG 进一步审查。
  This signals to the SIG that they need to handle the PR.
- If no SIG approval is given within a certain grace period (two weeks in
  general, but may be less in urgent cases), docs maintainer may use their own
  judgement to merge that PR.

### 来自机器人的 PR {#prs-from-bots}

针对机器人创建的 PR，可以采用以下处理流程：

- 自动更新注册表中版本号的 PR 可直接修复、审批并合并。
- 自动更新 SDK、零代码接入方式或 collector 的 PR
  可审批合并，除非相关 SIG 明确表示应延迟合并。
- 自动更新规范（spec）的 PR 往往需要修改脚本才能通过 CI
  检查。此类 PR 通常由 [@chalin](https://github.com/chalin/) 处理。
  若无需脚本更改，仍可审批合并，除非对应 SIG 要求延迟。 In that case
  [@chalin](https://github.com/chalin/) will handle the PR. Otherwise those PRs
  can as well be approved and merged except the corresponding SIG signals that
  merging should be postponed.

### 翻译类 PR {#translation-prs}

涉及翻译更新的 PR 应获得两位审批者的批准：
一位文档审批者和一位翻译审批者。其处理流程与联合拥有的 PR 类似。 Similar practices apply as suggested
for the co-owned PRs.

### Merging PRs

维护者可使用如下流程合并 PR：

- 确保 PR 获得所有必要的审批，且所有 CI 检查均通过。
- 如果分支落后，可通过 GitHub UI 执行 rebase 更新。
- 更新后 CI 会重新运行，等待其通过，或者使用如下脚本在后台完成合并：

  ```shell
  export PR=<PR 的 ID>; gh pr checks ${PR} --watch && gh pr merge ${PR} --squash
  ```
