// ===========================================
// SIMPLE ADMIN - Dr.Malestar
// Sistema simple y funcional para producción
// ===========================================

console.log('🚀 Simple Admin - Dr.Malestar cargado');

// Credenciales de admin
const ADMIN_USER = window.CONFIG?.ADMIN_USER || 'admin';
const ADMIN_PASS = window.CONFIG?.ADMIN_PASS || 'admin123';

// Estado de autenticación
let isAuthenticated = false;

// ===========================================
// INICIALIZACIÓN
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Inicializando admin...');
    
    // Verificar si ya está autenticado
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
        showAdminPanel();
    } else {
        showLoginForm();
    }
    
    setupEventListeners();
});

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
    
    // Flyer form
    const flyerForm = document.getElementById('flyerForm');
    if (flyerForm) {
        flyerForm.addEventListener('submit', handleFlyerSubmit);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        isAuthenticated = true;
        localStorage.setItem('adminAuth', 'true');
        showAdminPanel();
        showMessage('Sesión iniciada correctamente', 'success');
    } else {
        showMessage('Credenciales incorrectas', 'error');
    }
}

function handleLogout() {
    isAuthenticated = false;
    localStorage.removeItem('adminAuth');
    showLoginForm();
    showMessage('Sesión cerrada', 'info');
}

// ===========================================
// INTERFAZ
// ===========================================

function showLoginForm() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    // Cargar contenido automáticamente
    loadAllContent();
}

// ===========================================
// GESTIÓN DE CONTENIDO
// ===========================================

async function loadAllContent() {
    console.log('🔄 Cargando contenido...');
    
    try {
        await loadFlyers();
        await loadPhotos();
        await loadVideos();
        console.log('✅ Contenido cargado');
    } catch (error) {
        console.error('❌ Error cargando contenido:', error);
        showMessage('Error cargando contenido', 'error');
    }
}

async function loadFlyers() {
    const container = document.getElementById('flyersList');
    if (!container) return;
    
    try {
        const flyers = await simpleAPI.getFlyers();
        container.innerHTML = '';
        
        if (flyers.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay flyers</p>';
            return;
        }
        
        flyers.forEach(flyer => {
            const item = createFlyerItem(flyer);
            container.appendChild(item);
        });
        
        console.log(`✅ ${flyers.length} flyers cargados`);
    } catch (error) {
        console.error('❌ Error cargando flyers:', error);
        container.innerHTML = '<p class="text-danger">Error cargando flyers</p>';
    }
}

async function loadPhotos() {
    const container = document.getElementById('photosList');
    if (!container) return;
    
    try {
        const photos = await simpleAPI.getPhotos();
        container.innerHTML = '';
        
        if (photos.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay fotos</p>';
            return;
        }
        
        photos.forEach(photo => {
            const item = createPhotoItem(photo);
            container.appendChild(item);
        });
        
        console.log(`✅ ${photos.length} fotos cargadas`);
    } catch (error) {
        console.error('❌ Error cargando fotos:', error);
        container.innerHTML = '<p class="text-danger">Error cargando fotos</p>';
    }
}

async function loadVideos() {
    const container = document.getElementById('videosList');
    if (!container) return;
    
    try {
        const videos = await simpleAPI.getVideos();
        container.innerHTML = '';
        
        if (videos.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay videos</p>';
            return;
        }
        
        videos.forEach(video => {
            const item = createVideoItem(video);
            container.appendChild(item);
        });
        
        console.log(`✅ ${videos.length} videos cargados`);
    } catch (error) {
        console.error('❌ Error cargando videos:', error);
        container.innerHTML = '<p class="text-danger">Error cargando videos</p>';
    }
}

// ===========================================
// FORMULARIOS
// ===========================================

