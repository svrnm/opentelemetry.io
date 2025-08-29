---
title: Distribuições
linkTitle: Distributions
description: Lista de distribuições de código aberto do OpenTelemetry mantidas por terceiros.
---

As [distribuições](/docs/concepts/distributions/) do OpenTelemetry são uma forma
de personalizar os componentes do OpenTelemetry para torná-los mais fáceis de
implantar e utilizar com _backends_ de observabilidade específicos.

Qualquer terceiro pode personalizar os componentes do OpenTelemetry com
alterações específicas para _backends_, fornecedores ou usuários finais. Não é
obrigatório utilizar distribuições para utilizar os componentes do
OpenTelemetry, embora elas possam facilitar o uso em determinadas
circunstâncias, como requisitos específicos de fornecedores.

A lista a seguir contém uma amostra de distribuições do OpenTelemetry e seus
componentes personalizados. For
[OpenTelemetry Collector](/docs/collector/) distributions, see
[Collector distributions](/docs/collector/distributions/).

{{% ecosystem/distributions-table %}}

## Adicionando sua distribuição {#how-to-add}

Para que sua distribuição seja listada, \[envie um PR] com uma entrada adicionada
à \[lista de distribuições]. A entrada deve incluir:

- Link para a página principal da sua distribuição
- Link para a documentação que explica como utilizar a distribuição
- Lista dos componentes que sua distribuição contém
- Usuário do GitHub ou e-mail como ponto de contato, para que possamos entrar em
  contato caso tenhamos dúvidas

{{% alert title="Notas" %}}

- Se você fornece integração externa do OpenTelemetry para qualquer tipo de
  biblioteca, serviço ou aplicativo, considere
  [adicioná-la ao registro](/ecosystem/registry/adding).
- Se você adota o OpenTelemetry para observabilidade como um usuário final e não
  fornece nenhum tipo de serviço relacionado ao OpenTelemetry, consulte
  [Adotantes](/ecosystem/adopters).
- Se você oferece uma solução que consome o OpenTelemetry para fornecer
  observabilidade aos usuários finais, consulte
  [Fornecedores](/ecosystem/vendors).

{{% /alert %}}

[submit a PR]: /docs/contributing/pull-requests/

{{% include keep-up-to-date.md distribuições %}}

[components]: /docs/concepts/components/
[distributions]: /docs/concepts/distributions/
[distributions list]: https://github.com/open-telemetry/opentelemetry.io/tree/main/data/ecosystem/distributions.yaml
[vendor]: ../vendors/
