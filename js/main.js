// ===========================================
// DR. MALESTAR - MAIN JAVASCRIPT
// ===========================================

// Datos de ejemplo (fallback si JSONBin no está disponible)
const sampleData = {
    flyers: [
        {
            id: 1,
            title: "Show en el Teatro Colón",
            date: "2024-03-15",
            location: "Teatro Colón, Buenos Aires",
            image: "img/bluseraflier.jpg",
            description: "Gran presentación tributo a Pappo"
        },
        {
            id: 2,
            title: "Festival de Rock",
            date: "2024-04-20",
            location: "Estadio Luna Park",
            image: "img/bluseraflier.jpg",
            description: "Participación en el festival más importante del año"
        }
    ],
    photos: [
        {
            id: 1,
            title: "Ensayo en el estudio",
            description: "Preparando el repertorio para el próximo show",
            image: "img/banda1.jpg"
        },
        {
            id: 2,
            title: "Backstage",
            description: "Momento de relax antes del concierto",
            image: "img/banda2.jpg"
        }
    ],
    videos: [
        {
            id: 1,
            title: "Dr.Malestar - Macadam 3,2,1,0",
            description: "Presentación en Rodney Bar",
            url: "https://www.youtube.com/embed/8Gt6jMM7KgY"
        },
        {
            id: 2,
            title: "Dr.Malestar - El Viejo",
            description: "Interpretación clásica en vivo",
            url: "https://www.youtube.com/embed/M6LpESnfHPY"
        },
        {
            id: 3,
            title: "Dr.Malestar - Sucio y Desprolijo",
            description: "ATP - Show completo",
            url: "https://www.youtube.com/embed/vwMUqDtNn6g"
        },
        {
            id: 4,
            title: "Dr.Malestar - Botas Sucias",
            description: "Iaios Bar - Presentación especial",
            url: "https://www.youtube.com/embed/yFczLmQ4TKk?start=73"
        }
    ]
};

// Función para obtener datos del panel de administración
function getAdminData() {
    const stored = localStorage.getItem('siteData');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error al parsear datos del admin:', e);
        }
    }
    return null;
}

// Función para verificar si Firebase está disponible
function isFirebaseAvailable() {
    try {
        return typeof window !== 'undefined' && window.firebase;
    } catch (e) {
        return false;
    }
}

// ===========================================
// INICIALIZACIÓN
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadContent();
    setupScrollAnimations();
});

function initializeApp() {
    console.log('Dr.Malestar - Aplicación inicializada');
    
    // Cargar contenido inicial
    loadFlyers();
    loadPhotos();
    loadVideos();
}

// ===========================================
// NAVEGACIÓN
// ===========================================
function setupEventListeners() {
    // Cerrar navbar en móviles al hacer clic en un enlace
    document.querySelectorAll('.navbar-nav .nav-link').forEach(item => {
        item.addEventListener('click', () => {
            const navbarCollapse = document.getElementById('navbarNav');
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        });
    });

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Botón de admin
    const adminToggle = document.getElementById('admin-toggle');
    if (adminToggle) {
        adminToggle.addEventListener('click', function() {
            window.location.href = 'admin/index.html';
        });
    }
}

// ===========================================
// CARGA DE CONTENIDO
// ===========================================
function loadContent() {
    // En una implementación real, aquí harías fetch a una API
    console.log('Cargando contenido...');
}

async function loadFlyers() {
    const container = document.getElementById('flyers-container');
    if (!container) return;

    container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    
    try {
        // Intentar cargar desde API simple primero
        if (typeof simpleAPI !== 'undefined') {
            try {
                console.log('🔄 Cargando flyers desde API...');
                const flyers = await simpleAPI.getFlyers();
                console.log('📋 Flyers obtenidos:', flyers);
                if (flyers && flyers.length > 0) {
                    container.innerHTML = '';
                    flyers.forEach(flyer => {
                        const flyerCard = createFlyerCard(flyer);
                        container.appendChild(flyerCard);
                    });
                    console.log('✅ Flyers cargados desde API');
                    return;
                } else {
                    console.log('⚠️ No hay flyers en la API');
                }
            } catch (apiError) {
                console.log('❌ API no disponible, usando localStorage:', apiError);
            }
        } else {
            console.log('❌ simpleAPI no está definido');
        }
        
        // Fallback a datos locales
        const adminData = getAdminData();
        const flyers = adminData ? adminData.flyers : sampleData.flyers;
        
        container.innerHTML = '';
        flyers.forEach(flyer => {
            const flyerCard = createFlyerCard(flyer);
            container.appendChild(flyerCard);
        });
    } catch (error) {
        console.error('Error cargando flyers:', error);
        // Fallback a datos de ejemplo
        container.innerHTML = '';
        sampleData.flyers.forEach(flyer => {
            const flyerCard = createFlyerCard(flyer);
            container.appendChild(flyerCard);
        });
    }
}