async function handleFlyerSubmit(e) {
    e.preventDefault();
    console.log('🔄 Procesando formulario de flyer...');
    
    const formData = new FormData(e.target);
    const imageFile = formData.get('image');
    
    console.log('📋 Datos del formulario:');
    console.log('  - Título:', formData.get('title'));
    console.log('  - Fecha:', formData.get('date'));
    console.log('  - Lugar:', formData.get('location'));
    console.log('  - Hora:', formData.get('time'));
    console.log('  - Descripción:', formData.get('description'));
    console.log('  - Imagen:', imageFile ? imageFile.name : 'No seleccionada');
    
    let imageUrl = null;
    
    // Procesar imagen si se subió una
    if (imageFile && imageFile.size > 0) {
        try {
            const imageData = await imageHandler.processImage(imageFile);
            imageUrl = imageData.url; // Usar la URL de datos de la imagen
            console.log('✅ Imagen procesada:', imageData.name);
        } catch (error) {
            console.error('❌ Error procesando imagen:', error);
            showMessage('Error procesando imagen: ' + error.message, 'error');
            return;
        }
    } else {
        // Usar imagen por defecto si no se subió ninguna
        imageUrl = 'img/bluseraflier.jpg';
    }
    
    const flyerData = {
        title: formData.get('title'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        description: formData.get('description'),
        image: imageUrl
    };
    
    try {
        console.log('💾 Guardando flyer en la API...');
        await simpleAPI.addFlyer(flyerData);
        console.log('✅ Flyer guardado exitosamente');
        
        e.target.reset();
        
        // Limpiar preview de imagen
        imageHandler.clearPreview('flyerPreview');
        
        await loadFlyers();
        showMessage('Flyer agregado correctamente', 'success');
        
        // Notificar a la página principal
        notifyMainPage();
    } catch (error) {
        console.error('❌ Error agregando flyer:', error);
        showMessage('Error agregando flyer', 'error');
    }
}

// ===========================================
// CREAR ELEMENTOS
// ===========================================

function createFlyerItem(flyer) {
    const item = document.createElement('div');
    item.className = 'media-item';
    item.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2">
                <img src="${flyer.image || 'img/bluseraflier.jpg'}" 
                     alt="${flyer.title}" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="col-md-8">
                <h5>${flyer.title}</h5>
                <p class="mb-1"><strong>Fecha:</strong> ${flyer.date}</p>
                <p class="mb-1"><strong>Lugar:</strong> ${flyer.location}</p>
                <p class="mb-1"><strong>Hora:</strong> ${flyer.time}</p>
                ${flyer.description ? `<p class="mb-0"><strong>Descripción:</strong> ${flyer.description}</p>` : ''}
            </div>
            <div class="col-md-2 text-end">
                <button class="btn btn-danger" onclick="deleteFlyer('${flyer.id}')">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `;
    return item;
}

function createPhotoItem(photo) {
    const item = document.createElement('div');
    item.className = 'media-item';
    item.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2">
                <img src="${photo.image || 'img/bluseraflier.jpg'}" 
                     alt="${photo.title}" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="col-md-8">
                <h5>${photo.title}</h5>
                <p class="mb-1"><strong>Fecha:</strong> ${photo.date}</p>
                ${photo.description ? `<p class="mb-0"><strong>Descripción:</strong> ${photo.description}</p>` : ''}
            </div>
            <div class="col-md-2 text-end">
                <button class="btn btn-danger" onclick="deletePhoto('${photo.id}')">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `;
    return item;
}

function createVideoItem(video) {
    const item = document.createElement('div');
    item.className = 'media-item';
    item.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2">
                <img src="${video.thumbnail || 'img/bluseraflier.jpg'}" 
                     alt="${video.title}" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="col-md-8">
                <h5>${video.title}</h5>
                <p class="mb-1"><strong>Fecha:</strong> ${video.date}</p>
                ${video.description ? `<p class="mb-0"><strong>Descripción:</strong> ${video.description}</p>` : ''}
            </div>
            <div class="col-md-2 text-end">
                <button class="btn btn-danger" onclick="deleteVideo('${video.id}')">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `;
    return item;
}

// ===========================================
// ELIMINAR ELEMENTOS
// ===========================================

async function deleteFlyer(id) {
    if (!confirm('¿Eliminar este flyer?')) return;
    
    try {
        await simpleAPI.deleteFlyer(id);
        await loadFlyers();
        showMessage('Flyer eliminado', 'success');
        
        // Notificar a la página principal
        notifyMainPage();
    } catch (error) {
        console.error('❌ Error eliminando flyer:', error);
        showMessage('Error eliminando flyer', 'error');
    }
}

async function deletePhoto(id) {
    if (!confirm('¿Eliminar esta foto?')) return;
    
    try {
        await simpleAPI.deletePhoto(id);
        await loadPhotos();
        showMessage('Foto eliminada', 'success');
        
        // Notificar a la página principal
        notifyMainPage();
    } catch (error) {
        console.error('❌ Error eliminando foto:', error);
        showMessage('Error eliminando foto', 'error');
    }
}

async function deleteVideo(id) {
    if (!confirm('¿Eliminar este video?')) return;
    
    try {
        await simpleAPI.deleteVideo(id);
        await loadVideos();
        showMessage('Video eliminado', 'success');
        
        // Notificar a la página principal
        notifyMainPage();
    } catch (error) {
        console.error('❌ Error eliminando video:', error);
        showMessage('Error eliminando video', 'error');
    }
}

// ===========================================
// SINCRONIZACIÓN
// ===========================================

function notifyMainPage() {
    // Enviar mensaje a la página principal para que recargue
    if (window.opener) {
        window.opener.postMessage('RELOAD_CONTENT', '*');
    }
    
    // También notificar a través de localStorage
    localStorage.setItem('contentUpdated', Date.now().toString());
}

// ===========================================
// UTILIDADES
// ===========================================

function showMessage(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insertar al inicio del admin panel
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.insertBefore(notification, adminPanel.firstChild);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Hacer funciones globales
window.deleteFlyer = deleteFlyer;
window.deletePhoto = deletePhoto;
window.deleteVideo = deleteVideo;

console.log('✅ Simple Admin listo');
