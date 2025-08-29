---
title: কুবারনেটিস ডেপ্লয়মেন্ট
linkTitle: কুবারনেটিস
aliases: [ kubernetes_deployment ]
cSpell:ignore: loadgen otlphttp spanmetrics
---

আমরা একটি
[OpenTelemetry ডেমো Helm চার্ট](/docs/platforms/kubernetes/helm/demo/) প্রদান করি,
যা বিদ্যমান কুবারনেটিস ক্লাস্টারে ডেমোটি ডিপ্লয় করতে সহায়তা করে।

[Helm](https://helm.sh) must be installed to use the charts. Please refer to
Helm's [documentation](https://helm.sh/docs/) to get started.

## প্রয়োজনীয়তা {#prerequisites}

- Kubernetes 1.24+
- অ্যাপ্লিকেশনের জন্য ৬ জিবি ফ্রি RAM
- Helm 3.14+ (শুধুমাত্র Helm ইনস্টলেশন পদ্ধতির জন্য)

## Helm ব্যবহার করে ইনস্টল করুন (সুপারিশকৃত) {#install-using-helm-recommended}

OpenTelemetry Helm রিপোজিটরি যোগ করুন:

```shell
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
```

my-otel-demo রিলিজ নামে চার্ট ইনস্টল করতে, নিচের
কমান্ডটি চালান:

```shell
helm install my-otel-demo open-telemetry/opentelemetry-demo
```

{{% alert title="নোট" %}}

The OpenTelemetry Demo Helm chart does not support being upgraded from one
version to another. If you need to upgrade the chart, you must first delete the
existing release and then install the new version.

{{% /alert %}}

{{% alert title="নোট" %}}

নিচে উল্লেখিত সকল ইউসেজ মেথডস পারফর্ম করার জন্য OpenTelemetry ডেমো
Helm চার্টের সংস্করণ 0.11.0 বা তার বেশি ভার্সন প্রয়োজন।

{{% /alert %}}

## kubectl ব্যবহার করে ইনস্টল করুন {#install-using-kubectl}

নিম্নলিখিত কমান্ডটি আপনার কুবারনেটিস ক্লাস্টারে ডেমো অ্যাপ্লিকেশন
ইনস্টল করবে।

```shell
kubectl create --namespace otel-demo -f https://raw.githubusercontent.com/open-telemetry/opentelemetry-demo/main/kubernetes/opentelemetry-demo.yaml
```

{{% alert title="নোট" %}}

The OpenTelemetry Demo Kubernetes manifests do not support being upgraded from
one version to another. If you need to upgrade the demo, you must first delete
the existing resources and then install the new version.

{{% /alert %}}

{{% alert title="নোট" %}}

These manifests are generated from the Helm chart and are provided for
convenience. It is recommended to use the Helm chart for installation.

{{% /alert %}}

## ডেমো ব্যবহার করুন {#use-the-demo}

The demo application will need the services exposed outside of the Kubernetes
cluster in order to use them. You can expose the services to your local system
using the `kubectl port-forward` command or by configuring service types (ie:
LoadBalancer) with optionally deployed ingress resources.

### kubectl port-forward ব্যবহার করে সার্ভিস এক্সপোজ করুন {#expose-services-using-kubectl-port-forward}

frontend-proxy সার্ভিস এক্সপোজ করতে নিচের কমান্ডটি ব্যবহার করুন (আপনার
Helm চার্ট রিলিজ namespace অনুযায়ী `default` পরিবর্তন করুন):

```shell
kubectl --namespace default port-forward svc/frontend-proxy 8080:8080
```

{{% alert title="নোট" %}}

`kubectl port-forward` proxies the port until the process terminates. You might
need to create separate terminal sessions for each use of
`kubectl port-forward`, and use <kbd>Ctrl-C</kbd> to terminate the process when
done.

{{% /alert %}}

`frontend-proxy` port-forward সেটআপ করার পর, আপনি নিচের ঠিকানাগুলো-তে যেতে পারবেন:

- ওয়েব স্টোর: <http://localhost:8080/>
- Grafana: <http://localhost:8080/grafana/>
- লোড জেনারেটর UI: <http://localhost:8080/loadgen/>
- Jaeger UI: <http://localhost:8080/jaeger/ui/>
- Flagd configurator UI: <http://localhost:8080/feature>

### সার্ভিস বা ইনগ্রেস কনফিগারেশন ব্যবহার করে ডেমো কম্পোনেন্ট এক্সপোজ করুন {#expose-demo-components-using-service-or-ingress-configurations}

{{% alert title="Note" %}} We recommend that you use a values file when
installing the Helm chart in order to specify additional configuration options.
{{% /alert %}}

#### ইনগ্রেস রিসোর্স কনফিগার করুন {#configure-ingress-resources}

{{% alert title="নোট" %}}

Kubernetes clusters might not have the proper infrastructure components to
enable LoadBalancer service types or ingress resources. Verify your cluster has
the proper support before using these configuration options.

{{% /alert %}}

Each demo component (ie: frontend-proxy) offers a way to have its Kubernetes
service type configured. By default, these will not be created, but you can
enable and configure them through the `ingress` property of each component.

একটি ইনগ্রেস রিসোর্স ব্যবহার করার জন্য frontend-proxy কম্পোনেন্ট কনফিগার করতে
আপনাকে আপনার values ফাইলে নিচের মতো নির্দিষ্ট করতে হবে:

```yaml
components:
  frontend-proxy:
    ingress:
      enabled: true
      annotations: {}
      hosts:
        - host: otel-demo.my-domain.com
          paths:
            - path: /
              pathType: Prefix
              port: 8080
```

Some ingress controllers require special annotations or service types. Refer to
the documentation from your ingress controller for more information.

#### সার্ভিস টাইপ কনফিগার করুন {#configure-service-types}

Each demo component (ie: frontend-proxy) offers a way to have its Kubernetes
service type configured. By default, these will be `ClusterIP` but you can
change each one using the `service.type` property of each component.

LoadBalancer সার্ভিস টাইপ ব্যবহার করার জন্য frontend-proxy কম্পোনেন্ট কনফিগার করতে
আপনাকে আপনার values ফাইলে নিচের মতো উল্লেখ করতে হবে:

```yaml
components:
  frontend-proxy:
    service:
      type: LoadBalancer
```

#### ব্রাউজার টেলিমেট্রি কনফিগার করুন {#configure-browser-telemetry}

In order for spans from the browser to be properly collected, you will also need
to specify the location where the OpenTelemetry Collector is exposed. The
frontend-proxy defines a route for the collector with a path prefix of
`/otlp-http`. You can configure the collector endpoint by setting the following
environment variable on the frontend component:

```yaml
components:
  frontend:
    envOverrides:
      - name: PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
        value: http://otel-demo.my-domain.com/otlp-http/v1/traces
```

## নিজের ব্যাকএন্ড ব্যবহার করুন {#bring-your-own-backend}

সম্ভবত আপনি ওয়েব স্টোরটিকে আপনার ইতিমধ্যেই থাকা একটি অবজারভেবিলিটি ব্যাকএন্ডের
জন্য একটি ডেমো অ্যাপ্লিকেশন হিসাবে ব্যবহার করতে চান (যেমন, Jaeger, Zipkin - এর
একটি), অথবা [আপনার পছন্দের ভেন্ডর](/ecosystem/vendors/) এর কোনোটি।

The OpenTelemetry Collector's configuration is exposed in the Helm chart. Any
additions you do will be merged into the default configuration. You can use this
to add your own exporters, and add them to the desired pipeline(s)

```yaml
opentelemetry-collector:
  config:
    exporters:
      otlphttp/example:
        endpoint: <your-endpoint-url>

    service:
      pipelines:
        traces:
          exporters: [spanmetrics, otlphttp/example]
```

{{% alert title="Note" %}} When merging YAML values with Helm, objects are
merged and arrays are replaced. The `spanmetrics` exporter must be included in
the array of exporters for the `traces` pipeline if overridden. Not including
this exporter will result in an error. {{% /alert %}}

Vendor backends might require you to add additional parameters for
authentication, please check their documentation. Some backends require
different exporters, you may find them and their documentation available at
[opentelemetry-collector-contrib/exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter).

একটি কাস্টম `my-values-file.yaml` values ফাইল সহ Helm চার্ট ইনস্টল করতে ব্যবহার করুন:

```shell
helm install my-otel-demo open-telemetry/opentelemetry-demo --values my-values-file.yaml
```
