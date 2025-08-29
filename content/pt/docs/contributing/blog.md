---
title: Blog
description: Saiba como enviar uma publicação para o blog.
weight: 30
---

O [_blog_ do OpenTelemetry](/blog/) comunica novas funcionalidades, relatórios
da comunidade e quaisquer novidades que possam ser relevantes para a comunidade
OpenTelemetry. Isso inclui tanto usuários finais quanto desenvolvedores. Qualquer pessoa pode escrever uma publicação — veja abaixo quais são os
requisitos.

## Documentação ou post no blog?

Antes de escrever um _post_ no _blog_, pergunte a si mesmo se o conteúdo também
poderia ser uma boa adição à documentação. Se a resposta for "sim", crie uma
nova _issue_ ou _pull request_ (PR) com seu conteúdo para que seja adicionado à
documentação.

Observe que o foco dos mantenedores e aprovadores do site do OpenTelemetry é
melhorar a documentação do projeto, então sua publicação terá menor prioridade
de revisão.

## Antes de enviar um post no blog {#before-submitting-a-blog-post}

As publicações no _blog_ não devem ter caráter comercial e devem conter conteúdo
original que seja amplamente relevante para a comunidade OpenTelemetry. As
publicações devem seguir as políticas descritas no
[Guia de Mídias Sociais](https://github.com/open-telemetry/community/blob/main/social-media-guide.md).

Verifique se o conteúdo pretendido se aplica amplamente à comunidade
OpenTelemetry. Exemplos de conteúdos adequados incluem:

- Novas funcionalidades do OpenTelemetry
- Atualizações de projetos do OpenTelemetry
- Atualizações de Grupos de Interesse Especial (SIGs)
- Tutoriais e guias passo a passo
- Integrações com OpenTelemetry

Conteúdos inadequados incluem:

- Vendor product pitches

Caso sua publicação se encaixe na lista de conteúdos apropriados,
[crie uma _issue_](https://github.com/open-telemetry/opentelemetry.io/issues/new?title=New%20Blog%20Post:%20%3Ctitle%3E)
com os seguintes detalhes:

- Título da publicação
- Breve descrição e estrutura do conteúdo
- Se aplicável, liste as tecnologias utilizadas. Todas devem ser de código
  aberto, e deve-se dar preferência a projetos da CNCF em relação a projetos
  fora da CNCF (por exemplo, use Jaeger para visualização de rastros e
  Prometheus para visualização de métricas)
- Nome de um [SIG](https://github.com/open-telemetry/community/) relacionado ao
  conteúdo
- Nome de um patrocinador (mantenedor ou aprovador) desse SIG, que ajudará a
  revisar o PR. Idealmente, o patrocinador deve ser de uma empresa diferente da
  sua

Os mantenedores do SIG de Comunicação irão verificar se sua publicação atende a
todos os requisitos para ser aceita. Caso não consiga indicar um
SIG/patrocinador inicialmente na sua _issue_, eles poderão te direcionar a um
SIG apropriado, com o qual você pode entrar em contato para obter patrocínio. Ter um patrocinador é opcional, mas aumenta a chance de a publicação ser
revisada e aprovada mais rapidamente.

If your issue has everything needed, a maintainer will verify that you can go
ahead and submit your blog post.

## Enviar um post no blog {#submit-a-blog-post}

Você pode enviar um _post_ no _blog_ criando um _fork_ do repositório e
escrevendo-o localmente ou usando a interface do GitHub. Em ambos os casos,
pedimos que siga as instruções fornecidas pelo
[modelo de _post_ no _blog_](https://github.com/open-telemetry/opentelemetry.io/tree/main/archetypes/blog.md).

### Criar um _fork_ e escrever localmente {#fork-and-write-locally}

Depois de configurar o _fork_ local, você pode criar um _post_ no _blog_ usando
um modelo.
Siga estes passos para criar um _post_ a partir do modelo:

1. Execute o seguinte comando a partir da raiz do repositório:

   ```sh
   npx hugo new content/pt/blog/2025/nome-curto-da-publicação.md
   ```

   Caso seu _post_ tenha imagens ou outros arquivos, execute o seguinte comando:

   ```sh
   npx hugo new content/pt/blog/2025/nome-curto-da-publicação/index.md
   ```

2. Edite o arquivo Markdown no caminho informado no comando anterior. O arquivo
   é inicializado a partir do modelo de _post_ no _blog_ localizado em
   [archetypes](https://github.com/open-telemetry/opentelemetry.io/tree/main/archetypes/).

3. Adicione imagens ou outros arquivos na pasta criada.

4. Quando a publicação estiver pronta, envie-a através de um _pull request_.

### Usando a interface do GitHub {#use-the-github-ui}

Se preferir não criar um _fork_ local, é possível usar a interface do GitHub
para criar uma nova publicação. Siga estes passos para adicionar uma publicação
utilizando a interface do GitHub:

1. Acesse o
   [modelo de publicação](https://github.com/open-telemetry/opentelemetry.io/tree/main/archetypes/blog.md)
   e clique em **Copy raw content** (Copiar conteúdo) no canto superior direito
   do menu.

2. Vá para
   [Create a new file (Crie um novo arquivo)](https://github.com/open-telemetry/opentelemetry.io/new/main).

3. Cole o conteúdo do modelo copiado no primeiro passo.

4. Nomeie seu arquivo, por exemplo
   `content/pt/blog/2025/nome-curto-da-publicação/index.md`.

5. Edite o arquivo Markdown diretamente no GitHub.

6. Quando a publicação estiver pronta, selecione **Propose changes** (Proponha
   mudanças) e siga as instruções.

## Prazos de publicação {#publication-timelines}

O _blog_ do OpenTelemetry não segue um prazo de publicação rigoroso, o que
significa que:

- Seu _post_ será publicado quando tiver todas as aprovações necessárias.
- A publicação pode ser adiada se necessário, e os mantenedores não podem
  garantir que a publicação ocorra antes ou em uma determinada data.
- Alguns _posts_ no _blog_ (anúncios importantes) podem ter prioridade e serem
  publicados antes do seu.

## Cross-posting blog content

If you'd like to share your OpenTelemetry blog post on another platform, you're
welcome to do so. Just keep the following in mind:

- Decide which version will be the canonical post (typically the original
  OpenTelemetry blog post).
- Other versions of the post should:
  - Clearly mention that the original post appeared on the OpenTelemetry blog.
  - Include a link back to the original at the top or bottom of the page.
  - Set a canonical URL tag pointing to the OpenTelemetry blog post, if the
    platform supports it.

This helps ensure proper attribution, supports SEO best practices, and avoids
content duplication.
