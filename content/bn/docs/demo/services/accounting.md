---
title: হিসাবরক্ষণ সার্ভিস
linkTitle: হিসাবরক্ষণ
aliases: [ accountingservice ]
---

This service calculates the total amount of sold products. This is only mocked
and received orders are printed out.

[হিসাবরক্ষণ সার্ভিস](https://github.com/open-telemetry/opentelemetry-demo/blob/main/src/accounting/)

## স্বয়ংক্রিয় ইন্সট্রুমেন্টেশন (#auto-instrumentation)

This service relies on the OpenTelemetry .NET Automatic Instrumentation to
automatically instrument libraries such as Kafka, and to configure the
OpenTelemetry SDK. The instrumentation is added via Nuget package
[OpenTelemetry.AutoInstrumentation](https://www.nuget.org/packages/OpenTelemetry.AutoInstrumentation)
and activated using environment variables that are sourced from `instrument.sh`.
Using this installation approach also guarantees that all instrumentation
dependencies are properly aligned with the application.

## প্রকাশনা (#publishing)

উপযুক্ত নেটিভ রানটাইম কম্পোনেন্ট বিতরণের জন্য `dotnet publish` কমান্ডে `--use-current-runtime` যুক্ত করুন।

```sh
dotnet publish "./AccountingService.csproj" --use-current-runtime -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
```
