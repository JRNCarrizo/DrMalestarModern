// ===========================================
// MANEJADOR DE JSONBIN
// ===========================================

class JSONBinManager {
    constructor() {
        this.config = JSONBIN_CONFIG;
        this.binId = this.getBinIdFromStorage();
    }

    // Obtener el ID del bin desde localStorage
    getBinIdFromStorage() {
        return localStorage.getItem('drmalestar_bin_id');
    }

    // Guardar el ID del bin en localStorage
    saveBinIdToStorage(binId) {
        localStorage.setItem('drmalestar_bin_id', binId);
        this.binId = binId;
    }

    // Crear un nuevo bin en JSONBin
    async createBin() {
        try {
            const initialData = {
                flyers: [],
                photos: [],
                videos: [],
                lastUpdated: new Date().toISOString()
            };

            const response = await fetch(`${this.config.baseUrl}/b`, {
                method: 'POST',
                headers: this.config.getCreateHeaders(),
                body: JSON.stringify(initialData)
            });

            if (!response.ok) {
                throw new Error(`Error creando bin: ${response.status}`);
            }

            const result = await response.json();
            const binId = result.metadata.id;
            
            this.saveBinIdToStorage(binId);
            console.log('Bin creado exitosamente:', binId);
            
            return binId;
        } catch (error) {
            console.error('Error creando bin:', error);
            throw error;
        }
    }

    // Obtener datos del bin
    async getData() {
        try {
            if (!this.binId) {
                // Si no hay bin ID, crear uno nuevo
                await this.createBin();
            }

            const response = await fetch(`${this.config.baseUrl}/b/${this.binId}/latest`, {
                method: 'GET',
                headers: this.config.getHeaders()
            });

            if (!response.ok) {
                if (response.status === 404) {
                    // Si el bin no existe, crear uno nuevo
                    await this.createBin();
                    return this.getData(); // Recursión para obtener los datos del nuevo bin
                }
                throw new Error(`Error obteniendo datos: ${response.status}`);
            }

            const result = await response.json();
            return result.record;
        } catch (error) {
            console.error('Error obteniendo datos:', error);
            throw error;
        }
    }

    // Actualizar datos en el bin
    async updateData(data) {
        try {
            if (!this.binId) {
                await this.createBin();
            }

            const dataToSave = {
                ...data,
                lastUpdated: new Date().toISOString()
            };

            const response = await fetch(`${this.config.baseUrl}/b/${this.binId}`, {
                method: 'PUT',
                headers: this.config.getHeaders(),
                body: JSON.stringify(dataToSave)
            });

            if (!response.ok) {
                throw new Error(`Error actualizando datos: ${response.status}`);
            }

            const result = await response.json();
            console.log('Datos actualizados exitosamente');
            return result;
        } catch (error) {
            console.error('Error actualizando datos:', error);
            throw error;
        }
    }

    // Agregar un flyer
    async addFlyer(flyer) {
        try {
            const data = await this.getData();
            data.flyers.push({
                id: Date.now().toString(),
                ...flyer,
                createdAt: new Date().toISOString()
            });
            
            await this.updateData(data);
            return data.flyers[data.flyers.length - 1];
        } catch (error) {
            console.error('Error agregando flyer:', error);
            throw error;
        }
    }

    // Agregar una foto
    async addPhoto(photo) {
        try {
            const data = await this.getData();
            data.photos.push({
                id: Date.now().toString(),
                ...photo,
                createdAt: new Date().toISOString()
            });
            
            await this.updateData(data);
            return data.photos[data.photos.length - 1];
        } catch (error) {
            console.error('Error agregando foto:', error);
            throw error;
        }
    }

    // Agregar un video
    async addVideo(video) {
        try {
            const data = await this.getData();
            data.videos.push({
                id: Date.now().toString(),
                ...video,
                createdAt: new Date().toISOString()
            });
            
            await this.updateData(data);
            return data.videos[data.videos.length - 1];
        } catch (error) {
            console.error('Error agregando video:', error);
            throw error;
        }
    }

    // Eliminar un flyer
    async deleteFlyer(id) {
        try {
            const data = await this.getData();
            data.flyers = data.flyers.filter(flyer => flyer.id !== id);
            await this.updateData(data);
        } catch (error) {
            console.error('Error eliminando flyer:', error);
            throw error;
        }
    }

    // Eliminar una foto
    async deletePhoto(id) {
        try {
            const data = await this.getData();
            data.photos = data.photos.filter(photo => photo.id !== id);
            await this.updateData(data);
        } catch (error) {
            console.error('Error eliminando foto:', error);
            throw error;
        }
    }

    // Eliminar un video
    async deleteVideo(id) {
        try {
            const data = await this.getData();
            data.videos = data.videos.filter(video => video.id !== id);
            await this.updateData(data);
        } catch (error) {
            console.error('Error eliminando video:', error);
            throw error;
        }
    }

    // Obtener solo flyers
    async getFlyers() {
        try {
            const data = await this.getData();
            return data.flyers || [];
        } catch (error) {
            console.error('Error obteniendo flyers:', error);
            return [];
        }
    }

    // Obtener solo fotos
    async getPhotos() {
        try {
            const data = await this.getData();
            return data.photos || [];
        } catch (error) {
            console.error('Error obteniendo fotos:', error);
            return [];
        }
    }

    // Obtener solo videos
    async getVideos() {
        try {
            const data = await this.getData();
            return data.videos || [];
        } catch (error) {
            console.error('Error obteniendo videos:', error);
            return [];
        }
    }
}

// Crear instancia global
const jsonbinManager = new JSONBinManager();

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JSONBinManager;
}
