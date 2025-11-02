// ===========================================
// LOCAL STORAGE MANAGER - DR. MALESTAR
// ===========================================

class LocalStorageManager {
    constructor() {
        this.storageKey = 'drmalestar_local_data';
        this.defaultData = {
            flyers: [],
            photos: [],
            videos: [],
            lastUpdated: new Date().toISOString()
        };
    }

    // Obtener datos del localStorage
    getData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error leyendo datos del localStorage:', error);
        }
        return this.defaultData;
    }

    // Guardar datos en localStorage
    saveData(data) {
        try {
            data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('✅ Datos guardados en localStorage');
            return true;
        } catch (error) {
            console.error('Error guardando datos en localStorage:', error);
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
        data.flyers.unshift(newFlyer);
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
        data.photos.unshift(newPhoto);
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
        data.videos.unshift(newVideo);
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
        return this.getData().flyers || [];
    }

    // Obtener fotos
    getPhotos() {
        return this.getData().photos || [];
    }

    // Obtener videos
    getVideos() {
        return this.getData().videos || [];
    }

    // Limpiar todos los datos
    clearAll() {
        localStorage.removeItem(this.storageKey);
        console.log('🗑️ Todos los datos locales eliminados');
    }

    // Exportar datos
    exportData() {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `drmalestar-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Importar datos
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.saveData(data);
            console.log('✅ Datos importados correctamente');
            return true;
        } catch (error) {
            console.error('Error importando datos:', error);
            return false;
        }
    }
}

// Crear instancia global
const localStorageManager = new LocalStorageManager();

// Hacer funciones disponibles globalmente
window.localStorageManager = localStorageManager;

