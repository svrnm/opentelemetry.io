---
title: OpenTelemetry
description: >-
  Високоякісна, повсюдна та переносна телеметрія для забезпечення ефективної спостережуваності
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

- [Дізнатися більше](docs/what-is-opentelemetry/)
- [Демонстрація](docs/demo/)

</div>

<div class="h3 mt-4"><a class="text-secondary" href="docs/getting-started/">Розпочніть</a> відповідно до вашої ролі
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

> OpenTelemetry [доступна](/status/) для [різних мов програмування](docs/languages/) та придатна для промислового використання.

{{% /blocks/lead %}}

{{% blocks/section color="dark" type="row" %}}

{{% blocks/feature icon="fas fa-chart-line" title="Трейси, Метрики та Логи" url="docs/concepts/observability-primer/" %}}

Створюйте та збирайте телеметричні дані з ваших сервісів та програмного забезпечення, а потім надсилайте їх до різноманітних інструментів аналізу.

{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-magic" title="Інструментування та інтеграція" %}}

OpenTelemetry [інтегрується][integrates] з багатьма популярними бібліотеками та фреймворками, а також підтримує [інструментування][instrumentation] за допомогою написання відповідного _коду та без нього_.

[instrumentation]: /docs/concepts/instrumentation/
[integrates]: /ecosystem/integrations/

{{% /blocks/feature %}}

{{% blocks/feature icon="fab fa-github" title="Відкритий код, незалежний від постачальників" %}}

OpenTelemetry — це на 100% відкритий та вільний код, який [підтримується та використовується][adopted] провідними [лідерами галузі][industry leaders] у сфері спостережуваності.

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
