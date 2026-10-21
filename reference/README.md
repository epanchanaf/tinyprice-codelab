# Código completo de referencia

Esta carpeta complementa el codelab con una copia completa y sincronizada de los archivos relevantes. Usa Retrofit/Gson, recolección de estado consciente del ciclo de vida y pruebas automatizadas. No contiene claves reales.

## Android

1. Crea el proyecto con Android Studio siguiendo los pasos del codelab.
2. Copia `android/app/src` sobre `app/src`.
3. Usa los archivos Gradle de `android/` como referencia para configurar el proyecto.
4. Copia también `android/app/src/test` y `android/app/src/androidTest` para ejecutar los ejemplos de pruebas.
5. Define en tu `~/.gradle/gradle.properties` (no en Git):

   ```properties
   edgeRuntimeBaseUrl=https://YOUR_PROJECT_REF.supabase.co/functions/v1
   useRemoteDeals=true
   ```

El directorio es una instantánea de fuentes, no un segundo proyecto ejecutable: el wrapper de Gradle y los archivos generados los crea Android Studio.

Ejecuta `./gradlew :app:testDebugUnitTest` para los tests del ViewModel y `./gradlew :app:connectedDebugAndroidTest` con un teléfono físico autorizado o un emulador para la prueba Compose.

## Supabase alojado

1. Copia `supabase/functions/search-products/index.ts` a tu proyecto de Supabase.
2. Configura `TINYFISH_API_KEY` como secreto alojado; `.env.example` solo documenta el nombre.
3. Despliega `search-products` con la configuración de `supabase/config.toml`.

La configuración pública (`verify_jwt = false`) es deliberadamente didáctica. Antes de distribuir la app, añade Supabase Auth, límites compartidos, cuotas y alertas.

No publiques una clave de TinyFish en la app Android, en un archivo Gradle versionado ni en este directorio.
