# 🔧 Configuración de JSONBin para Producción

## 📋 Pasos para Configurar JSONBin

### 1. **Crear Cuenta en JSONBin**
1. Ve a [jsonbin.io](https://jsonbin.io)
2. Haz clic en "Sign Up" 
3. Crea una cuenta gratuita (tiene 10,000 requests/mes)

### 2. **Crear un Bin**
1. Una vez logueado, haz clic en "Create Bin"
2. Dale un nombre como "DrMalestar-Data"
3. Haz clic en "Create"
4. **Copia el Bin ID** (algo como `65a1b2c3d4e5f6789abcdef0`)

### 3. **Obtener API Key**
1. Ve a tu dashboard
2. Haz clic en "API Keys" en el menú lateral
3. Haz clic en "Create API Key"
4. Dale un nombre como "DrMalestar-API"
5. Selecciona "Read & Write" permissions
6. **Copia la API Key** (algo como `$2a$10$tu_api_key_aqui`)

### 4. **Configurar el Proyecto**
Edita el archivo `config.js` y reemplaza:

```javascript
const CONFIG = {
    // Reemplaza con tu Bin ID real
    BIN_ID: 'TU_BIN_ID_REAL_AQUI',
    
    // Reemplaza con tu API Key real
    API_KEY: 'TU_API_KEY_REAL_AQUI',
    
    // El resto se mantiene igual
    BASE_URL: 'https://api.jsonbin.io/v3',
    ADMIN_USER: 'admin',
    ADMIN_PASS: 'admin123'
};
```

### 5. **Probar la Configuración**
1. Abre la consola del navegador (F12)
2. Ve al admin (`/admin/`)
3. Inicia sesión (admin/admin123)
4. Intenta agregar un flyer
5. En la consola deberías ver:
   ```
   🔄 Obteniendo datos de JSONBin...
   📋 Bin ID: tu_bin_id_aqui
   🔑 API Key: Configurada
   ✅ Datos obtenidos de JSONBin
   ```

## ❌ Solución de Problemas

### Error HTTP 400
- **Problema**: Credenciales inválidas
- **Solución**: Verifica que BIN_ID y API_KEY sean correctos

### Error HTTP 401
- **Problema**: API Key inválida
- **Solución**: Verifica que la API Key sea correcta y tenga permisos de Read & Write

### Error HTTP 404
- **Problema**: Bin no encontrado
- **Solución**: Verifica que el BIN_ID sea correcto

## 🚀 Para Producción

Una vez configurado correctamente:
1. Sube todos los archivos a Netlify
2. El sistema funcionará automáticamente
3. Los datos se sincronizarán en tiempo real
4. Funcionará desde cualquier dispositivo

## 📊 Estructura de Datos

JSONBin almacenará tus datos en este formato:
```json
{
  "flyers": [
    {
      "id": "1234567890",
      "title": "Título del Flyer",
      "date": "2024-12-31",
      "time": "22:00",
      "location": "Lugar del Evento",
      "description": "Descripción del evento",
      "image": "data:image/jpeg;base64,/9j/4AAQ...",
      "createdAt": "2024-12-31T22:00:00.000Z"
    }
  ],
  "photos": [],
  "videos": []
}
```

## ✅ Verificación Final

Si todo está configurado correctamente, deberías poder:
- ✅ Agregar flyers en el admin
- ✅ Ver flyers en la página principal
- ✅ Eliminar flyers
- ✅ Subir imágenes
- ✅ Todo se sincroniza automáticamente

