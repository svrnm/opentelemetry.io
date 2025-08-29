## Zipkin

### Configuração do Backend {#zipkin-setup}

{{% alert title=Nota %}}

Caso já possua o Zipkin ou um _backend_ compatível com Zipkin configurado,
poderá pular esta seção e configurar as
[dependências do exportador Zipkin](#zipkin-dependencies) para a sua aplicação.

{{% /alert %}}

É possível executar o [Zipkin][Zipkin](https://zipkin.io/) em um contêiner
Docker através do seguinte comando:

```shell
docker run --rm -d -p 9411:9411 --name zipkin openzipkin/zipkin
```
