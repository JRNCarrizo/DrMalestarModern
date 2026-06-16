// ===========================================
// API SIMPLIFICADA - Dr.Malestar
// Sistema simple para Netlify usando JSONBin
// ===========================================

console.log('🔌 API Simplificada - Dr.Malestar cargada');

class SimpleAPI {
    constructor() {
        this.apiKey = window.CONFIG?.API_KEY || '$2a$10$oYe3uG0XIyCLhNeLvtrZjOSEAkLtqlABuEdQbM9QRKK0FRGVRdxfC';
        this.baseUrl = 'https://api.jsonbin.io/v3';
        
        // PRIORIDAD ABSOLUTA: Usar SIEMPRE el BIN_ID del config.js (compartido para todos)
        // Esto asegura que todos los dispositivos usen el mismo bin
        const configBinId = window.CONFIG?.BIN_ID;
        const localBinId = localStorage.getItem('drmalestar_bin_id');
        
        // SIEMPRE usar el Bin ID del config si existe (esto es crítico para producción)
        if (configBinId && configBinId.trim() !== '') {
            this.binId = configBinId.trim();
            // Forzar que localStorage use el mismo Bin ID del config
            // Esto previene que dispositivos diferentes usen bins diferentes
            if (localBinId !== this.binId) {
                console.log('🔄 Sincronizando localStorage con config.js...');
                console.log('   LocalStorage tenía:', localBinId || 'nada');
                console.log('   Actualizando a:', this.binId);
            }
            localStorage.setItem('drmalestar_bin_id', this.binId);
        } else {
            // Si no hay config, usar localStorage como fallback
            this.binId = localBinId || null;
            console.warn('⚠️ No hay BIN_ID en config.js. Usando localStorage como fallback.');
            console.warn('⚠️ Esto puede causar problemas en otros dispositivos.');
        }
        
        console.log('═══════════════════════════════════════');
        console.log('📋 CONFIGURACIÓN DE BIN ID');
        console.log('   Bin ID:', this.binId || 'No configurado');
        console.log('   Fuente:', configBinId ? '✅ config.js' : localBinId ? '⚠️ localStorage (fallback)' : '❌ Se creará nuevo');
        console.log('   API Key:', this.apiKey ? '✅ Configurada' : '❌ Faltante');
        console.log('═══════════════════════════════════════');
        
        // Advertencia si no hay Bin ID
        if (!this.binId) {
            console.error('❌ NO HAY BIN_ID CONFIGURADO');
            console.error('   Todos los dispositivos deben usar el mismo Bin ID.');
            console.error('   Actualiza config.js con el Bin ID correcto.');
        }
    }
    
    // Método para verificar si un bin tiene contenido
    async verificarBinConContenido(binId) {
        if (!binId) return false;
        try {
            const response = await fetch(`${this.baseUrl}/b/${binId}`, {
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });
            if (response.ok) {
                const result = await response.json();
                const data = result.record || {};
                const total = (Array.isArray(data.flyers) ? data.flyers.length : 0) +
                             (Array.isArray(data.photos) ? data.photos.length : 0) +
                             (Array.isArray(data.videos) ? data.videos.length : 0) +
                             (Array.isArray(data.downloads) ? data.downloads.length : 0);
                return total > 0;
            }
        } catch (e) {}
        return false;
    }

    // Obtener todos los datos
    async getData() {
        try {
            // Si no hay bin ID, crear uno nuevo automáticamente
            if (!this.binId) {
                console.log('📦 No hay Bin ID configurado, creando uno nuevo...');
                return await this.createBin();
            }

            // Intentar obtener datos del bin configurado
            const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });

