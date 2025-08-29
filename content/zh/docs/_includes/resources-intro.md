---
params:
  aResource: 进程
---

A [resource]({{ $resourceHRef }}) represents the entity producing telemetry as
resource attributes. [资源]({{ $resourceHRef }})以资源属性的形式表示产生遥测数据的实体。例如，
{{ $aResource }} 产生的遥测数据运行在 Kubernetes 的容器中，那么它会具有
{{ $aResource }} 的名称、Pod 名称、命名空间，可能还有部署名称。这四个属性都可以包含在资源中。 All four of these attributes can be
included in the resource.

In your observability backend, you can use resource information to better
investigate interesting behavior. For example, if your trace or metrics data
indicate latency in your system, you can narrow it down to a specific container,
pod, or Kubernetes deployment.
