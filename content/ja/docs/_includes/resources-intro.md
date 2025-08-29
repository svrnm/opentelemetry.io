---
params:
  aResource: プロセス
---

[リソース]({{ $resourceHRef }})は、リソース属性としてテレメトリーを生成するエンティティを表します。
たとえば、Kubernetes上のコンテナで実行されているテレメトリーを生成する{{ $aResource }}は、{{ $aResource }}名、ポッド名、ネームスペース、および場合によってはデプロイメント名を持ちます。
これらの4つの属性すべてをリソースに含まれることができます。 For example, {{ $aResource }} producing telemetry that is
running in a container on Kubernetes has {{ $aResource }} name, a pod name, a
namespace, and possibly a deployment name. All four of these attributes can be
included in the resource.

In your observability backend, you can use resource information to better
investigate interesting behavior. For example, if your trace or metrics data
indicate latency in your system, you can narrow it down to a specific container,
pod, or Kubernetes deployment.
