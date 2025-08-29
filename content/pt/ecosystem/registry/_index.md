---
title: Registro
description: >-
  Encontre bibliotecas, plugins, integrações e outras ferramentas úteis para usar e expandir o OpenTelemetry.
type: default
layout: registry
body_class: registry td-content
weight: 20

# =============================================================================
# IMPORTANT:
# IMPORTANT: Non-English locales: DO NOT include the front matter entries below
# IMPORTANT:
# =============================================================================

aliases: [ /registry/* ]
outputs: [ html, json ]

# The redirects and aliases implement catch-all rules for old registry entries;
# we don't publish individual entry pages anymore.
#
# We can't use the catch-all `/ecosystem/registry/*`, because that creates a
# self-loop with `/ecosystem/registry/index.html`. So we use the following
# redirect rule to avoid the loop, as suggested by Netlify support
# (email support ID 159489):
redirects:
  [
    { from: /ecosystem/registry*, to: '/ecosystem/registry?' }
  ]
---

{{% blocks/lead color="dark" %}}

<!-- markdownlint-disable single-h1 -->

<h1>{{% param title %}}</h1>

{{% param description %}}

{{% /blocks/lead %}}

{{< blocks/section color="white" type="container-lg" >}}

{{% alert %}}

O Registro do OpenTelemetry permite a busca por bibliotecas de instrumentação,
componentes do Collector, utilitários e outros projetos úteis dentro do
ecossistema. Caso você seja mantenedor de um projeto, é possível
[adicionar seu projeto ao Registro do OpenTelemetry](adding/).

{{% /alert %}}

{{< ecosystem/registry/search-form >}}

{{< /blocks/section >}}
