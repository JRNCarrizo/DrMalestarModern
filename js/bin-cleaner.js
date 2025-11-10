// ===========================================
// BIN CLEANER - Dr.Malestar
// Limpiar bin de JSONBin cuando supera el límite
// ===========================================

console.log('🧹 Bin Cleaner - Dr.Malestar cargado');

class BinCleaner {
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    // Limpiar bin completamente
    async cleanBin(binId) {
        try {
            console.log('🧹 Limpiando bin de JSONBin...');
            
            const cleanData = {
                flyers: [],
                photos: [],
                videos: [],
                lastCleaned: new Date().toISOString()
            };
            
            const response = await fetch(`${this.baseUrl}/b/${binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify(cleanData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error limpiando bin:', response.status, response.statusText);
                console.error('❌ Detalles:', errorText);
                throw new Error(`Error limpiando bin: ${response.status} ${response.statusText}`);
            }

            console.log('✅ Bin limpiado exitosamente');
            return true;
        } catch (error) {
            console.error('❌ Error limpiando bin:', error);
            return false;
        }
    }

    // Crear un nuevo bin limpio
    async createCleanBin() {
        try {
            console.log('🔄 Creando nuevo bin limpio...');
            
            const cleanData = {
                flyers: [],
                photos: [],
                videos: [],
                createdAt: new Date().toISOString()
            };
            
            const response = await fetch(`${this.baseUrl}/b`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Name': 'DrMalestar-Content-Clean'
                },
                body: JSON.stringify(cleanData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error creando bin limpio:', response.status, response.statusText);
                console.error('❌ Detalles:', errorText);
                throw new Error(`Error creando bin limpio: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            const newBinId = result.metadata.id;
            console.log('✅ Nuevo bin limpio creado:', newBinId);
            
            // Guardar el nuevo bin ID
            localStorage.setItem('drmalestar_bin_id', newBinId);
            
            return newBinId;
        } catch (error) {
            console.error('❌ Error creando bin limpio:', error);
            throw error;
        }
    }
}

// Función global para limpiar el bin
window.cleanJSONBin = async function() {
    const apiKey = window.CONFIG?.API_KEY || '$2a$10$oYe3uG0XIyCLhNeLvtrZjOSEAkLtqlABuEdQbM9QRKK0FRGVRdxfC';
    const baseUrl = window.CONFIG?.BASE_URL || 'https://api.jsonbin.io/v3';
    const currentBinId = localStorage.getItem('drmalestar_bin_id');
    
    const cleaner = new BinCleaner(apiKey, baseUrl);
    
    if (currentBinId) {
        console.log('🧹 Intentando limpiar bin existente...');
        const cleaned = await cleaner.cleanBin(currentBinId);
        if (cleaned) {
            console.log('✅ Bin limpiado exitosamente');
            return currentBinId;
        }
    }
    
    console.log('🔄 Creando nuevo bin limpio...');
    const newBinId = await cleaner.createCleanBin();
    return newBinId;
};

console.log('✅ Bin Cleaner listo');
console.log('💡 Usa cleanJSONBin() para limpiar el bin actual');


