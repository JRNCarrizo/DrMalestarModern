// ===========================================
// SCRIPT PARA REEMPLAZAR FLYERS - VERSIÓN NAVEGADOR
// ===========================================

// Información del evento
const EVENT_INFO = {
    title: "Dr.Malestar en Memphis",
    date: "2024-10-31", // Viernes 31 de octubre
    location: "Memphis, Granville 1756",
    time: "22:00", // Cambiar si necesitas otra hora
    description: "Show en vivo de Dr.Malestar en Memphis"
};

// Función para convertir imagen a base64 con compresión agresiva
async function imageToBase64(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Reducir tamaño para mantener bajo 100KB
            let { width, height } = img;
            const maxWidth = 400; // Reducir tamaño máximo
            const maxHeight = 300;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(img, 0, 0, width, height);
            
            try {
                // Compresión muy agresiva para mantener bajo 100KB
                let dataURL = canvas.toDataURL('image/jpeg', 0.3); // Calidad muy baja
                
                // Verificar tamaño y comprimir más si es necesario
                let sizeKB = (dataURL.length * 0.75) / 1024;
                console.log(`📏 Imagen comprimida: ${sizeKB.toFixed(1)}KB`);
                
                // Si sigue siendo muy grande, comprimir más
                if (sizeKB > 80) {
                    console.log('⚠️ Imagen muy grande, comprimiendo más...');
                    dataURL = canvas.toDataURL('image/jpeg', 0.1); // Calidad extremadamente baja
                    sizeKB = (dataURL.length * 0.75) / 1024;
                    console.log(`📏 Imagen re-comprimida: ${sizeKB.toFixed(1)}KB`);
                }
                
                // Si aún es muy grande, reducir más el tamaño
                if (sizeKB > 80) {
                    console.log('⚠️ Imagen aún muy grande, reduciendo tamaño...');
                    const smallerWidth = Math.min(width, 300);
                    const smallerHeight = (height * smallerWidth) / width;
                    
                    canvas.width = smallerWidth;
                    canvas.height = smallerHeight;
                    ctx.drawImage(img, 0, 0, smallerWidth, smallerHeight);
                    
                    dataURL = canvas.toDataURL('image/jpeg', 0.1);
                    sizeKB = (dataURL.length * 0.75) / 1024;
                    console.log(`📏 Imagen final: ${sizeKB.toFixed(1)}KB`);
                }
                
                resolve(dataURL);
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = function() {
            reject(new Error('Error cargando imagen: ' + imagePath));
        };
        
        img.src = imagePath;
    });
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

// Función principal para reemplazar flyers
async function replaceFlyers() {
    try {
        console.log('🔄 Iniciando reemplazo de flyers...');
        
        // Verificar que cloudAPI esté disponible
        if (typeof cloudAPI === 'undefined') {
            throw new Error('cloudAPI no está disponible. Asegúrate de cargar el panel de administración.');
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
        
        // 3. Procesar y agregar los nuevos flyers
        const flyerImages = [
            '../img/flyer1malestar.jpg',
            '../img/flyer2malestar.jpg', 
            '../img/flyer3malestar.jpg'
        ];
        
        console.log('➕ Procesando nuevos flyers...');
        
        for (let i = 0; i < flyerImages.length; i++) {
            const imagePath = flyerImages[i];
            console.log(`   - Procesando: ${imagePath}`);
            
            try {
                // Convertir imagen a base64
                const imageBase64 = await imageToBase64(imagePath);
                
                // Crear flyer
                const flyer = {
                    id: Date.now().toString() + i,
                    title: `${EVENT_INFO.title} - Flyer ${i + 1}`,
                    date: EVENT_INFO.date,
                    location: EVENT_INFO.location,
                    time: EVENT_INFO.time,
                    description: EVENT_INFO.description,
                    image: imageBase64,
                    createdAt: new Date().toISOString()
                };
                
                // Agregar a los datos
                currentData.flyers.push(flyer);
                console.log(`   ✅ Flyer ${i + 1} procesado`);
                
            } catch (error) {
                console.error(`❌ Error procesando ${imagePath}:`, error.message);
                // Continuar con el siguiente flyer
            }
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

// Función para arreglar la API manualmente
async function fixAPI() {
    try {
        console.log('🔧 Arreglando API...');
        const fixed = await fixAPIPermissions();
        if (fixed) {
            console.log('✅ API arreglada correctamente');
            if (typeof showNotification === 'function') {
                showNotification('API arreglada correctamente', 'success');
            }
        } else {
            console.log('❌ No se pudo arreglar la API');
            if (typeof showNotification === 'function') {
                showNotification('No se pudo arreglar la API', 'error');
            }
        }
        return fixed;
    } catch (error) {
        console.error('❌ Error arreglando API:', error);
        if (typeof showNotification === 'function') {
            showNotification('Error arreglando API: ' + error.message, 'error');
        }
        return false;
    }
}

// Hacer funciones disponibles globalmente
window.replaceFlyers = replaceFlyers;
window.setEventTime = setEventTime;
window.setEventTitle = setEventTitle;
window.setEventDescription = setEventDescription;
window.fixAPI = fixAPI;

// Mostrar información del evento
console.log('🎵 Información del evento:');
console.log(`   📅 Fecha: ${EVENT_INFO.date}`);
console.log(`   ⏰ Hora: ${EVENT_INFO.time}`);
console.log(`   📍 Lugar: ${EVENT_INFO.location}`);
console.log(`   🎤 Título: ${EVENT_INFO.title}`);
console.log(`   📝 Descripción: ${EVENT_INFO.description}`);
console.log('');
console.log('💡 Para cambiar la hora: setEventTime("23:00")');
console.log('💡 Para cambiar el título: setEventTitle("Nuevo Título")');
console.log('💡 Para ejecutar: replaceFlyers()');
