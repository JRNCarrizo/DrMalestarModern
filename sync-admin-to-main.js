// ===========================================
// SINCRONIZACIÓN ADMIN A PÁGINA PRINCIPAL
// ===========================================

// Función para sincronizar datos del admin a la página principal (SIN RECARGAR)
async function syncAdminToMainWithoutReload() {
    try {
        console.log('🔄 Sincronizando datos del admin a la página principal (sin recargar)...');
        
        // 1. Obtener datos del CloudAPI (desde el admin)
        let adminData = null;
        if (typeof cloudAPI !== 'undefined') {
            try {
                console.log('📥 Obteniendo datos del CloudAPI...');
                adminData = await cloudAPI.getData();
                console.log('✅ Datos obtenidos del CloudAPI:', adminData);
            } catch (error) {
                console.log('❌ Error obteniendo datos del CloudAPI:', error.message);
            }
        }
        
        // 2. Si no hay datos del CloudAPI, usar localStorage del admin
        if (!adminData || !adminData.flyers || adminData.flyers.length === 0) {
            console.log('🔄 Intentando obtener datos del localStorage del admin...');
            const adminLocalData = localStorage.getItem('drmalestar_local_data');
            if (adminLocalData) {
                try {
                    adminData = JSON.parse(adminLocalData);
                    console.log('✅ Datos obtenidos del localStorage:', adminData);
                } catch (error) {
                    console.log('❌ Error parseando datos del localStorage:', error);
                }
            }
        }
        
        // 3. Si tenemos datos, sincronizarlos
        if (adminData && adminData.flyers && adminData.flyers.length > 0) {
            console.log(`📋 Sincronizando ${adminData.flyers.length} flyers...`);
            
            // Limpiar flyers existentes en la página principal
            if (typeof localStorageManager !== 'undefined') {
                const currentData = localStorageManager.getData();
                currentData.flyers = [];
                localStorageManager.saveData(currentData);
                console.log('🗑️ Flyers existentes eliminados');
            }
            
            // Agregar cada flyer del admin
            for (let i = 0; i < adminData.flyers.length; i++) {
                const flyer = adminData.flyers[i];
                console.log(`➕ Sincronizando flyer: ${flyer.title}`);
                
                // Verificar que la imagen existe
                const imageExists = await checkImageExists(flyer.image);
                if (!imageExists) {
                    console.warn(`⚠️ Imagen no encontrada: ${flyer.image}`);
                    flyer.image = 'img/bluseraflier.jpg';
                    console.log(`🔄 Usando imagen de fallback: ${flyer.image}`);
                }
                
                // Agregar a localStorage de la página principal
                if (typeof localStorageManager !== 'undefined') {
                    localStorageManager.addFlyer(flyer);
                }
            }
            
            console.log('✅ Sincronización completada (sin recargar)');
            
            // 4. Recargar solo el contenido, no la página completa
            if (typeof loadFlyers === 'function') {
                console.log('🔄 Recargando contenido...');
                await loadFlyers();
            }
            
            return true;
        } else {
            console.log('⚠️ No hay datos del admin para sincronizar');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error en sincronización:', error);
        return false;
    }
}

// Función para sincronizar datos del admin a la página principal
async function syncAdminToMain() {
    try {
        console.log('🔄 Sincronizando datos del admin a la página principal...');
        
        // 1. Obtener datos del CloudAPI (desde el admin)
        let adminData = null;
        if (typeof cloudAPI !== 'undefined') {
            try {
                console.log('📥 Obteniendo datos del CloudAPI...');
                adminData = await cloudAPI.getData();
                console.log('✅ Datos obtenidos del CloudAPI:', adminData);
            } catch (error) {
                console.log('❌ Error obteniendo datos del CloudAPI:', error.message);
            }
        }
        
        // 2. Si no hay datos del CloudAPI, usar localStorage del admin
        if (!adminData || !adminData.flyers || adminData.flyers.length === 0) {
            console.log('🔄 Intentando obtener datos del localStorage del admin...');
            const adminLocalData = localStorage.getItem('drmalestar_local_data');
            if (adminLocalData) {
                try {
                    adminData = JSON.parse(adminLocalData);
                    console.log('✅ Datos obtenidos del localStorage:', adminData);
                } catch (error) {
                    console.log('❌ Error parseando datos del localStorage:', error);
                }
            }
        }
        
        // 3. Si tenemos datos, sincronizarlos
        if (adminData && adminData.flyers && adminData.flyers.length > 0) {
            console.log(`📋 Sincronizando ${adminData.flyers.length} flyers...`);
            
            // Limpiar flyers existentes en la página principal
            if (typeof localStorageManager !== 'undefined') {
                const currentData = localStorageManager.getData();
                currentData.flyers = [];
                localStorageManager.saveData(currentData);
                console.log('🗑️ Flyers existentes eliminados');
            }
            
            // Agregar cada flyer del admin
            for (let i = 0; i < adminData.flyers.length; i++) {
                const flyer = adminData.flyers[i];
                console.log(`➕ Sincronizando flyer: ${flyer.title}`);
                
                // Verificar que la imagen existe
                const imageExists = await checkImageExists(flyer.image);
                if (!imageExists) {
                    console.warn(`⚠️ Imagen no encontrada: ${flyer.image}`);
                    flyer.image = 'img/bluseraflier.jpg';
                    console.log(`🔄 Usando imagen de fallback: ${flyer.image}`);
                }
                
                // Agregar a localStorage de la página principal
                if (typeof localStorageManager !== 'undefined') {
                    localStorageManager.addFlyer(flyer);
                }
            }
            
            console.log('✅ Sincronización completada');
            
            // 4. Recargar la página para mostrar los cambios (solo si no es una recarga automática)
            if (!sessionStorage.getItem('syncInProgress')) {
                console.log('🔄 Recargando página para mostrar cambios...');
                sessionStorage.setItem('syncInProgress', 'true');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                console.log('✅ Sincronización completada, no recargando para evitar bucle');
                sessionStorage.removeItem('syncInProgress');
            }
            
            return true;
        } else {
            console.log('⚠️ No hay datos del admin para sincronizar');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error en sincronización:', error);
        return false;
    }
}

// Función para verificar que una imagen existe
function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
    });
}

