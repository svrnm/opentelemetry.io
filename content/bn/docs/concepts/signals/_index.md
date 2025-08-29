---
title: সিগন্যাল
description: OpenTelemetry দ্বারা সমর্থিত টেলিমেট্রির বিভাগগুলো সম্পর্কে জানুন
aliases: [ data-sources, otel-concepts ]
weight: 11
---

The purpose of OpenTelemetry is to collect, process, and export [signals].
Signals are system outputs that describe the underlying activity of the
operating system and applications running on a platform. A signal can be
something you want to measure at a specific point in time, like temperature or
memory usage, or an event that goes through the components of your distributed
system that you'd like to trace. You can group different signals together to
observe the inner workings of the same piece of technology under different
angles.

OpenTelemetry বর্তমানে সমর্থন করে:

- [ট্রেস](traces)
- [মেট্রিকস](metrics)
- [লগ](logs)
- [ব্যাগেজ](baggage)

এছাড়াও আন্ডার ডেভেলপমেন্ট বা [প্রস্তাবনা][proposal] পর্যায়ে রয়েছে:

- [ইভেন্ট][Events], একটি নির্দিষ্ট ধরনের [লগ](logs)
- [প্রোফাইল][Profiles] নিয়ে কাজ করছে প্রোফাইলিং ওয়ার্কিং গ্রুপ।

[Events]: /docs/specs/otel/logs/data-model/#events
[Profiles]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/oteps/profiles/0212-profiling-vision.md
[proposal]: https://github.com/open-telemetry/opentelemetry-specification/tree/main/oteps/#readme
[signals]: /docs/specs/otel/glossary/#signals
