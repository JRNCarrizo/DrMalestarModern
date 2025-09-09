// ===========================================
// PANEL DE ADMINISTRACIÓN - DR. MALESTAR
// ===========================================

// Configuración del panel de administración
const ADMIN_CONFIG = {
    username: 'admin',
    password: 'drmalestar2024',
    sessionKey: 'drmalestar_admin_session'
};

// Estado del panel
let isAdminLoggedIn = false;
let adminPanel = null;
let adminToggle = null;
let adminOverlay = null;

// ===========================================
// INICIALIZACIÓN DEL PANEL
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
    checkAdminSession();
});

function initializeAdminPanel() {
    // Crear el HTML del panel de administración
    const adminHTML = `
        <div class="admin-overlay" id="adminOverlay"></div>
        
        <button class="admin-toggle" id="adminToggle">
            <i class="bi bi-gear-fill"></i>
            <span>Admin</span>
        </button>
        
        <div class="admin-panel" id="adminPanel">
            <div class="admin-header">
                <h2 class="admin-title">Panel de Control</h2>
            </div>
            
            <div class="admin-content">
                <!-- Formulario de Login -->
                <div id="loginSection" class="login-form">
                    <h3>Iniciar Sesión</h3>
                    <div class="form-group">
                        <label for="adminUsername">Usuario:</label>
                        <input type="text" id="adminUsername" class="form-control" placeholder="Ingresa tu usuario">
                    </div>
                    <div class="form-group">
                        <label for="adminPassword">Contraseña:</label>
                        <input type="password" id="adminPassword" class="form-control" placeholder="Ingresa tu contraseña">
                    </div>
                    <button class="btn-admin" onclick="adminLogin()">Iniciar Sesión</button>
                </div>

                <!-- Panel Principal (oculto inicialmente) -->
                <div id="adminMainPanel" style="display: none;">
                    <button class="logout-btn" onclick="adminLogout()">Cerrar Sesión</button>
                    
                    <!-- Gestión de Flyers -->
                    <div class="admin-section">
                        <h3><i class="bi bi-image"></i> Gestión de Flyers</h3>
                        <div class="form-group">
                            <label for="flyerTitle">Título del Evento:</label>
                            <input type="text" id="flyerTitle" class="form-control" placeholder="Ej: Show en el Teatro">
                        </div>
                        <div class="form-group">
                            <label for="flyerDate">Fecha del Evento:</label>
                            <input type="date" id="flyerDate" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="flyerLocation">Ubicación:</label>
                            <input type="text" id="flyerLocation" class="form-control" placeholder="Ej: Teatro Colón, Buenos Aires">
                        </div>
                        <div class="form-group">
                            <label for="flyerDescription">Descripción:</label>
                            <textarea id="flyerDescription" class="form-control" rows="3" placeholder="Descripción del evento..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="flyerImage">Imagen del Flyer:</label>
                            <input type="file" id="flyerImage" class="form-control" accept="image/*">
                        </div>
                        <button class="btn-admin" onclick="addFlyer()">Agregar Flyer</button>
                    </div>

                    <!-- Gestión de Fotos -->
                    <div class="admin-section">
                        <h3><i class="bi bi-camera"></i> Gestión de Fotos</h3>
                        <div class="form-group">
                            <label for="photoTitle">Título de la Foto:</label>
                            <input type="text" id="photoTitle" class="form-control" placeholder="Ej: Ensayo en el estudio">
                        </div>
                        <div class="form-group">
                            <label for="photoDescription">Descripción:</label>
                            <textarea id="photoDescription" class="form-control" rows="3" placeholder="Descripción de la foto..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="photoImage">Imagen:</label>
                            <input type="file" id="photoImage" class="form-control" accept="image/*">
                        </div>
                        <button class="btn-admin" onclick="addPhoto()">Agregar Foto</button>
                    </div>

                    <!-- Gestión de Videos de YouTube -->
                    <div class="admin-section">
                        <h3><i class="bi bi-youtube"></i> Gestión de Videos</h3>
                        <div class="form-group">
                            <label for="videoTitle">Título del Video:</label>
                            <input type="text" id="videoTitle" class="form-control" placeholder="Ej: Dr.Malestar - Macadam 3,2,1,0">
                        </div>
                        <div class="form-group">
                            <label for="videoUrl">URL de YouTube:</label>
                            <input type="url" id="videoUrl" class="form-control" placeholder="https://www.youtube.com/watch?v=...">
                        </div>
                        <div class="form-group">
                            <label for="videoDescription">Descripción:</label>
                            <textarea id="videoDescription" class="form-control" rows="3" placeholder="Descripción del video..."></textarea>
                        </div>
                        <button class="btn-admin" onclick="addVideo()">Agregar Video</button>
                    </div>

                    <!-- Lista de Contenido Actual -->
                    <div class="admin-section">
                        <h3><i class="bi bi-list"></i> Contenido Actual</h3>
                        <div id="contentList">
                            <!-- Aquí se cargará dinámicamente el contenido -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insertar el HTML en el contenedor
    const container = document.getElementById('admin-panel-container');
    if (container) {
        container.innerHTML = adminHTML;
    } else {
        document.body.insertAdjacentHTML('beforeend', adminHTML);
    }

    // Obtener referencias a los elementos
    adminPanel = document.getElementById('adminPanel');
    adminToggle = document.getElementById('adminToggle');
    adminOverlay = document.getElementById('adminOverlay');

    // Configurar event listeners
    setupAdminEventListeners();
}

function setupAdminEventListeners() {
    // Toggle del panel
    if (adminToggle) {
        adminToggle.addEventListener('click', toggleAdminPanel);
    }

    // Cerrar panel con overlay
    if (adminOverlay) {
        adminOverlay.addEventListener('click', closeAdminPanel);
    }

    // Cerrar panel con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && adminPanel && adminPanel.classList.contains('open')) {
            closeAdminPanel();
        }
    });

    // Enter en campos de login
    const usernameField = document.getElementById('adminUsername');
    const passwordField = document.getElementById('adminPassword');
    
    if (usernameField && passwordField) {
        [usernameField, passwordField].forEach(field => {
            field.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    adminLogin();
                }
            });
        });
    }
}

// ===========================================
// FUNCIONES DE AUTENTICACIÓN
// ===========================================
function checkAdminSession() {
    const session = localStorage.getItem(ADMIN_CONFIG.sessionKey);
    if (session === 'true') {
        isAdminLoggedIn = true;
        showAdminMainPanel();
    }
}

function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password) {
        isAdminLoggedIn = true;
        localStorage.setItem(ADMIN_CONFIG.sessionKey, 'true');
        showAdminMainPanel();
        showNotification('Sesión iniciada correctamente', 'success');
    } else {
        showNotification('Usuario o contraseña incorrectos', 'error');
    }
}

function adminLogout() {
    isAdminLoggedIn = false;
    localStorage.removeItem(ADMIN_CONFIG.sessionKey);
    showLoginForm();
    closeAdminPanel();
    showNotification('Sesión cerrada', 'info');
}

function showAdminMainPanel() {
    const loginSection = document.getElementById('loginSection');
    const mainPanel = document.getElementById('adminMainPanel');
    
    if (loginSection) loginSection.style.display = 'none';
    if (mainPanel) {
        mainPanel.style.display = 'block';
        loadContentList();
    }
}

function showLoginForm() {
    const loginSection = document.getElementById('loginSection');
    const mainPanel = document.getElementById('adminMainPanel');
    
    if (loginSection) loginSection.style.display = 'block';
    if (mainPanel) mainPanel.style.display = 'none';
    
    // Limpiar campos
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
}

// ===========================================
// FUNCIONES DEL PANEL
// ===========================================
function toggleAdminPanel() {
    if (!isAdminLoggedIn) {
        showNotification('Debes iniciar sesión primero', 'error');
        return;
    }

    if (adminPanel.classList.contains('open')) {
        closeAdminPanel();
    } else {
        openAdminPanel();
    }
}

function openAdminPanel() {
    if (adminPanel) {
        adminPanel.classList.add('open');
        if (adminOverlay) adminOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAdminPanel() {
    if (adminPanel) {
        adminPanel.classList.remove('open');
        if (adminOverlay) adminOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===========================================
// GESTIÓN DE CONTENIDO
// ===========================================
function addFlyer() {
    const title = document.getElementById('flyerTitle').value;
    const date = document.getElementById('flyerDate').value;
    const location = document.getElementById('flyerLocation').value;
    const description = document.getElementById('flyerDescription').value;
    const imageFile = document.getElementById('flyerImage').files[0];

    if (!title || !date || !location || !imageFile) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }

    // Crear URL para la imagen (en una implementación real, subirías el archivo)
    const imageUrl = URL.createObjectURL(imageFile);

    const flyerData = {
        title,
        date,
        location,
        description,
        image: imageUrl
    };

    // Llamar a la función del main.js
    if (window.addFlyer) {
        window.addFlyer(flyerData);
    }

    // Limpiar formulario
    clearFlyerForm();
}

function addPhoto() {
    const title = document.getElementById('photoTitle').value;
    const description = document.getElementById('photoDescription').value;
    const imageFile = document.getElementById('photoImage').files[0];

    if (!title || !imageFile) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    // Crear URL para la imagen
    const imageUrl = URL.createObjectURL(imageFile);

    const photoData = {
        title,
        description: description || '',
        image: imageUrl
    };

    // Llamar a la función del main.js
    if (window.addPhoto) {
        window.addPhoto(photoData);
    }

    // Limpiar formulario
    clearPhotoForm();
}

function addVideo() {
    const title = document.getElementById('videoTitle').value;
    const url = document.getElementById('videoUrl').value;
    const description = document.getElementById('videoDescription').value;

    if (!title || !url) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    // Convertir URL de YouTube a embed
    const embedUrl = convertYouTubeUrl(url);
    if (!embedUrl) {
        showNotification('URL de YouTube no válida', 'error');
        return;
    }

    const videoData = {
        title,
        description: description || '',
        url: embedUrl
    };

    // Llamar a la función del main.js
    if (window.addVideo) {
        window.addVideo(videoData);
    }

    // Limpiar formulario
    clearVideoForm();
}

// ===========================================
// FUNCIONES AUXILIARES
// ===========================================
function convertYouTubeUrl(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return null;
}

function clearFlyerForm() {
    document.getElementById('flyerTitle').value = '';
    document.getElementById('flyerDate').value = '';
    document.getElementById('flyerLocation').value = '';
    document.getElementById('flyerDescription').value = '';
    document.getElementById('flyerImage').value = '';
}

function clearPhotoForm() {
    document.getElementById('photoTitle').value = '';
    document.getElementById('photoDescription').value = '';
    document.getElementById('photoImage').value = '';
}

function clearVideoForm() {
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoUrl').value = '';
    document.getElementById('videoDescription').value = '';
}

function loadContentList() {
    const container = document.getElementById('contentList');
    if (!container) return;

    // Esta función se implementaría para mostrar el contenido actual
    // Por ahora, solo mostramos un mensaje
    container.innerHTML = `
        <div class="media-item">
            <h4>Contenido actual</h4>
            <p>Aquí se mostraría la lista de flyers, fotos y videos actuales con opciones para editarlos o eliminarlos.</p>
        </div>
    `;
}

// ===========================================
// FUNCIÓN DE NOTIFICACIÓN
// ===========================================
function showNotification(message, type = 'info') {
    // Usar la función del main.js si está disponible
    if (window.showNotification) {
        window.showNotification(message, type);
        return;
    }

    // Fallback si no está disponible
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Crear notificación básica
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// ===========================================
// FUNCIONES PÚBLICAS
// ===========================================
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.addFlyer = addFlyer;
window.addPhoto = addPhoto;
window.addVideo = addVideo;

