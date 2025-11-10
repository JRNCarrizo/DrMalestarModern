# 🔍 Cómo Obtener el Bin ID Correcto

## Si cargaste contenido en modo incógnito:

### Paso 1: Abre la página en modo incógnito (donde funciona)
1. Abre Chrome/Edge en modo incógnito
2. Ve a tu página
3. Abre la consola (F12)

### Paso 2: Ejecuta estos comandos en la consola:

```javascript
// Ver el Bin ID actual
localStorage.getItem('drmalestar_bin_id')

// Ver todos los datos para confirmar que tiene contenido
api.getData().then(d => {
    console.log('Flyers:', d.flyers?.length || 0);
    console.log('Photos:', d.photos?.length || 0);
    console.log('Videos:', d.videos?.length || 0);
    console.log('Bin ID:', api.binId);
})
```

### Paso 3: Copia el Bin ID que aparece

### Paso 4: Actualiza config.js con ese Bin ID

---

## Solución alternativa (más fácil):

Si prefieres, puedo hacer que el código detecte automáticamente y use el bin con contenido, sin necesidad de actualizar manualmente el config.js cada vez. ¿Quieres que implemente esa solución?


