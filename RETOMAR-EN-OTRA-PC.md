# Retomar los anuncios de Grupo Barba en otra PC

Primero leer **CONTINUAR.md** (qué hay, cómo se regenera, reglas). Esto es sólo la instalación.

## Qué hace falta

- **Node 20 o más** y **Google Chrome** instalados (los scripts usan el Chrome del sistema).
- **ffmpeg** sólo si se van a tocar los videos.
- El conector de **Higgsfield** en Claude (misma cuenta): las fotos y clips se generaron ahí
  y los IDs están en CONTINUAR.md, sirven como referencia o start_image.

## Instalar (una vez)

```
git clone https://github.com/lautaromendezar-cmd/barba-ads.git
cd barba-ads
npm i
```

(instala playwright y sharp; no descarga navegadores, usa Chrome)

## Regenerar

- Placas: `node tools/render.mjs` → crea las carpetas B1…B10 con los PNG.
- Videos: `cd video && node build.mjs && sh render.sh v1-caba v1-interior …`
  (en Windows correr `render.sh` desde Git Bash). La primera vez `npx` baja hyperframes 0.8.126.

## Qué NO está en el repo

- Los PNG/MP4 terminados: están en la carpeta **«Grupo Barba - Anuncios octubre»** del Drive.
- `node_modules` (se reinstala con `npm i`).
- Los PNG originales de Higgsfield de `assets/gen/`: alcanzan los JPG (son los que usan las
  plantillas). Si hace falta el original en alta, se baja del historial de Higgsfield.

## Fuentes de las botellas

`FUENTES-BOTELLAS.md` (de dónde salió cada recorte). Los recortes están en `assets/botellas/`.
