# Anuncios Grupo Barba — octubre 2026

Creativos genéricos (no de un vino en particular), con lo que propone el cliente:
"Pedinos la lista", "mejores precios", "directo de bodega". Mismo método que
`Desktop/Claude/ads/` (mis propios anuncios). Estado al 4-oct: todo renderizado,
**nada mostrado al cliente todavía**.

## Placas (PNG, 4:5 y 9:16, versión CABA e interior)

| Pieza | Mensaje | Opciones (foto) |
|---|---|---|
| B1 | Directo de bodega. *Sin intermediarios.* | 1 cajas en depósito · 2 cajón abierto |
| B2 | ¿Qué vino llevás este finde? *Pedinos la lista.* | 1 sirviendo · 2 brindis |
| B3 | 1 Los vinos que te gustan, *a precio de distribuidora.* · 2 Espumantes de bodega, *a precio mayorista.* (desde $6.800) | copa · espumante |
| B4 | Michel Rolland. Codorníu. Colomé. Rosell Boher. *Todas en una sola lista.* | 1 cava · 2 viñedo |
| B6–B10 | De producto, botella integrada por Nano Banana (foto real de referencia + fondo): María Codorníu (desde $6.800), Amalaya ($10.917), Rosell Boher (desde $10.588), Michel Rolland y Yacochuya (consultá precio) | un fondo cada una |
| B5 | Envíos: CABA "Pedís la caja, *te la llevamos sin cargo*" / interior "¿Estás en el interior? *Te lo llevamos al expreso*" | reparto |

- Todo sale de `templates/placa.html` (datos arriba del archivo) + `templates/base.css`.
- `node tools/render.mjs [B1 …] [--f=45|916] [--r=caba|interior]` → `B1/opcion-1/B1-o1-caba-4x5.png`.
  El mismo script controla zona segura de 9:16 y que el titular no pise el pie.

## Videos (MP4 9:16, CABA e interior) — Hyperframes 0.8.126 en `video/`

| Video | Qué es | Dur. |
|---|---|---|
| V1 | Tipografía cinética: Directo de bodega → Sin intermediarios (fotos) → ráfaga de bodegas con la **botella real** → Precio de distribuidora → Pedinos la lista | 12,7 s |
| V2 | Clip Seedance: vino sirviéndose + "¿Qué vino llevás este finde?" → cierre Pedinos la lista | 9,6 s |
| V3 | Clip Seedance: copas de espumante + "Espumantes de bodega, a precio mayorista. Desde $6.800" | 9,6 s |
| V4 | Clip Seedance: cajas en la vereda + mensaje de envío (distinto en CABA e interior) | 9,6 s |

- `cd video && node build.mjs && sh render.sh v1-caba v2-interior …` → `../V1/V1-caba-9x16.mp4`.
- Los textos y tiempos están en `video/build.mjs`. render.sh copia cada variante a `index.html` (una sola raíz).
- Chequeo: `cp src/v3-caba.html index.html && npx -y hyperframes@0.8.126 check .`

## Reglas

- **La IA no dibuja botellas con etiqueta ni bodegas reales.** Las fotos de IA son genéricas
  (cajas lisas, botellas de espaldas). Las botellas con marca son los recortes reales de
  `../octubre/assets/botellas/` (fuentes en `../octubre/README.md`).
- Envío: CABA = "sin cargo en CABA y Zona Norte" (no GBA). Interior = "sin cargo al expreso que elijas".
- Sin teléfonos ni mails en la imagen: el botón de WhatsApp lo pone Meta.
- `video/assets/clips/reparto-con-brazos.mp4` es el primer intento de V4: salieron brazos sin
  cuerpo. No usar.

## Higgsfield

Nano Banana Pro 2K (9 fotos) + Seedance 2.5 1080p 6 s = 72 créditos cada clip (4 clips).
IDs de las fotos (sirven como start_image para clips nuevos): cajas 07faab16, cajón decb238f,
servir 06515577, brindis 9e7aab0a, copa 6dcada1e, espumante 862938d0, cava 3f55649c,
viñedo 106476a8, reparto 8708849e.

## Devolución del cliente (9-oct)

"Desde $X" con la lista de productos al lado confundía: en una misma bodega cada producto
tiene otro precio. Ahora **el precio nombra el producto** y el resto va con "consultá precio":
María Codorníu = Extra Brut $6.800 (B6, B3-o2, V3); Rosell Boher = Casa Boher $10.588 (B8).
Amalaya es un solo producto y no cambió. Campos nuevos en la plantilla: `precio.que` y `nota`.
Ojo: la botella de B6 dice Brut Nature y la de B8 es el Rosell Boher Brut, no la del precio.

## Pendiente

- Elegir opciones con el cliente. Versiones 4:5 de los videos (no hechas). Música (son mudos).
- Sin fecha de vencimiento en las piezas (pedido del 4-oct: la oferta puede durar hasta fin de mes). "Desde $6.800" sí vence con la lista.

## Entrega

Copia para Drive, con nombres legibles: `../Grupo Barba - Anuncios octubre/` (64 archivos, 4-oct; placas 10–14 = B6–B10). Si se regenera algo, volver a copiarlo ahí.

## Placas de producto (B6–B10): cómo se hicieron

- **No pegar la botella recortada encima del fondo** (se nota). Se sube el recorte de
  `assets/botellas/` a Higgsfield y Nano Banana Pro la integra en la escena (2 referencias:
  botella + fondo). Fotos finales: `assets/gen/prod-*.jpg`.
- **Revisar la letra chica de cada etiqueta contra la original.** La marca grande sale bien,
  la chica la inventa: Amalaya y Yacochuya salieron con texto deformado y hubo que regenerarlas
  pidiendo la letra chica textual en el prompt. Los intentos malos quedaron como `*-letra-mal.png`.
  Yacochuya final todavía tiene detalles mínimos («FROCEDENCIA», la añada) ilegibles al tamaño del anuncio.
- En 4:5 la foto va entera (contain) a la derecha y se funde a la izquierda; en 9:16 a sangre.

## Repo

GitHub: https://github.com/lautaromendezar-cmd/barba-ads (privado del usuario, rama `main`). Para otra PC: `RETOMAR-EN-OTRA-PC.md`. Lo terminado (PNG/MP4) no va al repo: está en la carpeta del Drive.
