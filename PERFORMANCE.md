# Auditoría multimedia

## Antes

7 elementos video: Car Wash 3, Bar 2, Billar 2. Todos con autoplay; Hero con preload auto, resto metadata. Sin posters ni control explícito de visibilidad. Hasta 7 reproductores habilitados, aunque Edge pausaba algunos fuera de pantalla; las tres tarjetas podían reproducirse simultáneamente.

Los originales son H.264 verticales 2160×3840, 30 fps, con audio y bitrates de 15–24 Mbps. Peso único total: 150.440.392 bytes. La caché puede reutilizar descargas, pero no elimina el coste de decodificar múltiples reproductores.

## Después

3 videos: Hero, Bar y Billar. Car Wash secundario y tarjetas usan frames reales WebP extraídos a 4, 12 y 10 segundos respectivamente. Se mantienen composición y estilos.

| Video | Original bytes | Desktop bytes | Móvil bytes |
|---|---:|---:|---:|
| Car Wash | 35.873.049 | 8.036.814 | 1.554.403 |
| Bar | 71.723.092 | 17.598.072 | 4.098.865 |
| Billar | 42.844.251 | 9.128.506 | 1.776.657 |

WebP: Car Wash 298.756 bytes, Bar 144.082 bytes, Billar 125.444 bytes (568.282 bytes total).

Copias web H.264/yuv420p, faststart, 24 fps, sin audio, duración íntegra. Desktop: 1080×1920 CRF24; móvil: 540×960 CRF26. Originales conservados. Los MP4 antiguos de public no se solicitan desde la página.

El Hero precarga su poster; preload metadata. Videos inferiores: preload none, asignación de src al acercarse a 250 px, play solo visibles, pause al salir o esconder la pestaña. Ahorro de datos y movimiento reducido: poster sin descarga MP4. Imágenes secundarias: lazy, async y dimensiones explícitas. El breakpoint móvil se decide al cargar cada recurso.

Peso de los tres MP4: 34,76 MB desktop / 7,43 MB móvil frente a 150,44 MB original (−77% / −95%). Al inicio solo se solicita Hero: 8,04 MB desktop o 1,55 MB móvil más poster; son tamaños completos, no una medida de bytes transferidos en el primer segundo ni de tiempo de carga.

WhatsApp: SVG reconocible ligero, sin dependencia adicional; número y mensaje conservados.

## Verificación

Build Vite correcto. Revisión en Edge por protocolo DevTools y capturas: tres videos reproducen; los otros se pausan al cambiar de sección; tarjetas muestran WebP reales. Inicio sin src en videos inferiores. Movimiento reducido no descarga videos. Sin excepciones JS ni respuestas HTTP >=400 en recorrido probado. Sin overflow a 390, 430, 768 y 1440 px. Car Wash sin precios. Preview local: http://localhost:5174/EliteCarwash/.
