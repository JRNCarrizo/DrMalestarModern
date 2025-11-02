// ===========================================
// API SIMPLIFICADA - Dr.Malestar
// Sistema simple para Netlify usando JSONBin
// ===========================================

console.log('🔌 API Simplificada - Dr.Malestar cargada');

class SimpleAPI {
    constructor() {
        this.apiKey = window.CONFIG?.API_KEY || '$2a$10$oYe3uG0XIyCLhNeLvtrZjOSEAkLtqlABuEdQbM9QRKK0FRGVRdxfC';
        this.baseUrl = 'https://api.jsonbin.io/v3';
        
        // PRIORIDAD: Primero usar el BIN_ID del config (compartido para todos)
        // Solo usar localStorage si el config no tiene BIN_ID
        // Esto asegura que todos los usuarios usen el mismo bin
        const configBinId = window.CONFIG?.BIN_ID;
        const localBinId = localStorage.getItem('drmalestar_bin_id');
        
        // Si el config tiene un bin ID válido (no es placeholder), usarlo
        if (configBinId && configBinId !== '67b0a0b8-5c4a-4b8a-9c1a-1a2b3c4d5e6f') {
            this.binId = configBinId;
            // Sincronizar localStorage con el config para consistencia
            if (localBinId !== configBinId) {
                localStorage.setItem('drmalestar_bin_id', configBinId);
            }
        } else {
            // Si no hay config válido, usar localStorage o intentar crear uno
            this.binId = localBinId || null;
        }
        
        console.log('📋 Bin ID:', this.binId || 'No configurado');
        console.log('📋 Fuente:', configBinId && configBinId !== '67b0a0b8-5c4a-4b8a-9c1a-1a2b3c4d5e6f' ? 'Config' : localBinId ? 'LocalStorage' : 'Ninguna');
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
            console.warn('⚠️ IMPORTANTE: Actualiza el BIN_ID en config.js con este valor:', this.binId);
            console.warn('⚠️ De lo contrario, cada usuario creará su propio bin.');
            
            // Mostrar alerta visible en la página
            showBinIdAlert(this.binId);
            
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

// Función para mostrar alerta del nuevo Bin ID
function showBinIdAlert(binId) {
    // Solo mostrar en consola en producción, no molestar al usuario final
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        alert(`Nuevo Bin ID creado: ${binId}\n\nActualiza config.js con este valor para que todos los usuarios usen el mismo bin.`);
    }
}

// Crear instancia global
const api = new SimpleAPI();

console.log('✅ API Simplificada lista');
