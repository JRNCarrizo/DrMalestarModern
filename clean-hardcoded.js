// ===========================================
// CLEAN HARDCODED - Dr.Malestar
// Script para limpiar datos hardcodeados residuales
// ===========================================

console.log('🧹 Clean Hardcoded - Dr.Malestar cargado');

// Función para limpiar datos hardcodeados
function cleanHardcodedData() {
    console.log('🧹 Limpiando datos hardcodeados...');
    
    try {
        // Limpiar datos de flyers existentes hardcodeados
        localStorage.removeItem('drmalestar_existing_flyers');
        localStorage.removeItem('drmalestar_existing_photos');
        localStorage.removeItem('drmalestar_existing_videos');
        
        // Limpiar datos de admin
        localStorage.removeItem('drmalestar_admin_data');
        localStorage.removeItem('drmalestar_site_data');
        
        // Limpiar datos de CloudAPI
        localStorage.removeItem('drmalestar_bin_id');
        
        // Mantener solo SimpleStorage
        console.log('✅ Datos hardcodeados eliminados');
        console.log('✅ Solo SimpleStorage se mantiene');
        
        // Mostrar estadísticas de SimpleStorage
        if (typeof simpleStorage !== 'undefined') {
            const stats = simpleStorage.getStats();
            console.log('📊 SimpleStorage actual:', stats);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error limpiando datos hardcodeados:', error);
        return false;
    }
}

// Función para verificar qué datos están en localStorage
function checkLocalStorage() {
    console.log('🔍 Verificando localStorage...');
    
    const keys = Object.keys(localStorage);
    console.log('📋 Claves en localStorage:', keys);
    
    keys.forEach(key => {
        if (key.includes('drmalestar')) {
            const value = localStorage.getItem(key);
            console.log(`  ${key}:`, value ? 'Tiene datos' : 'Vacío');
        }
    });
}

// Función para resetear completamente SimpleStorage
function resetSimpleStorage() {
    console.log('🔄 Reseteando SimpleStorage...');
    
    if (typeof simpleStorage !== 'undefined') {
        simpleStorage.clearAll();
        console.log('✅ SimpleStorage reseteado');
        
        // Mostrar estadísticas después del reset
        const stats = simpleStorage.getStats();
        console.log('📊 SimpleStorage después del reset:', stats);
    } else {
        console.log('❌ SimpleStorage no disponible');
    }
}

// Hacer funciones disponibles globalmente
window.cleanHardcodedData = cleanHardcodedData;
window.checkLocalStorage = checkLocalStorage;
window.resetSimpleStorage = resetSimpleStorage;

console.log('✅ Clean Hardcoded listo');
console.log('💡 Usa cleanHardcodedData() para limpiar datos hardcodeados');
console.log('💡 Usa checkLocalStorage() para verificar localStorage');
console.log('💡 Usa resetSimpleStorage() para resetear SimpleStorage');

