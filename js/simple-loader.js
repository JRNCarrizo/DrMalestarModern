// ===========================================
// SIMPLE LOADER - Dr.Malestar
// Cargador simple para la página principal
// ===========================================

console.log('🚀 Simple Loader - Dr.Malestar cargado');

// ===========================================
// INICIALIZACIÓN
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Iniciando carga de contenido...');
    loadContent();
    
    // Escuchar cambios desde el admin
    window.addEventListener('message', function(event) {
        if (event.data === 'RELOAD_CONTENT') {
            console.log('🔄 Recargando contenido desde admin...');
            loadContent();
        }
    });
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', function(event) {
        if (event.key === 'contentUpdated') {
            console.log('🔄 Contenido actualizado, recargando...');
            loadContent();
        }
    });
});

// ===========================================
// CARGA DE CONTENIDO
// ===========================================

async function loadContent() {
    try {
        await loadFlyers();
        await loadPhotos();
        await loadVideos();
        console.log('✅ Contenido cargado exitosamente');
    } catch (error) {
        console.error('❌ Error cargando contenido:', error);
    }
}

async function loadFlyers() {
    const container = document.getElementById('flyersSection');
    if (!container) return;
    
    try {
        const flyers = await simpleAPI.getFlyers();
        container.innerHTML = '';
        
        if (flyers.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No hay flyers disponibles</p>';
            return;
        }
        
        flyers.forEach(flyer => {
            const flyerElement = createFlyerElement(flyer);
            container.appendChild(flyerElement);
        });
        
        console.log(`✅ ${flyers.length} flyers cargados`);
    } catch (error) {
        console.error('❌ Error cargando flyers:', error);
        container.innerHTML = '<p class="text-center text-danger">Error cargando flyers</p>';
    }
}

async function loadPhotos() {
    const container = document.getElementById('photosSection');
    if (!container) return;
    
    try {
        const photos = await simpleAPI.getPhotos();
        container.innerHTML = '';
        
        if (photos.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No hay fotos disponibles</p>';
            return;
        }
        
        photos.forEach(photo => {
            const photoElement = createPhotoElement(photo);
            container.appendChild(photoElement);
        });
        
        console.log(`✅ ${photos.length} fotos cargadas`);
    } catch (error) {
        console.error('❌ Error cargando fotos:', error);
        container.innerHTML = '<p class="text-center text-danger">Error cargando fotos</p>';
    }
}

async function loadVideos() {
    const container = document.getElementById('videosSection');
    if (!container) return;
    
    try {
        const videos = await simpleAPI.getVideos();
        container.innerHTML = '';
        
        if (videos.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No hay videos disponibles</p>';
            return;
        }
        
        videos.forEach(video => {
            const videoElement = createVideoElement(video);
            container.appendChild(videoElement);
        });
        
        console.log(`✅ ${videos.length} videos cargados`);
    } catch (error) {
        console.error('❌ Error cargando videos:', error);
        container.innerHTML = '<p class="text-center text-danger">Error cargando videos</p>';
    }
}

// ===========================================
// CREAR ELEMENTOS
// ===========================================

function createFlyerElement(flyer) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    
    col.innerHTML = `
        <div class="card h-100">
            <img src="${flyer.image || 'img/bluseraflier.jpg'}" 
                 class="card-img-top" 
                 alt="${flyer.title}"
                 style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${flyer.title}</h5>
                <p class="card-text">
                    <strong>Fecha:</strong> ${flyer.date}<br>
                    <strong>Hora:</strong> ${flyer.time}<br>
                    <strong>Lugar:</strong> ${flyer.location}
                </p>
                ${flyer.description ? `<p class="card-text">${flyer.description}</p>` : ''}
            </div>
        </div>
    `;
    
    return col;
}

function createPhotoElement(photo) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    
    col.innerHTML = `
        <div class="card h-100">
            <img src="${photo.image || 'img/bluseraflier.jpg'}" 
                 class="card-img-top" 
                 alt="${photo.title}"
                 style="height: 200px; object-fit: cover;"
                 data-bs-toggle="modal" 
                 data-bs-target="#imageModal"
                 onclick="showImageModal('${photo.image || 'img/bluseraflier.jpg'}', '${photo.title}')">
            <div class="card-body">
                <h5 class="card-title">${photo.title}</h5>
                <p class="card-text">
                    <strong>Fecha:</strong> ${photo.date}
                </p>
                ${photo.description ? `<p class="card-text">${photo.description}</p>` : ''}
            </div>
        </div>
    `;
    
    return col;
}

function createVideoElement(video) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    
    col.innerHTML = `
        <div class="card h-100">
            <div class="card-img-top" style="height: 200px; background: #000; display: flex; align-items: center; justify-content: center;">
                <i class="bi bi-play-circle-fill text-white" style="font-size: 3rem;"></i>
            </div>
            <div class="card-body">
                <h5 class="card-title">${video.title}</h5>
                <p class="card-text">
                    <strong>Fecha:</strong> ${video.date}
                </p>
                ${video.description ? `<p class="card-text">${video.description}</p>` : ''}
                ${video.url ? `<a href="${video.url}" target="_blank" class="btn btn-primary">Ver Video</a>` : ''}
            </div>
        </div>
    `;
    
    return col;
}

// ===========================================
// MODAL DE IMAGEN
// ===========================================

function showImageModal(imageSrc, title) {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    
    if (modalImage) modalImage.src = imageSrc;
    if (modalTitle) modalTitle.textContent = title;
}

// ===========================================
// FUNCIONES GLOBALES
// ===========================================

window.loadContent = loadContent;
window.showImageModal = showImageModal;

console.log('✅ Simple Loader listo');


