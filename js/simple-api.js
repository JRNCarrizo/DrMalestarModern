// ===========================================
// API SIMPLE PARA DR. MALESTAR
// ===========================================

class SimpleAPI {
    constructor() {
        this.baseUrl = 'https://api.jsonbin.io/v3';
        this.apiKey = '$2a$10$oYe3uG0XIyCLhNeLvtrZjOSEAkLtqlABuEdQbM9QRKK0FRGVRdxfC';
        this.binId = null; // Se creará automáticamente
    }

    async createBin() {
        try {
            const initialData = {
                flyers: [],
                photos: [],
                videos: [],
                lastUpdated: new Date().toISOString()
            };

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
                throw new Error(`Error creando bin: ${response.status}`);
            }

            const result = await response.json();
            this.binId = result.metadata.id;
            localStorage.setItem('drmalestar_bin_id', this.binId);
            console.log('Bin creado:', this.binId);
            return this.binId;
        } catch (error) {
            console.error('Error creando bin:', error);
            return null;
        }
    }

    async getData() {
        try {
            // Si no hay binId, intentar crearlo
            if (!this.binId) {
                this.binId = localStorage.getItem('drmalestar_bin_id');
                if (!this.binId) {
                    console.log('🔄 Creando nuevo bin...');
                    await this.createBin();
                }
            }

            if (!this.binId) {
                console.log('❌ No se pudo crear el bin, usando datos locales');
                return this.getLocalData();
            }

            console.log('🔄 Obteniendo datos del bin:', this.binId);
            const response = await fetch(`${this.baseUrl}/b/${this.binId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Datos obtenidos de JSONBin:', result.record);
            return result.record;
        } catch (error) {
            console.error('❌ Error obteniendo datos de JSONBin:', error);
            console.log('🔄 Usando datos locales como fallback');
            return this.getLocalData();
        }
    }

    async updateData(data) {
        try {
            const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error actualizando datos:', error);
            // Fallback a localStorage
            this.saveLocalData(data);
            return { success: true, local: true };
        }
    }

    getLocalData() {
        const stored = localStorage.getItem('drmalestar_data');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parseando datos locales:', e);
            }
        }
        return {
            flyers: [],
            photos: [],
            videos: [],
            lastUpdated: new Date().toISOString()
        };
    }

    saveLocalData(data) {
        localStorage.setItem('drmalestar_data', JSON.stringify(data));
    }

    async getFlyers() {
        const data = await this.getData();
        return data.flyers || [];
    }

    async getPhotos() {
        const data = await this.getData();
        return data.photos || [];
    }

    async getVideos() {
        const data = await this.getData();
        return data.videos || [];
    }

    async addFlyer(flyer) {
        console.log('🔄 Agregando flyer:', flyer);
        const data = await this.getData();
        const newFlyer = {
            id: Date.now().toString(),
            ...flyer,
            createdAt: new Date().toISOString()
        };
        data.flyers.push(newFlyer);
        console.log('📝 Datos actualizados:', data);
        await this.updateData(data);
        console.log('✅ Flyer agregado exitosamente');
        return newFlyer;
    }

    async addPhoto(photo) {
        const data = await this.getData();
        data.photos.push({
            id: Date.now().toString(),
            ...photo,
            createdAt: new Date().toISOString()
        });
        await this.updateData(data);
        return data.photos[data.photos.length - 1];
    }

    async addVideo(video) {
        const data = await this.getData();
        data.videos.push({
            id: Date.now().toString(),
            ...video,
            createdAt: new Date().toISOString()
        });
        await this.updateData(data);
        return data.videos[data.videos.length - 1];
    }

    async deleteFlyer(id) {
        console.log('🗑️ Eliminando flyer con ID:', id);
        const data = await this.getData();
        console.log('📋 Flyers antes de eliminar:', data.flyers.length);
        data.flyers = data.flyers.filter(flyer => flyer.id !== id);
        console.log('📋 Flyers después de eliminar:', data.flyers.length);
        await this.updateData(data);
        console.log('✅ Flyer eliminado de la base de datos');
    }

    async deletePhoto(id) {
        const data = await this.getData();
        data.photos = data.photos.filter(photo => photo.id !== id);
        await this.updateData(data);
    }

    async deleteVideo(id) {
        const data = await this.getData();
        data.videos = data.videos.filter(video => video.id !== id);
        await this.updateData(data);
    }
}

// Crear instancia global
const simpleAPI = new SimpleAPI();

// Función para forzar sincronización
window.forceSync = async function() {
    console.log('🔄 Forzando sincronización...');
    try {
        const data = await simpleAPI.getData();
        console.log('📋 Datos sincronizados:', data);
        
        // Guardar en localStorage como respaldo
        localStorage.setItem('drmalestar_data', JSON.stringify(data));
        console.log('✅ Datos guardados en localStorage');
        
        return data;
    } catch (error) {
        console.error('❌ Error en sincronización:', error);
        return null;
    }
};
