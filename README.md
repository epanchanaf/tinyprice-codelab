# TinyPrice Codelab

Experiencia local, autocontenida y sin proceso de compilación para reproducir la app TinyPrice con Android, TinyFish Search y Supabase Edge Functions alojadas. Incluye la instalación y activación de la skill oficial `android-cli` para Codex y Gemini CLI.

## Abrir

Desde esta carpeta ejecuta un servidor estático:

```bash
python3 -m http.server 4173
```

Después abre `http://localhost:4173`.

También es posible abrir `index.html` directamente, aunque el portapapeles del navegador puede exigir un origen `http://` para que funcione el botón **Copiar**.

## Archivos

- `index.html`: los 16 pasos y todos los fragmentos de código.
- `styles.css`: experiencia responsive inspirada en Google Codelabs.
- `app.js`: navegación, progreso, tema, checklist y copia de código.
- `reference/`: copia completa de las fuentes Android y Supabase utilizadas como referencia, sin secretos.

La guía explica cómo instalar la skill oficial `android-cli` dentro del proyecto Android que cada estudiante construye. Esa skill no necesita estar incluida en este repositorio del codelab.

No utiliza dependencias externas ni recopila datos. El progreso se guarda únicamente en `localStorage` del navegador.
