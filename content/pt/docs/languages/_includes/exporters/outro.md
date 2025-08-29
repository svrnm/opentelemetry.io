## Exportadores personalizados {#custom-exporters}

Por fim, também é possível escrever o seu próprio exportador. Para mais
informações, consulte [SpanExporter Interface na documentação da API]({{ $1 }}).

## Agrupamento de trechos e registros de log {#batching-span-and-log-records}

O SDK do OpenTelemetry fornece um conjunto de processadores padrão de trechos e
registros de log, que permitem emitir trechos um-a-um ("simples") ou em lotes. O
uso de agrupamentos é recomendado, mas caso não deseje agrupar seus trechos ou
registros de log, é possível utilizar um processador simples da seguinte forma:
