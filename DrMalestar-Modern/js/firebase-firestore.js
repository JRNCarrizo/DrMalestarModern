// ===========================================
// FIREBASE FIRESTORE - DR. MALESTAR
// ===========================================

import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    deleteDoc, 
    updateDoc,
    query,
    orderBy,
    limit,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
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

        const docRef = await addDoc(collection(db, 'flyers'), {
            ...flyerData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        console.log('✅ Flyer agregado con ID:', docRef.id);
        return { success: true, id: docRef.id };
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

        const q = query(collection(db, 'flyers'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const flyers = [];
        querySnapshot.forEach((doc) => {
            flyers.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('✅ Flyers obtenidos:', flyers.length);
        return { success: true, data: flyers };
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

        await deleteDoc(doc(db, 'flyers', flyerId));
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

        const docRef = await addDoc(collection(db, 'photos'), {
            ...photoData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        console.log('✅ Foto agregada con ID:', docRef.id);
        return { success: true, id: docRef.id };
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

        const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const photos = [];
        querySnapshot.forEach((doc) => {
            photos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('✅ Fotos obtenidas:', photos.length);
        return { success: true, data: photos };
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

        await deleteDoc(doc(db, 'photos', photoId));
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

        const docRef = await addDoc(collection(db, 'videos'), {
            ...videoData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        console.log('✅ Video agregado con ID:', docRef.id);
        return { success: true, id: docRef.id };
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

        const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const videos = [];
        querySnapshot.forEach((doc) => {
            videos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('✅ Videos obtenidos:', videos.length);
        return { success: true, data: videos };
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

        await deleteDoc(doc(db, 'videos', videoId));
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

    const q = query(collection(db, 'flyers'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
        const flyers = [];
        querySnapshot.forEach((doc) => {
            flyers.push({
                id: doc.id,
                ...doc.data()
            });
        });
        callback(flyers);
    });
}

// Escuchar cambios en fotos en tiempo real
export function listenToPhotos(callback) {
    if (!isFirebaseConfigured()) {
        showConfigError();
        return null;
    }

    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
        const photos = [];
        querySnapshot.forEach((doc) => {
            photos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        callback(photos);
    });
}

// Escuchar cambios en videos en tiempo real
export function listenToVideos(callback) {
    if (!isFirebaseConfigured()) {
        showConfigError();
        return null;
    }

    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
        const videos = [];
        querySnapshot.forEach((doc) => {
            videos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        callback(videos);
    });
}

