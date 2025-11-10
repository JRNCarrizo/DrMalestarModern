// ===========================================
// LOCAL LOADER - Dr.Malestar
// Cargador de contenido con almacenamiento local
// ===========================================

console.log('📱 Local Loader - Dr.Malestar cargado');

// Verificar que las dependencias estén cargadas
if (typeof localAPI === 'undefined') {
    console.error('❌ Local Storage API no está cargado');
}

// Cargar contenido cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Local Loader...');
    loadAllContent();
    setupSyncListener();
    console.log('✅ Local Loader inicializado');
});

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

// Mostrar flyers en la página principal
function displayFlyers(flyers) {
    const flyerContainer = document.getElementById('flyerContainer');
    if (!flyerContainer) {
        console.warn('⚠️ Contenedor de flyers no encontrado');
        return;
    }
    
    if (flyers.length === 0) {
        flyerContainer.innerHTML = '<p class="text-center text-muted">No hay flyers disponibles</p>';
        return;
    }
    
    flyerContainer.innerHTML = flyers.map(flyer => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <img src="${flyer.image}" class="card-img-top" alt="${flyer.title}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${flyer.title}</h5>
                    <p class="card-text"><strong>Fecha:</strong> ${flyer.date}</p>
                    <p class="card-text"><strong>Hora:</strong> ${flyer.time}</p>
                    <p class="card-text"><strong>Lugar:</strong> ${flyer.location}</p>
                    <p class="card-text">${flyer.description}</p>
                </div>
            </div>
        </div>
    `).join('');
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

// Mostrar fotos en la página principal
function displayPhotos(photos) {
    const photoContainer = document.getElementById('photoContainer');
    if (!photoContainer) {
        console.warn('⚠️ Contenedor de fotos no encontrado');
        return;
    }
    
    if (photos.length === 0) {
        photoContainer.innerHTML = '<p class="text-center text-muted">No hay fotos disponibles</p>';
        return;
    }
    
    photoContainer.innerHTML = photos.map(photo => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <img src="${photo.image}" class="card-img-top" alt="${photo.title}" style="height: 200px; object-fit: cover;" onclick="openModal('${photo.image}', '${photo.title}')">
                <div class="card-body">
                    <h5 class="card-title">${photo.title}</h5>
                    <p class="card-text">${photo.description}</p>
                </div>
            </div>
        </div>
    `).join('');
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

// Mostrar videos en la página principal
function displayVideos(videos) {
    const videoContainer = document.getElementById('videoContainer');
    if (!videoContainer) {
        console.warn('⚠️ Contenedor de videos no encontrado');
        return;
    }
    
    if (videos.length === 0) {
        videoContainer.innerHTML = '<p class="text-center text-muted">No hay videos disponibles</p>';
        return;
    }
    
    videoContainer.innerHTML = videos.map(video => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${video.title}</h5>
                    <p class="card-text">${video.description}</p>
                    <a href="${video.url}" target="_blank" class="btn btn-primary">
                        <i class="fab fa-youtube"></i> Ver en YouTube
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Configurar listener para sincronización
function setupSyncListener() {
    // Escuchar mensajes del admin
    window.addEventListener('message', function(event) {
        if (event.data === 'contentUpdated') {
            console.log('🔄 Contenido actualizado desde admin, recargando...');
            loadAllContent();
        }
    });
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', function(event) {
        if (event.key === 'drmalestar_local_data') {
            console.log('🔄 Datos locales actualizados, recargando...');
            loadAllContent();
        }
    });
}

// Función para abrir modal de imagen
function openModal(imageSrc, imageTitle) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    if (modal && modalImage && modalCaption) {
        modalImage.src = imageSrc;
        modalCaption.textContent = imageTitle;
        
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

// Funciones de debugging
window.testLocalLoader = function() {
    console.log('🧪 Probando Local Loader...');
    console.log('📊 Estadísticas:', localAPI.getStats());
    loadAllContent();
};

window.forceReload = function() {
    console.log('🔄 Forzando recarga de contenido...');
    loadAllContent();
};

console.log('✅ Local Loader listo');


