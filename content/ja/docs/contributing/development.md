---
title: 開発環境のセットアップとビルド、サーブなどのコマンド
linkTitle: 開発環境セットアップなど
description: この Web サイトの開発環境をセットアップする方法を学びます。
what-next: |
  これで、[ビルド](#build)、[サーブ](#serve)、Web サイトファイルの更新を行う準備が整いました。 変更の提出方法の詳細については、[コンテンツの提出][Submitting content]を参照してください。
   For details on how to submit changes, see [Submitting content][].
weight: 60
---

{{% alert title="サポートされているビルド環境" color=warning %}}

ビルドは Linux ベースの環境と macOS で公式にサポートされています。
[DevContainers](#devcontainers) などの他の環境は、ベストエフォートベースでサポートされています。
Windows でのビルドについては、Windows Subsystem for Linux コマンドライン [WSL][windows-wsl] を使用して Linux と同様の手順に従うことができます。 Other
environments, such as [DevContainers](#devcontainers), are supported on a
best-effort basis. For builds on Windows, you can follow steps similar to those
for Linux using Windows Subsystem for Linux command line [WSL][windows-wsl].

{{% /alert %}}

以下の手順では、この Web サイトの開発環境をセットアップする方法を説明します。

## クラウド IDE のセットアップ {#cloud-ide-setup}

### Gitpod {#gitpod}

[Gitpod.io] で作業する手順は以下です。

1. Fork this repository. このリポジトリをフォークします。詳細は [リポジトリのフォーク方法][fork] を参照してください。
2. [gitpod.io/workspaces] から新しいワークスペースを作成する（初回のみ）か、フォークしたリポジトリ上の既存のワークスペースを開きます。
   また、次の形式のリンクを開くこともできます。
   `https://gitpod.io#https://github.com/YOUR_GITHUB_ID/opentelemetry.io` You can also visit a link of the
   form:
   `https://gitpod.io#https://github.com/YOUR_GITHUB_ID/opentelemetry.io`.

   > **注記**: このリポジトリで作業するための権限がある場合や、単に内容を確認したい場合は、
   > <https://gitpod.io/#https://github.com/open-telemetry/opentelemetry.io> を開いてください。

Gitpod はリポジトリ固有のパッケージを自動的にインストールします。
{{% param what-next %}}
{{% param what-next %}}

### Codespaces {#codespaces}

GitHub [Codespaces] で作業するには、下記にしたがってください。

1. Web サイトのリポジトリを[フォーク][fork]します。
2. フォークから Codespace を開きます。

開発環境は [DevContainer](#devcontainers) 設定を介して初期化されます。{{% param what-next %}} {{% param what-next %}}

## ローカルセットアップ {#local-setup}

1. <{{% param github\_repo %}}> でWeb サイトのリポジトリ[フォーク][fork]した後に、[クローン][clone]します。

2. リポジトリのディレクトリに移動します。

    ```sh
    cd opentelemetry.io
    ```

3. Node.js の [**Active LTS** リリース][nodejs-rel] をインストールまたはアップグレードします。
   Node.js インストレーションの管理には [nvm] の使用を推奨します。
   Linux では以下のコマンドを実行してください。
   .nvmrc ファイルで指定されたバージョンにインストールとアップグレードします。
   We recommend using [nvm] to manage your Node installation. Under Linux, run
   the following command, which will install and upgrade to the version
   specified in the .nvmrc file:

    ```sh
    nvm install
    ```

   Windows で [インストールする場合][nodejs-win] は、[nvm-windows] を使用してください。
   `cmd` を使用し、Windows PowerShell を使用しないことをお勧めします。 We recommend
   using `cmd` and not Windows PowerShell for the command below:

    ```cmd
    nvm install lts && nvm use lts
    ```

4. npm パッケージとその他の依存関係をインストールします。

    ```sh
    npm install
    ```

お好みの IDE を起動してください。{{% param what-next %}} {{% param what-next %}}

### ビルド {#build}

サイトをビルドするには、次のコマンドを実行します。

```sh
npm run build
```

生成されたサイトのファイルは `public` ディレクトリ内にあります。

### Serve

サイトをサーブするには、次のコマンドを実行します。

```sh
npm run serve
```

サイトは [localhost:1313][] でサーブされます。

[Netlify] のリダイレクトをテストする必要がある場合は、次のコマンドを実行し、[localhost:8888] にアクセスしてください。

```sh
npm run serve:netlify
```

この `serve` コマンドは、ディスクではなくメモリ上のファイルを提供します。

macOS で `too many open files` や `pipe failed` というエラーが発生する場合は、ファイルディスクリプタの制限を増やす必要があるかもしれません。
詳しくは [Hugo のイシューの #6109](https://github.com/gohugoio/hugo/issues/6109) を参照してください。 See
[Hugo issue #6109](https://github.com/gohugoio/hugo/issues/6109).

### コンテンツとサブモジュール {#content-and-submodules}

Web サイトは以下のコンテンツを基に構築されます。

- `content/`、`static/` などの [Hugo] のデフォルトディレクトリ
- Mount points, defined in [hugo.yaml] under `mounts`. [hugo.yaml] の `mounts` で定義されたマウントポイント。マウントは [content-modules] の Git サブモジュールから直接取得される場合や、`content-modules` から前処理されたコンテンツ（`tmp/` に配置）の場合があり、それ以外の場所からは取得されません。

[hugo.yaml]: https://github.com/open-telemetry/opentelemetry.io/blob/main/hugo.yaml
[content-modules]: https://github.com/open-telemetry/opentelemetry.io/tree/main/content-modules

### サブモジュールの変更 {#submodule-changes}

[content-modules] のサブモジュール内のコンテンツを変更する場合は、まずそのサブモジュールのリポジトリに対して PR（サブモジュールの変更を含む）を送信する必要があります。
サブモジュールの PR が承認された後にのみ、サブモジュールを更新し、この Web サイトに変更を反映できます。 Only after the submodule PR has been accepted, can you update the
submodule and have the changes appear in this website.

これは、サブモジュールそのものを更新するよりも、対応するサブモジュールの元のリポジトリで作業することが、`content-modules` の変更を管理する最も簡単な方法です。

Expert contributors can work directly in the submodule. You are then able to
directly build and serve your (submodule) changes. By default, the CI scripts
get submodules on every invocation. To prevent this behavior while you work
within a submodule, set the environment variable `GET=no`. You also need to run
`git fetch --unshallow` the submodule before you can submit a PR. Alternatively,
set `DEPTH=100` and re-fetch submodules.

## DevContainer サポート {#devcontainers}

このリポジトリは [Development Containers][devcontainers] での使用に設定されています。DevContainerは以下のようなさまざまなクラウドおよびローカル IDE でサポートされています（アルファベット順）。

- [Codespaces][cs-devc]
- [DevPod](https://devpod.sh/docs/developing-in-workspaces/devcontainer-json)
- [Gitpod](https://www.gitpod.io/docs/flex/configuration/devcontainer/overview)
- [VSCode](https://code.visualstudio.com/docs/devcontainers/containers#_installation)

[clone]: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository
[codespaces]: https://docs.github.com/en/codespaces
[cs-devc]: https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers#about-dev-containers
[devcontainers]: https://containers.dev/
[fork]: https://docs.github.com/en/get-started/quickstart/fork-a-repo
[gitpod.io]: https://gitpod.io
[gitpod.io/workspaces]: https://gitpod.io/workspaces
[hugo]: https://gohugo.io
[localhost:1313]: http://localhost:1313
[localhost:8888]: http://localhost:8888
[netlify]: https://netlify.com
[nodejs-rel]: https://nodejs.org/en/about/previous-releases
[nodejs-win]: https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows
[nvm]: https://github.com/nvm-sh/nvm/blob/master/README.md#installing-and-updating
[nvm-windows]: https://github.com/coreybutler/nvm-windows
[windows-wsl]: https://learn.microsoft.com/en-us/windows/wsl/install

<!-- markdownlint-disable link-image-reference-definitions -->

[Submitting content]: ../pull-requests/
