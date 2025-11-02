// ========================================
// 📸 LOAD EXISTING PHOTOS - Dr.Malestar
// ========================================
// Script para cargar fotos existentes en el panel de administración

console.log('📸 Load Existing Photos - Dr.Malestar cargado');

// ========================================
// 📋 FOTOS EXISTENTES
// ========================================

// Datos iniciales de fotos
const INITIAL_PHOTOS = [
    {
        id: 'existing-photo-1',
        title: 'Héctor Bass',
        description: 'Bajo y Fundador',
        image: '../img/hector1.jpg',
        fallback: '../img/bluseraflier.jpg'
    },
    {
        id: 'existing-photo-2',
        title: 'Hugo "Mosca" Fleitas',
        description: 'Batería',
        image: '../img/hugo1.jpg',
        fallback: '../img/bluseraflier.jpg'
    },
    {
        id: 'existing-photo-3',
        title: 'Jorge "Moncho" Carrizo',
        description: 'Guitarra y coros',
        image: '../img/moncho1.jpg',
        fallback: '../img/bluseraflier.jpg'
    },
    {
        id: 'existing-photo-4',
        title: 'Julio "Tano" Macaroni',
        description: 'Guitarra y coros',
        image: '../img/Tano1.jpg',
        fallback: '../img/bluseraflier.jpg'
    },
    {
        id: 'existing-photo-5',
        title: 'Gustavo "Negro" González',
        description: 'Voz y armónica',
        image: '../img/negro1.jpg',
        fallback: '../img/bluseraflier.jpg'
    },
    {
        id: 'existing-photo-6',
        title: 'Pappo',
        description: 'Nuestro homenaje',
        image: '../img/pappo1.avif',
        fallback: '../img/bluseraflier.jpg'
    }
];

// Obtener fotos desde localStorage o usar las iniciales
function getExistingPhotos() {
    const stored = localStorage.getItem('drmalestar_existing_photos');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error('Error parseando fotos desde localStorage:', error);
            return [...INITIAL_PHOTOS];
        }
    }
    return [...INITIAL_PHOTOS];
}

// Guardar fotos en localStorage
function saveExistingPhotos(photos) {
    localStorage.setItem('drmalestar_existing_photos', JSON.stringify(photos));
}

// Obtener fotos actuales
let EXISTING_PHOTOS = getExistingPhotos();

// ========================================
// 🔧 FUNCIONES DE CARGA
// ========================================

function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
    });
}

async function loadExistingPhotos() {
    console.log('📸 Cargando fotos existentes en el panel de administración...');
    
    const container = document.getElementById('photosList');
    if (!container) {
        console.error('❌ No se encontró el contenedor de fotos');
        return;
    }

    // Limpiar contenedor
    container.innerHTML = '';

    // Cargar cada foto
    for (const photo of EXISTING_PHOTOS) {
        const photoItem = await createExistingPhotoItem(photo);
        container.appendChild(photoItem);
    }

    console.log('✅ Fotos existentes cargadas en el panel de administración');
}

async function createExistingPhotoItem(photo) {
    const item = document.createElement('div');
    item.className = 'media-item';
    
    // Verificar si la imagen existe
    const imageExists = await checkImageExists(photo.image);
    const imageSrc = imageExists ? photo.image : photo.fallback;
    
    item.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2">
                <img src="${imageSrc}" alt="${photo.title}" 
                     onerror="this.src='${photo.fallback}'" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="col-md-8">
                <h5>${photo.title}</h5>
                <p class="mb-0">${photo.description}</p>
                <small class="text-muted">${imageExists ? 'Imagen cargada' : 'Usando imagen de respaldo'}</small>
            </div>
            <div class="col-md-2 text-end">
                <button class="btn btn-danger-admin" onclick="deleteExistingPhoto('${photo.id}')">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `;
    
    return item;
}

async function deleteExistingPhoto(photoId) {
    console.log('🗑️ Eliminando foto existente:', photoId);
    if (confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
        try {
            // Buscar la foto en los datos existentes
            const photo = EXISTING_PHOTOS.find(p => p.id === photoId);
            if (photo) {
                // Eliminar de la lista local
                const index = EXISTING_PHOTOS.findIndex(p => p.id === photoId);
                if (index > -1) {
                    EXISTING_PHOTOS.splice(index, 1);
                }
                
                // Guardar cambios en localStorage
                saveExistingPhotos(EXISTING_PHOTOS);
                console.log('💾 Cambios guardados en localStorage');
                
                // Si hay cloudAPI disponible, eliminar también de ahí
                if (typeof cloudAPI !== 'undefined' && typeof cloudAPI.deletePhoto === 'function') {
                    try {
                        await cloudAPI.deletePhoto(photoId);
                        console.log('✅ Foto eliminada de CloudAPI');
                    } catch (error) {
                        console.log('⚠️ No se pudo eliminar de CloudAPI:', error.message);
                    }
                }
                
                console.log('✅ Foto eliminada:', photoId);
                showNotification('Foto eliminada correctamente', 'success');
                
                // Recargar la lista
                await loadExistingPhotos();
            } else {
                showNotification('Foto no encontrada', 'error');
            }
        } catch (error) {
            console.error('❌ Error eliminando foto:', error);
            showNotification('Error eliminando foto: ' + error.message, 'error');
        }
    }
}

// ========================================
// 🎯 FUNCIONES GLOBALES
// ========================================

// Hacer las funciones disponibles globalmente
window.loadExistingPhotos = loadExistingPhotos;
window.deleteExistingPhoto = deleteExistingPhoto;

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos para la notificación
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

console.log('📸 Load Existing Photos - Dr.Malestar listo');