            if (!response.ok) {
                if (response.status === 400 || response.status === 404) {
                    console.log('🔄 Bin no válido o no encontrado, creando nuevo...');
                    console.log('⚠️ El Bin ID anterior era:', this.binId);
                    return await this.createBin();
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            const data = result.record || { flyers: [], photos: [], videos: [], downloads: [] };
            if (!Array.isArray(data.downloads)) data.downloads = [];
            
            const flyersCount = Array.isArray(data.flyers) ? data.flyers.length : 0;
            const photosCount = Array.isArray(data.photos) ? data.photos.length : 0;
            const videosCount = Array.isArray(data.videos) ? data.videos.length : 0;
            const downloadsCount = Array.isArray(data.downloads) ? data.downloads.length : 0;
            const total = flyersCount + photosCount + videosCount + downloadsCount;
            
            console.log('✅ Datos cargados del bin:', this.binId);
            console.log(`📊 Contenido: ${flyersCount} flyers, ${photosCount} fotos, ${videosCount} videos, ${downloadsCount} descargas (Total: ${total})`);
            
            // Si el bin está vacío, buscar en otros lugares posibles
            if (total === 0) {
                console.log('🔍 Bin está vacío, buscando contenido en otros bins...');
                
                // Buscar en localStorage
                const localBinId = localStorage.getItem('drmalestar_bin_id');
                const binsParaVerificar = [];
                
                if (localBinId && localBinId !== this.binId) {
                    binsParaVerificar.push(localBinId);
                }
                
                // Verificar cada bin posible
                for (const binId of binsParaVerificar) {
                    console.log(`   🔍 Verificando bin: ${binId}...`);
                    const tieneContenido = await this.verificarBinConContenido(binId);
                    if (tieneContenido) {
                        console.log('✅ ¡ENCONTRÉ CONTENIDO EN OTRO BIN!');
                        console.log('%c═══════════════════════════════════════', 'background: #4ecdc4; color: white; font-size: 14px; padding: 5px;');
                        console.log('%c📋 BIN ID CON CONTENIDO:', 'background: #4ecdc4; color: white; font-size: 16px; font-weight: bold; padding: 5px;');
                        console.log('%c' + binId, 'background: #4ecdc4; color: white; font-size: 18px; font-weight: bold; padding: 10px;');
                        console.log('%c⚠️ ACTUALIZA config.js con este Bin ID', 'background: #ff6b6b; color: white; font-size: 14px; padding: 5px;');
                        console.log('%c═══════════════════════════════════════', 'background: #4ecdc4; color: white; font-size: 14px; padding: 5px;');
                        
                        // Usar ese bin para esta sesión
                        this.binId = binId;
                        localStorage.setItem('drmalestar_bin_id', binId);
                        
                        // Obtener datos de ese bin
                        return await this.getData(); // Recursión para obtener datos del bin correcto
                    }
                }
                
                console.warn('⚠️ No se encontró contenido en otros bins.');
                console.warn('💡 Si cargaste contenido en modo incógnito, ejecuta esto en la consola de ese modo:');
                console.warn('   localStorage.getItem("drmalestar_bin_id")');
                console.warn('   Luego copia ese Bin ID y actualízalo en config.js');
            } else {
                // Si hay contenido, asegurar que el Bin ID esté guardado correctamente
                console.log(`✅ Bin ${this.binId} tiene ${total} elementos de contenido`);
                console.log('💡 Este es el Bin ID correcto que debe estar en config.js');
                
                // Mostrar el Bin ID de forma destacada
                console.log('%c═══════════════════════════════════════', 'background: #4ecdc4; color: white; font-size: 14px; padding: 5px;');
                console.log('%c📋 BIN ID CON CONTENIDO:', 'background: #4ecdc4; color: white; font-size: 16px; font-weight: bold; padding: 5px;');
                console.log('%c' + this.binId, 'background: #4ecdc4; color: white; font-size: 18px; font-weight: bold; padding: 10px;');
                console.log('%c⚠️ COPIA ESTE VALOR Y ACTUALÍZALO EN config.js', 'background: #ff6b6b; color: white; font-size: 14px; padding: 5px;');
                console.log('%cPara que todos los dispositivos vean el mismo contenido', 'background: #4ecdc4; color: white; font-size: 12px; padding: 3px;');
                console.log('%c═══════════════════════════════════════', 'background: #4ecdc4; color: white; font-size: 14px; padding: 5px;');
            }
            
            return data;
        } catch (error) {
            console.error('❌ Error obteniendo datos:', error);
            // Si es un error de red u otro, intentar crear un bin nuevo
            if (error.message.includes('fetch')) {
                console.log('🔄 Error de conexión, intentando crear nuevo bin...');
                try {
                    return await this.createBin();
                } catch (createError) {
                    console.error('❌ Error creando bin:', createError);
                    return { flyers: [], photos: [], videos: [], downloads: [] };
                }
            }
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
            
            const initialData = { flyers: [], photos: [], videos: [], downloads: [] };
            
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
            console.warn('⚠️ COPIA ESTE VALOR Y ACTUALÍZALO EN config.js:', this.binId);
            
            // Mostrar en consola de forma destacada
            console.log('%c═══════════════════════════════════════', 'background: #ff6b6b; color: white; font-size: 14px; padding: 5px;');
            console.log('%c📋 NUEVO BIN ID CREADO', 'background: #ff6b6b; color: white; font-size: 16px; font-weight: bold; padding: 5px;');
            console.log('%c' + this.binId, 'background: #4ecdc4; color: white; font-size: 16px; font-weight: bold; padding: 10px;');
            console.log('%c⚠️ ACTUALIZA config.js con este valor', 'background: #ff6b6b; color: white; font-size: 14px; padding: 5px;');
            console.log('%c═══════════════════════════════════════', 'background: #ff6b6b; color: white; font-size: 14px; padding: 5px;');
            
            // Mostrar alerta visible en la página (solo en desarrollo)
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

    async updateFlyer(id, updates) {
        const data = await this.getData();
        const index = data.flyers.findIndex(f => f.id === id);
        if (index === -1) {
            throw new Error('Flyer no encontrado');
        }
        data.flyers[index] = {
            ...data.flyers[index],
            ...updates,
            id
        };
        await this.saveData(data);
        return data.flyers[index];
    }

    async moveFlyer(id, direction) {
        const data = await this.getData();
        const flyers = Array.isArray(data.flyers) ? data.flyers : [];
        const index = flyers.findIndex(f => f.id === id);
        if (index === -1) {
            throw new Error('Flyer no encontrado');
        }
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= flyers.length) {
            return flyers;
        }
        const [item] = flyers.splice(index, 1);
        flyers.splice(newIndex, 0, item);
        data.flyers = flyers;
        await this.saveData(data);
        return flyers;
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

    async updatePhoto(id, updates) {
        const data = await this.getData();
        const index = data.photos.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Foto no encontrada');
        }
        data.photos[index] = {
            ...data.photos[index],
            ...updates,
            id
        };
        await this.saveData(data);
        return data.photos[index];
    }

    async movePhoto(id, direction) {
        const data = await this.getData();
        const photos = Array.isArray(data.photos) ? data.photos : [];
        const index = photos.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Foto no encontrada');
        }
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= photos.length) {
            return photos;
        }
        const [item] = photos.splice(index, 1);
        photos.splice(newIndex, 0, item);
        data.photos = photos;
        await this.saveData(data);
        return photos;
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

