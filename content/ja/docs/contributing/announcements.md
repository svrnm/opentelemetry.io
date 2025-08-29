---
title: アナウンス
description: 特別なイベントのためのアナウンスやバナーを作成します。
weight: 50
---

アナウンスは、ロケールの `announcements` セクション内に含まれる _通常の Hugo ページ_ です。
これにより、Hugo の組み込み機能を活用して、ページの日付 (未来または期限切れ) の処理、国際化の管理などを行い、ビルドの日付によってバナーの表示や非表示を自動で切り替えたり、バナーの並び順を決定したり、英語バナーへのフォールバックを処理したりできます。 This means that we leverage Hugo's builtin handling of page
dates (future or expired), internationalization, and more, to automatically show
or hide banners depending on the build date, determine banner ordering, handle
fall back to English banners, etc.

> 現在、アナウンスはバナーとしてのみ使用されています。
> 将来的には、もう少し一般的なアナウンス機能をサポートする _可能性が_ あります。 We _might_ eventually
> support slightly more general announcements as well.

### アナウンスを作成する {#creating-an-announcement}

新しいアナウンスを追加するには、以下のコマンドを使用して、ローカリゼーションフォルダー内の `announcements` フォルダーに Markdown ファイルを作成します。

```sh
hugo new --kind announcement content/YOUR-LOCALE/announcements/announcement-file-name.md
```

Adjust according to your desired locale and file name. Add the announcement text
as the body of the page.

> バナーの場合、アナウンスの本文は短いフレーズにしてください。

{{% alert title="ローカリゼーションについて" %}}

**ローカル固有のアナウンスを上書きする場合** は、英語版のアナウンスと **同じファイル名** を使用してください。

{{% /alert %}}

### アナウンス一覧 {#announcement-list}

各アナウンスは、ビルドの日付が `date` フィールドと `expiryDate` フィールドの間にある場合にサイトのビルドに含まれます。
これらのフィールドが省略された場合、それぞれ「現在」と「無期限」と見なされます。 When those
fields are missing they are assumed to be "now" and "forever", respectively.

Announcements will appear in the standard page order as determined using Hugo's
[Regular pages](https://gohugo.io/methods/site/regularpages/) function. That is,
the "lightest" announcements (by `weight`) will appear first; when weights are
the same or unspecified, the most recent announcements (by `date`) will appear
first, etc.

したがって、アナウンスを最上位に固定したい場合は、
フロントマターで `weight` に負の値を設定してください。

このリポジトリの内容にバグや問題を発見した場合、または改善をリクエストしたい場合は、[ドキュメントのイシューを作成][new-issue] してください。

セキュリティ上の問題を発見した場合は、イシューを作成する前に[セキュリティポリシー](https://github.com/open-telemetry/opentelemetry.io/security/policy) を確認してください。

新しいイシューを報告する前に、[イシューのリスト](https://github.com/open-telemetry/opentelemetry.io/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc)を検索することで、既に報告されているか修正されていないかを確認してください。

When creating a new issue, include a short, meaningful title and a clear
description. Add as much relevant information as you can, and, if possible, a
test case.

[new-issue]: https://github.com/open-telemetry/opentelemetry.io/issues/new/choose
