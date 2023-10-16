{{/*
cSpell:ignore: bution cial cond distri
*/ -}}
{{ $nativeOTLP := .Get 0 | default true }}
{{ $data := sort (sort (sort $.Site.Data.ecosystem.vendors "name") "oss" "desc") "commercial" -}}

| Organization[^org] | OSS | Com&shy;mer&shy;cial | Distri&shy;bution | Learn more  |
| ----------- | ----------- | ---------- | ----------------- | ----------- |
{{- range where $data "nativeOTLP" $nativeOTLP }}
  {{- $shortUrl := .shortUrl -}}
  {{- if not $shortUrl  }}
      {{- $tmp := split (replace .docsUrl "https://" "") "/"  }}
      {{- $shortUrl = (index $tmp 0) }}
      {{- if gt (len $tmp) 1  }}
          {{- $shortUrl = printf "%s/…" $shortUrl  }}
      {{- end }}
  {{- end }}
  {{/* Each line below is a column: */ -}}
  {{ .name }} |
  {{- cond .oss "Yes" "No" }} |
  {{- cond .commercial "Yes" "No" }} |
  {{- cond .distribution "Yes" "No" }} |
  {{- /* */}} {{- if .docsUrl }} [{{ $shortUrl }}]({{ .docsUrl }}) {{- end }} |
{{- end }}

[^org]: Organizations are grouped as follows based on their OTel support:
    - Pure OSS
    - Mixed OSS/commercial
    - Commercial
    - Alphabetical within each group
