// ===========================================
// ALMACENAMIENTO SIMPLE - DR. MALESTAR
// ===========================================

class SimpleStorage {
    constructor() {
        this.storageKey = 'drmalestar_content';
    }

    // Obtener todos los datos
    getData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error leyendo datos:', error);
        }
        
        // Datos por defecto
        return {
            flyers: [],
            photos: [],
            videos: [],
            lastUpdated: new Date().toISOString()
        };
    }

    // Guardar todos los datos
    saveData(data) {
        try {
            data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('✅ Datos guardados en localStorage');
            return true;
        } catch (error) {
            console.error('Error guardando datos:', error);
            return false;
        }
    }

    // Agregar flyer
    addFlyer(flyer) {
        const data = this.getData();
        const newFlyer = {
            id: Date.now().toString(),
            ...flyer,
            createdAt: new Date().toISOString()
        };
        data.flyers.unshift(newFlyer); // Agregar al inicio
        this.saveData(data);
        return newFlyer;
    }

    // Agregar foto
    addPhoto(photo) {
        const data = this.getData();
        const newPhoto = {
            id: Date.now().toString(),
            ...photo,
            createdAt: new Date().toISOString()
        };
        data.photos.unshift(newPhoto); // Agregar al inicio
        this.saveData(data);
        return newPhoto;
    }

    // Agregar video
    addVideo(video) {
        const data = this.getData();
        const newVideo = {
            id: Date.now().toString(),
            ...video,
            createdAt: new Date().toISOString()
        };
        data.videos.unshift(newVideo); // Agregar al inicio
        this.saveData(data);
        return newVideo;
    }

    // Eliminar flyer
    deleteFlyer(id) {
        const data = this.getData();
        data.flyers = data.flyers.filter(flyer => flyer.id !== id);
        this.saveData(data);
        return true;
    }

    // Eliminar foto
    deletePhoto(id) {
        const data = this.getData();
        data.photos = data.photos.filter(photo => photo.id !== id);
        this.saveData(data);
        return true;
    }

    // Eliminar video
    deleteVideo(id) {
        const data = this.getData();
        data.videos = data.videos.filter(video => video.id !== id);
        this.saveData(data);
        return true;
    }

    // Obtener flyers
    getFlyers() {
        return this.getData().flyers;
    }

    // Obtener fotos
    getPhotos() {
        return this.getData().photos;
    }

    // Obtener videos
    getVideos() {
        return this.getData().videos;
    }

    // Limpiar todos los datos
    clearAll() {
        localStorage.removeItem(this.storageKey);
        console.log('🗑️ Todos los datos eliminados');
    }

    // Ver estadísticas
    getStats() {
        const data = this.getData();
        return {
            flyers: data.flyers.length,
            photos: data.photos.length,
            videos: data.videos.length,
            lastUpdated: data.lastUpdated
        };
    }
}

// Crear instancia global
const simpleStorage = new SimpleStorage();

// Funciones de debugging
window.debugStorage = function() {
    console.log('🔍 Estado del almacenamiento:');
    console.log('Datos:', simpleStorage.getData());
    console.log('Estadísticas:', simpleStorage.getStats());
};

window.clearStorage = function() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos?')) {
        simpleStorage.clearAll();
        console.log('✅ Almacenamiento limpiado');
    }
};
