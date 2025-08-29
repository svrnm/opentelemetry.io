---
title: 库
description: 了解如何为你的库添加原生插桩。
aliases: [ ../instrumenting-library ]
weight: 40
---

OpenTelemetry 为许多库提供了[插桩库][instrumentation libraries]，
这些插桩通常通过库的钩子或对库代码的猴子补丁来实现。

使用 OpenTelemetry 实现库的原生插桩可以为用户提供更好的可观测性和开发体验，
省去了库公开和记录钩子的需求。原生插桩的其他优势包括： Other advantages provided by native instrumentation include:

- 可以用通用、易用的 OpenTelemetry API 替代自定义日志钩子，用户只需接触 OpenTelemetry。
- 来自库和应用代码的链路、日志和指标是相关且一致的。
- 通用的约定使用户能够在同一技术体系内或跨库、跨语言获取一致的遥测数据。
- 遥测信号可以通过 OpenTelemetry 提供的众多、文档完善的可扩展点进行精细调控（过滤、处理、聚合）以适应不同使用场景。

![ Native Instrumentation vs instrumentation libraries](../native-vs-libraries.svg)

## 语义约定 {#semantic-convention}

[Semantic conventions](/docs/specs/semconv/general/trace/) are the main source
of truth about what information is included on spans produced by web frameworks,
RPC clients, databases, messaging clients, infrastructure, and more. Conventions
make instrumentation consistent: users who work with telemetry don't have to
learn library specifics and observability vendors can build experiences for a
wide variety of technologies, for example databases or messaging systems. When
libraries follow conventions, many scenarios can be enabled without the user's
input or configuration.

