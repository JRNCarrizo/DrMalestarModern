# 📸 Configuración de Cloudinary

Cloudinary se usa para almacenar las imágenes del sitio. Si Cloudinary falla, el sistema automáticamente usa base64 como respaldo.

## 🔧 Configurar Upload Preset en Cloudinary

### Paso 1: Crear cuenta en Cloudinary

1. Ve a [cloudinary.com](https://cloudinary.com)
2. Crea una cuenta gratuita (25GB de almacenamiento gratuito)

### Paso 2: Obtener Cloud Name

1. En el Dashboard, verás tu **Cloud Name**
2. Ya está configurado en `config.js` como `daoo9nvfc`

### Paso 3: Crear Upload Preset

1. Ve a **Settings** → **Upload** → **Upload presets**
2. Haz clic en **Add upload preset**
3. Configura:
   - **Preset name**: `drmalestar_upload` (o el nombre que quieras)
   - **Signing mode**: Selecciona **Unsigned** (IMPORTANTE: debe ser unsigned)
   - **Folder**: `drmalestar` (opcional, para organizar)
4. Haz clic en **Save**

### Paso 4: Actualizar config.js

Si creaste un preset con otro nombre, actualiza `config.js`:

```javascript
CLOUDINARY_UPLOAD_PRESETS: ['TU_PRESET_AQUI', 'drmalestar', 'ml_default'],
```

## ✅ Verificar que funciona

1. Abre el admin (`admin/index.html`)
2. Intenta subir una imagen
3. Revisa la consola del navegador (F12):
   - Si ves `✅ Imagen subida exitosamente` → Funciona correctamente
   - Si ves `⚠️ Cloudinary falló, usando base64...` → Cloudinary no funciona, pero el sistema usa base64 como respaldo

## 🔄 Fallback a Base64

Si Cloudinary no está configurado o falla, el sistema automáticamente:
- Convierte la imagen a base64
- La guarda directamente en JSONBin
- Funciona perfectamente, pero las imágenes ocupan más espacio en JSONBin

## ⚠️ Límites Importantes

### Cloudinary Gratuito:
- **25GB** de almacenamiento
- **25GB** de ancho de banda mensual
- Suficiente para la mayoría de sitios pequeños

### JSONBin con Base64:
- **100KB** máximo por bin (plan gratuito)
- Si usas base64, las imágenes ocupan mucho espacio
- Recomendado: Usar Cloudinary cuando sea posible

## 🆘 Solución de Problemas

### Error: "Bad Request" (400)
- Verifica que el preset sea **Unsigned**
- Verifica que el preset esté **habilitado**
- Verifica que el nombre del preset sea correcto

### Error: "Unauthorized" (401)
- El preset debe ser **Unsigned** para funcionar desde el navegador
- No uses presets firmados (signed) sin configuración adicional

### Las imágenes no se cargan
- Abre la consola (F12) para ver el error exacto
- El sistema automáticamente usa base64 si Cloudinary falla
- Verifica que el preset esté en la lista de `CLOUDINARY_UPLOAD_PRESETS`

---

**Consejo**: Es mejor usar Cloudinary cuando sea posible para ahorrar espacio en JSONBin.
