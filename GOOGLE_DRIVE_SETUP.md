# Google Drive para imagenes de productos

El flujo implementado sube la imagen desde `product-service` a Google Drive y guarda en MySQL solo la URL publica en `imagenUrl`.

## 1. Crear credenciales

1. En Google Cloud Console crea o elige un proyecto.
2. Activa Google Drive API.
3. Crea una cuenta de servicio.
4. Descarga el JSON de credenciales.
5. En tu Google Drive crea una carpeta para imagenes de productos.
6. Comparte esa carpeta con el email de la cuenta de servicio, con permiso de editor.
7. Copia el ID de la carpeta desde la URL de Drive.

## 2. Variables para IntelliJ

La cuenta de servicio solo funciona si subes a un Shared Drive de Google Workspace. Para usar tus 2TB de una cuenta personal, configura OAuth y usa estas variables en `product-service`:

```text
GOOGLE_DRIVE_ENABLED=true
GOOGLE_DRIVE_FOLDER_ID=15Dbbtu0UvmawOs0Wrmsgqmo79tzmsiQq
GOOGLE_DRIVE_AUTH_MODE=oauth
GOOGLE_DRIVE_OAUTH_CLIENT_ID=TU_CLIENT_ID
GOOGLE_DRIVE_OAUTH_CLIENT_SECRET=TU_CLIENT_SECRET
GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN=TU_REFRESH_TOKEN
GOOGLE_DRIVE_PUBLIC_IMAGES=true
```

No guardes `GOOGLE_DRIVE_OAUTH_CLIENT_SECRET` ni `GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN` dentro del codigo del proyecto. Ponlos como variables de entorno en IntelliJ o en un archivo local ignorado por Git.

Luego reinicia:

1. `config-server`
2. `product-service`
3. `api-gateway`

## 3. Probar

En el panel administrador, crea un producto y selecciona una imagen. El frontend llamara primero a:

```text
POST /api/v1/products/images
```

Ese endpoint devuelve una URL de Drive y luego se crea el producto con esa URL.
