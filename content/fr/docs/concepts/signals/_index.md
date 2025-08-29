---
title: Les signaux
description: Catégories de télémétrie supportées par OpenTelemetry
aliases: [ data-sources, otel-concepts ]
weight: 11
---

L'objectif d'OpenTelemetry est de collecter, traiter et exporter des
**[signaux][signals]**.
Les signaux sont des données générées par le système et
décrivant l'activité interne du système d'exploitation et des applications
exécutées sur une plateforme. Un signal peut être quelque chose que vous
souhaitez mesurer à un instant précis, comme par exemple la température ou
l'utilisation mémoire, ou un événement traversant les différents composants de
votre système distribué. Vous avez la possibilité de regrouper plusieurs signaux
ensemble afin d'observer sous différents angles le fonctionnement d'une
technologie.

OpenTelemetry currently supports:

- [Traces](traces)
- [Metrics](metrics)
- [Logs](logs)
- [Baggage](baggage)

Also under development or at the [proposal] stage:

- Les _événements_ sont une catégorie
  de log.
- [Profiles] are being worked on by the Profiling Working Group.

[Events]: /docs/specs/otel/logs/data-model/#events
[Profiles]: <Un groupe dédié au profilage travaille actuellement sur les&#xA;[_profils_](https://github.com/open-telemetry/opentelemetry-specification/blob/main/oteps/profiles/0212-profiling-vision.md).>
[proposal]: https://github.com/open-telemetry/opentelemetry-specification/tree/main/oteps/#readme
[signals]: /docs/specs/otel/glossary/#signals
