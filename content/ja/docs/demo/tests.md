---
title: テスト
cSpell:ignore: Tracetest
---

Currently, the repository includes E2E tests for both the frontend and backend
services. For the Frontend we are using [Cypress](https://www.cypress.io/) to
execute the different flows in the web store. While the backend services use
[AVA](https://avajs.dev) as the main testing framework for integration tests and
[Tracetest](https://tracetest.io/) for trace-based tests.

すべてのテストを実行する場合は、ルートディレクトリから `make run-tests` を実行します。

特定のテストスイートのみを実行したい場合は、テストの種類ごとに各種テストのコマンドを実行します[^1]:

- **フロントエンドのテスト**: `docker compose run frontendTests`
- **バックエンドのテスト**:
  - 統合テスト: `docker compose run integrationTests`
  - トレースベーステスト: `docker compose run traceBasedTests`

詳細な情報については、[Service Testing](https://github.com/open-telemetry/opentelemetry-demo/tree/main/test)を参照してください。

[^1]: {{% param notes.docker-compose-v2 %}}
