---
title: 開発環境
cSpell:ignore: grpcio intellij libcurl libprotobuf nlohmann openssl protoc
---

[OpenTelemetry デモ GitHub リポジトリ](https://github.com/open-telemetry/opentelemetry-demo)

Development for this demo requires tooling in several programming languages.
Minimum required versions will be noted where possible, but it is recommended to
update to the latest version for all tooling. The OpenTelemetry demo team will
attempt to keep the services in this repository up to date with the latest
version for dependencies and tooling when possible.

## Protocol Buffers ファイルの生成 {#generate-protobuf-files}

すべてのサービスに対応する protobuf ファイルを生成するための `make generate-protobuf` コマンドが提供されています。
このコマンドにより、（Dockerを使用せず）ローカルでのコードのコンパイルを行うことができ、IntelliJやVS CodeなどのIDEからのヒントを確認することができます。
ファイル生成前にフロントエンドのソースフォルダで `npm install` の実行が必要な場合があります。 This can be used to compile code locally (without Docker) and
receive hints from IDEs such as IntelliJ or VS Code. It may be necessary to run
`npm install` within the frontend source folder before generating the files.

## 必要な開発ツール {#development-tooling-requirements}

### .NET

- .NET 8.0+

### C++

- build-essential
- cmake
- libcurl4-openssl-dev
- libprotobuf-dev
- nlohmann-json3-dev
- pkg-config
- protobuf-compiler

### Go

- Go 1.19+
- protoc-gen-go
- protoc-gen-go-grpc

### Java

- JDK 17+
- Gradle 7+

### JavaScript

- Node.js 16+

### PHP

- PHP 8.1+
- Composer 2.4+

### Python

- Python 3.10
- grpcio-tools 1.48+

### Ruby

- Ruby 3.1+

### Rust

- Rust 1.61+
- protoc 3.21+
- protobuf-dev
