---
title: Guía de estilo de documentación
description: Terminología y estilo al escribir la documentación de OpenTelemetry.
linkTitle: Guía de estilo de documentación
weight: 20
cSpell:ignore: open-telemetry opentelemetryio postgre style-guide textlintrc
---

Aún no tenemos una guía de estilo oficial, pero el estilo actual de la
documentación de OpenTelemetry está inspirado en las siguientes guías de estilo:

- [Guía de estilo de documentación de para desarrolladores Google](https://developers.google.com/style)
- [Guía de estilo de documentación de Kubernetes](https://kubernetes.io/docs/contribute/style/style-guide/)

Las siguientes secciones contienen indicaciones específicas para el proyecto
OpenTelemetry.

{{% alert title="Note" %}}

Muchos de los requisitos de nuestra guía de estilo se pueden aplicar
automaticamente: antes de enviar un
[pull request](https://docs.github.com/en/get-started/learning-about-github/github-glossary#pull-request)
(PR), ejecute `npm run fix:all` en su máquina local y confirme los cambios.

Si se producen errores o [fallan las comprobaciones de su PR](../pr-checks), lea
nuestra guía de estilo y aprenda qué puede hacer para solucionar ciertos asuntos
comunes.

{{% /alert %}}

## Lista de palabras de OpenTelemetry.io {#opentelemetryio-word-list}

Una lista de términos y palabras específicos de OpenTelemetry que se deben usar
de manera uniforme en todo el sitio:

- [OpenTelemetry](/docs/concepts/glossary/#opentelemetry) y
  [OTel](/docs/concepts/glossary/#otel)
- [Collector](/docs/concepts/glossary/#collector)
- [OTEP](/docs/concepts/glossary/#otep)
- [OpAMP](/docs/concepts/glossary/#opamp)

Para obtener una lista completa de los términos de OpenTelemetry y su
definición, consulte [Glosario](/docs/concepts/glossary/).

Asegúrese de que los nombres propios, como otros proyectos de CNCF o
herramientas de terceros, estén escritos correctamente y utilicen la mayúscula
original. Por ejemplo, escriba "PostgreSQL" en lugar de "postgre". Para obtener
una lista completa, consulte el archivo
[`.textlintrc.yml`](https://github.com/open-telemetry/opentelemetry.io/blob/main/.textlintrc.yml).

## Estándares de Markdown {#markdown-standards}

Para hacer cumplir los estándares y la coherencia de los archivos Markdown,
todos los archivos deben seguir ciertas reglas, impuestas por
[markdownlint](https://github.com/DavidAnson/markdownlint). Para obtener una
lista completa, consulte el archivo
[`.markdownlint.json`](https://github.com/open-telemetry/opentelemetry.io/blob/main/.markdownlint.json).

We also enforce Markdown [file format](#file-format) and strip files of trailing
whitespace. This precludes the [line break syntax] of 2+ spaces; use `<br>`
instead or reformat your text.

## Revisión ortográfica {#spell-checking}

Utilice [CSpell](https://github.com/streetsidesoftware/cspell) para asegurarse
de que todo su texto esté escrito correctamente. Para obtener una lista de
palabras específicas del sitio web OpenTelemetry, consulte el archivo
[`.cspell.yml`](https://github.com/open-telemetry/opentelemetry.io/blob/main/.cspell.yml).

Si `cspell` indica un error de `Palabra desconocida`,
verifique si escribió esa palabra correctamente. Si es así, agregue esta palabra
a la sección `cSpell:ignore` en la parte superior de su archivo. Si no existe
dicha sección, puede agregarla al principio de un archivo Markdown:

```markdown
---
title: TítuloDeLaPágina
cSpell:ignore: <word>
---
```

Para cualquier otro archivo, agregue `cSpell:ignore <word>` en una línea de
comentario apropiada para el contexto del archivo. Para un archivo YAML de
entrada [registry](/ecosystem/registry/), podría verse así:

```yaml
# cSpell:ignore <word>
title: TítuloDeEntradaDelRegistro
```

## Formato de archivo {#file-format}

Para hacer cumplir un estándar determinado sobre cómo se estructuran los
archivos, todos los archivos deben estar formateados por
[prettier](https://prettier.io). Ejecute `npm run fix:format` antes de enviar un
PR, o ejecutarlo después y enviar una confirmación adicional.

## Nombres de archivos {#file-names}

Todos los nombres de archivo deben estar en
[kebab case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case).

## Fixing validation issues

To learn how to fix validation issues, see [Pull request checks](../pr-checks).

[.markdownlint.json]: https://github.com/open-telemetry/opentelemetry.io/blob/main/.markdownlint.json
[line break syntax]: https://www.markdownguide.org/basic-syntax/#line-breaks
[markdownlint]: https://github.com/DavidAnson/markdownlint
[Prettier]: https://prettier.io
