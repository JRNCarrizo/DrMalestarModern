// ===========================================
// SIMPLE API - Dr.Malestar
// Sistema simple y confiable para producción
// ===========================================

class SimpleAPI {
    constructor() {
        this.apiKey = window.CONFIG?.API_KEY || '$2a$10$YOUR_API_KEY_HERE';
        this.baseUrl = window.CONFIG?.BASE_URL || 'https://api.jsonbin.io/v3';
        this.useLocalStorage = window.CONFIG?.USE_LOCAL_STORAGE || false;
        this.storageKey = 'drmalestar_data';
        
        // Usar bin ID del localStorage si existe, sino usar el de config
        this.binId = localStorage.getItem('drmalestar_bin_id') || window.CONFIG?.BIN_ID || '67b0a0b8-5c4a-4b8a-9c1a-1a2b3c4d5e6f';
    }

    // Crear un nuevo bin
    async createBin() {
        try {
            console.log('🔄 Creando nuevo bin en JSONBin...');

            const response = await fetch(`${this.baseUrl}/b`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Name': 'DrMalestar-Content'
                },
                body: JSON.stringify({ flyers: [], photos: [], videos: [] })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error creando bin:', response.status, response.statusText);
                console.error('❌ Detalles:', errorText);
                throw new Error(`Error creando bin: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            this.binId = result.metadata.id;
            console.log('✅ Bin creado exitosamente:', this.binId);
            
            // Guardar el bin ID en localStorage para uso futuro
            localStorage.setItem('drmalestar_bin_id', this.binId);
            
            return { flyers: [], photos: [], videos: [] };
        } catch (error) {
            console.error('❌ Error creando bin:', error);
            throw error;
        }
    }

    // Obtener todos los datos
    async getData() {
        try {
            console.log('🔄 Obteniendo datos de JSONBin...');
            console.log('📋 Bin ID:', this.binId);
            console.log('🔑 API Key:', this.apiKey ? 'Configurada' : 'No configurada');
            
            const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error HTTP:', response.status, response.statusText);
                console.error('❌ Detalles:', errorText);
                
                if (response.status === 400) {
                    console.log('🔄 Bin ID inválido, creando nuevo bin...');
                    return await this.createBin();
                } else if (response.status === 401) {
                    throw new Error('API Key inválida. Verifica tu API_KEY en config.js');
                } else if (response.status === 404) {
                    console.log('🔄 Bin no encontrado, creando nuevo bin...');
                    return await this.createBin();
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }

            const result = await response.json();
            console.log('✅ Datos obtenidos de JSONBin');
            return result.record || { flyers: [], photos: [], videos: [] };
        } catch (error) {
            console.error('❌ Error obteniendo datos:', error);
            throw error; // Re-lanzar el error para que se muestre al usuario
        }
    }

    // Guardar todos los datos
    async saveData(data) {
        try {
            console.log('💾 Guardando datos en JSONBin...');
            
            const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error HTTP:', response.status, response.statusText);
                console.error('❌ Detalles:', errorText);
                
                if (response.status === 400) {
                    throw new Error('Credenciales de JSONBin inválidas. Verifica tu BIN_ID y API_KEY en config.js');
                } else if (response.status === 401) {
                    throw new Error('API Key inválida. Verifica tu API_KEY en config.js');
                } else if (response.status === 403) {
                    throw new Error('Bin supera el límite de 100KB. Usa cleanJSONBin() para limpiar el bin.');
                } else if (response.status === 404) {
                    throw new Error('Bin no encontrado. Verifica tu BIN_ID en config.js');
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            }

            console.log('✅ Datos guardados en JSONBin');
            return await response.json();
        } catch (error) {
            console.error('❌ Error guardando datos:', error);
            throw error;
        }
    }

    // Agregar flyer
    async addFlyer(flyer) {
        const data = await this.getData();
        const newFlyer = {
            id: Date.now().toString(),
            ...flyer,
            createdAt: new Date().toISOString()
        };
        data.flyers.unshift(newFlyer);
        await this.saveData(data);
        return newFlyer;
    }

    // Obtener flyers
    async getFlyers() {
        const data = await this.getData();
        return data.flyers || [];
    }

    // Eliminar flyer
    async deleteFlyer(id) {
        const data = await this.getData();
        data.flyers = data.flyers.filter(flyer => flyer.id !== id);
        await this.saveData(data);
    }

    // Agregar foto
    async addPhoto(photo) {
        const data = await this.getData();
        const newPhoto = {
            id: Date.now().toString(),
            ...photo,
            createdAt: new Date().toISOString()
        };
        data.photos.unshift(newPhoto);
        await this.saveData(data);
        return newPhoto;
    }

    // Obtener fotos
    async getPhotos() {
        const data = await this.getData();
        return data.photos || [];
    }

    // Eliminar foto
    async deletePhoto(id) {
        const data = await this.getData();
        data.photos = data.photos.filter(photo => photo.id !== id);
        await this.saveData(data);
    }

    // Agregar video
    async addVideo(video) {
        const data = await this.getData();
        const newVideo = {
            id: Date.now().toString(),
            ...video,
            createdAt: new Date().toISOString()
        };
        data.videos.unshift(newVideo);
        await this.saveData(data);
        return newVideo;
    }

    // Obtener videos
    async getVideos() {
        const data = await this.getData();
        return data.videos || [];
    }

    // Eliminar video
    async deleteVideo(id) {
        const data = await this.getData();
        data.videos = data.videos.filter(video => video.id !== id);
        await this.saveData(data);
    }
}

// Crear instancia global
const simpleAPI = new SimpleAPI();

console.log('✅ SimpleAPI cargado');