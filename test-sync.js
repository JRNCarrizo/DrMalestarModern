// ===========================================
// SCRIPT DE PRUEBA PARA SINCRONIZACIÓN
// Dr.Malestar - Test de Sincronización
// ===========================================

console.log('🧪 Iniciando prueba de sincronización...');

// Función para probar la sincronización
async function testSync() {
    try {
        console.log('🔄 Probando carga de flyers desde API...');
        
        // Verificar que cloudAPI esté disponible
        if (typeof cloudAPI === 'undefined') {
            console.error('❌ cloudAPI no está disponible');
            return false;
        }
        
        // Obtener flyers actuales
        const flyers = await cloudAPI.getFlyers();
        console.log('📋 Flyers actuales:', flyers.length);
        
        // Mostrar información de cada flyer
        flyers.forEach((flyer, index) => {
            console.log(`  ${index + 1}. ${flyer.title} (ID: ${flyer.id})`);
        });
        
        console.log('✅ Prueba de sincronización completada');
        return true;
        
    } catch (error) {
        console.error('❌ Error en prueba de sincronización:', error);
        return false;
    }
}

// Función para simular eliminación de flyer
async function simulateFlyerDeletion() {
    try {
        console.log('🔄 Simulando eliminación de flyer...');
        
        // Obtener flyers actuales
        const flyers = await cloudAPI.getFlyers();
        
        if (flyers.length === 0) {
            console.log('⚠️ No hay flyers para eliminar');
            return false;
        }
        
        // Tomar el primer flyer
        const flyerToDelete = flyers[0];
        console.log(`🗑️ Eliminando flyer: ${flyerToDelete.title} (ID: ${flyerToDelete.id})`);
        
        // Eliminar el flyer
        await cloudAPI.deleteFlyer(flyerToDelete.id);
        console.log('✅ Flyer eliminado de la base de datos');
        
        // Simular notificación a la página principal
        if (typeof window.reloadContent === 'function') {
            console.log('🔄 Notificando a la página principal...');
            window.reloadContent();
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error simulando eliminación:', error);
        return false;
    }
}

// Función para verificar el estado de la sincronización
function checkSyncStatus() {
    console.log('🔍 Verificando estado de sincronización...');
    
    const status = {
        cloudAPI: typeof cloudAPI !== 'undefined',
        loadContent: typeof window.loadContent === 'function',
        reloadContent: typeof window.reloadContent === 'function',
        mainJS: typeof loadFlyers === 'function'
    };
    
    console.log('📊 Estado de sincronización:', status);
    
    const allGood = Object.values(status).every(Boolean);
    
    if (allGood) {
        console.log('✅ Sistema de sincronización configurado correctamente');
    } else {
        console.log('❌ Sistema de sincronización con problemas');
    }
    
    return allGood;
}

// Hacer funciones disponibles globalmente
window.testSync = testSync;
window.simulateFlyerDeletion = simulateFlyerDeletion;
window.checkSyncStatus = checkSyncStatus;

console.log('🧪 Script de prueba de sincronización cargado');
console.log('💡 Usa testSync() para probar la carga de flyers');
console.log('💡 Usa simulateFlyerDeletion() para simular eliminación');
console.log('💡 Usa checkSyncStatus() para verificar el estado');


