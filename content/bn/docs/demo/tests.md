---
title: টেস্ট
cSpell:ignore: Tracetest
---

Currently, the repository includes E2E tests for both the frontend and backend
services. For the Frontend we are using [Cypress](https://www.cypress.io/) to
execute the different flows in the web store. While the backend services use
[AVA](https://avajs.dev) as the main testing framework for integration tests and
[Tracetest](https://tracetest.io/) for trace-based tests.

সব টেস্ট একসাথে চালানোর জন্য, রুট ডিরেক্টরি থেকে `make run-tests` কমান্ডটি এক্সিকিউট করুন।

এছাড়া, নির্দিষ্ট কোনো টেস্ট চালাতে চাইলে, প্রতিটি টেস্টের জন্য নিচের কমান্ডগুলো ব্যবহার করতে পারেন[^1]:

- **ফ্রন্টএন্ড টেস্ট**: `docker compose run frontendTests`
- **ব্যাকএন্ড টেস্ট**:
  - ইন্টিগ্রেশন: `docker compose run integrationTests`
  - ট্রেস-ভিত্তিক: `docker compose run traceBasedTests`

এই টেস্টগুলো সম্পর্কে আরও বিস্তারিত জানতে [Service Testing](https://github.com/open-telemetry/opentelemetry-demo/tree/main/test) দেখুন।

[^1]: {{% param notes.docker-compose-v2 %}}