async function loadPhotos() {
    const container = document.getElementById('photos-container');
    if (!container) return;

    container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    
    try {
        // Intentar cargar desde JSONBin primero
        if (typeof jsonbinManager !== 'undefined') {
            try {
                const photos = await jsonbinManager.getPhotos();
                if (photos && photos.length > 0) {
                    container.innerHTML = '';
                    photos.forEach(photo => {
                        const photoCard = createPhotoCard(photo);
                        container.appendChild(photoCard);
                    });
                    return;
                }
            } catch (jsonbinError) {
                console.log('JSONBin no disponible, usando localStorage:', jsonbinError);
            }
        }
        
        // Fallback a datos locales
        const adminData = getAdminData();
        const photos = adminData ? adminData.photos : sampleData.photos;
        
        container.innerHTML = '';
        photos.forEach(photo => {
            const photoCard = createPhotoCard(photo);
            container.appendChild(photoCard);
        });
    } catch (error) {
        console.error('Error cargando fotos:', error);
        // Fallback a datos de ejemplo
        container.innerHTML = '';
        sampleData.photos.forEach(photo => {
            const photoCard = createPhotoCard(photo);
            container.appendChild(photoCard);
        });
    }
}

async function loadVideos() {
    const container = document.getElementById('videos-container');
    if (!container) return;

    container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    
    try {
        // Intentar cargar desde JSONBin primero
        if (typeof jsonbinManager !== 'undefined') {
            try {
                const videos = await jsonbinManager.getVideos();
                if (videos && videos.length > 0) {
                    container.innerHTML = '';
                    videos.forEach(video => {
                        const videoCard = createVideoCard(video);
                        container.appendChild(videoCard);
                    });
                    return;
                }
            } catch (jsonbinError) {
                console.log('JSONBin no disponible, usando localStorage:', jsonbinError);
            }
        }
        
        // Fallback a datos locales
        const adminData = getAdminData();
        const videos = adminData ? adminData.videos : sampleData.videos;
        
        container.innerHTML = '';
        videos.forEach(video => {
            const videoCard = createVideoCard(video);
            container.appendChild(videoCard);
        });
    } catch (error) {
        console.error('Error cargando videos:', error);
        // Fallback a datos de ejemplo
        container.innerHTML = '';
        sampleData.videos.forEach(video => {
            const videoCard = createVideoCard(video);
            container.appendChild(videoCard);
        });
    }
}

// ===========================================
// CREACIÓN DE ELEMENTOS
// ===========================================
function createFlyerCard(flyer) {
    const card = document.createElement('div');
    card.className = 'flyer-card fade-in';
    card.innerHTML = `
        <img src="${flyer.image}" alt="${flyer.title}" class="flyer-image">
        <div class="flyer-info">
            <h3>${flyer.title}</h3>
            <p><i class="bi bi-calendar"></i> ${formatDate(flyer.date)}</p>
            <p><i class="bi bi-geo-alt"></i> ${flyer.location}</p>
            <p>${flyer.description}</p>
        </div>
        <div class="flyer-actions">
            <a href="${flyer.image}" download class="btn btn-primary">
                <i class="bi bi-cloud-download"></i> Descargar
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href + flyer.image)}" 
               target="_blank" class="btn btn-secondary">
                <i class="bi bi-facebook"></i> Compartir
            </a>
        </div>
    `;
    return card;
}

function createPhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card fade-in';
    card.innerHTML = `
        <img src="${photo.image}" alt="${photo.title}" class="photo-image">
        <div class="photo-overlay">
            <h4 class="photo-title">${photo.title}</h4>
            <p class="photo-description">${photo.description}</p>
        </div>
    `;
    
    // Agregar funcionalidad de modal para ver la imagen en grande
    card.addEventListener('click', () => {
        showImageModal(photo);
    });
    
    return card;
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card fade-in';
    card.innerHTML = `
        <div class="video-container">
            <iframe src="${video.url}" 
                    frameborder="0" 
                    allowfullscreen
                    loading="lazy">
            </iframe>
        </div>
        <div class="video-info">
            <h3>${video.title}</h3>
            <p>${video.description}</p>
        </div>
    `;
    return card;
}

