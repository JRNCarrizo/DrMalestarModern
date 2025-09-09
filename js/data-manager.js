// ===========================================
// DATA MANAGER - DR. MALESTAR
// Sistema mejorado de gestión de datos
// ===========================================

// ===========================================
// CONFIGURACIÓN
// ===========================================
const DATA_CONFIG = {
    storageKey: 'drmalestar_data',
    backupKey: 'drmalestar_backup',
    maxBackups: 5
};

// ===========================================
// ESTRUCTURA DE DATOS
// ===========================================
const defaultData = {
    flyers: [],
    photos: [],
    videos: [],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0'
};

// ===========================================
// FUNCIONES PRINCIPALES
// ===========================================

// Obtener todos los datos
export function getAllData() {
    try {
        const stored = localStorage.getItem(DATA_CONFIG.storageKey);
        if (stored) {
            const data = JSON.parse(stored);
            return { success: true, data: data };
        } else {
            // Crear datos por defecto
            saveAllData(defaultData);
            return { success: true, data: defaultData };
        }
    } catch (error) {
        console.error('Error al obtener datos:', error);
        return { success: false, error: error.message, data: defaultData };
    }
}

// Guardar todos los datos
export function saveAllData(data) {
    try {
        const dataWithTimestamp = {
            ...data,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(DATA_CONFIG.storageKey, JSON.stringify(dataWithTimestamp));
        
        // Crear respaldo
        createBackup(dataWithTimestamp);
        
        console.log('✅ Datos guardados correctamente');
        return { success: true };
    } catch (error) {
        console.error('Error al guardar datos:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// FUNCIONES PARA FLYERS
// ===========================================

export function addFlyer(flyerData) {
    try {
        const result = getAllData();
        if (!result.success) return result;
        
        const newFlyer = {
            id: generateId(),
            ...flyerData,
            createdAt: new Date().toISOString()
        };
        
        result.data.flyers.unshift(newFlyer);
        const saveResult = saveAllData(result.data);
        
        if (saveResult.success) {
            console.log('✅ Flyer agregado:', newFlyer.id);
            return { success: true, id: newFlyer.id };
        } else {
            return saveResult;
        }
    } catch (error) {
        console.error('Error al agregar flyer:', error);
        return { success: false, error: error.message };
    }
}

export function getFlyers() {
    try {
        const result = getAllData();
        if (result.success) {
            return { success: true, data: result.data.flyers };
        } else {
            return { success: false, error: result.error, data: [] };
        }
    } catch (error) {
        console.error('Error al obtener flyers:', error);
        return { success: false, error: error.message, data: [] };
    }
}

export function deleteFlyer(flyerId) {
    try {
        const result = getAllData();
        if (!result.success) return result;
        
        result.data.flyers = result.data.flyers.filter(flyer => flyer.id !== flyerId);
        const saveResult = saveAllData(result.data);
        
        if (saveResult.success) {
            console.log('✅ Flyer eliminado:', flyerId);
            return { success: true };
        } else {
            return saveResult;
        }
    } catch (error) {
        console.error('Error al eliminar flyer:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// FUNCIONES PARA FOTOS
// ===========================================

export function addPhoto(photoData) {
    try {
        const result = getAllData();
        if (!result.success) return result;
        
        const newPhoto = {
            id: generateId(),
            ...photoData,
            createdAt: new Date().toISOString()
        };
        
        result.data.photos.unshift(newPhoto);
        const saveResult = saveAllData(result.data);
        
        if (saveResult.success) {
            console.log('✅ Foto agregada:', newPhoto.id);
            return { success: true, id: newPhoto.id };
        } else {
            return saveResult;
        }
    } catch (error) {
        console.error('Error al agregar foto:', error);
        return { success: false, error: error.message };
    }
}

export function getPhotos() {
    try {
        const result = getAllData();
        if (result.success) {
            return { success: true, data: result.data.photos };
        } else {
            return { success: false, error: result.error, data: [] };
        }
    } catch (error) {
        console.error('Error al obtener fotos:', error);
        return { success: false, error: error.message, data: [] };
    }
}

export function deletePhoto(photoId) {
    try {
        const result = getAllData();
        if (!result.success) return result;
        
        result.data.photos = result.data.photos.filter(photo => photo.id !== photoId);
        const saveResult = saveAllData(result.data);
        
        if (saveResult.success) {
            console.log('✅ Foto eliminada:', photoId);
            return { success: true };
        } else {
            return saveResult;
        }
    } catch (error) {
        console.error('Error al eliminar foto:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// FUNCIONES PARA VIDEOS
// ===========================================

export function addVideo(videoData) {
    try {
        const result = getAllData();
        if (!result.success) return result;
        
        const newVideo = {
            id: generateId(),
            ...videoData,
            createdAt: new Date().toISOString()
        };
        
        result.data.videos.unshift(newVideo);
        const saveResult = saveAllData(result.data);
        
        if (saveResult.success) {
            console.log('✅ Video agregado:', newVideo.id);
            return { success: true, id: newVideo.id };
        } else {
            return saveResult;
        }
    } catch (error) {
        console.error('Error al agregar video:', error);
        return { success: false, error: error.message };
    }
}

export function getVideos() {
    try {
        const result = getAllData();
        if (result.success) {
            return { success: true, data: result.data.videos };
        } else {
            return { success: false, error: result.error, data: [] };
        }
    } catch (error) {
        console.error('Error al obtener videos:', error);
        return { success: false, error: error.message, data: [] };
    }
}

export function deleteVideo(videoId) {
    try {
        const result = getAllData();
        if (!result.success) return result;
        
        result.data.videos = result.data.videos.filter(video => video.id !== videoId);
        const saveResult = saveAllData(result.data);
        
        if (saveResult.success) {
            console.log('✅ Video eliminado:', videoId);
            return { success: true };
        } else {
            return saveResult;
        }
    } catch (error) {
        console.error('Error al eliminar video:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// FUNCIONES DE RESPALDO
// ===========================================

function createBackup(data) {
    try {
        const backups = getBackups();
        backups.unshift({
            data: data,
            timestamp: new Date().toISOString()
        });
        
        // Mantener solo los últimos X respaldos
        if (backups.length > DATA_CONFIG.maxBackups) {
            backups.splice(DATA_CONFIG.maxBackups);
        }
        
        localStorage.setItem(DATA_CONFIG.backupKey, JSON.stringify(backups));
    } catch (error) {
        console.error('Error al crear respaldo:', error);
    }
}

function getBackups() {
    try {
        const stored = localStorage.getItem(DATA_CONFIG.backupKey);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error al obtener respaldos:', error);
        return [];
    }
}

// ===========================================
// FUNCIONES DE EXPORTACIÓN/IMPORTACIÓN
// ===========================================

export function exportData() {
    try {
        const result = getAllData();
        if (result.success) {
            const dataStr = JSON.stringify(result.data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `drmalestar-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            return { success: true };
        } else {
            return result;
        }
    } catch (error) {
        console.error('Error al exportar datos:', error);
        return { success: false, error: error.message };
    }
}

export function importData(file) {
    return new Promise((resolve) => {
        try {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    const saveResult = saveAllData(data);
                    resolve(saveResult);
                } catch (error) {
                    console.error('Error al parsear archivo:', error);
                    resolve({ success: false, error: 'Archivo inválido' });
                }
            };
            reader.readAsText(file);
        } catch (error) {
            console.error('Error al importar datos:', error);
            resolve({ success: false, error: error.message });
        }
    });
}

// ===========================================
// FUNCIONES DE UTILIDAD
// ===========================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getDataStats() {
    try {
        const result = getAllData();
        if (result.success) {
            return {
                success: true,
                stats: {
                    flyers: result.data.flyers.length,
                    photos: result.data.photos.length,
                    videos: result.data.videos.length,
                    lastUpdated: result.data.lastUpdated,
                    version: result.data.version
                }
            };
        } else {
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return { success: false, error: error.message };
    }
}

