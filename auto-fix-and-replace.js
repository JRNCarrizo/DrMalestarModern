// ===========================================
// SCRIPT AUTOMÁTICO PARA ARREGLAR API Y REEMPLAZAR FLYERS
// ===========================================

// Este script se ejecuta en el navegador para arreglar la API y reemplazar los flyers automáticamente

console.log('🚀 Iniciando arreglo automático de API y reemplazo de flyers...');

// Función para esperar un poco
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Función principal
async function autoFixAndReplace() {
    try {
        console.log('🔧 Paso 1: Arreglando API...');
        
        // Verificar si las funciones están disponibles
        if (typeof fixAPI === 'undefined') {
            console.error('❌ La función fixAPI no está disponible. Asegúrate de cargar el panel de administración.');
            return false;
        }
        
        // Arreglar la API
        const apiFixed = await fixAPI();
        if (!apiFixed) {
            console.error('❌ No se pudo arreglar la API');
            return false;
        }
        
        console.log('✅ API arreglada correctamente');
        await wait(2000); // Esperar 2 segundos
        
        console.log('🔄 Paso 2: Reemplazando flyers...');
        
        // Verificar si la función replaceFlyers está disponible
        if (typeof replaceFlyers === 'undefined') {
            console.error('❌ La función replaceFlyers no está disponible.');
            return false;
        }
        
        // Reemplazar flyers
        const flyersReplaced = await replaceFlyers();
        if (!flyersReplaced) {
            console.error('❌ No se pudieron reemplazar los flyers');
            return false;
        }
        
        console.log('✅ Flyers reemplazados correctamente');
        console.log('🎉 ¡Proceso completado exitosamente!');
        
        return true;
        
    } catch (error) {
        console.error('❌ Error en el proceso automático:', error);
        return false;
    }
}

// Función para mostrar el estado
function showStatus() {
    console.log('📊 Estado actual:');
    console.log('   - API Key configurada:', typeof cloudAPI !== 'undefined' && cloudAPI.apiKey ? 'Sí' : 'No');
    console.log('   - Bin ID:', cloudAPI?.binId || 'No configurado');
    console.log('   - Funciones disponibles:');
    console.log('     * fixAPI:', typeof fixAPI !== 'undefined' ? '✅' : '❌');
    console.log('     * replaceFlyers:', typeof replaceFlyers !== 'undefined' ? '✅' : '❌');
}

// Hacer funciones disponibles globalmente
window.autoFixAndReplace = autoFixAndReplace;
window.showStatus = showStatus;

// Mostrar instrucciones
console.log('💡 Instrucciones:');
console.log('   1. Ejecuta: showStatus() - para ver el estado actual');
console.log('   2. Ejecuta: autoFixAndReplace() - para arreglar y reemplazar automáticamente');
console.log('   3. O ejecuta manualmente: fixAPI() y luego replaceFlyers()');

// Mostrar estado inicial
showStatus();

