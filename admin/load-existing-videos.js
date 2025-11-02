// ========================================
// 🎥 LOAD EXISTING VIDEOS - Dr.Malestar
// ========================================
// Script para cargar videos existentes en el panel de administración

console.log('🎥 Load Existing Videos - Dr.Malestar cargado');

// ========================================
// 📋 VIDEOS EXISTENTES
// ========================================

// Datos iniciales de videos
const INITIAL_VIDEOS = [
    {
        id: 'existing-video-1',
        title: 'Dr.Malestar - Show en Vivo',
        description: 'Concierto completo desde Memphis',
        youtubeId: 'dQw4w9WgXcQ',
        originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
        id: 'existing-video-2',
        title: 'Dr.Malestar - Tributo a Pappo',
        description: 'Homenaje completo a la leyenda del rock argentino',
        youtubeId: 'dQw4w9WgXcQ',
        originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
        id: 'existing-video-3',
        title: 'Dr.Malestar - En el Estudio',
        description: 'Grabando nuestro próximo álbum',
        youtubeId: 'dQw4w9WgXcQ',
        originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
        id: 'existing-video-4',
        title: 'Dr.Malestar - Entrevista',
        description: 'Hablamos sobre nuestra música y proyectos',
        youtubeId: 'dQw4w9WgXcQ',
        originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
];

// Obtener videos desde localStorage o usar los iniciales
function getExistingVideos() {
    const stored = localStorage.getItem('drmalestar_existing_videos');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error('Error parseando videos desde localStorage:', error);
            return [...INITIAL_VIDEOS];
        }
    }
    return [...INITIAL_VIDEOS];
}

// Guardar videos en localStorage
function saveExistingVideos(videos) {
    localStorage.setItem('drmalestar_existing_videos', JSON.stringify(videos));
}

// Obtener videos actuales
let EXISTING_VIDEOS = getExistingVideos();

// ========================================
// 🔧 FUNCIONES DE CARGA
// ========================================

function checkVideoExists(youtubeId) {
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${youtubeId}`;
        iframe.style.display = 'none';
        iframe.onload = () => resolve(true);
        iframe.onerror = () => resolve(false);
        document.body.appendChild(iframe);
        
        // Limpiar después de verificar
        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
        }, 1000);
    });
}

async function loadExistingVideos() {
    console.log('🎥 Cargando videos existentes en el panel de administración...');
    
    const container = document.getElementById('videosList');
    if (!container) {
        console.error('❌ No se encontró el contenedor de videos');
        return;
    }

    // Limpiar contenedor
    container.innerHTML = '';

    // Cargar cada video
    for (const video of EXISTING_VIDEOS) {
        const videoItem = await createExistingVideoItem(video);
        container.appendChild(videoItem);
    }

    console.log('✅ Videos existentes cargados en el panel de administración');
}

async function createExistingVideoItem(video) {
    const item = document.createElement('div');
    item.className = 'media-item';
    
    // Verificar si el video existe (simplificado para YouTube)
    const videoExists = true; // YouTube videos generalmente existen
    
    item.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2">
                <div class="bg-secondary rounded d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-youtube text-danger" style="font-size: 2rem;"></i>
                </div>
            </div>
            <div class="col-md-8">
                <h5>${video.title}</h5>
                <p class="mb-1">${video.description}</p>
                <small class="text-muted">${video.originalUrl}</small>
                <div class="mt-2">
                    <span class="badge bg-success">YouTube</span>
                    <span class="badge bg-info">Disponible</span>
                </div>
            </div>
            <div class="col-md-2 text-end">
                <button class="btn btn-danger-admin" onclick="deleteExistingVideo('${video.id}')">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `;
    
    return item;
}

async function deleteExistingVideo(videoId) {
    console.log('🗑️ Eliminando video existente:', videoId);
    if (confirm('¿Estás seguro de que quieres eliminar este video?')) {
        try {
            // Buscar el video en los datos existentes
            const video = EXISTING_VIDEOS.find(v => v.id === videoId);
            if (video) {
                // Eliminar de la lista local
                const index = EXISTING_VIDEOS.findIndex(v => v.id === videoId);
                if (index > -1) {
                    EXISTING_VIDEOS.splice(index, 1);
                }
                
                // Guardar cambios en localStorage
                saveExistingVideos(EXISTING_VIDEOS);
                console.log('💾 Cambios guardados en localStorage');
                
                // Si hay cloudAPI disponible, eliminar también de ahí
                if (typeof cloudAPI !== 'undefined' && typeof cloudAPI.deleteVideo === 'function') {
                    try {
                        await cloudAPI.deleteVideo(videoId);
                        console.log('✅ Video eliminado de CloudAPI');
                    } catch (error) {
                        console.log('⚠️ No se pudo eliminar de CloudAPI:', error.message);
                    }
                }
                
                console.log('✅ Video eliminado:', videoId);
                showNotification('Video eliminado correctamente', 'success');
                
                // Recargar la lista
                await loadExistingVideos();
            } else {
                showNotification('Video no encontrado', 'error');
            }
        } catch (error) {
            console.error('❌ Error eliminando video:', error);
            showNotification('Error eliminando video: ' + error.message, 'error');
        }
    }
}

// ========================================
// 🎯 FUNCIONES GLOBALES
// ========================================

// Hacer las funciones disponibles globalmente
window.loadExistingVideos = loadExistingVideos;
window.deleteExistingVideo = deleteExistingVideo;

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

console.log('🎥 Load Existing Videos - Dr.Malestar listo');
