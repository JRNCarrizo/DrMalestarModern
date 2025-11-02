// ===========================================
// DEBUG API - Dr.Malestar
// Script para debuggear problemas de API
// ===========================================

console.log('🐛 Debug API - Dr.Malestar cargado');

// Función para debuggear la API
async function debugAPI() {
    console.log('🔍 Iniciando debug de API...');
    
    try {
        if (typeof cloudAPI === 'undefined') {
            console.error('❌ cloudAPI no está disponible');
            return false;
        }
        
        console.log('📋 Configuración de API:');
        console.log('  - Bin ID:', cloudAPI.binId);
        console.log('  - API Key:', cloudAPI.apiKey ? 'Configurada' : 'No configurada');
        console.log('  - Base URL:', cloudAPI.baseUrl);
        
        // Probar obtener datos
        console.log('🔄 Probando getData()...');
        const data = await cloudAPI.getData();
        console.log('📊 Datos obtenidos:', data);
        
        if (data && data.flyers) {
            console.log('🎫 Flyers en la API:', data.flyers.length);
            data.flyers.forEach((flyer, index) => {
                console.log(`  ${index + 1}. ${flyer.title} (ID: ${flyer.id})`);
            });
        } else {
            console.log('⚠️ No hay datos de flyers en la API');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error en debug de API:', error);
        return false;
    }
}

// Función para probar agregar un flyer de prueba
async function testAddFlyer() {
    console.log('🧪 Probando agregar flyer de prueba...');
    
    try {
        if (typeof cloudAPI === 'undefined') {
            console.error('❌ cloudAPI no está disponible');
            return false;
        }
        
        const testFlyer = {
            title: 'Flyer de Prueba Debug',
            date: '2024-12-31',
            time: '22:00',
            location: 'Lugar de Prueba Debug',
            description: 'Este es un flyer de prueba para debug',
            image: 'img/bluseraflier.jpg'
        };
        
        console.log('🔄 Agregando flyer de prueba...');
        const result = await cloudAPI.addFlyer(testFlyer);
        console.log('✅ Flyer de prueba agregado:', result);
        
        // Verificar que se agregó
        console.log('🔄 Verificando que se agregó...');
        const data = await cloudAPI.getData();
        const addedFlyer = data.flyers.find(f => f.id === result.id);
        
        if (addedFlyer) {
            console.log('✅ Flyer encontrado en la API:', addedFlyer);
        } else {
            console.log('❌ Flyer NO encontrado en la API');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error probando agregar flyer:', error);
        return false;
    }
}

// Función para verificar la sincronización
async function checkSync() {
    console.log('🔄 Verificando sincronización...');
    
    try {
        // Verificar admin
        console.log('🔍 Verificando admin...');
        if (typeof window.loadFlyers === 'function') {
            console.log('✅ loadFlyers disponible en admin');
        } else {
            console.log('❌ loadFlyers NO disponible en admin');
        }
        
        // Verificar página principal
        console.log('🔍 Verificando página principal...');
        if (typeof window.loadHybridContent === 'function') {
            console.log('✅ loadHybridContent disponible en página principal');
        } else {
            console.log('❌ loadHybridContent NO disponible en página principal');
        }
        
        // Verificar API
        const apiWorking = await debugAPI();
        if (apiWorking) {
            console.log('✅ API funcionando');
        } else {
            console.log('❌ API con problemas');
        }
        
        return apiWorking;
        
    } catch (error) {
        console.error('❌ Error verificando sincronización:', error);
        return false;
    }
}

// Función para limpiar y resetear todo
async function resetEverything() {
    console.log('🔄 Reseteando todo...');
    
    try {
        if (typeof cloudAPI === 'undefined') {
            console.error('❌ cloudAPI no está disponible');
            return false;
        }
        
        // Limpiar todos los flyers
        const data = await cloudAPI.getData();
        data.flyers = [];
        data.photos = [];
        data.videos = [];
        
        await cloudAPI.updateData(data);
        console.log('✅ Todos los datos limpiados');
        
        // Recargar en admin si está disponible
        if (typeof window.loadFlyers === 'function') {
            await window.loadFlyers();
            console.log('✅ Admin recargado');
        }
        
        // Recargar en página principal si está disponible
        if (typeof window.reloadHybridContent === 'function') {
            await window.reloadHybridContent();
            console.log('✅ Página principal recargada');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error reseteando:', error);
        return false;
    }
}

// Hacer funciones disponibles globalmente
window.debugAPI = debugAPI;
window.testAddFlyer = testAddFlyer;
window.checkSync = checkSync;
window.resetEverything = resetEverything;

console.log('✅ Debug API listo');
console.log('💡 Usa debugAPI() para verificar el estado');
console.log('💡 Usa testAddFlyer() para probar agregar un flyer');
console.log('💡 Usa checkSync() para verificar sincronización');
console.log('💡 Usa resetEverything() para limpiar todo');