// Función para forzar la sincronización desde CloudAPI
async function forceSyncFromCloudAPI() {
    try {
        console.log('🔄 Forzando sincronización desde CloudAPI...');
        
        if (typeof cloudAPI === 'undefined') {
            throw new Error('CloudAPI no está disponible');
        }
        
        // Obtener datos del CloudAPI
        const data = await cloudAPI.getData();
        console.log('📋 Datos obtenidos del CloudAPI:', data);
        
        if (data.flyers && data.flyers.length > 0) {
            // Limpiar localStorage actual
            if (typeof localStorageManager !== 'undefined') {
                const currentData = localStorageManager.getData();
                currentData.flyers = [];
                localStorageManager.saveData(currentData);
            }
            
            // Agregar flyers del CloudAPI
            for (const flyer of data.flyers) {
                if (typeof localStorageManager !== 'undefined') {
                    localStorageManager.addFlyer(flyer);
                }
            }
            
            console.log('✅ Sincronización forzada completada');
            console.log(`📊 Total de flyers sincronizados: ${data.flyers.length}`);
            
            // Recargar página (solo si no es una recarga automática)
            if (!sessionStorage.getItem('syncInProgress')) {
                sessionStorage.setItem('syncInProgress', 'true');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                console.log('✅ Sincronización forzada completada, no recargando para evitar bucle');
                sessionStorage.removeItem('syncInProgress');
            }
            
            return true;
        } else {
            console.log('⚠️ No hay flyers en CloudAPI');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error en sincronización forzada:', error);
        return false;
    }
}

// Función para mostrar el estado de sincronización
function showSyncStatus() {
    console.log('📊 Estado de sincronización:');
    
    // Verificar CloudAPI
    if (typeof cloudAPI !== 'undefined') {
        console.log('   ☁️ CloudAPI: Disponible');
        cloudAPI.getData().then(data => {
            console.log(`   📋 CloudAPI flyers: ${data.flyers?.length || 0}`);
        }).catch(error => {
            console.log('   ❌ CloudAPI: Error -', error.message);
        });
    } else {
        console.log('   ☁️ CloudAPI: No disponible');
    }
    
    // Verificar localStorage
    if (typeof localStorageManager !== 'undefined') {
        const localData = localStorageManager.getData();
        console.log(`   📱 localStorage flyers: ${localData.flyers?.length || 0}`);
    } else {
        console.log('   📱 localStorageManager: No disponible');
    }
    
    // Verificar localStorage del admin
    const adminData = localStorage.getItem('drmalestar_local_data');
    if (adminData) {
        try {
            const parsed = JSON.parse(adminData);
            console.log(`   🔧 Admin localStorage flyers: ${parsed.flyers?.length || 0}`);
        } catch (e) {
            console.log('   🔧 Admin localStorage: Datos corruptos');
        }
    } else {
        console.log('   🔧 Admin localStorage: Vacío');
    }
}

// Función para limpiar el estado de sincronización
function clearSyncState() {
    sessionStorage.removeItem('syncInProgress');
    sessionStorage.removeItem('adminSynced');
    console.log('🧹 Estado de sincronización limpiado');
}

// Función para reiniciar la sincronización
function restartSync() {
    clearSyncState();
    console.log('🔄 Reiniciando sincronización...');
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

// Hacer funciones disponibles globalmente
window.syncAdminToMain = syncAdminToMain;
window.syncAdminToMainWithoutReload = syncAdminToMainWithoutReload;
window.forceSyncFromCloudAPI = forceSyncFromCloudAPI;
window.showSyncStatus = showSyncStatus;
window.clearSyncState = clearSyncState;
window.restartSync = restartSync;

// Mostrar instrucciones
console.log('🔄 Sincronización Admin a Página Principal - Dr.Malestar');
console.log('💡 Instrucciones:');
console.log('   1. Ejecuta: showSyncStatus() - para ver el estado actual');
console.log('   2. Ejecuta: syncAdminToMain() - para sincronizar datos (con recarga)');
console.log('   3. Ejecuta: syncAdminToMainWithoutReload() - para sincronizar datos (sin recarga)');
console.log('   4. Ejecuta: forceSyncFromCloudAPI() - para forzar sincronización desde CloudAPI');
console.log('   5. Ejecuta: clearSyncState() - para limpiar el estado de sincronización');
console.log('   6. Ejecuta: restartSync() - para reiniciar la sincronización');
console.log('');
console.log('🎯 Este script resuelve el problema de que los flyers aparecen en el admin pero no en la página principal');
console.log('⚠️ Si la página se recarga constantemente, ejecuta: clearSyncState()');
console.log('✅ La sincronización automática ahora funciona sin recargar la página');
