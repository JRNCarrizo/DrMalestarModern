// ===========================================
// PANEL DE ADMINISTRACIÓN - DR. MALESTAR
// ===========================================

// Importar el sistema de gestión de datos con JSONBin
// import { 
//     addFlyer, getFlyers, deleteFlyer,
//     addPhoto, getPhotos, deletePhoto,
//     addVideo, getVideos, deleteVideo,
//     exportData, importData, getDataStats
// } from '../js/data-manager.js';

// Configuración de autenticación (en producción, esto debería estar en el servidor)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'drmalestar2024'
};

// ===========================================
// INICIALIZACIÓN
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    setupEventListeners();
    loadStoredData();
});

function initializeAdmin() {
    console.log('Panel de Administración - Dr.Malestar inicializado');
    
    // Verificar si ya está autenticado
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (isAuthenticated === 'true') {
        showAdminPanel();
    } else {
        showLoginSection();
    }
}

// ===========================================
// AUTENTICACIÓN
// ===========================================
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Forms
    const flyerForm = document.getElementById('flyerForm');
    if (flyerForm) {
        flyerForm.addEventListener('submit', handleFlyerSubmit);
    }
    
    const photoForm = document.getElementById('photoForm');
    if (photoForm) {
        photoForm.addEventListener('submit', handlePhotoSubmit);
    }
    
    const videoForm = document.getElementById('videoForm');
    if (videoForm) {
        videoForm.addEventListener('submit', handleVideoSubmit);
    }
    
    // File uploads
    setupFileUploads();
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminAuthenticated', 'true');
        showAdminPanel();
        showNotification('Sesión iniciada correctamente', 'success');
    } else {
        showNotification('Credenciales incorrectas', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('adminAuthenticated');
    showLoginSection();
    showNotification('Sesión cerrada', 'info');
}

function showLoginSection() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAllContent();
}

// ===========================================
// GESTIÓN DE DATOS CON JSONBIN
// ===========================================
async function loadStoredData() {
    try {
        // Los datos se cargan desde JSONBin automáticamente
        console.log('Datos cargados desde JSONBin');
    } catch (error) {
        console.error('Error cargando datos:', error);
        showNotification('Error cargando datos desde la nube', 'error');
    }
}

async function loadAllContent() {
    try {
        await loadFlyers();
        await loadPhotos();
        await loadVideos();
    } catch (error) {
        console.error('Error cargando contenido:', error);
        showNotification('Error cargando contenido', 'error');
    }
}

// ===========================================
// GESTIÓN DE FLYERS
// ===========================================
async function handleFlyerSubmit(e) {
    e.preventDefault();
    
    try {
        const flyerData = {
            title: document.getElementById('flyerTitle').value,
            date: document.getElementById('flyerDate').value,
            location: document.getElementById('flyerLocation').value,
            time: document.getElementById('flyerTime').value,
            description: document.getElementById('flyerDescription').value,
            image: null
        };
        
        const imageFile = document.getElementById('flyerImage').files[0];
        if (imageFile) {
            // Convertir imagen a base64 para persistencia
            flyerData.image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(imageFile);
            });
            console.log('Imagen convertida a base64');
        }
        
        await simpleAPI.addFlyer(flyerData);
        await loadFlyers();
        
        // Limpiar formulario
        e.target.reset();
        document.getElementById('flyerPreview').innerHTML = '';
        
        showNotification('Flyer agregado correctamente', 'success');
    } catch (error) {
        console.error('Error agregando flyer:', error);
        showNotification('Error agregando flyer', 'error');
    }
}

async function loadFlyers() {
    const container = document.getElementById('flyersList');
    if (!container) return;
    
    try {
        const flyers = await simpleAPI.getFlyers();
        container.innerHTML = '';
        
        flyers.forEach(flyer => {
            const flyerItem = createFlyerItem(flyer);
            container.appendChild(flyerItem);
        });
    } catch (error) {
        console.error('Error cargando flyers:', error);
        container.innerHTML = '<p class="text-danger">Error cargando flyers</p>';
    }
}

