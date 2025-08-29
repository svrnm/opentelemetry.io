---
title: 开发
cSpell:ignore: grpcio intellij libcurl libprotobuf nlohmann openssl protoc
---

[OpenTelemetry Demo GitHub 仓库](https://github.com/open-telemetry/opentelemetry-demo)

Development for this demo requires tooling in several programming languages.
Minimum required versions will be noted where possible, but it is recommended to
update to the latest version for all tooling. The OpenTelemetry demo team will
attempt to keep the services in this repository up to date with the latest
version for dependencies and tooling when possible.

## 生成 protobuf 文件 {#generate-protobuf-files}

提供了 `make generate-protobuf` 命令用于为所有服务生成 protobuf 文件。
这个命令可以在本地编译代码（无需 Docker），并在 IntelliJ 或 VS Code 等 IDE 中获得代码提示。
生成文件前，可能需要先在 frontend 源代码目录中运行 `npm install`。 This can be used to compile code locally (without Docker) and
receive hints from IDEs such as IntelliJ or VS Code. It may be necessary to run
`npm install` within the frontend source folder before generating the files.

## 开发工具要求 {#development-tooling-requirements}

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
