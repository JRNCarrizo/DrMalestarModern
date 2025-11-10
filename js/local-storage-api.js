// ===========================================
// LOCAL STORAGE API - Dr.Malestar
// Sistema de desarrollo con archivos locales
// ===========================================

console.log('💾 Local Storage API - Dr.Malestar cargado');

class LocalStorageAPI {
    constructor() {
        this.storageKey = 'drmalestar_local_data';
        this.initializeData();
    }

    // Inicializar datos si no existen
    initializeData() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                flyers: [],
                photos: [],
                videos: [],
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
            console.log('✅ Datos locales inicializados');
        }
    }

    // Obtener todos los datos
    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return JSON.parse(data);
        } catch (error) {
            console.error('❌ Error obteniendo datos locales:', error);
            this.initializeData();
            return this.getData();
        }
    }

    // Guardar todos los datos
    saveData(data) {
        try {
            data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('✅ Datos locales guardados');
            return true;
        } catch (error) {
            console.error('❌ Error guardando datos locales:', error);
            return false;
        }
    }

    // Agregar flyer
    addFlyer(flyer) {
        try {
            console.log('🔄 Agregando flyer local...');
            const data = this.getData();
            
            const newFlyer = {
                id: Date.now().toString(),
                ...flyer,
                createdAt: new Date().toISOString()
            };
            
            data.flyers.unshift(newFlyer);
            this.saveData(data);
            
            console.log('✅ Flyer agregado localmente:', newFlyer.title);
            return newFlyer;
        } catch (error) {
            console.error('❌ Error agregando flyer local:', error);
            throw error;
        }
    }

    // Obtener flyers
    getFlyers() {
        try {
            const data = this.getData();
            return data.flyers || [];
        } catch (error) {
            console.error('❌ Error obteniendo flyers locales:', error);
            return [];
        }
    }

    // Eliminar flyer
    deleteFlyer(id) {
        try {
            console.log('🔄 Eliminando flyer local:', id);
            const data = this.getData();
            data.flyers = data.flyers.filter(flyer => flyer.id !== id);
            this.saveData(data);
            console.log('✅ Flyer eliminado localmente');
            return true;
        } catch (error) {
            console.error('❌ Error eliminando flyer local:', error);
            throw error;
        }
    }

    // Agregar foto
    addPhoto(photo) {
        try {
            console.log('🔄 Agregando foto local...');
            const data = this.getData();
            
            const newPhoto = {
                id: Date.now().toString(),
                ...photo,
                createdAt: new Date().toISOString()
            };
            
            data.photos.unshift(newPhoto);
            this.saveData(data);
            
            console.log('✅ Foto agregada localmente:', newPhoto.title);
            return newPhoto;
        } catch (error) {
            console.error('❌ Error agregando foto local:', error);
            throw error;
        }
    }

    // Obtener fotos
    getPhotos() {
        try {
            const data = this.getData();
            return data.photos || [];
        } catch (error) {
            console.error('❌ Error obteniendo fotos locales:', error);
            return [];
        }
    }

    // Eliminar foto
    deletePhoto(id) {
        try {
            console.log('🔄 Eliminando foto local:', id);
            const data = this.getData();
            data.photos = data.photos.filter(photo => photo.id !== id);
            this.saveData(data);
            console.log('✅ Foto eliminada localmente');
            return true;
        } catch (error) {
            console.error('❌ Error eliminando foto local:', error);
            throw error;
        }
    }

    // Agregar video
    addVideo(video) {
        try {
            console.log('🔄 Agregando video local...');
            const data = this.getData();
            
            const newVideo = {
                id: Date.now().toString(),
                ...video,
                createdAt: new Date().toISOString()
            };
            
            data.videos.unshift(newVideo);
            this.saveData(data);
            
            console.log('✅ Video agregado localmente:', newVideo.title);
            return newVideo;
        } catch (error) {
            console.error('❌ Error agregando video local:', error);
            throw error;
        }
    }

    // Obtener videos
    getVideos() {
        try {
            const data = this.getData();
            return data.videos || [];
        } catch (error) {
            console.error('❌ Error obteniendo videos locales:', error);
            return [];
        }
    }

    // Eliminar video
    deleteVideo(id) {
        try {
            console.log('🔄 Eliminando video local:', id);
            const data = this.getData();
            data.videos = data.videos.filter(video => video.id !== id);
            this.saveData(data);
            console.log('✅ Video eliminado localmente');
            return true;
        } catch (error) {
            console.error('❌ Error eliminando video local:', error);
            throw error;
        }
    }

    // Limpiar todos los datos
    clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
            this.initializeData();
            console.log('✅ Todos los datos locales limpiados');
            return true;
        } catch (error) {
            console.error('❌ Error limpiando datos locales:', error);
            return false;
        }
    }

    // Obtener estadísticas
    getStats() {
        try {
            const data = this.getData();
            return {
                flyers: data.flyers.length,
                photos: data.photos.length,
                videos: data.videos.length,
                lastUpdated: data.lastUpdated
            };
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas locales:', error);
            return { flyers: 0, photos: 0, videos: 0, lastUpdated: null };
        }
    }

    // Exportar datos para Git
    exportData() {
        try {
            const data = this.getData();
            const exportData = {
                flyers: data.flyers,
                photos: data.photos,
                videos: data.videos,
                exportedAt: new Date().toISOString()
            };
            
            // Crear archivo JSON para descargar
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `drmalestar-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('✅ Datos exportados para Git');
            return true;
        } catch (error) {
            console.error('❌ Error exportando datos:', error);
            return false;
        }
    }
}

// Crear instancia global
const localAPI = new LocalStorageAPI();

// Funciones de debugging
window.testLocalAPI = async function() {
    console.log('🧪 Probando Local Storage API...');
    
    try {
        // Probar agregar flyer
        const testFlyer = {
            title: 'Flyer de Prueba Local',
            date: '2024-12-31',
            time: '22:00',
            location: 'Lugar de Prueba',
            description: 'Este es un flyer de prueba local',
            image: 'img/bluseraflier.jpg'
        };
        
        console.log('🔄 Agregando flyer de prueba...');
        const result = await localAPI.addFlyer(testFlyer);
        console.log('✅ Flyer agregado:', result);
        
        // Verificar que se guardó
        console.log('🔄 Verificando que se guardó...');
        const flyers = localAPI.getFlyers();
        console.log('📋 Flyers en storage:', flyers.length);
        
        const found = flyers.find(f => f.id === result.id);
        if (found) {
            console.log('✅ Flyer encontrado en storage:', found);
        } else {
            console.log('❌ Flyer NO encontrado en storage');
        }
        
        // Mostrar estadísticas
        const stats = localAPI.getStats();
        console.log('📊 Estadísticas:', stats);
        
        return true;
    } catch (error) {
        console.error('❌ Error en prueba:', error);
        return false;
    }
};

window.clearLocalAPI = function() {
    console.log('🧹 Limpiando Local Storage API...');
    localAPI.clearAll();
    console.log('✅ Local Storage API limpiado');
};

window.exportLocalData = function() {
    console.log('📤 Exportando datos locales...');
    localAPI.exportData();
};

console.log('✅ Local Storage API listo');