function createFlyerItem(flyer) {
    const item = document.createElement('div');
    item.className = 'media-item';
    item.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2">
                ${flyer.image ? `<img src="${flyer.image}" alt="${flyer.title}">` : '<div class="bg-secondary rounded" style="width: 80px; height: 80px;"></div>'}
            </div>
            <div class="col-md-8">
                <h5>${flyer.title}</h5>
                <p class="mb-1"><strong>Fecha:</strong> ${formatDate(flyer.date)}</p>
                <p class="mb-1"><strong>Lugar:</strong> ${flyer.location}</p>
                <p class="mb-1"><strong>Hora:</strong> ${flyer.time}</p>
                ${flyer.description ? `<p class="mb-0"><strong>Descripción:</strong> ${flyer.description}</p>` : ''}
            </div>
            <div class="col-md-2 text-end">
                <button class="btn btn-danger-admin" onclick="deleteFlyer(${flyer.id})">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `;
    return item;
}

async function deleteFlyer(id) {
    console.log('🗑️ Eliminando flyer con ID:', id);
    if (confirm('¿Estás seguro de que quieres eliminar este flyer?')) {
        try {
            console.log('🔄 Llamando a simpleAPI.deleteFlyer...');
            await simpleAPI.deleteFlyer(id);
            console.log('✅ Flyer eliminado de la API');
            await loadFlyers();
            showNotification('Flyer eliminado', 'info');
        } catch (error) {
            console.error('❌ Error eliminando flyer:', error);
            showNotification('Error eliminando flyer', 'error');
        }
    }
}

// ===========================================
// GESTIÓN DE FOTOS
// ===========================================
async function handlePhotoSubmit(e) {
    e.preventDefault();
    
    try {
        const photoData = {
            title: document.getElementById('photoTitle').value,
            description: document.getElementById('photoDescription').value,
            image: null
        };
        
        const imageFile = document.getElementById('photoImage').files[0];
        if (imageFile) {
            // Convertir imagen a base64 para persistencia
            photoData.image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(imageFile);
            });
            console.log('Imagen convertida a base64');
        }
        
        await simpleAPI.addPhoto(photoData);
        await loadPhotos();
        
        // Limpiar formulario
        e.target.reset();
        document.getElementById('photoPreview').innerHTML = '';
        
        showNotification('Foto agregada correctamente', 'success');
    } catch (error) {
        console.error('Error agregando foto:', error);
        showNotification('Error agregando foto', 'error');
    }
}

async function loadPhotos() {
    const container = document.getElementById('photosList');
    if (!container) return;
    
    try {
        const photos = await simpleAPI.getPhotos();
        container.innerHTML = '';
        
        photos.forEach(photo => {
            const photoItem = createPhotoItem(photo);
            container.appendChild(photoItem);
        });
    } catch (error) {
        console.error('Error cargando fotos:', error);
        container.innerHTML = '<p class="text-danger">Error cargando fotos</p>';
    }
}

function createPhotoItem(photo) {
    const item = document.createElement('div');
    item.className = 'media-item';
    item.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2">
                ${photo.image ? `<img src="${photo.image}" alt="${photo.title}">` : '<div class="bg-secondary rounded" style="width: 80px; height: 80px;"></div>'}
            </div>
            <div class="col-md-8">
                <h5>${photo.title}</h5>
                ${photo.description ? `<p class="mb-0">${photo.description}</p>` : ''}
            </div>
            <div class="col-md-2 text-end">
                <button class="btn btn-danger-admin" onclick="deletePhoto(${photo.id})">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `;
    return item;
}

async function deletePhoto(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
        try {
            await simpleAPI.deletePhoto(id);
            await loadPhotos();
            showNotification('Foto eliminada', 'info');
        } catch (error) {
            console.error('Error eliminando foto:', error);
            showNotification('Error eliminando foto', 'error');
        }
    }
}

// ===========================================
// GESTIÓN DE VIDEOS
// ===========================================
async function handleVideoSubmit(e) {
    e.preventDefault();
    
    try {
        const videoUrl = document.getElementById('videoUrl').value;
        const embedUrl = convertToEmbedUrl(videoUrl);
        
        if (!embedUrl) {
            showNotification('URL de YouTube no válida', 'error');
            return;
        }
        
        const videoData = {
            title: document.getElementById('videoTitle').value,
            description: document.getElementById('videoDescription').value,
            url: embedUrl,
            originalUrl: videoUrl
        };
        
        await simpleAPI.addVideo(videoData);
        await loadVideos();
        
        // Limpiar formulario
        e.target.reset();
        document.getElementById('videoPreview').innerHTML = '';
        
        showNotification('Video agregado correctamente', 'success');
    } catch (error) {
        console.error('Error agregando video:', error);
        showNotification('Error agregando video', 'error');
    }
}

