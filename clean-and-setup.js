// ===========================================
// CLEAN AND SETUP - DR. MALESTAR
// ===========================================

// Función para limpiar datos corruptos y configurar flyers limpios
async function cleanAndSetup() {
    try {
        console.log('🧹 Iniciando limpieza y configuración...');
        
        // 1. Limpiar localStorage completamente
        console.log('🗑️ Limpiando localStorage...');
        localStorage.removeItem('drmalestar_local_data');
        localStorage.removeItem('drmalestar_bin_id');
        localStorage.removeItem('siteData');
        
        // Limpiar también datos de CloudAPI si existen
        if (typeof cloudAPI !== 'undefined') {
            try {
                const data = await cloudAPI.getData();
                data.flyers = [];
                data.photos = [];
                data.videos = [];
                await cloudAPI.updateData(data);
                console.log('✅ Datos de CloudAPI limpiados');
            } catch (error) {
                console.log('⚠️ No se pudo limpiar CloudAPI:', error.message);
            }
        }
        
        // 2. Configurar flyers limpios en localStorage
        console.log('🔄 Configurando flyers limpios...');
        
        const cleanFlyers = [
            {
                id: '1',
                title: 'Dr.Malestar en Memphis - Flyer 1',
                date: '2024-10-31',
                location: 'Memphis, Granville 1756',
                time: '22:00',
                description: 'Show en vivo de Dr.Malestar en Memphis',
                image: 'img/flyer1malestar.jpg',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Dr.Malestar en Memphis - Flyer 2',
                date: '2024-10-31',
                location: 'Memphis, Granville 1756',
                time: '22:00',
                description: 'Show en vivo de Dr.Malestar en Memphis',
                image: 'img/flyer2malestar.jpg',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                title: 'Dr.Malestar en Memphis - Flyer 3',
                date: '2024-10-31',
                location: 'Memphis, Granville 1756',
                time: '22:00',
                description: 'Show en vivo de Dr.Malestar en Memphis',
                image: 'img/flyer3malestar.jpg',
                createdAt: new Date().toISOString()
            }
        ];
        
        // Verificar que las imágenes existan
        console.log('🔍 Verificando imágenes...');
        for (let i = 0; i < cleanFlyers.length; i++) {
            const flyer = cleanFlyers[i];
            const exists = await checkImageExists(flyer.image);
            if (!exists) {
                console.warn(`⚠️ Imagen no encontrada: ${flyer.image}`);
                flyer.image = 'img/bluseraflier.jpg';
                console.log(`🔄 Usando imagen de fallback: ${flyer.image}`);
            } else {
                console.log(`✅ Imagen encontrada: ${flyer.image}`);
            }
        }
        
        // Guardar en localStorage
        const cleanData = {
            flyers: cleanFlyers,
            photos: [],
            videos: [],
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('drmalestar_local_data', JSON.stringify(cleanData));
        console.log('✅ Flyers limpios guardados en localStorage');
        
        // 3. También guardar en CloudAPI si está disponible
        if (typeof cloudAPI !== 'undefined') {
            try {
                console.log('☁️ Guardando en CloudAPI...');
                await cloudAPI.updateData(cleanData);
                console.log('✅ Datos guardados en CloudAPI');
            } catch (error) {
                console.log('⚠️ No se pudo guardar en CloudAPI:', error.message);
            }
        }
        
        console.log('🎉 Limpieza y configuración completada');
        console.log(`📊 Total de flyers: ${cleanFlyers.length}`);
        
        // Mostrar resumen
        cleanFlyers.forEach((flyer, index) => {
            console.log(`   ${index + 1}. ${flyer.title}`);
            console.log(`      📅 ${flyer.date} a las ${flyer.time}`);
            console.log(`      📍 ${flyer.location}`);
            console.log(`      🖼️ ${flyer.image}`);
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Error en limpieza y configuración:', error);
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

// Función para mostrar el estado actual
function showCurrentStatus() {
    console.log('📊 Estado actual:');
    
    // Verificar localStorage
    const localData = localStorage.getItem('drmalestar_local_data');
    if (localData) {
        try {
            const data = JSON.parse(localData);
            console.log(`   📱 localStorage: ${data.flyers.length} flyers`);
        } catch (e) {
            console.log('   📱 localStorage: Datos corruptos');
        }
    } else {
        console.log('   📱 localStorage: Vacío');
    }
    
    // Verificar CloudAPI
    if (typeof cloudAPI !== 'undefined') {
        console.log('   ☁️ CloudAPI: Disponible');
    } else {
        console.log('   ☁️ CloudAPI: No disponible');
    }
}

// Función para recargar la página
function reloadPage() {
    console.log('🔄 Recargando página...');
    window.location.reload();
}

// Hacer funciones disponibles globalmente
window.cleanAndSetup = cleanAndSetup;
window.showCurrentStatus = showCurrentStatus;
window.reloadPage = reloadPage;

// Mostrar instrucciones
console.log('🧹 Clean and Setup - Dr.Malestar');
console.log('💡 Instrucciones:');
console.log('   1. Ejecuta: showCurrentStatus() - para ver el estado actual');
console.log('   2. Ejecuta: cleanAndSetup() - para limpiar y configurar');
console.log('   3. Ejecuta: reloadPage() - para recargar la página');
console.log('');
console.log('🎵 Información del evento:');
console.log('   📅 Fecha: Viernes 31 de octubre de 2024');
console.log('   ⏰ Hora: 22:00');
console.log('   📍 Lugar: Memphis, Granville 1756');
console.log('   🎤 Título: Dr.Malestar en Memphis');

