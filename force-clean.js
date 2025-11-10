// ===========================================
// FORCE CLEAN - Dr.Malestar
// Script para limpiar AGRESIVAMENTE todos los datos residuales
// ===========================================

console.log('💥 Force Clean - Dr.Malestar cargado');

// Función para limpiar AGRESIVAMENTE todo
function forceCleanEverything() {
    console.log('💥 LIMPIEZA AGRESIVA INICIADA...');
    
    try {
        // 1. Limpiar TODOS los datos de DrMalestar del localStorage
        const keys = Object.keys(localStorage);
        let cleanedCount = 0;
        
        keys.forEach(key => {
            if (key.includes('drmalestar') || key.includes('malestar') || key.includes('flyer')) {
                localStorage.removeItem(key);
                cleanedCount++;
                console.log(`🗑️ Eliminado: ${key}`);
            }
        });
        
        console.log(`✅ ${cleanedCount} elementos eliminados del localStorage`);
        
        // 2. Limpiar sessionStorage también
        const sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach(key => {
            if (key.includes('drmalestar') || key.includes('malestar') || key.includes('flyer')) {
                sessionStorage.removeItem(key);
                console.log(`🗑️ Eliminado de sessionStorage: ${key}`);
            }
        });
        
        // 3. Forzar limpieza de SimpleStorage
        if (typeof simpleStorage !== 'undefined') {
            simpleStorage.clearAll();
            console.log('✅ SimpleStorage limpiado');
        }
        
        // 4. Limpiar cualquier referencia en window
        if (typeof window !== 'undefined') {
            // Eliminar funciones globales problemáticas
            delete window.loadExistingFlyers;
            delete window.deleteExistingFlyer;
            delete window.resetExistingFlyers;
            console.log('✅ Funciones globales problemáticas eliminadas');
        }
        
        console.log('💥 LIMPIEZA AGRESIVA COMPLETADA');
        console.log('🔄 Recarga la página para ver los cambios');
        
        return true;
        
    } catch (error) {
        console.error('❌ Error en limpieza agresiva:', error);
        return false;
    }
}

// Función para verificar qué queda en localStorage
function checkWhatRemains() {
    console.log('🔍 Verificando qué queda en localStorage...');
    
    const keys = Object.keys(localStorage);
    console.log('📋 Todas las claves en localStorage:', keys);
    
    const drmalestarKeys = keys.filter(key => 
        key.includes('drmalestar') || 
        key.includes('malestar') || 
        key.includes('flyer')
    );
    
    if (drmalestarKeys.length > 0) {
        console.log('⚠️ Aún quedan claves de DrMalestar:', drmalestarKeys);
        drmalestarKeys.forEach(key => {
            const value = localStorage.getItem(key);
            console.log(`  ${key}:`, value ? value.substring(0, 100) + '...' : 'Vacío');
        });
    } else {
        console.log('✅ No quedan claves de DrMalestar en localStorage');
    }
}

// Función para eliminar flyers específicos de Memphis
function removeMemphisFlyers() {
    console.log('🎯 Eliminando específicamente flyers de Memphis...');
    
    try {
        // Buscar en todas las claves posibles
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value && value.includes('Memphis')) {
                console.log(`🗑️ Eliminando clave con Memphis: ${key}`);
                localStorage.removeItem(key);
            }
        });
        
        // También buscar en SimpleStorage
        if (typeof simpleStorage !== 'undefined') {
            const data = simpleStorage.getData();
            if (data.flyers) {
                const originalCount = data.flyers.length;
                data.flyers = data.flyers.filter(flyer => 
                    !flyer.title.includes('Memphis') && 
                    !flyer.location.includes('Memphis')
                );
                
                if (data.flyers.length < originalCount) {
                    simpleStorage.saveData(data);
                    console.log(`✅ ${originalCount - data.flyers.length} flyers de Memphis eliminados de SimpleStorage`);
                }
            }
        }
        
        console.log('✅ Flyers de Memphis eliminados');
        return true;
        
    } catch (error) {
        console.error('❌ Error eliminando flyers de Memphis:', error);
        return false;
    }
}

// Función para resetear completamente la página
function hardReset() {
    console.log('🔄 HARD RESET - Limpieza completa...');
    
    // Limpiar todo
    forceCleanEverything();
    
    // Mostrar mensaje
    alert('Limpieza completa realizada. La página se recargará automáticamente.');
    
    // Recargar la página
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

// Hacer funciones disponibles globalmente
window.forceCleanEverything = forceCleanEverything;
window.checkWhatRemains = checkWhatRemains;
window.removeMemphisFlyers = removeMemphisFlyers;
window.hardReset = hardReset;

console.log('💥 Force Clean listo');
console.log('💡 Usa forceCleanEverything() para limpieza agresiva');
console.log('💡 Usa removeMemphisFlyers() para eliminar solo flyers de Memphis');
console.log('💡 Usa checkWhatRemains() para ver qué queda');
console.log('💡 Usa hardReset() para reset completo y recarga');


