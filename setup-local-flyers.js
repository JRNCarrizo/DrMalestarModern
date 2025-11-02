// ===========================================
// SETUP LOCAL FLYERS - DR. MALESTAR
// ===========================================

// Información del evento
const EVENT_INFO = {
    title: "Dr.Malestar en Memphis",
    date: "2024-10-31", // Viernes 31 de octubre
    location: "Memphis, Granville 1756",
    time: "22:00",
    description: "Show en vivo de Dr.Malestar en Memphis"
};

// Flyers para agregar al localStorage
const FLYERS_TO_ADD = [
    {
        title: `${EVENT_INFO.title} - Flyer 1`,
        date: EVENT_INFO.date,
        location: EVENT_INFO.location,
        time: EVENT_INFO.time,
        description: EVENT_INFO.description,
        image: 'img/flyer1malestar.jpg'
    },
    {
        title: `${EVENT_INFO.title} - Flyer 2`,
        date: EVENT_INFO.date,
        location: EVENT_INFO.location,
        time: EVENT_INFO.time,
        description: EVENT_INFO.description,
        image: 'img/flyer2malestar.jpg'
    },
    {
        title: `${EVENT_INFO.title} - Flyer 3`,
        date: EVENT_INFO.date,
        location: EVENT_INFO.location,
        time: EVENT_INFO.time,
        description: EVENT_INFO.description,
        image: 'img/flyer3malestar.jpg'
    }
];

// Función para verificar que una imagen existe
function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
    });
}

// Función para agregar flyers al localStorage
async function setupLocalFlyers() {
    try {
        console.log('🔄 Configurando flyers locales...');
        
        // Verificar que localStorageManager esté disponible
        if (typeof localStorageManager === 'undefined') {
            throw new Error('localStorageManager no está disponible');
        }
        
        // Limpiar flyers existentes
        const data = localStorageManager.getData();
        data.flyers = [];
        localStorageManager.saveData(data);
        console.log('🗑️ Flyers existentes eliminados');
        
        // Verificar y agregar cada flyer
        for (let i = 0; i < FLYERS_TO_ADD.length; i++) {
            const flyer = FLYERS_TO_ADD[i];
            console.log(`🔍 Verificando imagen: ${flyer.image}`);
            
            // Verificar si la imagen existe
            const exists = await checkImageExists(flyer.image);
            if (!exists) {
                console.warn(`⚠️ Imagen no encontrada: ${flyer.image}`);
                // Usar imagen de fallback
                flyer.image = 'img/bluseraflier.jpg';
                console.log(`🔄 Usando imagen de fallback: ${flyer.image}`);
            } else {
                console.log(`✅ Imagen encontrada: ${flyer.image}`);
            }
            
            // Agregar flyer
            const addedFlyer = localStorageManager.addFlyer(flyer);
            console.log(`✅ Flyer agregado: ${addedFlyer.title}`);
        }
        
        console.log('🎉 Flyers configurados correctamente en localStorage');
        console.log(`📊 Total de flyers: ${localStorageManager.getFlyers().length}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error configurando flyers locales:', error);
        return false;
    }
}

// Función para mostrar el estado actual
function showLocalStatus() {
    console.log('📊 Estado actual del localStorage:');
    
    if (typeof localStorageManager !== 'undefined') {
        const data = localStorageManager.getData();
        console.log(`   📅 Flyers: ${data.flyers.length}`);
        console.log(`   📸 Fotos: ${data.photos.length}`);
        console.log(`   🎥 Videos: ${data.videos.length}`);
        console.log(`   🕒 Última actualización: ${data.lastUpdated}`);
        
        if (data.flyers.length > 0) {
            console.log('   📋 Flyers actuales:');
            data.flyers.forEach((flyer, index) => {
                console.log(`      ${index + 1}. ${flyer.title}`);
                console.log(`         📅 ${flyer.date} a las ${flyer.time}`);
                console.log(`         📍 ${flyer.location}`);
                console.log(`         🖼️ ${flyer.image}`);
            });
        }
    } else {
        console.log('   ❌ localStorageManager no disponible');
    }
}

// Función para limpiar todo
function clearAllLocalData() {
    if (typeof localStorageManager !== 'undefined') {
        localStorageManager.clearAll();
        console.log('🗑️ Todos los datos locales eliminados');
    } else {
        console.log('❌ localStorageManager no disponible');
    }
}

// Hacer funciones disponibles globalmente
window.setupLocalFlyers = setupLocalFlyers;
window.showLocalStatus = showLocalStatus;
window.clearAllLocalData = clearAllLocalData;

// Mostrar instrucciones
console.log('🎵 Configuración de Flyers Locales - Dr.Malestar');
console.log('💡 Instrucciones:');
console.log('   1. Ejecuta: showLocalStatus() - para ver el estado actual');
console.log('   2. Ejecuta: setupLocalFlyers() - para configurar los flyers');
console.log('   3. Ejecuta: clearAllLocalData() - para limpiar todo');
console.log('');
console.log('🎵 Información del evento:');
console.log(`   📅 Fecha: ${EVENT_INFO.date}`);
console.log(`   ⏰ Hora: ${EVENT_INFO.time}`);
console.log(`   📍 Lugar: ${EVENT_INFO.location}`);
console.log(`   🎤 Título: ${EVENT_INFO.title}`);

