// ===========================================
// SCRIPT PARA REEMPLAZAR FLYERS - DR. MALESTAR
// ===========================================

// Importar la API de la nube
const { CloudAPI } = require('./js/cloud-api.js');

// Configuración del evento
const EVENT_INFO = {
    title: "Dr.Malestar en Vivo",
    date: "2024-10-31", // Viernes 31 de octubre
    location: "Rafael Castillo, Granville 1756",
    time: "22:00", // Hora por defecto, se puede cambiar
    description: "Show en vivo de Dr.Malestar"
};

// Información de los flyers
const FLYERS = [
    {
        title: `${EVENT_INFO.title} - Flyer 1`,
        date: EVENT_INFO.date,
        location: EVENT_INFO.location,
        time: EVENT_INFO.time,
        description: EVENT_INFO.description,
        image: './img/flyer1malestar.jpg'
    },
    {
        title: `${EVENT_INFO.title} - Flyer 2`,
        date: EVENT_INFO.date,
        location: EVENT_INFO.location,
        time: EVENT_INFO.time,
        description: EVENT_INFO.description,
        image: './img/flyer2malestar.jpg'
    },
    {
        title: `${EVENT_INFO.title} - Flyer 3`,
        date: EVENT_INFO.date,
        location: EVENT_INFO.location,
        time: EVENT_INFO.time,
        description: EVENT_INFO.description,
        image: './img/flyer3malestar.jpg'
    }
];

async function replaceFlyers() {
    try {
        console.log('🔄 Iniciando reemplazo de flyers...');
        
        // Crear instancia de la API
        const cloudAPI = new CloudAPI();
        
        // 1. Obtener datos actuales
        console.log('📥 Obteniendo datos actuales...');
        const currentData = await cloudAPI.getData();
        
        // 2. Eliminar todos los flyers actuales
        console.log(`🗑️ Eliminando ${currentData.flyers.length} flyers actuales...`);
        currentData.flyers = [];
        
        // 3. Agregar los nuevos flyers
        console.log('➕ Agregando nuevos flyers...');
        for (let i = 0; i < FLYERS.length; i++) {
            const flyer = FLYERS[i];
            console.log(`   - Agregando: ${flyer.title}`);
            
            // Convertir imagen a base64
            const fs = require('fs');
            const path = require('path');
            
            try {
                const imagePath = path.resolve(flyer.image);
                const imageBuffer = fs.readFileSync(imagePath);
                const imageBase64 = imageBuffer.toString('base64');
                const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;
                
                flyer.image = imageDataUrl;
            } catch (error) {
                console.error(`❌ Error procesando imagen ${flyer.image}:`, error.message);
                // Continuar sin imagen si hay error
                flyer.image = null;
            }
            
            // Agregar flyer a los datos
            const newFlyer = {
                id: Date.now().toString() + i,
                ...flyer,
                createdAt: new Date().toISOString()
            };
            
            currentData.flyers.push(newFlyer);
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
        
    } catch (error) {
        console.error('❌ Error reemplazando flyers:', error);
        throw error;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    replaceFlyers()
        .then(() => {
            console.log('🎉 Proceso completado!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error fatal:', error);
            process.exit(1);
        });
}

module.exports = { replaceFlyers, FLYERS, EVENT_INFO };