    async updateVideo(id, updates) {
        const data = await this.getData();
        const index = data.videos.findIndex(v => v.id === id);
        if (index === -1) {
            throw new Error('Video no encontrado');
        }
        data.videos[index] = {
            ...data.videos[index],
            ...updates,
            id
        };
        await this.saveData(data);
        return data.videos[index];
    }

    async moveVideo(id, direction) {
        const data = await this.getData();
        const videos = Array.isArray(data.videos) ? data.videos : [];
        const index = videos.findIndex(v => v.id === id);
        if (index === -1) {
            throw new Error('Video no encontrado');
        }
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= videos.length) {
            return videos;
        }
        const [item] = videos.splice(index, 1);
        videos.splice(newIndex, 0, item);
        data.videos = videos;
        await this.saveData(data);
        return videos;
    }

    async addDownload(downloadData) {
        const data = await this.getData();
        const newDownload = {
            id: Date.now().toString(),
            ...downloadData,
            createdAt: new Date().toISOString()
        };
        if (!Array.isArray(data.downloads)) data.downloads = [];
        data.downloads.unshift(newDownload);
        await this.saveData(data);
        return newDownload;
    }

    async getDownloads() {
        const data = await this.getData();
        return Array.isArray(data.downloads) ? data.downloads : [];
    }

    async deleteDownload(id) {
        const data = await this.getData();
        data.downloads = (data.downloads || []).filter(d => d.id !== id);
        await this.saveData(data);
    }

    async updateDownload(id, updates) {
        const data = await this.getData();
        const downloads = Array.isArray(data.downloads) ? data.downloads : [];
        const index = downloads.findIndex(d => d.id === id);
        if (index === -1) {
            throw new Error('Descarga no encontrada');
        }
        downloads[index] = {
            ...downloads[index],
            ...updates,
            id
        };
        data.downloads = downloads;
        await this.saveData(data);
        return downloads[index];
    }

    async moveDownload(id, direction) {
        const data = await this.getData();
        const downloads = Array.isArray(data.downloads) ? data.downloads : [];
        const index = downloads.findIndex(d => d.id === id);
        if (index === -1) {
            throw new Error('Descarga no encontrada');
        }
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= downloads.length) {
            return downloads;
        }
        const [item] = downloads.splice(index, 1);
        downloads.splice(newIndex, 0, item);
        data.downloads = downloads;
        await this.saveData(data);
        return downloads;
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