function convertToEmbedUrl(url) {
    // Convertir URL de YouTube a formato embed
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return null;
}

async function loadVideos() {
    const container = document.getElementById('videosList');
    if (!container) return;
    
    try {
        const videos = await simpleAPI.getVideos();
        container.innerHTML = '';
        
        videos.forEach(video => {
            const videoItem = createVideoItem(video);
            container.appendChild(videoItem);
        });
    } catch (error) {
        console.error('Error cargando videos:', error);
        container.innerHTML = '<p class="text-danger">Error cargando videos</p>';
    }
}

function createVideoItem(video) {
    const item = document.createElement('div');
    item.className = 'media-item';
    item.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2">
                <div class="bg-secondary rounded d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <i class="bi bi-youtube text-danger" style="font-size: 2rem;"></i>
                </div>
            </div>
            <div class="col-md-8">
                <h5>${video.title}</h5>
                ${video.description ? `<p class="mb-0">${video.description}</p>` : ''}
                <small class="text-muted">${video.originalUrl}</small>
            </div>
            <div class="col-md-2 text-end">
                <button class="btn btn-danger-admin" onclick="deleteVideo(${video.id})">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `;
    return item;
}

async function deleteVideo(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este video?')) {
        try {
            await simpleAPI.deleteVideo(id);
            await loadVideos();
            showNotification('Video eliminado', 'info');
        } catch (error) {
            console.error('Error eliminando video:', error);
            showNotification('Error eliminando video', 'error');
        }
    }
}

// ===========================================
// SUBIDA DE ARCHIVOS
// ===========================================
function setupFileUploads() {
    // Flyer image upload
    const flyerUpload = document.getElementById('flyerImage');
    if (flyerUpload) {
        flyerUpload.addEventListener('change', function(e) {
            handleFilePreview(e, 'flyerPreview');
        });
    }
    
    // Photo image upload
    const photoUpload = document.getElementById('photoImage');
    if (photoUpload) {
        photoUpload.addEventListener('change', function(e) {
            handleFilePreview(e, 'photoPreview');
        });
    }
    
    // Video URL preview
    const videoUrl = document.getElementById('videoUrl');
    if (videoUrl) {
        videoUrl.addEventListener('input', function(e) {
            handleVideoPreview(e.target.value);
        });
    }
    
    // Drag and drop functionality
    setupDragAndDrop();
}

function handleFilePreview(event, previewId) {
    const file = event.target.files[0];
    const preview = document.getElementById(previewId);
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <img src="${e.target.result}" class="media-preview" alt="Preview">
                <p class="mt-2 text-muted">${file.name}</p>
            `;
        };
        reader.readAsDataURL(file);
    }
}

function handleVideoPreview(url) {
    const preview = document.getElementById('videoPreview');
    const embedUrl = convertToEmbedUrl(url);
    
    if (embedUrl) {
        preview.innerHTML = `
            <div class="mt-3">
                <h6>Vista previa:</h6>
                <div class="ratio ratio-16x9">
                    <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        `;
    } else if (url) {
        preview.innerHTML = '<p class="text-warning mt-2">URL de YouTube no válida</p>';
    } else {
        preview.innerHTML = '';
    }
}

function setupDragAndDrop() {
    const uploadAreas = document.querySelectorAll('.file-upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const fileInput = this.querySelector('input[type="file"]');
                if (fileInput) {
                    fileInput.files = files;
                    fileInput.dispatchEvent(new Event('change'));
                }
            }
        });
    });
}

// ===========================================
// UTILIDADES
// ===========================================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

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

// ===========================================
// FUNCIONES PÚBLICAS
// ===========================================
window.deleteFlyer = deleteFlyer;
window.deletePhoto = deletePhoto;
window.deleteVideo = deleteVideo;

// Función para recargar contenido
window.reloadAdminContent = async function() {
    await loadFlyers();
    await loadPhotos();
    await loadVideos();
    showNotification('Contenido recargado', 'info');
};

// Función para verificar el estado de la API
window.checkAdminAPI = function() {
    console.log('🔍 Verificando estado de la API en admin...');
    console.log('simpleAPI disponible:', typeof simpleAPI !== 'undefined');
    if (typeof simpleAPI !== 'undefined') {
        console.log('Bin ID:', simpleAPI.binId);
        console.log('API Key:', simpleAPI.apiKey ? 'Configurada' : 'No configurada');
    }
    showNotification('Estado de API verificado en consola', 'info');
};
