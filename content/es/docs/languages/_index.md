---
title: APIs y SDKs para lenguajes
description: La instrumentación de código de OpenTelemetry es compatible con muchos lenguajes de programación populares.
weight: 250
aliases: [ /docs/instrumentation ]
redirects:
  - { from: /docs/instrumentation/*, to: ':splat' } # Only for `en`
  - { from: 'net/*', to: 'dotnet/:splat' }
---

La \[instrumentación]\[] de código de OpenTelemetry es compatible con los
lenguajes enumerados en la tabla de estados y lanzamientos presentada a
continuación. También están disponibles implementaciones no oficiales para
[otros lenguajes](/docs/languages/other). Puedes encontrarlas en el
[registro](/ecosystem/registry/).

Para Go, .NET, PHP, Python, Java y JavaScript puedes usar
[instrumentación zero-code](/docs/zero-code) para agregar instrumentación a tu
aplicación sin hacer cambios en el código.

Si estás utilizando Kubernetes, puedes usar el [Operador de OpenTelemetry para
Kubernetes][otel-op] para [inyectar estas soluciones zero-code][zero-code] en tu
aplicación.

## Estados y lanzamientos

El estado actual de los principales componentes funcionales de OpenTelemetry es
el siguiente:

{{% alert title="Importante" color="warning" %}}

Independientemente del estado de un API/SDK, si tu instrumentación depende de
\[convenciones semánticas]\[] que estén marcadas como [Experimental] en la
\[especificación de convenciones semánticas]\[], tu flujo de datos podría estar
sujeto a **cambios importantes**.

[semantic conventions]: /docs/concepts/semantic-conventions/
[Experimental]: /docs/specs/otel/document-status/
[semantic conventions specification]: /docs/specs/semconv/

{{% /alert %}}

{{% telemetry-support-table " " %}}

## Referencias de API

Los Grupos de Interés Especial (SIGs) que implementan el API y SDK de
OpenTelemetry en un lenguaje específico también publican referencias de API para
desarrolladores. Las siguientes referencias están disponibles:

{{% apidocs %}}

{{% alert title="Consejo" %}}

The list above is aliased to [`/api`](/api).

{{% /alert %}}

[zero-code]: /docs/platforms/kubernetes/operator/automatic/
[instrumentation]: /docs/concepts/instrumentation/
[otel-op]: /docs/platforms/kubernetes/operator/
