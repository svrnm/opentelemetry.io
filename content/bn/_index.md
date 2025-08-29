---
title: OpenTelemetry
description: >-
  ইফেক্টিভ অবজারভেবিলিটির জন্য উচ্চ-মানের, সর্বজনীন ও পোর্টেবল টেলিমেট্রি প্রদান
outputs:
  - HTML
  # Include the following for `content/en` ONLY
  - REDIRECTS
  - RSS
developer_note: The blocks/cover shortcode (used below) will use as a background image any image file containing "background" in its name.
show_banner: true
---

<div class="d-none"><a rel="me" href="https://fosstodon.org/@opentelemetry"></a></div>

{{< blocks/cover image_anchor="top" height="max" color="primary" >}}

<!-- prettier-ignore -->

![OpenTelemetry](/img/logos/opentelemetry-horizontal-color.svg)
{.otel-logo}

<!-- prettier-ignore -->

{{% param description %}}
{.display-6}

<div class="l-primary-buttons mt-5">

- [আরও জানুন](docs/what-is-opentelemetry/)
- [Demo ট্রাই করুন](docs/demo/)

</div>

<div class="h3 mt-4">
আপনার কাজের উপর ভিত্তি করে <a class="text-secondary" href="docs/getting-started/"> শুরু করুন </a>
</div>
<div class="l-get-started-buttons">

- [Dev](docs/getting-started/dev/)
- [Ops](docs/getting-started/ops/)

</div>
{{< /blocks/cover >}}

{{% blocks/lead color="white" %}}

OpenTelemetry is a collection of APIs, SDKs, and tools. Use it to instrument,
generate, collect, and export telemetry data (metrics, logs, and traces) to help
you analyze your software's performance and behavior.

> OpenTelemetry সাধারণভাবে [অনেক ভাষায়](docs/languages/)
> [এভেইলেবল (available)](/status/) এবং প্রোডাকশন ব্যবহারের জন্য উপযোগী।

{{% /blocks/lead %}}

{{% blocks/section color="dark" type="row" %}}

{{% blocks/feature icon="fas fa-chart-line" title="ট্রেস, মেট্রিকস, লগস" url="docs/concepts/observability-primer/" %}}

আপনার সার্ভিস এবং সফটওয়্যার থেকে টেলিমেট্রি তৈরি ও সংগ্রহ করুন, এবং এটি
বিশ্লেষণ টুলে পাঠান।

{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-magic" title="সহজ ইন্টিগ্রেশন ও ইন্সট্রুমেন্টেশন" %}}

OpenTelemetry অনেক জনপ্রিয় লাইব্রেরি ও ফ্রেমওয়ার্কের সাথে
[ইন্টিগ্রেট][integrates] করে এবং _code-based ও zero-code_
[ইন্সট্রুমেন্টেশন][instrumentation] সাপোর্ট করে।

[instrumentation]: /docs/concepts/instrumentation/
[integrates]: /ecosystem/integrations/

{{% /blocks/feature %}}

{{% blocks/feature icon="fab fa-github" title="ওপেন সোর্স, ভেন্ডর নিউট্রাল" %}}

১০০% বিনামূল্যে এবং ওপেন সোর্স, OpenTelemetry অবজারভেবিলিটির ক্ষেত্রে
[ইন্ডাস্ট্রি লিডার্স][industry leaders] দ্বারা [গৃহীত][adopted] এবং সমর্থিত।

[adopted]: /ecosystem/adopters/
[industry leaders]: /ecosystem/vendors/

{{% /blocks/feature %}}

{{% /blocks/section %}}

{{% blocks/section color="secondary" type="cncf" %}}

**OpenTelemetry is a [CNCF][] [incubating][] project**.<br> Formed through a
merger of the OpenTracing and OpenCensus projects.

[![CNCF logo][]][cncf]

[cncf]: https://cncf.io
[cncf logo]: /img/logos/cncf-white.svg
[incubating]: https://www.cncf.io/projects/

{{% /blocks/section %}}
