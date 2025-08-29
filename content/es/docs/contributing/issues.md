---
title: Propuestas
description: Cómo solucionar un problema existente o informar un error, un riesgo de seguridad o una posible mejora.
weight: 10
_issues: https://github.com/open-telemetry/opentelemetry.io/issues
_issue: https://github.com/open-telemetry/opentelemetry.io/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A
cSpell:ignore: prepopulated
---

<style>
  /* Force all list to be compact. */
  li > p {
    margin-bottom: 0;
  }

  /* Style "first time" alert */
  .alert--first-timer {
    margin: 0.5rem 0 !important;

    > blockquote {
      margin-top: 1rem;
      margin-bottom: 0;
      border-left-color: var(--bs-warning);
      background-color: var(--bs-danger-bg-subtle);
      > *:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>

## Fixing an existing issue

Una de las mejores maneras de contribuir a mejorar la documentación de
OpenTelemetry (OTel) es solucionando un problema ya identificado.

1. Navegar por la lista de [propuestas]({{% param _issues %}}).

2. Seleccione una propuesta en el que le gustaría trabajar, idealmente una que
   se pueda solucionar en poco tiempo. <a name="first-issue"></a>
   {{% alert title="Contribuyendo por la primera vez?" color="primary alert--first-timer" %}}

   Seleccione una propuesta con las siguientes etiquetas:

   - {{% param _issue %}}%22good+first+issue%22

   - {{% param _issue %}}%3A%22help+wanted%22

   > **NOTA**: **_No_ asignamos propuestas** a aquellos que aún no hayan
   >
   > [org]: https://github.com/open-telemetry

   {{% /alert %}}

3. Lea los comentarios del problema, si los hay.

4. Ask maintainers if this issue is still relevant, and ask any questions you
   need for clarification by posting comments over the issue.

5. Comparte tu intención de trabajar en el tema agregando un comentario a este
   efecto.

6. Work on fixing the issue. Let maintainers know if you run into any problems.

7. Cuando este listo, [envia tu trabajo con un pull request](../pull-requests)
   (PR).

## Reportar un problema

Si encuentras un error o quieres hacer unas sugerencias para mejorar el
contenido existente, abre una propuesta.

1. Haz click en el enlace **Crea una propuesta para la documentación** de
   cualquier documento. Eso te va a redireccionar a una pagina de la propuesta
   GitHub prerrellenada con algunos encabezados.
2. Describa el problema o la sugerencia de mejora. Proporcione tantos detalles
   como pueda.
3. Haz click en **Submit new issue**.

Después de enviar el problema, verifique su problema de vez en cuando o active
las notificaciones de GitHub. Puede que pasen algunos días hasta que los
mantenedores respondan.
Los revisores y otros miembros de la comunidad pueden
hacer preguntas antes de poder tomar medidas sobre su problema.

## Sugerir nuevos contenidos o funciones

Si tienes una idea para un nuevo contenido o funcionalidad, pero no estás seguro
de dónde debería ir, aún puedes presentar una propuesta. También puedes informar
errores y vulnerabilidades de seguridad.

1. Ve a [GitHub](https://github.com/open-telemetry/opentelemetry.io/issues/new/)
   y selecciona **Nueva propuesta** dentro de la pestaña **Propuestas**.

2. Seleccione el tipo de problema que mejor se aplica a su solicitud o duda.

3. Rellene la plantilla.

4. Envia la propuesta.

### How to file great issues

Keep the following in mind when filing an issue:

- Proporcione una descripción clara del problema. Describa específicamente qué
  falta, qué está desactualizado, qué está mal o qué necesita mejorarse.
- Explique el impacto específico que tiene el problema en los usuarios.
- Limite el alcance de un problema determinado a una unidad de trabajo
  razonable. En el caso de problemas de gran alcance, divídelos en tareas más
  pequeñas. Por ejemplo, "Corregir la documentación de seguridad" es demasiado
  amplio, pero "Agregar detalles en la sección 'Restringir el acceso a la red'"
  es lo suficientemente específico como para que se pueda llevar a cabo una
  acción.
- Busque los problemas existentes para ver si hay algo relacionado o similar al
  nuevo problema.
- Si el nuevo problema se relaciona con otro problema o solicitud de
  incorporación de cambios, haga referencia a él por su URL completa o por el
  número del problema o solicitud de incorporación de cambios precedido por el
  carácter `#`, por ejemplo `Introducido por #987654`. For example, `Introduced by #987654`.
- Sigue el
  [Código de conducta](https://github.com/open-telemetry/community/blob/main/code-of-conduct.md).
  Respete a sus compañeros colaboradores. Por ejemplo, decir "Los documentos son
  terribles" no es un comentario útil ni cortés.
