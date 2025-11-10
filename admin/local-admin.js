// ===========================================
// LOCAL ADMIN - Dr.Malestar
// Panel de administración con almacenamiento local
// ===========================================

console.log('🔧 Local Admin - Dr.Malestar cargado');

// Verificar que las dependencias estén cargadas
if (typeof localAPI === 'undefined') {
    console.error('❌ Local Storage API no está cargado');
}

if (typeof gitSync === 'undefined') {
    console.error('❌ Git Sync no está cargado');
}

// Estado de autenticación
let isAuthenticated = false;

// Elementos del DOM
let loginForm, adminPanel, flyerForm, photoForm, videoForm;
let flyerList, photoList, videoList;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Local Admin...');
    
    // Obtener elementos del DOM
    loginForm = document.getElementById('loginForm');
    adminPanel = document.getElementById('adminPanel');
    flyerForm = document.getElementById('flyerForm');
    photoForm = document.getElementById('photoForm');
    videoForm = document.getElementById('videoForm');
    flyerList = document.getElementById('flyerList');
    photoList = document.getElementById('photoList');
    videoList = document.getElementById('videoList');
    
    // Verificar autenticación
    checkAuth();
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('✅ Local Admin inicializado');
});

// Verificar autenticación
function checkAuth() {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
        showAdminPanel();
    } else {
        showLoginForm();
    }
}

// Mostrar formulario de login
function showLoginForm() {
    if (loginForm) loginForm.style.display = 'block';
    if (adminPanel) adminPanel.style.display = 'none';
    isAuthenticated = false;
}

// Mostrar panel de administración
async function showAdminPanel() {
    if (loginForm) loginForm.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
    isAuthenticated = true;
    
    // Cargar contenido
    await loadAllContent();
    
    // Iniciar auto-sync
    if (typeof gitSync !== 'undefined') {
        gitSync.startAutoSync();
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Flyer form
    if (flyerForm) {
        flyerForm.addEventListener('submit', handleFlyerSubmit);
    }
    
    // Photo form
    if (photoForm) {
        photoForm.addEventListener('submit', handlePhotoSubmit);
    }
    
    // Video form
    if (videoForm) {
        videoForm.addEventListener('submit', handleVideoSubmit);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Sync buttons
    const syncBtn = document.getElementById('syncBtn');
    if (syncBtn) {
        syncBtn.addEventListener('click', () => {
            if (typeof gitSync !== 'undefined') {
                gitSync.syncToGit();
            }
        });
    }
    
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (typeof gitSync !== 'undefined') {
                gitSync.exportForNetlify();
            }
        });
    }
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Verificar credenciales (usar las de config.js)
    const validUser = window.CONFIG?.ADMIN_USER || 'admin';
    const validPass = window.CONFIG?.ADMIN_PASS || 'admin123';
    
    if (username === validUser && password === validPass) {
        localStorage.setItem('adminAuthenticated', 'true');
        showAdminPanel();
        console.log('✅ Login exitoso');
    } else {
        alert('Credenciales incorrectas');
        console.log('❌ Login fallido');
    }
}

// Manejar logout
function handleLogout() {
    localStorage.removeItem('adminAuthenticated');
    showLoginForm();
    
    // Detener auto-sync
    if (typeof gitSync !== 'undefined') {
        gitSync.stopAutoSync();
    }
    
    console.log('✅ Logout exitoso');
}

// Cargar todo el contenido
async function loadAllContent() {
    try {
        console.log('🔄 Cargando contenido local...');
        await loadFlyers();
        await loadPhotos();
        await loadVideos();
        console.log('✅ Contenido local cargado');
    } catch (error) {
        console.error('❌ Error cargando contenido local:', error);
    }
}

// Cargar flyers
async function loadFlyers() {
    try {
        const flyers = localAPI.getFlyers();
        displayFlyers(flyers);
        console.log('✅ Flyers cargados:', flyers.length);
    } catch (error) {
        console.error('❌ Error cargando flyers:', error);
    }
}

