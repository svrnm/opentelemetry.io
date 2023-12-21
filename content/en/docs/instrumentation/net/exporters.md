---
title: Exporters
weight: 50
description: Process and export your telemetry data
---

{{% docs/instrumentation/exporters-intro dotnet %}}

{{% alert title="Note" color="info" %}}

If you use the OpenTelemetry .NET Automatic Instrumentation for
[automatic instrumentation](/docs/instrumentation/net/automatic) you can learn
how to setup exporters following the
[Configuration Guide](/docs/instrumentation/net/automatic/config)

{{% /alert %}}

## OTLP

### Collector Setup

{{% alert title="Note" color="info" %}}

If you have a OTLP collector or backend already set up, you can skip this
section and [setup the OTLP exporter dependencies](#otlp-dependencies) for your
application.

{{% /alert %}}

To try out and verify your OTLP exporters, you can run the collector in a docker
container that writes telemetry directly to the console.

In an empty directory, create a file called `collector-config.yaml` with the
following content:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
exporters:
  debug:
    verbosity: detailed
service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [debug]
    metrics:
      receivers: [otlp]
      exporters: [debug]
    logs:
      receivers: [otlp]
      exporters: [debug]
```

Now run the collector in a docker container:

```shell
docker run -p 4317:4317 -p 4318:4318 --rm -v $(pwd)/collector-config.yaml:/etc/otelcol/config.yaml otel/opentelemetry-collector
```

This collector is now able to accept telemetry via OTLP. Later you may want to
[configure the collector](/docs/collector/configuration) to send your telemetry
to your observability backend.

### Dependencies {#otlp-dependencies}

If you want to send telemetry data to an OTLP endpoint (like the
[OpenTelemetry Collector](#collector-setup), [Jaeger](#jaeger) or
[Prometheus](#prometheus)), you can choose between three different protocols to
transport your data:

- HTTP/protobuf
- gRPC

Start by installing the respective exporter packages as a dependency for your
project:

```sh
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
dotnet add package OpenTelemetry.Extensions.Hosting
```

### Usage

Next, configure the exporter to point at an OTLP endpoint. If you're using
ASP.NET Core, configure the exporter in your ASP.NET Core services:

{{< tabpane text=true >}} {{% tab "HTTP/Proto" %}}

```csharp
   using OpenTelemetry.Logs;
   using OpenTelemetry.Metrics;
   using OpenTelemetry.Resources;
   using OpenTelemetry.Trace;

   var builder = WebApplication.CreateBuilder(args);

   const string serviceName = "roll-dice";

   builder.Logging.AddOpenTelemetry(options =>
   {
       options
           .SetResourceBuilder(
               ResourceBuilder.CreateDefault()
                   .AddService(serviceName))
           .AddOtlpExporter(opt => {
              opt.Protocol = OtlpExportProtocol.HttpProtobuf;
           });
   });
   builder.Services.AddOpenTelemetry()
         .ConfigureResource(resource => resource.AddService(serviceName))
         .WithTracing(tracing => tracing
             .AddAspNetCoreInstrumentation()
             .AddOtlpExporter(opt => {
                opt.Protocol = OtlpExportProtocol.HttpProtobuf;
           }))
         .WithMetrics(metrics => metrics
             .AddAspNetCoreInstrumentation()
             .AddOtlpExporter(opt => {
                opt.Protocol = OtlpExportProtocol.HttpProtobuf;
           }));

   var app = builder.Build();
```

{{% /tab %}} {{% tab gRPC %}}

```csharp
   using OpenTelemetry.Logs;
   using OpenTelemetry.Metrics;
   using OpenTelemetry.Resources;
   using OpenTelemetry.Trace;

   var builder = WebApplication.CreateBuilder(args);

   const string serviceName = "roll-dice";

   builder.Logging.AddOpenTelemetry(options =>
   {
       options
           .SetResourceBuilder(
               ResourceBuilder.CreateDefault()
                   .AddService(serviceName))
           .AddOtlpExporter(opt => {
              opt.Protocol = OtlpExportProtocol.Grpc;
           });
   });
   builder.Services.AddOpenTelemetry()
         .ConfigureResource(resource => resource.AddService(serviceName))
         .WithTracing(tracing => tracing
             .AddAspNetCoreInstrumentation()
             .AddOtlpExporter(opt => {
                opt.Protocol = OtlpExportProtocol.Grpc;
           }))
         .WithMetrics(metrics => metrics
             .AddAspNetCoreInstrumentation()
             .AddOtlpExporter(opt => {
                opt.Protocol = OtlpExportProtocol.Grpc;
           }));

   var app = builder.Build();
```

We recommend, to use environment variables to set values like headers and an endpoint URL for
production.

If you're not using ASP.NET Core, configure the exporter when creating a tracer provider:

```csharp
using var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddOtlpExporter(opt =>
    {
        opt.Endpoint = new Uri("your-endpoint-here/v1/traces");
        opt.Protocol = OtlpExportProtocol.HttpProtobuf;
    })

    // Other setup code, like setting a resource goes here too

    .Build();
```

{% alert title="Note" color="primary" %}

Note: Versions below .NET 6 are not officially supported by
OpenTelemetry .NET, therefore this section is here to help, but may not work
as the library progresses.

If you're not using ASP.NET Core gRPC and you are running on .NET Core 3.x,
you'll need to add the following at application startup

```csharp
AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
```

If you are using .NET 5 or higher, the previous code sample is not required.

{{% /alert %}}

## Console exporter

To debug your instrumentation or see the values locally in development, you can
use exporters writing telemetry data to the console (stdout).

If you followed the
[Getting Started](/docs/instrumentation/js/getting-started/nodejs/) or
[Manual Instrumentation](/docs/instrumentation/js/manual) guides, you already
have the console exporter installed.

The `ConsoleSpanExporter` is included in the [`OpenTelemetry.Exporter.Console`](https://www.nuget.org/packages/OpenTelemetry.Exporter.Console) package.

## Jaeger

[Jaeger](https://www.jaegertracing.io/) natively supports OTLP to receive trace
data. You can run Jaeger in a docker container with the UI accessible on port
16686 and OTLP enabled on ports 4317 and 4318:

```shell
docker run --rm \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 9411:9411 \
  jaegertracing/all-in-one:latest
```

Now following the instruction to setup the [OTLP exporters](#otlp-dependencies).

## Prometheus

To send your metric data to [Prometheus](https://prometheus.io/), you can either
[enable Prometheus' OTLP Receiver](https://prometheus.io/docs/prometheus/latest/feature_flags/#otlp-receiver)
and use the [OTLP exporter](#otlp) or you can use the `PrometheusExporter`.

### Backend Setup {#prometheus-setup}

{{% alert title="Note" color="info" %}}

If you have Prometheus or a Prometheus-compatible backend already set up, you
can skip this section and setup the [Prometheus](#prometheus-dependencies) or
[OTLP](#otlp-dependencies) exporter dependencies for your application.

{{% /alert %}}

You can run [Prometheus](https://prometheus.io) in a docker container,
accessible on port `9090` by following these instructions:

Create a file called `prometheus.yml` with the following content:

```yaml
scrape_configs:
  - job_name: dice-service
    scrape_interval: 5s
    static_configs:
      - targets: [host.docker.internal:9464]
```

Run Prometheus in a docker container with the UI accessible on port `9090`:

```shell
docker run --rm -v ${PWD}/prometheus.yml:/prometheus/prometheus.yml -p 9090:9090 prom/prometheus --enable-feature=otlp-write-receive
```

{{% alert title="Note" color="info" %}}

When using Prometheus' OTLP Receiver, make sure that you set the OTLP endpoint
for metrics in your application to `http://localhost:9090/api/v1/otlp`.

Not all docker environments support `host.docker.internal`. In some cases you
may need to replace `host.docker.internal` with `localhost` or the IP address of
your machine.

{{% /alert %}}

### Dependencies {#prometheus-dependencies}

### ASP.NET

Install the [exporter package](https://www.nuget.org/packages/OpenTelemetry.Exporter.Prometheus.AspNetCore) as a dependency for your application:

```shell
dotnet add package OpenTelemetry.Exporter.Prometheus.AspNetCore --version 1.4.0-rc.4
dotnet add package OpenTelemetry.Extensions.Hosting
```

Update your OpenTelemetry configuration to use the exporter and to send data to
your Prometheus backend:

```csharp
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

const string serviceName = "roll-dice";

builder.Logging.AddOpenTelemetry(options =>
{
    options
        .SetResourceBuilder(
            ResourceBuilder.CreateDefault()
                .AddService(serviceName))
        .AddOtlpExporter(opt => {
          opt.Protocol = OtlpExportProtocol.Grpc;
        });
});
builder.Services.AddOpenTelemetry()
      .ConfigureResource(resource => resource.AddService(serviceName))
      .WithTracing(tracing => tracing
          .AddAspNetCoreInstrumentation()
          .AddOtlpExporter(opt => {
            opt.Protocol = OtlpExportProtocol.Grpc;
        }))
      .WithMetrics(metrics => metrics
          .AddAspNetCoreInstrumentation()
          .AddPrometheusExporter()
      );

var app = builder.Build();

// You'll then need to add the endpoint so that Prometheus can scrape your site.
// You can do this using the `IAppBuilder` extension like this:
app.UseOpenTelemetryPrometheusScrapingEndpoint();

await app.RunAsync();
```

### Non-ASP.NET Core

For applications not using ASP.NET Core, you can use the `HttpListener` version
which is available in a different package:

```shell
dotnet add package OpenTelemetry.Exporter.Prometheus.HttpListener
```

Then this is setup directly on the `MeterProviderBuilder`:

```csharp
var meterProvider = Sdk.CreateMeterProviderBuilder()
    .AddMeter(MyMeter.Name)
    .AddPrometheusHttpListener(
        options => options.UriPrefixes = new string[] { "http://localhost:9090/" })
    .Build();
```

Finally, register the Prometheus scraping middleware using the
`UseOpenTelemetryPrometheusScrapingEndpoint` extension method on
`IApplicationBuilder` :

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseOpenTelemetryPrometheusScrapingEndpoint();
```

Further details on configuring the Prometheus exporter can be found
[here](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Prometheus.AspNetCore/README.md).

## Zipkin

### Backend Setup {#zipkin-setup}

{{% alert title="Note" color="info" %}}

If you have Zipkin or a Zipkin-compatible backend already set up, you can skip
this section and setup the [Zipkin exporter dependencies](#zipkin-dependencies)
for your application.

{{% /alert %}}

You can run [Zipkin](https://zipkin.io/) on ina Docker container by executing
the following command:

```shell
docker run --rm -d -p 9411:9411 --name zipkin openzipkin/zipkin
```

### Dependencies {#zipkin-dependencies}

To send your trace data to [Zipkin](https://zipkin.io/), install the
[exporter package](https://www.nuget.org/packages/OpenTelemetry.Exporter.Zipkin)
as a dependency for your application:

```shell
dotnet add package OpenTelemetry.Exporter.Zipkin
dotnet add package OpenTelemetry.Extensions.Hosting
```

If you're using ASP.NET Core, configure the exporter in your ASP.NET Core
services:

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenTelemetry()
    .WithTracing(b =>
    {
        b.AddZipkinExporter(o =>
        {
            o.Endpoint = new Uri("your-zipkin-uri-here");
        })
        // The rest of your setup code goes here too
    });
```

Otherwise, configure the exporter when creating a tracer provider:

```csharp
using var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddZipkinExporter(o =>
    {
        o.Endpoint = new Uri("your-zipkin-uri-here");
    })

    // Other setup code, like setting a resource goes here too

    .Build();
```

## Other available exporters

There are many other exporters available. For a list of available exporters, see
the [registry](/ecosystem/registry/?component=exporter&language=dotnet).

Finally, you can also write your own exporter. For more information, see the
[SpanExporter Interface in the API documentation](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_sdk_trace_base.SpanExporter.html).

## Batching spans