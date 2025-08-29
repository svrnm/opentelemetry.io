---
title: ডকার ডেপ্লয়মেন্ট
linkTitle: ডকার
aliases: [ docker_deployment ]
cSpell:ignore: otlphttp spanmetrics tracetest tracetesting
---

<!-- markdownlint-disable code-block-style ol-prefix -->

## পূর্বশর্ত {#prerequisites}

- ডকার
- [ডকার কম্পোজ](https://docs.docker.com/compose/install/) v2.0.0+
- Make (optional)
- অ্যাপ্লিকেশনের জন্য ৬ জিবি RAM

## ডেমো সংগ্রহ ও চালানো {#get-and-run-the-demo}

1. ডেমো রিপোজিটরি ক্লোন করুন:

    ```shell
    git clone https://github.com/open-telemetry/opentelemetry-demo.git
    ```

2. ডেমো ফোল্ডারে যান:

    ```shell
    cd opentelemetry-demo/
    ```

3. ডেমো চালু করুন[^1]:

       {{< tabpane text=true >}} {{% tab Make %}}

```shell
make start
```

    ```
    {{% /tab %}} {{% tab Docker %}}
    ```

```shell
docker compose up --force-recreate --remove-orphans --detach
```

    ```
    {{% /tab %}} {{< /tabpane >}}
    ```

4. (Optional) Enable API observability-driven testing[^1]:

    ```
    {{< tabpane text=true >}} {{% tab Make %}}
    ```

```shell
make run-tracetesting
```

    ```
    {{% /tab %}} {{% tab Docker %}}
    ```

```shell
docker compose -f docker-compose-tests.yml run traceBasedTests
```

    ```
    {{% /tab %}} {{< /tabpane >}}
    ```

## ওয়েব স্টোর ও টেলিমেট্রি যাচাই করুন {#verify-the-web-store-and-telemetry}

ইমেজগুলো বিল্ড হয়ে কন্টেইনারগুলো চালু হলে, আপনি অ্যাক্সেস করতে পারবেন:

- ওয়েব স্টোর: <http://localhost:8080/>
- Grafana: <http://localhost:8080/grafana/>
- লোড জেনারেটর UI: <http://localhost:8080/loadgen/>
- Jaeger UI: <http://localhost:8080/jaeger/ui/>
- Tracetest UI: <http://localhost:11633/>, শুধুমাত্র
  `make run-tracetesting` ব্যবহার করলে
- Flagd configurator UI: <http://localhost:8080/feature>

## ডেমোর প্রাইমারি পোর্ট নম্বর পরিবর্তন {#changing-the-demos-primary-port-number}

By default, the demo application will start a proxy for all browser traffic
bound to port 8080. To change the port number, set the `ENVOY_PORT` environment
variable before starting the demo.

- উদাহরণস্বরূপ, ৮০৮১ পোর্ট ব্যবহার করতে চাইলে[^1]:

    {{< tabpane text=true >}} {{% tab Make %}}

```shell
ENVOY_PORT=8081 make start
```

    ```
    {{% /tab %}} {{% tab Docker %}}
    ```

```shell
ENVOY_PORT=8081 docker compose up --force-recreate --remove-orphans --detach
```

    ```
    {{% /tab %}} {{< /tabpane >}}
    ```

## নিজের ব্যাকএন্ড ব্যবহার করুন {#bring-your-own-backend}

সম্ভবত আপনি ওয়েব স্টোরটি আগে থেকে বিদ্যমান একটি অবজার্ভেবিলিটি ব্যাকএন্ড
(যেমন, Jaeger, Zipkin, অথবা [আপনার পছন্দের ভেন্ডর](/ecosystem/vendors/))-এর
জন্য একটি ডেমো অ্যাপ্লিকেশন হিসেবে ব্যবহার করতে চাইছেন।

OpenTelemetry Collector can be used to export telemetry data to multiple
backends. By default, the collector in the demo application will merge the
configuration from two files:

- `otelcol-config.yml`
- `otelcol-config-extras.yml`

আপনার ব্যাকএন্ড যোগ করতে, ফাইলটি
[src/otel-collector/otelcol-config-extras.yml](https://github.com/open-telemetry/opentelemetry-demo/blob/main/src/otel-collector/otelcol-config-extras.yml)
এডিটরে খুলুন।

- Start by adding a new exporter. For example, if your backend supports OTLP
  over HTTP, add the following:

  ```yaml
  exporters:
    otlphttp/example:
      endpoint: <your-endpoint-url>
  ```

- এরপর, আপনার ব্যাকএন্ডের জন্য যেসব টেলিমেট্রি পাইপলাইনে `এক্সপোর্টার` ব্যবহার করতে চান,
  সেগুলো ওভাররাইড করুন।

  ```yaml
  service:
    pipelines:
      traces:
        exporters: [spanmetrics, otlphttp/example]
  ```

{{% alert title="Note" %}} When merging YAML values with the Collector, objects
are merged and arrays are replaced. The `spanmetrics` exporter must be included
in the array of exporters for the `traces` pipeline if overridden. Not including
this exporter will result in an error. {{% /alert %}}

Vendor backends might require you to add additional parameters for
authentication, please check their documentation. Some backends require
different exporters, you may find them and their documentation available at
[opentelemetry-collector-contrib/exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter).

After updating the `otelcol-config-extras.yml`, start the demo by running
`make start`. After a while, you should see the traces flowing into your backend
as well.

[^1]: {{% param notes.docker-compose-v2 %}}
