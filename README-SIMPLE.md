# 🎸 Dr.Malestar - Sistema Simplificado

Sistema simple y funcional para gestionar contenido de la banda en Netlify.

## 🚀 Características

- **Simple y directo**: Sin código duplicado ni complejidad innecesaria
- **JSONBin para datos**: Almacena metadatos (títulos, descripciones, URLs)
- **Cloudinary para imágenes**: Sube imágenes automáticamente a Cloudinary
- **Netlify Ready**: Funciona perfectamente con Netlify (hosting estático)
- **Sincronización automática**: La página principal se actualiza cuando cambias contenido

## 📋 Archivos del Sistema

### Core
- `js/api.js` - API simplificada para JSONBin
- `js/loader.js` - Cargador de contenido para la página principal
- `admin/admin.js` - Panel de administración

### Configuración
- `config.js` - Credenciales (API Key, Bin ID, usuario admin)

## 🔧 Configuración

### 1. Configurar JSONBin

1. Ve a [jsonbin.io](https://jsonbin.io)
2. Crea una cuenta gratuita
3. Crea un nuevo bin
4. Copia tu **Bin ID** y **API Key**
5. Actualiza `config.js` con tus credenciales:

```javascript
const CONFIG = {
    BIN_ID: 'TU_BIN_ID_AQUI',
    API_KEY: 'TU_API_KEY_AQUI',
    ADMIN_USER: 'admin',
    ADMIN_PASS: 'admin123'
};
```

### 2. Cloudinary (Ya configurado)

Cloudinary ya está configurado con:
- Cloud Name: `daoo9nvfc`
- Upload Preset: `drmalestar_upload`

Las imágenes se suben automáticamente a:
- Flyers: `drmalestar/flyers/`
- Fotos: `drmalestar/photos/`

## 📱 Uso

### Panel de Administración

1. Ve a `admin/index.html`
2. Inicia sesión con tus credenciales (por defecto: `admin` / `admin123`)
3. Gestiona tu contenido:
   - **Flyers**: Agrega shows con fecha, hora, lugar e imagen
   - **Fotos**: Sube fotos de la banda
   - **Videos**: Agrega enlaces de YouTube

### Página Principal

La página principal (`index.html`) carga automáticamente:
- Flyers en la sección "Próximas Fechas"
- Fotos en la sección "Galería"
- Videos en la sección "Videos"

## 🔄 Flujo de Trabajo

1. **Agregar contenido**:
   - Inicia sesión en el admin
   - Completa el formulario
   - Sube la imagen (se sube automáticamente a Cloudinary)
   - Haz clic en "Agregar"

2. **Eliminar contenido**:
   - Haz clic en "Eliminar" en cualquier elemento
   - Confirma la eliminación

3. **Sincronización**:
   - Los cambios se guardan inmediatamente en JSONBin
   - La página principal se actualiza automáticamente

## 🎯 Cómo Funciona

### Almacenamiento

- **JSONBin**: Guarda solo metadatos (títulos, descripciones, URLs)
  - Flyers: título, fecha, hora, lugar, descripción, URL de imagen
  - Fotos: título, descripción, URL de imagen
  - Videos: título, descripción, URL de YouTube

- **Cloudinary**: Almacena las imágenes
  - Subida automática cuando seleccionas una imagen
  - URLs públicas que se guardan en JSONBin

### Límites de JSONBin (Plan Gratuito)

- **100KB máximo por bin**: Si superas este límite, recibirás un error
- **Solución**: Limpia contenido antiguo o crea un nuevo bin

## 🐛 Solución de Problemas

### Error: "Bin ID no configurado"
- Verifica que `config.js` tenga el `BIN_ID` correcto
- O crea un nuevo bin ejecutando `api.createBin()` en la consola

### Error: "Bin supera 100KB"
- Limpia contenido antiguo desde el admin
- O crea un nuevo bin

### Las imágenes no se cargan
- Verifica que Cloudinary esté funcionando
- Abre la consola del navegador (F12) para ver errores

### El contenido no aparece en la página principal
- Recarga la página
- Verifica que `loader.js` esté cargado correctamente
- Abre la consola para ver errores

## 📊 Estructura de Datos

```json
{
  "flyers": [
    {
      "id": "1234567890",
      "title": "Show en Buenos Aires",
      "date": "2024-12-31",
      "time": "22:00",
      "location": "Teatro Colón",
      "description": "Gran show de fin de año",
      "image": "https://res.cloudinary.com/.../flyer.jpg",
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  ],
  "photos": [
    {
      "id": "1234567891",
      "title": "En Vivo",
      "description": "Show en vivo",
      "image": "https://res.cloudinary.com/.../photo.jpg",
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  ],
  "videos": [
    {
      "id": "1234567892",
      "title": "Nuestro Último Show",
      "description": "Grabación en vivo",
      "url": "https://www.youtube.com/watch?v=...",
      "videoId": "abc123",
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  ]
}
```

## 🚀 Despliegue en Netlify

1. **Conecta tu repositorio Git** a Netlify
2. **Configura el build**:
   - Build command: (dejar vacío, es sitio estático)
   - Publish directory: `DrMalestar-Modern` (o la carpeta donde está tu sitio)

3. **Variables de entorno** (opcional):
   - No necesitas variables de entorno
   - Todo está configurado en `config.js`

4. **Despliega**: Netlify detectará cambios automáticamente

## ✅ Ventajas de este Sistema

- ✅ **Simple**: Solo 3 archivos principales
- ✅ **Funcional**: Funciona en desarrollo y producción
- ✅ **Sin servidor**: Perfecto para Netlify
- ✅ **Escalable**: Fácil de mantener y actualizar
- ✅ **Económico**: Usa servicios gratuitos (JSONBin + Cloudinary)

## 📝 Notas Importantes

- **JSONBin gratuito**: Límite de 100KB por bin
- **Cloudinary gratuito**: 25GB de almacenamiento y 25GB de ancho de banda mensual
- **Eliminación**: Cuando eliminas contenido, se elimina de JSONBin pero las imágenes permanecen en Cloudinary (para ahorrar espacio, puedes eliminarlas manualmente desde Cloudinary)

---

**¡Listo para usar!** 🎸