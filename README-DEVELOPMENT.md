# 🚀 Sistema de Desarrollo - Dr.Malestar

Sistema de desarrollo local con sincronización automática con Git/Netlify.

## 📋 Características

- **Almacenamiento Local**: Todos los datos se guardan en localStorage del navegador
- **Sincronización Automática**: Se sincroniza automáticamente con Git cada 30 segundos
- **Gestión de Imágenes**: Las imágenes se convierten a base64 y se almacenan localmente
- **Eliminación Real**: Los elementos eliminados se eliminan del sistema
- **Debugging**: Funciones de debugging integradas para desarrollo

## 🔧 Archivos del Sistema

### Core
- `js/local-storage-api.js` - API para almacenamiento local
- `js/git-sync.js` - Sincronización con Git
- `js/local-loader.js` - Cargador para la página principal
- `admin/local-admin.js` - Panel de administración local

### Configuración
- `config.js` - Configuración de credenciales
- `setup-development.js` - Configuración automática para desarrollo

## 🚀 Uso en Desarrollo

### 1. Iniciar el Sistema
```javascript
// En la consola del navegador
setupDev()
```

### 2. Probar el Sistema
```javascript
// Probar todas las funcionalidades
testDev()
```

### 3. Ver Estadísticas
```javascript
// Ver estadísticas actuales
dev.stats()
```

### 4. Sincronizar con Git
```javascript
// Sincronizar manualmente
dev.sync()
```

### 5. Exportar para Netlify
```javascript
// Exportar datos para Netlify
dev.export()
```

## 📊 Funciones de Debugging

### Estadísticas
```javascript
dev.stats() // Ver estadísticas del sistema
```

### Limpiar Datos
```javascript
dev.clear() // Limpiar todos los datos locales
```

### Sincronización
```javascript
dev.sync() // Sincronizar con Git
dev.history() // Ver historial de sincronización
```

### Exportación
```javascript
dev.export() // Exportar para Netlify
```

## 🔄 Flujo de Trabajo

1. **Desarrollo Local**:
   - Agregar/editar/eliminar contenido en el admin
   - Los datos se guardan en localStorage
   - La página principal se actualiza automáticamente

2. **Sincronización Automática**:
   - Cada 30 segundos se sincroniza con Git
   - Se crean archivos JSON para Git
   - Se mantiene historial de sincronización

3. **Despliegue a Netlify**:
   - Los archivos se suben a Git
   - Netlify detecta los cambios automáticamente
   - Se despliega la versión actualizada

## 📁 Estructura de Archivos Generados

```
data/
├── content.json          # Datos principales (flyers, fotos, videos)
├── images.json           # Lista de imágenes
└── commit.json           # Información del commit

netlify-deploy.json       # Datos para Netlify
git-config.json           # Configuración de Git
sample-data.json          # Datos de ejemplo
```

## ⚙️ Configuración

### Auto-sync
```javascript
// Habilitar/deshabilitar auto-sync
gitSync.startAutoSync()  // Habilitar
gitSync.stopAutoSync()   // Deshabilitar
```

### Intervalo de Sincronización
```javascript
// Cambiar intervalo (en milisegundos)
gitSync.syncInterval = 60000 // 1 minuto
```

## 🧪 Testing

### Probar Local Storage API
```javascript
testLocalAPI()
```

### Probar Local Admin
```javascript
testLocalAdmin()
```

### Probar Local Loader
```javascript
testLocalLoader()
```

### Probar Sistema Completo
```javascript
testDev()
```

## 📱 Uso en Producción

1. **Desarrollo**: Usar el sistema local
2. **Testing**: Probar con `testDev()`
3. **Sincronización**: Usar `dev.sync()` o auto-sync
4. **Despliegue**: Los cambios se suben automáticamente a Git
5. **Netlify**: Detecta cambios y despliega automáticamente

## 🔍 Debugging

### Ver Logs
- Abrir consola del navegador (F12)
- Los logs aparecen con emojis para fácil identificación
- Usar `dev.stats()` para ver estado actual

### Limpiar Sistema
```javascript
// Limpiar datos locales
dev.clear()

// Limpiar historial de sync
gitSync.clearSyncHistory()
```

## 📈 Monitoreo

### Estadísticas en Tiempo Real
```javascript
// Ver estadísticas actuales
dev.stats()

// Ver historial de sincronización
dev.history()
```

### Notificaciones
- Las notificaciones aparecen en la esquina superior derecha
- Se auto-eliminan después de 5 segundos
- Se pueden deshabilitar en la configuración

## 🚨 Solución de Problemas

### Datos No Se Sincronizan
1. Verificar que Git Sync esté activo: `gitSync.isAutoSync`
2. Verificar historial: `dev.history()`
3. Sincronizar manualmente: `dev.sync()`

### Imágenes No Se Cargan
1. Verificar que `image-handler.js` esté cargado
2. Verificar que las imágenes estén en base64
3. Verificar consola para errores

### Admin No Funciona
1. Verificar que `local-admin.js` esté cargado
2. Verificar que `localAPI` esté disponible
3. Verificar credenciales en `config.js`

## 🎯 Próximos Pasos

1. **Desarrollo**: Continuar agregando contenido
2. **Testing**: Probar todas las funcionalidades
3. **Sincronización**: Verificar que se sincronice correctamente
4. **Despliegue**: Subir cambios a Git
5. **Producción**: Verificar que Netlify despliegue correctamente

---

**¡El sistema está listo para desarrollo! Usa `setupDev()` para comenzar.**

