# Placas Meta Ads — octubre 2026

`node octubre/build.js` (desde `contenidos-barba/`) → 32 PNG en `out/`:
8 placas × 2 regiones (caba / interior) × 2 formatos (feed 1080×1350, stories 1080×1920).
Cambiar un precio o un texto = editar `data.json` y volver a correr.

Diseño rehecho sobre el que está al aire desde septiembre (cabecera oscura con
el lockup, panel crema, franja de envío). Las fuentes de ese diseño no estaban
en esta PC: esta es una reconstrucción, no el original.

## Placas

- Se mantienen: **rolland**, **yacochuya** (las dos que funcionaron en septiembre).
- Del cliente: **maria-codorniu**, **amalaya**, **rosell-boher**. Precios copiados
  de las placas que mandó el cliente (oferta válida hasta el 18-oct).
- Genéricas nuestras: **marcas**, **mayorista**, **lista**.

## Envío por región

- CABA: "Envío sin cargo en CABA y Zona Norte". **No GBA**: el resto del AMBA se consulta.
- Interior: "Te lo llevamos sin cargo al expreso que elijas".

## Botellas (`assets/botellas/`, salen de `node octubre/tools/recortar.mjs`)

| Placa | Fuente |
|---|---|
| rolland | rollandcollection.com (render oficial) |
| yacochuya | tienda.criollawine.com.ar |
| amalaya | cavacolome.com (render oficial) |
| rosell-boher | rosellboher.com (render oficial) |
| maria-codorniu | casadevinosmendoza.com.ar (packshot, etiqueta nueva) |

Las del catálogo de Tienda Nube no sirven: son de Espacio Vino, con marca de agua.
La tienda de Séptima usa imágenes de ChatGPT para María: no usarlas.

## A revisar antes de publicar

- Rosell Boher "desde $10.588" es Casa Boher (tintos/rosado); la botella es el Brut ($27.139).
  Por eso la bajada dice "vinos y espumantes".
- La pared de **marcas** y la hoja de **lista** nombran bodegas de las placas
  de ago–oct: confirmar que siguen en la lista.
- Los precios de la hoja de **lista** son decorado borroneado, ilegibles a propósito.
- Las placas con precio vencen con la oferta (18-oct).
