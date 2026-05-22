# Omni-Lingua · Subtitle Companion

Extensión Chrome MV3 · Diferenciador #8 del PROMPT.

Marca palabras `i+1` en subtítulos de Netflix/YouTube y permite añadirlas a tu deck con 1 click. Privacy first · todo vive en `chrome.storage.local` · sin servidor.

## Instalación local (modo desarrollador)

1. Abre Chrome → `chrome://extensions`
2. Activa "Modo de desarrollador" (esquina superior derecha)
3. Pulsa "Cargar descomprimida" y selecciona esta carpeta `chrome-extension/`
4. Listo · el icono Omni-Lingua aparece en la barra

## Uso

1. Abre Netflix o YouTube con subtítulos en inglés activados
2. Las palabras "no conocidas" (todo lo que no marcaste) aparecen resaltadas en coral suave
3. Click sobre una palabra → la añade a tu lista de "conocidas"
4. Re-click → la quita
5. El popup muestra cuántas palabras conocidas tienes

## Integración con app principal

Por ahora la extensión y la app principal mantienen `known-words` separados. Roadmap:
- Sync con la app vía `window.postMessage` desde la página de Omni-Lingua
- Export/import JSON manual desde Settings

## Iconos

Pendientes · placeholders en `icons/` (192/48/16). Genera con Figma o herramientas similares.

## Sites soportados

- Netflix (`.player-timedtext-text-container`)
- YouTube (`.ytp-caption-segment`)
- Disney+ · Apple TV pendientes (selectores varían)
