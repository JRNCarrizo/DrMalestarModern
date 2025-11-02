// ===========================================
// API SIMPLIFICADA - Dr.Malestar
// Sistema simple para Netlify usando JSONBin
// ===========================================

console.log('🔌 API Simplificada - Dr.Malestar cargada');

class SimpleAPI {
    constructor() {
        this.apiKey = window.CONFIG?.API_KEY || '$2a$10$oYe3uG0XIyCLhNeLvtrZjOSEAkLtqlABuEdQbM9QRKK0FRGVRdxfC';
        this.baseUrl = 'https://api.jsonbin.io/v3';
        
        // Obtener bin ID del localStorage o config
        this.binId = localStorage.getItem('drmalestar_bin_id') || window.CONFIG?.BIN_ID || null;
        
        console.log('📋 Bin ID:', this.binId || 'No configurado');
    }

    // Obtener todos los datos
    async getData() {
        try {
            if (!this.binId) {
                throw new Error('Bin ID no configurado. Usa createBin() primero.');
            }

            const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });

            if (!response.ok) {
                if (response.status === 400 || response.status === 404) {
                    console.log('🔄 Bin no válido, creando nuevo...');
                    return await this.createBin();
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result.record || { flyers: [], photos: [], videos: [] };
        } catch (error) {
            console.error('❌ Error obteniendo datos:', error);
            throw error;
        }
    }

    // Guardar todos los datos
    async saveData(data) {
        try {
            if (!this.binId) {
                throw new Error('Bin ID no configurado. Usa createBin() primero.');
            }

            const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                if (response.status === 400 || response.status === 404) {
                    console.log('🔄 Bin no válido, creando nuevo...');
                    await this.createBin();
                    return await this.saveData(data);
                }
                if (response.status === 403) {
                    throw new Error('Bin supera 100KB. Limpia datos antiguos o crea un bin nuevo.');
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            console.log('✅ Datos guardados correctamente');
            return await response.json();
        } catch (error) {
            console.error('❌ Error guardando datos:', error);
            throw error;
        }
    }

    // Crear nuevo bin
    async createBin() {
        try {
            console.log('🔄 Creando nuevo bin...');
            
            const initialData = { flyers: [], photos: [], videos: [] };
            
            const response = await fetch(`${this.baseUrl}/b`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Name': 'DrMalestar-Content'
                },
                body: JSON.stringify(initialData)
            });

            if (!response.ok) {
                throw new Error(`Error creando bin: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            this.binId = result.metadata.id;
            localStorage.setItem('drmalestar_bin_id', this.binId);
            
            console.log('✅ Bin creado:', this.binId);
            return initialData;
        } catch (error) {
            console.error('❌ Error creando bin:', error);
            throw error;
        }
    }

    // Agregar flyer
    async addFlyer(flyerData) {
        const data = await this.getData();
        const newFlyer = {
            id: Date.now().toString(),
            ...flyerData,
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
        data.flyers = data.flyers.filter(f => f.id !== id);
        await this.saveData(data);
    }

    // Agregar foto
    async addPhoto(photoData) {
        const data = await this.getData();
        const newPhoto = {
            id: Date.now().toString(),
            ...photoData,
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
        data.photos = data.photos.filter(p => p.id !== id);
        await this.saveData(data);
    }

    // Agregar video
    async addVideo(videoData) {
        const data = await this.getData();
        const newVideo = {
            id: Date.now().toString(),
            ...videoData,
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
        data.videos = data.videos.filter(v => v.id !== id);
        await this.saveData(data);
    }
}

// Crear instancia global
const api = new SimpleAPI();

console.log('✅ API Simplificada lista');
