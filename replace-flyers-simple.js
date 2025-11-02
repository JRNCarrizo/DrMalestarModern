// ===========================================
// SCRIPT SIMPLE PARA REEMPLAZAR FLYERS - SIN IMÁGENES BASE64
// ===========================================

// Información del evento
const EVENT_INFO = {
    title: "Dr.Malestar en Memphis",
    date: "2024-10-31", // Viernes 31 de octubre
    location: "Memphis, Granville 1756",
    time: "22:00", // Cambiar si necesitas otra hora
    description: "Show en vivo de Dr.Malestar en Memphis"
};

// Información de los flyers (solo URLs, no base64)
const FLYERS = [
    {
        title: `${EVENT_INFO.title} - Flyer 1`,
        date: EVENT_INFO.date,
        location: EVENT_INFO.location,
        time: EVENT_INFO.time,
        description: EVENT_INFO.description,
        image: 'img/flyer1malestar.jpg' // URL directa, sin ./
    },
    {
        title: `${EVENT_INFO.title} - Flyer 2`,
        date: EVENT_INFO.date,
        location: EVENT_INFO.location,
        time: EVENT_INFO.time,
        description: EVENT_INFO.description,
        image: 'img/flyer2malestar.jpg' // URL directa, sin ./
    },
    {
        title: `${EVENT_INFO.title} - Flyer 3`,
        date: EVENT_INFO.date,
        location: EVENT_INFO.location,
        time: EVENT_INFO.time,
        description: EVENT_INFO.description,
        image: 'img/flyer3malestar.jpg' // URL directa, sin ./
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

// Función principal para reemplazar flyers (versión simple)
async function replaceFlyersSimple() {
    try {
        console.log('🔄 Iniciando reemplazo simple de flyers...');
        
        // Verificar que cloudAPI esté disponible
        if (typeof cloudAPI === 'undefined') {
            throw new Error('cloudAPI no está disponible. Asegúrate de cargar el panel de administración.');
        }
        
        // Verificar que las imágenes existan
        console.log('🔍 Verificando que las imágenes existan...');
        for (let i = 0; i < FLYERS.length; i++) {
            const flyer = FLYERS[i];
            const exists = await checkImageExists(flyer.image);
            if (!exists) {
                console.warn(`⚠️ Imagen no encontrada: ${flyer.image}`);
                // Usar imagen de fallback
                flyer.image = 'img/bluseraflier.jpg';
                console.log(`🔄 Usando imagen de fallback para: ${flyer.title}`);
            } else {
                console.log(`✅ Imagen encontrada: ${flyer.image}`);
            }
        }
        
        // Intentar arreglar permisos si hay error 403
        try {
            await cloudAPI.getData();
        } catch (error) {
            if (error.message.includes('403') || error.message.includes('Acceso denegado')) {
                console.log('⚠️ Error de permisos detectado, intentando arreglar...');
                const fixed = await fixAPIPermissions();
                if (!fixed) {
                    throw new Error('No se pudieron arreglar los permisos de la API');
                }
            } else {
                throw error;
            }
        }
        
        // 1. Obtener datos actuales
        console.log('📥 Obteniendo datos actuales...');
        const currentData = await cloudAPI.getData();
        
        // 2. Eliminar todos los flyers actuales
        console.log(`🗑️ Eliminando ${currentData.flyers.length} flyers actuales...`);
        currentData.flyers = [];
        
        // 3. Agregar los nuevos flyers (sin imágenes base64)
        console.log('➕ Agregando nuevos flyers (versión simple)...');
        
        for (let i = 0; i < FLYERS.length; i++) {
            const flyer = FLYERS[i];
            console.log(`   - Agregando: ${flyer.title}`);
            
            // Crear flyer sin imagen base64 (solo URL)
            const newFlyer = {
                id: Date.now().toString() + i,
                title: flyer.title,
                date: flyer.date,
                location: flyer.location,
                time: flyer.time,
                description: flyer.description,
                image: flyer.image, // URL directa
                createdAt: new Date().toISOString()
            };
            
            // Agregar a los datos
            currentData.flyers.push(newFlyer);
            console.log(`   ✅ Flyer ${i + 1} agregado (${flyer.image})`);
        }
        
        // 4. Actualizar datos en la nube
        console.log('☁️ Actualizando datos en la nube...');
        await cloudAPI.updateData(currentData);
        
        console.log('✅ Flyers reemplazados exitosamente!');
        console.log(`📊 Total de flyers: ${currentData.flyers.length}`);
        
        // Mostrar resumen
        currentData.flyers.forEach((flyer, index) => {
            console.log(`   ${index + 1}. ${flyer.title}`);
            console.log(`      📅 ${flyer.date} a las ${flyer.time}`);
            console.log(`      📍 ${flyer.location}`);
            console.log(`      🖼️ Imagen: ${flyer.image}`);
        });
        
        // Recargar la interfaz de administración
        if (typeof loadFlyers === 'function') {
            await loadFlyers();
        }
        
        // Mostrar notificación
        if (typeof showNotification === 'function') {
            showNotification('Flyers reemplazados exitosamente!', 'success');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error reemplazando flyers:', error);
        
        if (typeof showNotification === 'function') {
            showNotification('Error reemplazando flyers: ' + error.message, 'error');
        }
        
        throw error;
    }
}

// Función para arreglar permisos de la API
async function fixAPIPermissions() {
    try {
        console.log('🔧 Intentando arreglar permisos de la API...');
        
        // Limpiar el binId anterior
        localStorage.removeItem('drmalestar_bin_id');
        cloudAPI.binId = null;
        
        // Crear un nuevo bin
        console.log('🆕 Creando nuevo bin...');
        const newBinId = await cloudAPI.createBin();
        
        console.log('✅ Nuevo bin creado:', newBinId);
        return true;
    } catch (error) {
        console.error('❌ Error arreglando permisos:', error);
        return false;
    }
}

// Función para cambiar la hora del evento
function setEventTime(newTime) {
    EVENT_INFO.time = newTime;
    console.log(`⏰ Hora del evento cambiada a: ${newTime}`);
}

// Función para cambiar el título del evento
function setEventTitle(newTitle) {
    EVENT_INFO.title = newTitle;
    console.log(`📝 Título del evento cambiado a: ${newTitle}`);
}

// Función para cambiar la descripción del evento
function setEventDescription(newDescription) {
    EVENT_INFO.description = newDescription;
    console.log(`📄 Descripción del evento cambiada a: ${newDescription}`);
}

// Función para verificar el estado de las imágenes
async function checkImagesStatus() {
    console.log('🔍 Verificando estado de las imágenes...');
    
    const images = [
        'img/flyer1malestar.jpg',
        'img/flyer2malestar.jpg', 
        'img/flyer3malestar.jpg',
        'img/bluseraflier.jpg' // Imagen de fallback
    ];
    
    for (const imagePath of images) {
        const exists = await checkImageExists(imagePath);
        console.log(`${exists ? '✅' : '❌'} ${imagePath}`);
    }
    
    return true;
}

// Hacer funciones disponibles globalmente
window.replaceFlyersSimple = replaceFlyersSimple;
window.setEventTime = setEventTime;
window.setEventTitle = setEventTitle;
window.setEventDescription = setEventDescription;
window.checkImagesStatus = checkImagesStatus;

// Mostrar información del evento
console.log('🎵 Información del evento (versión simple):');
console.log(`   📅 Fecha: ${EVENT_INFO.date}`);
console.log(`   ⏰ Hora: ${EVENT_INFO.time}`);
console.log(`   📍 Lugar: ${EVENT_INFO.location}`);
console.log(`   🎤 Título: ${EVENT_INFO.title}`);
console.log(`   📝 Descripción: ${EVENT_INFO.description}`);
console.log('');
console.log('💡 Para cambiar la hora: setEventTime("23:00")');
console.log('💡 Para cambiar el título: setEventTitle("Nuevo Título")');
console.log('💡 Para ejecutar: replaceFlyersSimple()');
