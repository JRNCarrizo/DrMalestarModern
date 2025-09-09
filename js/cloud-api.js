// ===========================================
// API CLOUD - DR. MALESTAR
// ===========================================

class CloudAPI {
    constructor() {
        this.apiKey = '$2a$10$oYe3uG0XIyCLhNeLvtrZjOSEAkLtqlABuEdQbM9QRKK0FRGVRdxfC';
        this.baseUrl = 'https://api.jsonbin.io/v3';
        this.binId = localStorage.getItem('drmalestar_bin_id');
        this.binName = 'DrMalestar-Content';
    }

    // Crear un nuevo bin si no existe
    async createBin() {
        try {
            console.log('🔄 Creando nuevo bin en JSONBin...');
            
            const response = await fetch(`${this.baseUrl}/b`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Name': this.binName
                },
                body: JSON.stringify({
                    flyers: [],
                    photos: [],
                    videos: [],
                    lastUpdated: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            this.binId = result.metadata.id;
            localStorage.setItem('drmalestar_bin_id', this.binId);
            
            console.log('✅ Bin creado con ID:', this.binId);
            return this.binId;
        } catch (error) {
            console.error('❌ Error creando bin:', error);
            throw error;
        }
    }

    // Obtener datos del bin
    async getData() {
        try {
            // Si no hay binId, crear uno
            if (!this.binId) {
                await this.createBin();
            }

            console.log('🔄 Obteniendo datos del bin:', this.binId);
            
            const response = await fetch(`${this.baseUrl}/b/${this.binId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log('⚠️ Bin no encontrado, creando nuevo...');
                    await this.createBin();
                    return await this.getData();
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Datos obtenidos:', result.record);
            return result.record;
        } catch (error) {
            console.error('❌ Error obteniendo datos:', error);
            throw error;
        }
    }

    // Actualizar datos del bin
    async updateData(data) {
        try {
            if (!this.binId) {
                await this.createBin();
            }

            console.log('🔄 Actualizando datos del bin:', this.binId);
            console.log('🔑 API Key:', this.apiKey ? 'Configurada' : 'No configurada');
            
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
                console.error('❌ Error details:', errorText);
                
                if (response.status === 403) {
                    throw new Error(`HTTP 403: Acceso denegado. Verifica tu API Key y permisos del bin.`);
                } else if (response.status === 404) {
                    throw new Error(`HTTP 404: Bin no encontrado. Creando nuevo bin...`);
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }

            const result = await response.json();
            console.log('✅ Datos actualizados');
            return result;
        } catch (error) {
            console.error('❌ Error actualizando datos:', error);
            throw error;
        }
    }

    // Agregar flyer
    async addFlyer(flyer) {
        try {
            const data = await this.getData();
            const newFlyer = {
                id: Date.now().toString(),
                ...flyer,
                createdAt: new Date().toISOString()
            };
            data.flyers.unshift(newFlyer);
            await this.updateData(data);
            console.log('✅ Flyer agregado a la nube');
            return newFlyer;
        } catch (error) {
            console.error('❌ Error agregando flyer:', error);
            throw error;
        }
    }

    // Agregar foto
    async addPhoto(photo) {
        try {
            const data = await this.getData();
            const newPhoto = {
                id: Date.now().toString(),
                ...photo,
                createdAt: new Date().toISOString()
            };
            data.photos.unshift(newPhoto);
            await this.updateData(data);
            console.log('✅ Foto agregada a la nube');
            return newPhoto;
        } catch (error) {
            console.error('❌ Error agregando foto:', error);
            throw error;
        }
    }

    // Agregar video
    async addVideo(video) {
        try {
            const data = await this.getData();
            const newVideo = {
                id: Date.now().toString(),
                ...video,
                createdAt: new Date().toISOString()
            };
            data.videos.unshift(newVideo);
            await this.updateData(data);
            console.log('✅ Video agregado a la nube');
            return newVideo;
        } catch (error) {
            console.error('❌ Error agregando video:', error);
            throw error;
        }
    }

    // Eliminar flyer
    async deleteFlyer(id) {
        try {
            const data = await this.getData();
            data.flyers = data.flyers.filter(flyer => flyer.id !== id);
            await this.updateData(data);
            console.log('✅ Flyer eliminado de la nube');
            return true;
        } catch (error) {
            console.error('❌ Error eliminando flyer:', error);
            throw error;
        }
    }

    // Eliminar foto
    async deletePhoto(id) {
        try {
            const data = await this.getData();
            data.photos = data.photos.filter(photo => photo.id !== id);
            await this.updateData(data);
            console.log('✅ Foto eliminada de la nube');
            return true;
        } catch (error) {
            console.error('❌ Error eliminando foto:', error);
            throw error;
        }
    }

    // Eliminar video
    async deleteVideo(id) {
        try {
            const data = await this.getData();
            data.videos = data.videos.filter(video => video.id !== id);
            await this.updateData(data);
            console.log('✅ Video eliminado de la nube');
            return true;
        } catch (error) {
            console.error('❌ Error eliminando video:', error);
            throw error;
        }
    }

    // Obtener flyers
    async getFlyers() {
        try {
            const data = await this.getData();
            return data.flyers || [];
        } catch (error) {
            console.error('❌ Error obteniendo flyers:', error);
            return [];
        }
    }

    // Obtener fotos
    async getPhotos() {
        try {
            const data = await this.getData();
            return data.photos || [];
        } catch (error) {
            console.error('❌ Error obteniendo fotos:', error);
            return [];
        }
    }

    // Obtener videos
    async getVideos() {
        try {
            const data = await this.getData();
            return data.videos || [];
        } catch (error) {
            console.error('❌ Error obteniendo videos:', error);
            return [];
        }
    }

    // Verificar estado de la API
    async checkStatus() {
        try {
            console.log('🔄 Verificando estado de JSONBin...');
            const data = await this.getData();
            console.log('✅ JSONBin funcionando correctamente');
            console.log('📊 Estadísticas:', {
                flyers: data.flyers?.length || 0,
                photos: data.photos?.length || 0,
                videos: data.videos?.length || 0
            });
            return true;
        } catch (error) {
            console.error('❌ JSONBin no disponible:', error);
            return false;
        }
    }

    // Crear un nuevo bin y limpiar el anterior
    async createNewBin() {
        try {
            console.log('🔄 Creando nuevo bin...');
            
            // Limpiar el binId anterior
            this.binId = null;
            localStorage.removeItem('drmalestar_bin_id');
            
            // Crear nuevo bin
            await this.createBin();
            
            console.log('✅ Nuevo bin creado:', this.binId);
            return this.binId;
        } catch (error) {
            console.error('❌ Error creando nuevo bin:', error);
            throw error;
        }
    }

    // Verificar y arreglar permisos
    async fixPermissions() {
        try {
            console.log('🔧 Intentando arreglar permisos...');
            
            // Intentar crear un nuevo bin
            await this.createNewBin();
            
            // Probar con datos de prueba
            const testData = {
                flyers: [],
                photos: [],
                videos: [],
                lastUpdated: new Date().toISOString()
            };
            
            await this.updateData(testData);
            console.log('✅ Permisos arreglados');
            return true;
        } catch (error) {
            console.error('❌ No se pudieron arreglar los permisos:', error);
            return false;
        }
    }
}

// Crear instancia global
const cloudAPI = new CloudAPI();

// Funciones de debugging
window.checkCloudAPI = async function() {
    console.log('🔍 Verificando CloudAPI...');
    const status = await cloudAPI.checkStatus();
    if (status) {
        console.log('✅ CloudAPI funcionando');
    } else {
        console.log('❌ CloudAPI con problemas');
    }
    return status;
};

window.testCloudAPI = async function() {
    console.log('🧪 Probando CloudAPI...');
    try {
        // Probar obtener datos
        const data = await cloudAPI.getData();
        console.log('✅ Datos obtenidos:', data);
        
        // Probar agregar un flyer de prueba
        const testFlyer = {
            title: 'Prueba',
            date: '2025-01-01',
            location: 'Test',
            image: 'data:image/png;base64,test'
        };
        
        const result = await cloudAPI.addFlyer(testFlyer);
        console.log('✅ Flyer de prueba agregado:', result);
        
        // Eliminar el flyer de prueba
        await cloudAPI.deleteFlyer(result.id);
        console.log('✅ Flyer de prueba eliminado');
        
        console.log('🎉 CloudAPI funcionando perfectamente');
        return true;
    } catch (error) {
        console.error('❌ Error en prueba:', error);
        return false;
    }
};

window.fixCloudAPI = async function() {
    console.log('🔧 Intentando arreglar CloudAPI...');
    try {
        const fixed = await cloudAPI.fixPermissions();
        if (fixed) {
            console.log('✅ CloudAPI arreglado');
            return true;
        } else {
            console.log('❌ No se pudo arreglar CloudAPI');
            return false;
        }
    } catch (error) {
        console.error('❌ Error arreglando CloudAPI:', error);
        return false;
    }
};

window.createNewBin = async function() {
    console.log('🆕 Creando nuevo bin...');
    try {
        const newBinId = await cloudAPI.createNewBin();
        console.log('✅ Nuevo bin creado:', newBinId);
        return newBinId;
    } catch (error) {
        console.error('❌ Error creando nuevo bin:', error);
        return null;
    }
};
