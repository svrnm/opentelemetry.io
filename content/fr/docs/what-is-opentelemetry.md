---
title: Qu'est-ce qu'OpenTelemetry ?
description: Une brève explication de ce qu'est OpenTelemetry, et de ce qu'il n'est pas.
aliases:
  [
    /about,
    "Un framework

      \  d'[observabilité](/docs/concepts/observability-primer/#what-is-observability)

      \  et des outils conçus pour créer et gérer des données de télémétrie telles que

      \  des [traces](/docs/concepts/signals/traces/), des

      [métriques](/docs/concepts/signals/metrics/), et des

      [logs](/docs/concepts/signals/logs/)",
    /otel
  ]
weight: 150
cSpell:ignore: youtube
---

OpenTelemetry, c'est :

- An **[observability] framework and toolkit** designed to facilitate the

  - [Generation][instr]
  - Export
  - [Collection](../concepts/components/#collector)

  of [telemetry data][] such as [traces], [metrics], and [logs].

- **Open source**, as well as **vendor- and tool-agnostic**, meaning that it can
  be used with a broad variety of observability backends, including open source
  tools like [Jaeger] and [Prometheus], as well as commercial offerings.
  OpenTelemetry is **not** an observability backend itself.

L'un des objectifs principaux d'OpenTelemetry est de pouvoir
aisément instrumenter vos applications ou systèmes, quelque soit leur langage,
infrastructure, ou environnement d'exécution.

Le stockage et la visualisation
des données sont intentionnellement laissés à d'autres outils

<div class="td-max-width-on-larger-screens">
{{< youtube iEEIabOha8U >}}
</div>

For more videos in this series and additional resources, see
[What next?](#what-next)

## Qu'est-ce que l'observabilité ?

L'[observabilité](/docs/concepts/observability-primer/#what-is-observability)
est la capacité de comprendre l'état interne d'un système en examinant ses
données sortantes. Dans un contexte logiciel, cela signifie être capable de
comprendre l'état interne d'un système en examinant ses données de télémétrie,
qui incluent les traces, métriques et logs.

Pour rendre un système observable, il doit être
[instrumenté](/docs/concepts/instrumentation). Cela signifie que le code doit
émettre des [traces](/docs/concepts/signals/traces/), des
[métriques](/docs/concepts/signals/metrics/), et/ou des
[logs](/docs/concepts/signals/logs/). Les données produites doivent être
transmises à un backend d'observabilité.

## Pourquoi OpenTelemetry ?

Avec l'essor du cloud computing, des architectures en microservices, et des
exigences commerciales de plus en plus complexes, le besoin
d'[observabilité](/docs/concepts/observability-primer/#what-is-observability)
des logiciels et de l'infrastructure est plus grand que jamais.

OpenTelemetry répond au besoin d'observabilité tout en suivant deux principes
clés :

1. Vous êtes propriétaire des données que vous générez. Il n'y a pas de
   dépendance vis-à-vis d'un fournisseur
2. Vous n'avez besoin d'apprendre qu'un seul ensemble d'APIs et de conventions

Ces deux principes combinés offrent aux équipes et aux organisations la
flexibilité dont elles ont besoin dans le monde informatique moderne
d’aujourd’hui.

Si vous souhaitez en savoir plus, consultez la page
[Mission, vision et valeurs](/community/mission/) d'OpenTelemetry.

## Composants principaux d'OpenTelemetry {#main-opentelemetry-components}

OpenTelemetry se compose des principaux composants suivants :

- Une [spécification](/docs/specs/otel) pour tous les composants
- Un [protocole](/docs/specs/otlp/) standardisé définissant le format des
  données de télémétrie
- Des [conventions sémantiques](/docs/specs/semconv/) définissant une
  nomenclature standardisée pour décrire les données de télémétrie
- Des APIs décrivant comment générer des données de télémétrie
- Des [SDKs par langage](/docs/languages) qui implémentent les spécifications,
  les APIs et l'export des données de télémétrie
- Un [écosystème de bibliothèques](/ecosystem/registry) qui instrumentent des
  bibliothèques et frameworks
- Des composants d'instrumentation automatique qui génèrent des données de
  télémétrie sans requérir de modifications de code
- Le [Collector OpenTelemetry](/docs/collector), un proxy qui reçoit, modifie et
  exporte les données de télémétrie
- Divers autres outils, tels que
  l'[Opérateur Kubernetes pour OpenTelemetry](/docs/platforms/kubernetes/operator/),
  les [Helm Charts pour OpenTelemetry](/docs/platforms/kubernetes/helm/) et des
  [ressources communautaires pour les FaaS](/docs/platforms/faas/)

OpenTelemetry est utilisé par une grande variété de
[bibliothèques, services et applications](/ecosystem/integrations/) qui
intègrent OpenTelemetry afin de fournir de l'observabilité par défaut.

OpenTelemetry est pris en charge par de nombreux
[fournisseurs](/ecosystem/vendors/), dont beaucoup fournissent un support
commercial à OpenTelemetry et contribuent au projet directement.

## Extensibilité {#extensibility}

OpenTelemetry est conçu pour être extensible. Quelques exemples de la façon dont
il peut être étendu incluent :

- Ajouter un receveur au Collecteur OpenTelemetry afin de prendre en charge les
  données de télémétrie venant d'une source de données personnalisée
- Charger des bibliothèques d'instrumentation personnalisées dans un SDK
- Créer une [distribution](/docs/concepts/distributions/) d'un SDK, ou du
  collecteur adapté à une utilisation spécifique
- Créer un nouvel exportateur pour un backend personnalisé qui ne prend pas
  encore en charge le protocole OpenTelemetry (OTLP)
- Créer un propagateur personnalisé pour un format de propagation de contexte
  non standard

Bien que la plupart des utilisateurs n’aient pas besoin d’étendre OpenTelemetry,
le projet est conçu pour rendre cela possible presque à tous les niveaux.

## Histoire {#history}

OpenTelemetry est un projet de la
[Cloud Native Computing Foundation (CNCF)](https://www.cncf.io) qui trouve son
origine dans la fusion de deux projets antérieurs,
[OpenTracing](https://opentracing.io) et [OpenCensus](https://opencensus.io).
Ces deux projets ont été créés pour résoudre le même problème : l'absence d'une
norme décrivant la manière d'instrumenter du code et de transmettre des données
de télémétrie à un backend d'observabilité. Aucun des projets n'étant en mesure
de résoudre ce problème de manière indépendante, ils ont fusionné pour former
OpenTelemetry et combiner leurs forces tout en offrant une solution unique.

Si vous utilisez actuellement OpenTracing ou OpenCensus, vous pouvez découvrir
comment migrer vers OpenTelemetry dans le
[guide de migration](/docs/migration/).

[merger]: https://www.cncf.io/blog/2019/05/21/a-brief-history-of-opentelemetry-so-far/

## Et ensuite ?

- [Pour commencer](/docs/getting-started/) &mdash; Lancez-vous directement !
- Découvrez les [concepts d'OpenTelemetry](/docs/concepts/)
- [Watch videos][] from the [OTel for beginners][] or other [playlists].
- Sign up for [training](/training), including the **free course**
  [Getting started with OpenTelemetry](/training/#courses).

[Cloud Native Computing Foundation]: https://www.cncf.io
[instr]: ../concepts/instrumentation
[Jaeger]: https://www.jaegertracing.io/
[logs]: ../concepts/signals/logs/
[metrics]: ../concepts/signals/metrics/
[observability]: {#what-is-observability}
[OTel for beginners]: https://www.youtube.com/playlist?list=PLVYDBkQ1TdyyWjeWJSjXYUaJFVhplRtvN
[playlists]: https://www.youtube.com/@otel-official/playlists
[Prometheus]: https://prometheus.io/
[telemetry data]: ../concepts/signals/
[traces]: ../concepts/signals/traces/
[Watch videos]: https://www.youtube.com/@otel-official
