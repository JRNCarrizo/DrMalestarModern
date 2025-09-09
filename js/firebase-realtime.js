// ===========================================
// FIREBASE REALTIME DATABASE - DR. MALESTAR
// ===========================================

import { 
    ref, 
    push, 
    set, 
    get, 
    remove, 
    onValue,
    off,
    query,
    orderByChild,
    limitToLast
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { db, isFirebaseConfigured, showConfigError } from './firebase-config.js';

// ===========================================
// FUNCIONES PARA FLYERS
// ===========================================

// Agregar un nuevo flyer
export async function addFlyer(flyerData) {
    try {
        if (!isFirebaseConfigured()) {
            showConfigError();
            return { success: false, error: 'Firebase no configurado' };
        }

        const flyersRef = ref(db, 'flyers');
        const newFlyerRef = push(flyersRef);
        
        const flyerWithTimestamp = {
            ...flyerData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await set(newFlyerRef, flyerWithTimestamp);
        
        console.log('✅ Flyer agregado con ID:', newFlyerRef.key);
        return { success: true, id: newFlyerRef.key };
    } catch (error) {
        console.error('❌ Error al agregar flyer:', error);
        return { success: false, error: error.message };
    }
}

// Obtener todos los flyers
export async function getFlyers() {
    try {
        if (!isFirebaseConfigured()) {
            showConfigError();
            return { success: false, error: 'Firebase no configurado', data: [] };
        }

        const flyersRef = ref(db, 'flyers');
        const snapshot = await get(flyersRef);
        
        if (snapshot.exists()) {
            const flyers = [];
            snapshot.forEach((childSnapshot) => {
                flyers.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            // Ordenar por fecha de creación (más recientes primero)
            flyers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            console.log('✅ Flyers obtenidos:', flyers.length);
            return { success: true, data: flyers };
        } else {
            console.log('✅ No hay flyers');
            return { success: true, data: [] };
        }
    } catch (error) {
        console.error('❌ Error al obtener flyers:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Eliminar un flyer
export async function deleteFlyer(flyerId) {
    try {
        if (!isFirebaseConfigured()) {
            showConfigError();
            return { success: false, error: 'Firebase no configurado' };
        }

        const flyerRef = ref(db, `flyers/${flyerId}`);
        await remove(flyerRef);
        
        console.log('✅ Flyer eliminado:', flyerId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error al eliminar flyer:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// FUNCIONES PARA FOTOS
// ===========================================

// Agregar una nueva foto
export async function addPhoto(photoData) {
    try {
        if (!isFirebaseConfigured()) {
            showConfigError();
            return { success: false, error: 'Firebase no configurado' };
        }

        const photosRef = ref(db, 'photos');
        const newPhotoRef = push(photosRef);
        
        const photoWithTimestamp = {
            ...photoData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await set(newPhotoRef, photoWithTimestamp);
        
        console.log('✅ Foto agregada con ID:', newPhotoRef.key);
        return { success: true, id: newPhotoRef.key };
    } catch (error) {
        console.error('❌ Error al agregar foto:', error);
        return { success: false, error: error.message };
    }
}

// Obtener todas las fotos
export async function getPhotos() {
    try {
        if (!isFirebaseConfigured()) {
            showConfigError();
            return { success: false, error: 'Firebase no configurado', data: [] };
        }

        const photosRef = ref(db, 'photos');
        const snapshot = await get(photosRef);
        
        if (snapshot.exists()) {
            const photos = [];
            snapshot.forEach((childSnapshot) => {
                photos.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            // Ordenar por fecha de creación (más recientes primero)
            photos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            console.log('✅ Fotos obtenidas:', photos.length);
            return { success: true, data: photos };
        } else {
            console.log('✅ No hay fotos');
            return { success: true, data: [] };
        }
    } catch (error) {
        console.error('❌ Error al obtener fotos:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Eliminar una foto
export async function deletePhoto(photoId) {
    try {
        if (!isFirebaseConfigured()) {
            showConfigError();
            return { success: false, error: 'Firebase no configurado' };
        }

        const photoRef = ref(db, `photos/${photoId}`);
        await remove(photoRef);
        
        console.log('✅ Foto eliminada:', photoId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error al eliminar foto:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// FUNCIONES PARA VIDEOS
// ===========================================

// Agregar un nuevo video
export async function addVideo(videoData) {
    try {
        if (!isFirebaseConfigured()) {
            showConfigError();
            return { success: false, error: 'Firebase no configurado' };
        }

        const videosRef = ref(db, 'videos');
        const newVideoRef = push(videosRef);
        
        const videoWithTimestamp = {
            ...videoData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await set(newVideoRef, videoWithTimestamp);
        
        console.log('✅ Video agregado con ID:', newVideoRef.key);
        return { success: true, id: newVideoRef.key };
    } catch (error) {
        console.error('❌ Error al agregar video:', error);
        return { success: false, error: error.message };
    }
}

// Obtener todos los videos
export async function getVideos() {
    try {
        if (!isFirebaseConfigured()) {
            showConfigError();
            return { success: false, error: 'Firebase no configurado', data: [] };
        }

        const videosRef = ref(db, 'videos');
        const snapshot = await get(videosRef);
        
        if (snapshot.exists()) {
            const videos = [];
            snapshot.forEach((childSnapshot) => {
                videos.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            // Ordenar por fecha de creación (más recientes primero)
            videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            console.log('✅ Videos obtenidos:', videos.length);
            return { success: true, data: videos };
        } else {
            console.log('✅ No hay videos');
            return { success: true, data: [] };
        }
    } catch (error) {
        console.error('❌ Error al obtener videos:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Eliminar un video
export async function deleteVideo(videoId) {
    try {
        if (!isFirebaseConfigured()) {
            showConfigError();
            return { success: false, error: 'Firebase no configurado' };
        }

        const videoRef = ref(db, `videos/${videoId}`);
        await remove(videoRef);
        
        console.log('✅ Video eliminado:', videoId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error al eliminar video:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// FUNCIONES DE TIEMPO REAL
// ===========================================

// Escuchar cambios en flyers en tiempo real
export function listenToFlyers(callback) {
    if (!isFirebaseConfigured()) {
        showConfigError();
        return null;
    }

    const flyersRef = ref(db, 'flyers');
    return onValue(flyersRef, (snapshot) => {
        if (snapshot.exists()) {
            const flyers = [];
            snapshot.forEach((childSnapshot) => {
                flyers.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            // Ordenar por fecha de creación (más recientes primero)
            flyers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            callback(flyers);
        } else {
            callback([]);
        }
    });
}

// Escuchar cambios en fotos en tiempo real
export function listenToPhotos(callback) {
    if (!isFirebaseConfigured()) {
        showConfigError();
        return null;
    }

    const photosRef = ref(db, 'photos');
    return onValue(photosRef, (snapshot) => {
        if (snapshot.exists()) {
            const photos = [];
            snapshot.forEach((childSnapshot) => {
                photos.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            // Ordenar por fecha de creación (más recientes primero)
            photos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            callback(photos);
        } else {
            callback([]);
        }
    });
}

// Escuchar cambios en videos en tiempo real
export function listenToVideos(callback) {
    if (!isFirebaseConfigured()) {
        showConfigError();
        return null;
    }

    const videosRef = ref(db, 'videos');
    return onValue(videosRef, (snapshot) => {
        if (snapshot.exists()) {
            const videos = [];
            snapshot.forEach((childSnapshot) => {
                videos.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            // Ordenar por fecha de creación (más recientes primero)
            videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            callback(videos);
        } else {
            callback([]);
        }
    });
}

// ===========================================
// FUNCIONES DE UTILIDAD
// ===========================================

// Detener escucha en tiempo real
export function stopListening(listener) {
    if (listener) {
        off(listener);
    }
}

