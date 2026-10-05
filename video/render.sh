#!/bin/sh
# Renderiza variantes: sh render.sh v1-caba v2-interior …  →  ../V1/V1-caba-9x16.mp4
for n in "$@"; do
  code=$(echo "$n" | cut -d- -f1 | tr a-z A-Z); r=$(echo "$n" | cut -d- -f2)
  mkdir -p "../$code"
  cp "src/$n.html" index.html
  npx -y hyperframes@0.8.126 render . -o "../$code/$code-$r-9x16.mp4" --quiet || echo "FALLÓ $n"
done
