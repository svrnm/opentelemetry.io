---
title: শব্দকোষ
description: OpenTelemetry-তে ব্যবহৃত টেলিমেট্রি টার্মস-এর সংজ্ঞা এবং প্রচলিত নিয়ম।
weight: 200
---

এই শব্দকোষ OpenTelemetry প্রজেক্টে নতুন টার্মস
এবং ধারণাগুলো ([concepts](/docs/concepts/)) সংজ্ঞায়িত করে, এবং
অবজারভেবিলিটি ক্ষেত্রে প্রচলিত টার্মসগুলোর OpenTelemetry-সম্পর্কিত
ব্যবহার স্পষ্ট করে।

We also comment on spelling and capitalization when helpful. For example, see
[OpenTelemetry](#opentelemetry) and [OTel](#otel).

## টার্মস {#terms}

### এগ্রিগেশন (Aggregation) {#aggregation}

The process of combining multiple measurements into exact or estimated
statistics about the measurements that took place during an interval of time,
during program execution. Used by the [Metric](#metric)
[Data source](#data-source).

### API {#api}

Application Programming Interface. In the OpenTelemetry project, used to define
how telemetry data is generated per [Data source](#data-source).

### এপ্লিকেশন (Application) {#application}

এন্ড ইউজার (end user) বা অন্যান্য অ্যাপ্লিকেশনের জন্য ডিজাইন করা এক বা একাধিক [সার্ভিস](#service)।

### APM {#apm}

Application Performance Monitoring হল সফটওয়্যার অ্যাপ্লিকেশন, তাদের পারফরম্যান্স (গতি, রেলিয়াবিলিটি, এভাইল্যাবিলিটি ইত্যাদি) নিরীক্ষণ করে
সমস্যা শনাক্ত করা, সতর্কতা এবং
মূল কারণ খুঁজে বের করার জন্য একটা টুলিং সিস্টেম।

### অ্যাট্রিবিউট (Attribute) {#attribute}

OpenTelemetry term for [Metadata](#metadata). Adds key-value information to the
entity producing telemetry. Used across [Signals](#signal) and
[Resources](#resource). See [attribute spec][attribute].

### অটোমেটিক ইনস্ট্রুমেন্টেশন (Automatic instrumentation) {#automatic-instrumentation}

Refers to telemetry collection methods that do not require the end-user to
modify application's source code. Methods vary by programming language, and
examples include bytecode injection or monkey patching.

### ব্যাগেজ (Baggage) {#baggage}

A mechanism for propagating [Metadata](#metadata) to help establish a causal
relationship between events and services. See [baggage spec][baggage].

### ক্লায়েন্ট লাইব্রেরি (Client library)

The number of unique values for a given [Attribute](#attribute) or set of
attributes. High cardinality means many unique values, which can impact the
performance and storage requirements of telemetry backends. For example, a
`user_id` attribute would have high cardinality, while a `status_code` attribute
with values like "200", "404", "500" would have low cardinality.

### ক্লায়েন্ট-সাইড অ্যাপ (Client-side app)

এটি [Application](#application)-এর একটি উপাদান যা একটি প্রাইভেট ইনফ্রাস্ট্রাকচার-এর ভিতরে চলে না এবং
সাধারণত এন্ড ইউজাররা (end users) সরাসরি ব্যবহার করে। client-side app-এর উদাহরণ
হল ব্রাউজার অ্যাপ, মোবাইল অ্যাপ, এবং IoT ডিভাইসে চালিত অ্যাপ।

### কালেক্টর (Collector) {#collector}

A component of an [Application](#application) that is not running inside a
private infrastructure and is typically used directly by end-users. Examples of
client-side apps are browser apps, mobile apps, and apps running on IoT devices.

### Collector

The [OpenTelemetry Collector], or Collector for short, is a vendor-agnostic
implementation on how to receive, process, and export telemetry data. A single
binary that can be deployed as an agent or gateway.

> **Spelling**: When referring to the [OpenTelemetry Collector], always
> capitalize Collector. Use just "Collector" if you are using Collector as an
> adjective &mdash; for example, "Collector configuration".

[OpenTelemetry Collector]: /docs/collector/

### কনটেক্সট প্রপাগেশন (Context propagation) {#context-propagation}

[Transaction](#transaction) এর জীবদ্দশায় state সংরক্ষণ এবং ডেটা অ্যাক্সেসের
জন্য সমস্ত [Data sources](#data-source) কে একটি underlying context
mechanism শেয়ার করে নেওয়ার অনুমতি দেয়।
[context propagation spec][context propagation] দেখুন।

### DAG {#dag}

Allows all [Data sources](#data-source) to share an underlying context mechanism
for storing state and accessing data across the lifespan of a
[Transaction](#transaction). See [context propagation
spec][context propagation].

### ডাটা সোর্স (Data source) {#data-source}

[Signal](#signal) দেখুন

### ডাইমেনশন (Dimension) {#dimension}

[Metrics](#metric) দ্বারা বিশেষভাবে ব্যবহৃত একটি টার্ম। [Attribute](#attribute) দেখুন।

### ডিস্ট্রিবিউটেড ট্রেসিং (Distributed tracing) {#distributed-tracing}

A term used specifically by [Metrics](#metric). See [Attribute](#attribute).

### Distributed tracing

Tracks the progression of a single [Request](#request), called a
[Trace](#trace), as it is handled by [Services](#service) that make up an
[Application](#application). A [Distributed trace](#distributed-tracing)
transverses process, network and security boundaries.

একটি distribution হল কিছু কাস্টমাইজেশন সহ একটি upstream OpenTelemetry repository-এর চারপাশে
একটি wrapper। \[Distributions] দেখুন।

### (ইভেন্ট) Event {#event}

A distribution is a wrapper around an upstream OpenTelemetry repository with
some customizations. See [Distributions].

### এক্সপোর্টার (Exporter) {#exporter}

An Event is a [Log Record](#log-record) with an event name and a well-known
structure. For example, browser events in OpenTelemetry follow a particular
naming convention and carry particular data in a common structure.

### ফিল্ড (Field) {#field}

Provides functionality to emit telemetry to consumers. Exporters can be push- or
pull-based.

### gRPC {#grpc}

A term used specifically by [Log Records](#log-record). [Metadata](#metadata)
can be added through defined fields, including [Attributes](#attribute) and
[Resource](#resource). Other fields may also be considered `Metadata`, including
severity and trace information. See the [field spec][field].

### HTTP {#http}

A high-performance, open source universal [RPC](#rpc) framework. See
[gRPC](https://grpc.io).

### ইন্স্ট্রুমেন্টেড লাইব্রেরি (Instrumented library) {#instrumented-library}

[Library](#library)-কে নির্দেশ করে, যার জন্য টেলিমেট্রি সিগনালগুলো
([Traces](#trace), [Metrics](#metric), [Logs](#log)) সংগ্রহ করা হয়।
\[Instrumented library]\[] দেখুন।

### ইনস্ট্রুমেন্টেশন লাইব্রেরি (Instrumentation library) {#instrumentation-library}

Denotes the [Library](#library) for which the telemetry signals
([Traces](#trace), [Metrics](#metric), [Logs](#log)) are gathered. See
[Instrumented library][].

### JSON {#json}

Denotes the [Library](#library) that provides the instrumentation for a given
[Instrumented library](#instrumented-library).
[Instrumented library](#instrumented-library) and
[Instrumentation library](#instrumentation-library) can be the same
[Library](#library) if it has built-in OpenTelemetry instrumentation. See [the
lib specification][spec-instrumentation-lib].

### লেবেল (Label) {#label}

[Metrics](#metric) দ্বারা বিশেষভাবে ব্যবহৃত একটি পরিভাষা। [Metadata](#metadata) দেখুন।

### ভাষা (Language) {#language}

A term used specifically by [Metrics](#metric). See [Metadata](#metadata).

### লাইব্রেরি (Library) {#library}

একটি ইন্টারফেস দ্বারা আহ্বান করা আচরণের ভাষা-নির্দিষ্ট সংগ্রহ।

### লগ (Log) {#log}

কখনও কখনও [Log records](#log-record)-এর একটি সংগ্রহ বোঝাতে ব্যবহৃত হয়। অস্পষ্ট হতে পারে কারণ
লোকেরা কখনও কখনও একটি একক [Log record](#log-record) বোঝাতেও [Log](#log) ব্যবহার করে।
যেখানে অস্পষ্টতা সম্ভব,
অতিরিক্ত qualifier ব্যবহার করুন, উদাহরণস্বরূপ, `Log record`। [Log] দেখুন।

### লগ রেকর্ড (Log record) {#log-record}

Sometimes used to refer to a collection of [Log records](#log-record). Can be
ambiguous since people also sometimes use [Log](#log) to refer to a single
[Log record](#log-record). Where ambiguity is possible, use additional
qualifiers, for example, `Log record`. See [Log].

### মেটাডাটা (Metadata) {#metadata}

A recording of data with a timestamp and a severity. May also have a
[Trace ID](#trace) and [Span ID](#span) when correlated with a trace. See [Log
record][].

### মেট্রিক (Metric) {#metric}

A key-value pair, for example `foo="bar"`, added to an entity producing
telemetry. OpenTelemetry calls these pairs [Attributes](#attribute). In
addition, [Metrics](#metric) have [Dimensions](#dimension) an [Labels](#label),
while [Logs](#log) have [Fields](#field).

### OC {#oc}

Records a data point, either raw measurements or predefined aggregation, as time
series with [Metadata](#metadata). See [Metric].

### অবজারভেবিলিটি ব্যাকএন্ড (Observability backend) {#observability-backend}

একটি observability platform-এর কম্পোনেন্ট যা টেলিমেট্রি ডেটা গ্রহণ, প্রক্রিয়াকরণ, সংরক্ষণ এবং কোয়েরি (query) করার
জন্য দায়ী। উদাহরণের মধ্যে [Jaeger]
এবং [Prometheus]-এর মতো ওপেন সোর্স টুলস,
পাশাপাশি বাণিজ্যিক অফারিংও রয়েছে। OpenTelemetry একটি observability backend নয়।

### অবজারভেবিলিটি ফ্রন্টএন্ড (Observability frontend) {#observability-frontend}

The component of an observability platform that is responsible for receiving,
processing, storing, and querying telemetry data. Examples include open source
tools like [Jaeger] and [Prometheus], as well as commercial offerings.
OpenTelemetry is not an observability backend.

### OpAMP {#opamp}

The component of an observability platform that provides user interfaces for
visualizing and analyzing telemetry data. It can be often a part of an
observability backend, particularly when considering commercial offerings.

### OpAMP

Abbreviation for the
[Open Agent Management Protocol](/docs/collector/management/#opamp).

> **Spelling**: Write OpAMP, not `OPAMP` nor `opamp` in descriptions or
> instructions.

### OpenTelemetry {#opentelemetry}

Precursor to OpenTelemetry. For details, see
[History](/docs/what-is-opentelemetry/#history).

### OpenTelemetry

Formed through a [merger] of the [OpenTracing](#opentracing) and
[OpenCensus](#opencensus) projects, OpenTelemetry &mdash; the subject of this
website &mdash; is a collection of [APIs](#api), [SDKs](#sdk), and tools that
you can use to [instrument](/docs/concepts/instrumentation/), generate,
[collect](/docs/concepts/components/#collector), and
[export](/docs/concepts/components/#exporters)
[telemetry data](/docs/concepts/signals/) such as [metrics](#metric),
[logs](#log), and [traces](#trace).

> **Spelling**: OpenTelemetry should always be a single unhyphenated word and
> capitalized as shown.

[merger]: /docs/what-is-opentelemetry/#history

### OT {#ot}

Precursor to OpenTelemetry. For details, see
[History](/docs/what-is-opentelemetry/#history).

### OTel {#otel}

[OpenTelemetry](/docs/what-is-opentelemetry/)-এর সংক্ষিপ্ত রূপ।

### OTel

Short form for [OpenTelemetry](/docs/what-is-opentelemetry/).

> **Spelling**: Write OTel, not `OTEL`.

### OTEP {#otep}

[OpenTelemetry Enhancement Proposal]-এর একটি সংক্ষিপ্ত রূপ।

### OTEP

An acronym for [OpenTelemetry Enhancement Proposal].

> **Spelling**: Write "OTEPs" as plural form. Don't write `OTep` or `otep` in
> descriptions.

[OpenTelemetry Enhancement Proposal]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/oteps/README.md

### প্রপাগেটরস (Propagators)

span context এবং [Spans](#span)-এ [Baggage](#baggage)-এর মতো টেলিমেট্রি ডেটার নির্দিষ্ট অংশগুলো serialize এবং deserialize করতে ব্যবহৃত হয়।
[Propagators] দেখুন।

### Proto {#proto}

Used to serialize and deserialize specific parts of telemetry data such as span
context and [Baggage](#baggage) in [Spans](#span). See [Propagators].

### গ্রাহক (Receiver) {#receiver}

Language independent interface types. See [opentelemetry-proto].

### অনুরোধ (Request) {#request}

The term used by the [Collector](/docs/collector/configuration/#receivers) to
define how telemetry data is received. Receivers can be push- or pull-based. See
[Receiver].

### রিসোর্স (Resource) {#resource}

টেলিমেট্রি উৎপাদনকারী entity সম্পর্কে তথ্য [Attributes](#attribute) হিসেবে ক্যাপচার করে।
উদাহরণস্বরূপ, Kubernetes-এ একটি container-এ চলমান একটি প্রক্রিয়া যা টেলিমেট্রি উৎপাদন করে তার একটি প্রসেস (process) নাম,
একটি pod নাম, একটি namespace, এবং সম্ভবত একটি deployment নাম আছে।
এই সমস্ত attributes `Resource`-এ
অন্তর্ভুক্ত করা যেতে পারে।

### REST {#rest}

Captures information about the entity producing telemetry as
[Attributes](#attribute). For example, a process producing telemetry that is
running in a container on Kubernetes has a process name, a pod name, a
namespace, and possibly a deployment name. All these attributes can be included
in the `Resource`.

### RPC {#rpc}

\[Remote Procedure Call]\[rpc]-এর সংক্ষিপ্ত রূপ।

### Sampling {#sampling}

রপ্তানি করা ডেটার পরিমাণ নিয়ন্ত্রণের একটি মেকানিজম।
সবচেয়ে সাধারণভাবে [Tracing](#trace) [Data Source](#data-source)-এর সাথে ব্যবহৃত। \[Sampling] দেখুন।

### SDK {#sdk}

A mechanism to control the amount of data exported. Most commonly used with the
[Tracing](#trace) [Data Source](#data-source). See [Sampling].

### Semantic conventions {#semantic-conventions}

Short for Software Development Kit. Refers to a telemetry SDK that denotes a
[Library](#library) that implement the OpenTelemetry [API](#api).

### সেবা (Service) {#service}

[Application](#application)-এর একটি উপাদান। উচ্চ availability এবং scalability-এর জন্য সাধারণত
একটি [Service](#service)-এর একাধিক
instances ডিপ্লয় করা হয়। একটি [Service](#service) একাধিক স্থানে ডিপ্লয় করা যেতে পারে।

### সিগন্যাল (Signal) {#signal}

A component of an [Application](#application). Multiple instances of a
[Service](#service) are typically deployed for high availability and
scalability. A [Service](#service) can be deployed in multiple locations.

### স্প্যান (Span) {#span}

One of [Traces](#trace), [Metrics](#metric) or [Logs](#log). See [Signals].

### স্প্যান লিঙ্ক (Span link) {#span-link}

Represents a single operation within a [Trace](#trace). See [Span].

### স্পেসিফিকেশন (Specification) {#specification}

A span link is a link between causally-related spans. For details see
[Links between spans](/docs/specs/otel/overview#links-between-spans) and
[Specifying Links](/docs/specs/otel/trace/api#specifying-links).

### স্ট্যাটাস (Status) {#status}

Describes the cross-language requirements and expectations for all
implementations. See [Specification].

### ট্যাগ (Tag) {#tag}

The result of the operation. Typically used to indicate whether an error
occurred. See [Status].

### ট্রেস (Trace) {#trace}

[Spans](#span)-এর একটি [DAG](#dag), যেখানে [Spans](#span)-এর
মধ্যে edges parent-child সম্পর্ক হিসেবে সংজ্ঞায়িত। [Traces] দেখুন।

### ট্রেসার (Tracer) {#tracer}

A [DAG](#dag) of [Spans](#span), where the edges between [Spans](#span) are
defined as parent-child relationship. See [Traces].

### ট্রানজেকশন (Transaction) {#transaction}

Responsible for creating [Spans](#span). See [Tracer].

### zPages {#zpages}

external exporters-এর একটি in-process বিকল্প।
অন্তর্ভুক্ত করা হলে, তারা
পটভূমিতে tracing এবং metrics তথ্য সংগ্রহ এবং একত্রিত করে; অনুরোধ করা হলে এই ডেটা ওয়েব পৃষ্ঠাগুলোতে পরিবেশিত হয়। [zPages] দেখুন।

### zPages

An in-process alternative to external exporters. When included, they collect and
aggregate tracing and metrics information in the background; this data is served
on web pages when requested. See [zPages].

[attribute]: /docs/specs/otel/common/#attributes
[baggage]: /docs/specs/otel/baggage/api/
[context propagation]: /docs/specs/otel/overview#context-propagation
[dag]: https://en.wikipedia.org/wiki/Directed_acyclic_graph
[distributed tracing]: ../signals/traces/
[distributions]: ../distributions/
[field]: /docs/specs/otel/logs/data-model#field-kinds
[http]: https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol
[instrumented library]: /docs/specs/otel/glossary/#instrumented-library
[Jaeger]: https://www.jaegertracing.io/
[json]: https://en.wikipedia.org/wiki/JSON
[log record]: /docs/specs/otel/glossary#log-record
[log]: /docs/specs/otel/glossary#log
[metric]: ../signals/metrics/
[opentelemetry-proto]: https://github.com/open-telemetry/opentelemetry-proto
[propagators]: /docs/languages/go/instrumentation/#propagators-and-context
[Prometheus]: https://prometheus.io/
[receiver]: /docs/collector/configuration/#receivers
[rest]: https://en.wikipedia.org/wiki/Representational_state_transfer
[rpc]: https://en.wikipedia.org/wiki/Remote_procedure_call
[sampling]: /docs/specs/otel/trace/sdk#sampling
[signals]: ../signals/
[span]: /docs/specs/otel/trace/api#span
[spec-instrumentation-lib]: /docs/specs/otel/glossary/#instrumentation-library
[specification]: ../components/#specification
[status]: /docs/specs/otel/trace/api#set-status
[tracer]: /docs/specs/otel/trace/api#tracer
[traces]: /docs/specs/otel/overview#traces
[zpages]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/development/trace/zpages.md