// Mostrar flyers
function displayFlyers(flyers) {
    if (!flyerList) return;
    
    if (flyers.length === 0) {
        flyerList.innerHTML = '<p class="text-muted">No hay flyers disponibles</p>';
        return;
    }
    
    flyerList.innerHTML = flyers.map(flyer => `
        <div class="card mb-3" data-id="${flyer.id}">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${flyer.image}" class="img-fluid rounded-start" alt="${flyer.title}" style="height: 150px; object-fit: cover; width: 100%;">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${flyer.title}</h5>
                        <p class="card-text"><strong>Fecha:</strong> ${flyer.date}</p>
                        <p class="card-text"><strong>Hora:</strong> ${flyer.time}</p>
                        <p class="card-text"><strong>Lugar:</strong> ${flyer.location}</p>
                        <p class="card-text">${flyer.description}</p>
                        <button class="btn btn-danger btn-sm" onclick="deleteFlyer('${flyer.id}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Manejar envío de flyer
async function handleFlyerSubmit(e) {
    e.preventDefault();
    
    try {
        console.log('🔄 Procesando flyer...');
        
        const formData = new FormData(flyerForm);
        const flyerData = {
            title: formData.get('title'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            description: formData.get('description'),
            image: formData.get('image') ? await processImage(formData.get('image')) : 'img/bluseraflier.jpg'
        };
        
        console.log('📋 Datos del flyer:', flyerData);
        
        // Agregar flyer
        const newFlyer = localAPI.addFlyer(flyerData);
        
        // Recargar lista
        await loadFlyers();
        
        // Limpiar formulario
        flyerForm.reset();
        clearImagePreview('flyerPreview');
        
        console.log('✅ Flyer agregado exitosamente');
        
        // Sincronizar con Git
        if (typeof gitSync !== 'undefined') {
            gitSync.syncToGit();
        }
        
    } catch (error) {
        console.error('❌ Error agregando flyer:', error);
        alert('Error agregando flyer: ' + error.message);
    }
}

// Procesar imagen
async function processImage(file) {
    return new Promise((resolve, reject) => {
        if (!file || file.size === 0) {
            resolve('img/bluseraflier.jpg');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = function() {
            reject(new Error('Error leyendo imagen'));
        };
        reader.readAsDataURL(file);
    });
}

// Eliminar flyer
async function deleteFlyer(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este flyer?')) {
        return;
    }
    
    try {
        localAPI.deleteFlyer(id);
        await loadFlyers();
        console.log('✅ Flyer eliminado');
        
        // Sincronizar con Git
        if (typeof gitSync !== 'undefined') {
            gitSync.syncToGit();
        }
    } catch (error) {
        console.error('❌ Error eliminando flyer:', error);
        alert('Error eliminando flyer: ' + error.message);
    }
}

// Cargar fotos
async function loadPhotos() {
    try {
        const photos = localAPI.getPhotos();
        displayPhotos(photos);
        console.log('✅ Fotos cargadas:', photos.length);
    } catch (error) {
        console.error('❌ Error cargando fotos:', error);
    }
}

// Mostrar fotos
function displayPhotos(photos) {
    if (!photoList) return;
    
    if (photos.length === 0) {
        photoList.innerHTML = '<p class="text-muted">No hay fotos disponibles</p>';
        return;
    }
    
    photoList.innerHTML = photos.map(photo => `
        <div class="card mb-3" data-id="${photo.id}">
            <img src="${photo.image}" class="card-img-top" alt="${photo.title}" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${photo.title}</h5>
                <p class="card-text">${photo.description}</p>
                <button class="btn btn-danger btn-sm" onclick="deletePhoto('${photo.id}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Manejar envío de foto
async function handlePhotoSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(photoForm);
        const photoData = {
            title: formData.get('title'),
            description: formData.get('description'),
            image: formData.get('image') ? await processImage(formData.get('image')) : 'img/bluseraflier.jpg'
        };
        
        localAPI.addPhoto(photoData);
        await loadPhotos();
        
        photoForm.reset();
        clearImagePreview('photoPreview');
        
        console.log('✅ Foto agregada exitosamente');
        
        // Sincronizar con Git
        if (typeof gitSync !== 'undefined') {
            gitSync.syncToGit();
        }
        
    } catch (error) {
        console.error('❌ Error agregando foto:', error);
        alert('Error agregando foto: ' + error.message);
    }
}

// Eliminar foto
async function deletePhoto(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
        return;
    }
    
    try {
        localAPI.deletePhoto(id);
        await loadPhotos();
        console.log('✅ Foto eliminada');
        
        // Sincronizar con Git
        if (typeof gitSync !== 'undefined') {
            gitSync.syncToGit();
        }
    } catch (error) {
        console.error('❌ Error eliminando foto:', error);
        alert('Error eliminando foto: ' + error.message);
    }
}

// Cargar videos
async function loadVideos() {
    try {
        const videos = localAPI.getVideos();
        displayVideos(videos);
        console.log('✅ Videos cargados:', videos.length);
    } catch (error) {
        console.error('❌ Error cargando videos:', error);
    }
}

// Mostrar videos
function displayVideos(videos) {
    if (!videoList) return;
    
    if (videos.length === 0) {
        videoList.innerHTML = '<p class="text-muted">No hay videos disponibles</p>';
        return;
    }
    
    videoList.innerHTML = videos.map(video => `
        <div class="card mb-3" data-id="${video.id}">
            <div class="card-body">
                <h5 class="card-title">${video.title}</h5>
                <p class="card-text">${video.description}</p>
                <p class="card-text"><strong>URL:</strong> <a href="${video.url}" target="_blank">${video.url}</a></p>
                <button class="btn btn-danger btn-sm" onclick="deleteVideo('${video.id}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Manejar envío de video
async function handleVideoSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(videoForm);
        const videoData = {
            title: formData.get('title'),
            description: formData.get('description'),
            url: formData.get('url')
        };
        
        localAPI.addVideo(videoData);
        await loadVideos();
        
        videoForm.reset();
        
        console.log('✅ Video agregado exitosamente');
        
        // Sincronizar con Git
        if (typeof gitSync !== 'undefined') {
            gitSync.syncToGit();
        }
        
    } catch (error) {
        console.error('❌ Error agregando video:', error);
        alert('Error agregando video: ' + error.message);
    }
}

// Eliminar video
async function deleteVideo(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este video?')) {
        return;
    }
    
    try {
        localAPI.deleteVideo(id);
        await loadVideos();
        console.log('✅ Video eliminado');
        
        // Sincronizar con Git
        if (typeof gitSync !== 'undefined') {
            gitSync.syncToGit();
        }
    } catch (error) {
        console.error('❌ Error eliminando video:', error);
        alert('Error eliminando video: ' + error.message);
    }
}

// Limpiar preview de imagen
function clearImagePreview(previewId) {
    const preview = document.getElementById(previewId);
    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }
}

// Funciones de debugging
window.testLocalAdmin = function() {
    console.log('🧪 Probando Local Admin...');
    console.log('📊 Estadísticas:', localAPI.getStats());
    console.log('🔄 Historial de sync:', gitSync.getSyncHistory());
};

window.clearLocalData = function() {
    if (confirm('¿Estás seguro de que quieres limpiar todos los datos locales?')) {
        localAPI.clearAll();
        loadAllContent();
        console.log('✅ Datos locales limpiados');
    }
};

console.log('✅ Local Admin listo');


