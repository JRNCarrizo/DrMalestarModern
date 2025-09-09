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
                    await this.createBin();
                }
            }

            if (!this.binId) {
                throw new Error('No se pudo crear el bin');
            }

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
            return result.record;
        } catch (error) {
            console.error('Error obteniendo datos:', error);
            // Fallback a datos locales
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
        const data = await this.getData();
        data.flyers.push({
            id: Date.now().toString(),
            ...flyer,
            createdAt: new Date().toISOString()
        });
        await this.updateData(data);
        return data.flyers[data.flyers.length - 1];
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
        const data = await this.getData();
        data.flyers = data.flyers.filter(flyer => flyer.id !== id);
        await this.updateData(data);
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