// ===========================================
// MODAL DE IMÁGENES
// ===========================================
function showImageModal(photo) {
    // Crear modal si no existe
    let modal = document.getElementById('imageModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <img id="modalImage" src="" alt="">
                <div class="modal-info">
                    <h3 id="modalTitle"></h3>
                    <p id="modalDescription"></p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Event listeners para el modal
        modal.querySelector('.close').addEventListener('click', closeImageModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeImageModal();
        });
    }
    
    // Mostrar contenido
    modal.querySelector('#modalImage').src = photo.image;
    modal.querySelector('#modalTitle').textContent = photo.title;
    modal.querySelector('#modalDescription').textContent = photo.description;
    modal.style.display = 'block';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===========================================
// FORMULARIO DE CONTACTO
// ===========================================
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simular envío (en una implementación real, enviarías a un servidor)
    console.log('Datos del formulario:', data);
    
    // Mostrar mensaje de éxito
    showNotification('Mensaje enviado correctamente', 'success');
    
    // Limpiar formulario
    e.target.reset();
}

// ===========================================
// ANIMACIONES DE SCROLL
// ===========================================
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar elementos con clases de animación
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
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
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
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
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===========================================
// FUNCIONES DEL MODAL DE IMÁGENES
// ===========================================
function openModal(imageSrc, caption) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("modalCaption");

    if (modal && modalImg && captionText) {
        modal.style.display = "block";
        modalImg.src = imageSrc;
        captionText.innerHTML = caption;
    }
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Cerrar modal al hacer clic fuera de la imagen
document.addEventListener('click', function(event) {
    const modal = document.getElementById("imageModal");
    if (event.target === modal) {
        closeModal();
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ===========================================
// FUNCIONES PÚBLICAS PARA EL PANEL DE ADMIN
// ===========================================
window.addFlyer = function(flyerData) {
    const newFlyer = {
        id: Date.now(),
        ...flyerData
    };
    sampleData.flyers.unshift(newFlyer);
    loadFlyers();
    showNotification('Flyer agregado correctamente', 'success');
};

window.addPhoto = function(photoData) {
    const newPhoto = {
        id: Date.now(),
        ...photoData
    };
    sampleData.photos.unshift(newPhoto);
    loadPhotos();
    showNotification('Foto agregada correctamente', 'success');
};

window.addVideo = function(videoData) {
    const newVideo = {
        id: Date.now(),
        ...videoData
    };
    sampleData.videos.unshift(newVideo);
    loadVideos();
    showNotification('Video agregado correctamente', 'success');
};

window.removeFlyer = function(id) {
    sampleData.flyers = sampleData.flyers.filter(flyer => flyer.id !== id);
    loadFlyers();
    showNotification('Flyer eliminado', 'info');
};

window.removePhoto = function(id) {
    sampleData.photos = sampleData.photos.filter(photo => photo.id !== id);
    loadPhotos();
    showNotification('Foto eliminada', 'info');
};

window.removeVideo = function(id) {
    sampleData.videos = sampleData.videos.filter(video => video.id !== id);
    loadVideos();
    showNotification('Video eliminado', 'info');
};

// ===========================================
// ESTILOS ADICIONALES PARA MODAL
// ===========================================
const modalStyles = `
<style>
.modal {
    display: none;
    position: fixed;
    z-index: 10000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    animation: fadeIn 0.3s ease;
}

.modal-content {
    position: relative;
    margin: auto;
    padding: 20px;
    width: 90%;
    max-width: 800px;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
}

.modal-content img {
    max-width: 100%;
    max-height: 70vh;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.modal-info {
    margin-top: 20px;
    color: white;
}

.modal-info h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: var(--primary-color);
}

.modal-info p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
}

.close {
    position: absolute;
    top: 10px;
    right: 25px;
    color: white;
    font-size: 35px;
    font-weight: bold;
    cursor: pointer;
    z-index: 10001;
}

.close:hover {
    color: var(--primary-color);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification-content i {
    font-size: 1.2rem;
}
</style>
`;

// Agregar estilos al head
document.head.insertAdjacentHTML('beforeend', modalStyles);

// ===========================================
// FUNCIONES DE DEBUGGING
// ===========================================
// Función para recargar contenido (útil para debugging)
async function reloadAllContent() {
    console.log('🔄 Recargando todo el contenido...');
    await loadFlyers();
    await loadPhotos();
    await loadVideos();
    console.log('✅ Contenido recargado');
}

// Función para ver el estado de la API
function checkAPIStatus() {
    console.log('🔍 Verificando estado de la API...');
    console.log('simpleAPI disponible:', typeof simpleAPI !== 'undefined');
    if (typeof simpleAPI !== 'undefined') {
        console.log('Bin ID:', simpleAPI.binId);
        console.log('API Key:', simpleAPI.apiKey ? 'Configurada' : 'No configurada');
    }
}

// Hacer funciones disponibles globalmente
window.reloadContent = reloadAllContent;
window.checkAPI = checkAPIStatus;