Semantic conventions are always evolving and new conventions are constantly
added. If some don't exist for your library, consider
[adding them](https://github.com/open-telemetry/semantic-conventions/issues).
Pay special attention to span names: strive to use meaningful names and consider
cardinality when defining them. Also set the
[`schema_url`](/docs/specs/otel/schemas/#schema-url) attribute that you can use
to record what version of the semantic conventions you're using.

如果你有反馈或想要添加新约定，可以通过加入
[Instrumentation Slack](https://cloud-native.slack.com/archives/C01QZFGMLQ7)，
或在[规范仓库](https://github.com/open-telemetry/opentelemetry-specification)提交
Issue 或 PR 的方式参与贡献。

### 定义 Span {#definition-spans}

Think of your library from the perspective of a library user and what the user
might be interested in knowing about the behavior and activity of the library.
As the library maintainer, you know the internals, but the user will most likely
be less interested in the inner workings of the library and more interested in
the functionality of their application. Think about what information can be
helpful in analyzing the usage of your library, then think about an appropriate
way to model that data. Some aspects to consider include:

- Span 及其层级结构
- Span 中的数值属性（作为聚合指标的替代）
- Span 事件
- Aggregated Metrics

For example, if your library is making requests to a database, create spans only
for the logical request to the database. The physical requests over the network
should be instrumented within the libraries implementing that functionality. You
should also favor capturing other activities, like object/data serialization as
span events, rather than as additional spans.

Follow the semantic conventions when setting span attributes.

## 何时不应添加插桩 {#when-not-to-instrument}

Some libraries are thin clients wrapping network calls. Chances are that
OpenTelemetry has an instrumentation library for the underlying RPC client.
Check out the [registry](/ecosystem/registry/) to find existing libraries. If a
library exists, instrumenting the wrapper library might not be necessary.

As a general guideline, only instrument your library at its own level. Don't
instrument if all the following cases apply:

- 你的库只是对已记录或易于理解的 API 的轻量封装。
- OpenTelemetry 已对底层网络调用实现了插桩。
- There are no conventions your library should follow to enrich telemetry.

When in doubt, don't instrument. If you choose not to instrument, it might still
be useful to provide a way to configure OpenTelemetry handlers for your internal
RPC client instance. It's essential in languages that don't support fully
automatic instrumentation and still useful in others.

The rest of this document provides guidance on what and how to instrument your
application.

## OpenTelemetry API

插桩的第一步是将 OpenTelemetry API 包作为依赖引入。

OpenTelemetry has [two main modules](/docs/specs/otel/overview/): API and SDK.
OpenTelemetry API is a set of abstractions and non-operational implementations.
Unless your application imports the OpenTelemetry SDK, your instrumentation does
nothing and does not impact application performance.

### 库应仅使用 OpenTelemetry API {#libraries-should-only-use-the-opentelemetry-api}

如果你担心引入新依赖，可参考以下建议以减少依赖冲突的可能：

- OpenTelemetry Trace API 在 2021 年初已达到稳定状态，
  遵循[语义版本 2.0](/docs/specs/otel/versioning-and-stability/)。 It follows
  [Semantic Versioning 2.0](/docs/specs/otel/versioning-and-stability/).
- 使用最早的稳定 API 版本（1.0.\*），非必要不要升级。
- While your instrumentation stabilizes, consider shipping it as a separate
  package, so that it never causes issues for users who don't use it. 在插桩逻辑尚未稳定时，考虑将其作为单独的包发布，避免影响不使用该逻辑的用户。
  可以保存在你自己的代码仓库中，也可以[提交到 OpenTelemetry 社区](https://github.com/open-telemetry/opentelemetry-specification/blob/main/oteps/0155-external-modules.md#contrib-components)，
  与其他插桩库一起发布。
- 语义约定是[稳定的但仍会演进][stable, but subject to evolution]：虽然不会造成功能性问题，但你可能需不时更新插桩逻辑。
  将其置于预览插件或 OpenTelemetry contrib 仓库中有助于在不破坏用户使用的情况下保持约定更新。 Having it in a preview plugin or in OpenTelemetry
  contrib repository may help keeping conventions up-to-date without breaking
  changes for your users.

  [stable, but subject to evolution]: /docs/specs/otel/versioning-and-stability/#semantic-conventions-stability

### 获取 Tracer {#getting-a-tracer}

所有应用配置对库是透明的，库通过 Tracer API 使用遥测功能。库可以允许应用传入 `TracerProvider`
实例以便依赖注入和测试便利，或通过[全局 `TracerProvider`](/docs/specs/otel/trace/api/#get-a-tracer)
获取。不同语言的实现可能会依据其惯用方式选择传参或使用全局变量。 Libraries might allow applications to pass instances of `TracerProvider` to
facilitate dependency injection and ease of testing, or obtain it from
[global `TracerProvider`](/docs/specs/otel/trace/api/#get-a-tracer).
OpenTelemetry language implementations might have different preferences for
passing instances or accessing the global based on what's idiomatic in each
programming language.

When obtaining the tracer, provide your library (or tracing plugin) name and
version: they show up on the telemetry and help users process and filter
telemetry, understand where it came from, and debug or report instrumentation
issues.

## What to instrument

### 公共 API {#public-apis}

公共 API 是良好的插桩对象：为公共方法创建 Span 能帮助用户将遥测信息映射到应用代码，
了解库调用的耗时与结果。可插桩的调用包括： Which calls to trace include:

- 内部包含网络调用或本地耗时（且可能失败）操作的公共方法，例如 I/O。
- 请求或消息处理的处理程序。

#### 插桩示例 {#instrumentation-example}

以下是 Java 应用的插桩示例：

```java
private static Tracer tracer =  getTracer(TracerProvider.noop());

public static void setTracerProvider(TracerProvider tracerProvider) {
    tracer = getTracer(tracerProvider);
}

private static Tracer getTracer(TracerProvider tracerProvider) {
    return tracerProvider.getTracer("demo-db-client", "0.1.0-beta1");
}

private Response selectWithTracing(Query query) {
    // 检查有关 span 名称和属性是否符合约定惯例
    Span span = tracer.spanBuilder(String.format("SELECT %s.%s", dbName, collectionName))
            .setSpanKind(SpanKind.CLIENT)
            .setAttribute("db.name", dbName)
            ...
            .startSpan();

    // 激活 span 并允许关联日志和嵌套 span
    try (Scope unused = span.makeCurrent()) {
        Response response = query.runWithRetries();
        if (response.isSuccessful()) {
            span.setStatus(StatusCode.OK);
        }

        if (span.isRecording()) {
           // 为响应代码和其他信息填充响应属性
        }
    } catch (Exception e) {
        span.recordException(e);
        span.setStatus(StatusCode.ERROR, e.getClass().getSimpleName());
        throw e;
    } finally {
        span.end();
    }
}
```

Follow conventions to populate attributes. If there is no applicable one, see
[general conventions](/docs/specs/semconv/general/attributes/).

### 嵌套的网络调用及其他 Span {#nested-network-and-other-spans}

网络调用通常由 OpenTelemetry 的自动插桩功能通过相应客户端实现来进行追踪。

![在 Jaeger UI 中展示嵌套的数据库和 HTTP Span](../nested-spans.svg)

如果 OpenTelemetry 尚未支持你的网络客户端，请参考以下建议来决定是否要手动插桩：

- 插桩网络调用是否能提高用户可观测性或便于你支持用户？
- 你的库是否是某个公开、文档化的 RPC API 的封装？当出现问题时，用户是否需要联系底层服务？ Would users
  need to get support from the underlying service in case of issues?
  - Instrument the library and make sure to trace individual network tries.
- Would tracing those calls with spans be very verbose? or would it noticeably
  impact performance?
  - 使用带有可调日志级别的日志记录，或使用 Span 事件代替：日志可与父 Span（如公共 API 调用）关联，而
    Span 事件应添加在公共 API 的 Span 上。
  - 若必须使用 Span（例如为了携带并传播链路上下文），应提供配置项并默认关闭。

如果 OpenTelemetry 已支持你的网络调用追踪，通常不应重复插桩。但也有例外： There might be some exceptions:

- 需要支持无法启用自动插桩的用户（某些环境下 monkey-patch 无效或用户有顾虑）。
- To enable custom or legacy correlation and context propagation protocols with
  underlying service.
- Enrich RPC spans with essential library or service-specific information not
  covered by auto-instrumentation.

A generic solution to avoid duplication is under construction.

### 事件 {#events}

Traces are a kind of signal that your apps can emit. Events (or logs) and traces
complement, not duplicate, each other. Whenever you have something that should
have a certain level of verbosity, logs are a better choice than traces.

如果你的应用已经使用日志记录模块，它可能已集成 OpenTelemetry。
可查看[登记表](/ecosystem/registry/)验证。此类集成通常会在所有日志中附加当前链路上下文，以便用户进行关联。 To find out, see the
[registry](/ecosystem/registry/). Integrations usually stamp active trace
context on all logs, so users can correlate them.

如果你的语言或生态尚无通用日志方案，可使用 [Span 事件][span events]记录额外应用信息。当你还想附加属性时，事件也更方便。 Events maybe more convenient if you
want to add attributes as well.

As a rule of thumb, use events or logs for verbose data instead of spans. Always
attach events to the span instance that your instrumentation created. Avoid
using the active span if you can, since you don't control what it refers to.

## 上下文传播 {#context-propagation}

### 提取上下文 {#extracting-context}

If you work on a library or a service that receives upstream calls, such as a
web framework or a messaging consumer,extract context from the incoming request
or message. OpenTelemetry provides the `Propagator` API, which hides specific
propagation standards and reads the trace `Context` from the wire. In case of a
single response, there is just one context on the wire, which becomes the parent
of the new span the library creates.

After you create a span, pass new trace context to the application code
(callback or handler), by making the span active; if possible, do this
explicitly. The following Java example shows how to add trace context and
activate a span. See the
[Context extraction in Java](/docs/languages/java/api/#contextpropagators), for
more examples.

```java
// 提取上下文
Context extractedContext = propagator.extract(Context.current(), httpExchange, getter);
Span span = tracer.spanBuilder("receive")
            .setSpanKind(SpanKind.SERVER)
            .setParent(extractedContext)
            .startSpan();

// 激活 span，以便关联子层级的遥测数据
try (Scope unused = span.makeCurrent()) {
  userCode();
} catch (Exception e) {
  span.recordException(e);
  span.setStatus(StatusCode.ERROR);
  throw e;
} finally {
  span.end();
}
```

In the case of a messaging system, you might receive more than one message at
once. Received messages become links on the span you create. Refer to
[messaging conventions](/docs/specs/semconv/messaging/messaging-spans/) for
details.

### 注入上下文 {#injecting-context}

When you make an outbound call, you usually want to propagate context to the
downstream service. In this case, create a new span to trace the outgoing call
and use `Propagator` API to inject context into the message. There might be
other cases where you might want to inject context, for example when creating
messages for async processing. The following Java example shows how to propagate
context. See
[Context injection in Java](/docs/languages/java/instrumentation/#context-propagation)
for more examples.

```java
Span span = tracer.spanBuilder("send")
            .setSpanKind(SpanKind.CLIENT)
            .startSpan();

// 激活 span，使任何嵌套的遥测数据能够关联起来
// 即使网络调用也可能包含多层嵌套的 span、日志或事件
try (Scope unused = span.makeCurrent()) {
  // 注入上下文
  propagator.inject(Context.current(), transportLayer, setter);
  send();
} catch (Exception e) {
  span.recordException(e);
  span.setStatus(StatusCode.ERROR);
  throw e;
} finally {
  span.end();
}
```

某些情况下无需传播上下文：

- 下游服务不支持元数据，或禁止未知字段。
- Downstream service does not define correlation protocols. Consider adding
  support for context propagation in a future version.
- 下游服务支持自定义关联协议：
  - 可尝试使用自定义 `Propagator`：若协议兼容，可使用 OpenTelemetry
    链路上下文，否则可生成自定义关联 ID 并附加到 Span。

### 进程内上下文 {#in-process}

- Make your spans active or current, as this enables correlating spans with logs
  and any nested auto-instrumentations.
- 如果库中有上下文概念，建议在支持活跃 Span 的同时，提供显式传递链路上下文的能力：
  - 将库创建的链路上下文显式置于上下文中，并说明如何访问。
  - 允许用户在自己的上下文中传递链路上下文。
- Within the library, propagate trace context explicitly. Active spans might
  change during callbacks.
  - 尽早在公共 API 入口捕获活跃上下文，并用其作为你创建 Span 的父上下文。
  - Pass context around and stamp attributes, exceptions, events on explicitly
    propagated instances.
  - 如果你主动开启线程、做后台处理或其它可能破坏上下文流的异步行为，这一点至关重要。

## 其他注意事项 {#additional-considerations}

### 插桩登记表 {#instrumentation-registry}

将你的插桩库添加到 [OpenTelemetry 登记表](/ecosystem/registry/)，方便用户发现使用。

### 性能 {#performance}

OpenTelemetry 包含[两个主要模块](/docs/specs/otel/overview/)：API 和 SDK。
OpenTelemetry API 是一组抽象和非运行时实现。如果应用未引入 SDK，则你的插桩逻辑不会执行，也不会影响应用性能。 在未配置 OpenTelemetry SDK 时，API 默认为 no-op，实现极为高效。当启用 SDK 后，
它会[消耗绑定资源](/docs/specs/otel/performance/)。

Real-life applications, especially on the high scale, would frequently have
head-based sampling configured. Sampled-out spans are affordable and you can
check if the span is recording to avoid extra allocations and potentially
expensive calculations while populating attributes. The following Java example
shows to provide attributes for sampling and check span recording.

```java
// 创建 span 时设置对采样重要的属性
Span span = tracer.spanBuilder(String.format("SELECT %s.%s", dbName, collectionName))
        .setSpanKind(SpanKind.CLIENT)
        .setAttribute("db.name", dbName)
        ...
        .startSpan();

// 计算代价大的属性时，先判断是否启用记录
if (span.isRecording()) {
    span.setAttribute("db.statement", sanitize(query.statement()))
}
```

### 错误处理 {#error-handling}

OpenTelemetry API 在运行时非常宽容：不会因无效参数抛出异常、不会中断程序逻辑、异常会被吞掉，
详见[错误处理原则](/docs/specs/otel/error-handling/#basic-error-handling-principles)。
因此插桩问题不会影响应用逻辑，但你仍应测试插桩逻辑以发现 API 所隐藏的问题。
This way instrumentation issues do not affect application logic. Test the
instrumentation to notice issues OpenTelemetry hides at runtime.

### 测试 {#testing}

OpenTelemetry 提供多种自动插桩方式，因此请测试你的插桩与其他遥测信号（如入站/出站请求、日志等）的交互方式。
使用典型应用及流行框架/库并启用完整追踪进行测试，查看你的库的遥测表现。 Use a typical application, with popular frameworks
and libraries and all tracing enabled when trying out your instrumentation.
Check out how libraries similar to yours show up.

在单元测试中，你通常可以 mock 或 fake `SpanProcessor` 和 `SpanExporter`，如下例所示：

```java
@Test
public void checkInstrumentation() {
  SpanExporter exporter = new TestExporter();

  Tracer tracer = OpenTelemetrySdk.builder()
           .setTracerProvider(SdkTracerProvider.builder()
              .addSpanProcessor(SimpleSpanProcessor.create(exporter)).build()).build()
           .getTracer("test");
  // 执行测试...

  validateSpans(exporter.exportedSpans);
}

class TestExporter implements SpanExporter {
  public final List<SpanData> exportedSpans = Collections.synchronizedList(new ArrayList<>());

  @Override
  public CompletableResultCode export(Collection<SpanData> spans) {
    exportedSpans.addAll(spans);
    return CompletableResultCode.ofSuccess();
  }
  ...
}
```

[instrumentation libraries]: /docs/specs/otel/overview/#instrumentation-libraries
[span events]: /docs/specs/otel/trace/api/#add-events
