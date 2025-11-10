// ===========================================
// TEST API - Dr.Malestar
// Script para probar la API y verificar sincronización
// ===========================================

console.log('🧪 Test API - Dr.Malestar cargado');

// Función para probar la API
async function testAPI() {
    console.log('🔄 Probando API de JSONBin...');
    
    try {
        if (typeof cloudAPI === 'undefined') {
            console.error('❌ cloudAPI no está disponible');
            return false;
        }
        
        // Probar obtener datos
        const data = await cloudAPI.getData();
        console.log('📋 Datos obtenidos:', data);
        
        // Mostrar estadísticas
        console.log('📊 Estadísticas:', {
            flyers: data.flyers?.length || 0,
            photos: data.photos?.length || 0,
            videos: data.videos?.length || 0
        });
        
        // Mostrar flyers actuales
        if (data.flyers && data.flyers.length > 0) {
            console.log('🎫 Flyers actuales:');
            data.flyers.forEach((flyer, index) => {
                console.log(`  ${index + 1}. ${flyer.title} (ID: ${flyer.id})`);
            });
        } else {
            console.log('⚠️ No hay flyers en la API');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error probando API:', error);
        return false;
    }
}

// Función para limpiar todos los flyers
async function clearAllFlyers() {
    console.log('🗑️ Limpiando todos los flyers...');
    
    try {
        if (typeof cloudAPI === 'undefined') {
            console.error('❌ cloudAPI no está disponible');
            return false;
        }
        
        // Obtener datos actuales
        const data = await cloudAPI.getData();
        
        // Limpiar flyers
        data.flyers = [];
        
        // Actualizar en la API
        await cloudAPI.updateData(data);
        
        console.log('✅ Todos los flyers eliminados');
        
        // Recargar contenido
        if (typeof window.reloadHybridContent === 'function') {
            window.reloadHybridContent();
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error limpiando flyers:', error);
        return false;
    }
}

// Función para agregar un flyer de prueba
async function addTestFlyer() {
    console.log('➕ Agregando flyer de prueba...');
    
    try {
        if (typeof cloudAPI === 'undefined') {
            console.error('❌ cloudAPI no está disponible');
            return false;
        }
        
        const testFlyer = {
            title: 'Flyer de Prueba',
            date: '2024-12-31',
            time: '22:00',
            location: 'Lugar de Prueba',
            description: 'Este es un flyer de prueba',
            image: 'img/bluseraflier.jpg'
        };
        
        await cloudAPI.addFlyer(testFlyer);
        console.log('✅ Flyer de prueba agregado');
        
        // Recargar contenido
        if (typeof window.reloadHybridContent === 'function') {
            window.reloadHybridContent();
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error agregando flyer de prueba:', error);
        return false;
    }
}

// Función para verificar sincronización
async function checkSync() {
    console.log('🔄 Verificando sincronización...');
    
    const apiWorking = await testAPI();
    
    if (apiWorking) {
        console.log('✅ API funcionando correctamente');
        console.log('💡 Usa clearAllFlyers() para limpiar todos los flyers');
        console.log('💡 Usa addTestFlyer() para agregar un flyer de prueba');
    } else {
        console.log('❌ API con problemas');
    }
}

// Hacer funciones disponibles globalmente
window.testAPI = testAPI;
window.clearAllFlyers = clearAllFlyers;
window.addTestFlyer = addTestFlyer;
window.checkSync = checkSync;

console.log('✅ Test API listo');
console.log('💡 Usa checkSync() para verificar el estado');


