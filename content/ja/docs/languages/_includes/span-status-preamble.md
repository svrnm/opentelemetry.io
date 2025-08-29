[ステータス](/docs/concepts/signals/traces/#span-status)は[スパン](/docs/concepts/signals/traces/#spans)に設定でき、通常はスパンが正常に完了しなかったことを示すために使用されます。
つまり`Error`です。
デフォルトでは、すべてのスパンは`Unset`であり、これはスパンがエラーなく完了したことを意味します。
`Ok`ステータスは、デフォルトの`Unset`（つまり「エラーなし」）のままにするのではなく、スパンを明示的に成功としてマークする必要がある場合に予約されています。 By default, all spans are
`Unset`, which means a span completed without error. The `Ok` status is reserved
for when you need to explicitly mark a span as successful rather than stick with
the default of `Unset` (i.e., "without error").

ステータスは、スパンが終了する前であればいつでも設定できます。
