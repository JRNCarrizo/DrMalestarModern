// ===========================================
// HYBRID LOADER - Dr.Malestar
// Sistema híbrido que combina API y contenido local
// ===========================================

console.log('🔄 Hybrid Loader - Dr.Malestar cargado');

// Función principal de carga híbrida
async function loadHybridContent() {
    console.log('🚀 Iniciando carga híbrida...');
    
    try {
        // Intentar cargar desde CloudAPI primero (producción)
        if (typeof cloudAPI !== 'undefined') {
            console.log('🔄 Intentando cargar desde CloudAPI...');
            const success = await loadFromAPI();
            if (success) {
                console.log('✅ Contenido cargado desde CloudAPI');
                return;
            }
        }
        
        // Si CloudAPI falla, intentar SimpleStorage como respaldo
        if (typeof simpleStorage !== 'undefined') {
            console.log('🔄 CloudAPI no disponible, intentando SimpleStorage...');
            const success = await loadFromStorage();
            if (success) {
                console.log('✅ Contenido cargado desde SimpleStorage como respaldo');
                return;
            }
        }
        
        // Si todo falla, usar contenido local
        console.log('🔄 Usando contenido local como último recurso...');
        loadFromLocal();
        
    } catch (error) {
        console.error('❌ Error en carga híbrida:', error);
        console.log('🔄 Usando contenido local como fallback...');
        loadFromLocal();
    }
}

// Cargar desde CloudAPI
async function loadFromAPI() {
    try {
        console.log('🔄 Cargando desde CloudAPI...');
        
        const flyers = await cloudAPI.getFlyers();
        const photos = await cloudAPI.getPhotos();
        const videos = await cloudAPI.getVideos();
        
        console.log('📋 Datos de CloudAPI obtenidos:', { 
            flyers: flyers.length, 
            photos: photos.length, 
            videos: videos.length 
        });
        
        // Mostrar detalles de flyers
        if (flyers.length > 0) {
            console.log('🎫 Flyers desde CloudAPI:');
            flyers.forEach((flyer, index) => {
                console.log(`  ${index + 1}. ${flyer.title} (ID: ${flyer.id})`);
            });
        }
        
        // Cargar datos
        loadFlyersFromData(flyers);
        loadPhotosFromData(photos);
        loadVideosFromData(videos);
        
        console.log('✅ Datos cargados desde CloudAPI');
        return true;
        
    } catch (error) {
        console.error('❌ Error cargando desde CloudAPI:', error);
        console.error('❌ Detalles del error:', error.message);
        return false;
    }
}

// Cargar desde SimpleStorage
async function loadFromStorage() {
    try {
        console.log('🔄 Cargando desde SimpleStorage...');
        
        const flyers = simpleStorage.getFlyers();
        const photos = simpleStorage.getPhotos();
        const videos = simpleStorage.getVideos();
        
        console.log('📋 Datos de SimpleStorage obtenidos:', { 
            flyers: flyers.length, 
            photos: photos.length, 
            videos: videos.length 
        });
        
        // Mostrar detalles de flyers
        if (flyers.length > 0) {
            console.log('🎫 Flyers desde SimpleStorage:');
            flyers.forEach((flyer, index) => {
                console.log(`  ${index + 1}. ${flyer.title} (ID: ${flyer.id})`);
            });
        }
        
        // Cargar datos
        loadFlyersFromData(flyers);
        loadPhotosFromData(photos);
        loadVideosFromData(videos);
        
        console.log('✅ Datos cargados desde SimpleStorage');
        return true;
        
    } catch (error) {
        console.error('❌ Error cargando desde SimpleStorage:', error);
        console.error('❌ Detalles del error:', error.message);
        return false;
    }
}

// Cargar desde contenido local
function loadFromLocal() {
    console.log('🔄 Cargando contenido local...');
    
    // NO usar debug content - solo usar datos hardcodeados sin flyers
    loadHardcodedContent();
}

// Cargar flyers desde datos
function loadFlyersFromData(flyers) {
    const container = document.getElementById('flyers-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (flyers.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No hay flyers disponibles</p>';
        return;
    }
    
    flyers.forEach(flyer => {
        const flyerCard = createFlyerCard(flyer);
        container.appendChild(flyerCard);
    });
    
    console.log('✅ Flyers cargados:', flyers.length);
}

// Cargar fotos desde datos
function loadPhotosFromData(photos) {
    const container = document.getElementById('photos-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (photos.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No hay fotos disponibles</p>';
        return;
    }
    
    photos.forEach(photo => {
        const photoCard = createPhotoCard(photo);
        container.appendChild(photoCard);
    });
    
    console.log('✅ Fotos cargadas:', photos.length);
}

// Cargar videos desde datos
function loadVideosFromData(videos) {
    const container = document.getElementById('videos-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (videos.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No hay videos disponibles</p>';
        return;
    }
    
    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        container.appendChild(videoCard);
    });
    
    console.log('✅ Videos cargados:', videos.length);
}

// Crear tarjeta de flyer
function createFlyerCard(flyer) {
    const card = document.createElement('div');
    card.className = 'flyer-card';
    card.innerHTML = `
        <img src="${flyer.image || 'img/bluseraflier.jpg'}" alt="${flyer.title}" class="flyer-image" 
             onerror="this.src='img/bluseraflier.jpg'">
        <div class="flyer-info">
            <h3>${flyer.title}</h3>
            <p>Fecha: ${flyer.date}<br>Lugar: ${flyer.location}<br>Hora: ${flyer.time || 'TBA'}</p>
            <p class="flyer-description">${flyer.description || ''}</p>
        </div>
        <div class="flyer-actions">
            <button class="btn btn-primary">Ver Detalles</button>
            <button class="btn btn-secondary">Compartir</button>
        </div>
    `;
    return card;
}

// Crear tarjeta de foto
function createPhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.onclick = () => openModal(photo.image, photo.title);
    card.innerHTML = `
        <img src="${photo.image || 'img/bluseraflier.jpg'}" alt="${photo.title}" class="photo-image" 
             onerror="this.src='img/bluseraflier.jpg'">
        <div class="photo-overlay">
            <h4 class="photo-title">${photo.title}</h4>
            <p class="photo-description">${photo.description || ''}</p>
        </div>
    `;
    return card;
}

// Crear tarjeta de video
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
        <div class="video-container">
            <iframe src="${video.url}" 
                    title="${video.title}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen></iframe>
        </div>
        <div class="video-info">
            <h3>${video.title}</h3>
            <p>${video.description || ''}</p>
        </div>
    `;
    return card;
}

// Cargar contenido hardcodeado como último recurso
function loadHardcodedContent() {
    console.log('🔄 Cargando contenido hardcodeado...');
    
    // NO mostrar flyers hardcodeados - solo mostrar mensaje de que no hay flyers
    const hardcodedFlyers = [];
    
    // Fotos hardcodeadas (estas sí se pueden mostrar)
    const hardcodedPhotos = [
        {
            id: 'hardcoded-photo-1',
            title: 'Héctor Bass',
            description: 'Bajo y Fundador',
            image: 'img/hector1.jpg'
        }
    ];
    
    // Videos hardcodeados (estos sí se pueden mostrar)
    const hardcodedVideos = [
        {
            id: 'hardcoded-video-1',
            title: 'Dr.Malestar - Show en Vivo',
            description: 'Concierto completo desde Memphis',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
    ];
    
    loadFlyersFromData(hardcodedFlyers);
    loadPhotosFromData(hardcodedPhotos);
    loadVideosFromData(hardcodedVideos);
}

// Función para recargar contenido
async function reloadHybridContent() {
    console.log('🔄 Recargando contenido híbrido...');
    console.log('🔄 Timestamp:', new Date().toISOString());
    
    try {
        await loadHybridContent();
        console.log('✅ Contenido híbrido recargado exitosamente');
    } catch (error) {
        console.error('❌ Error recargando contenido híbrido:', error);
    }
}

// Hacer funciones disponibles globalmente
window.loadHybridContent = loadHybridContent;
window.reloadHybridContent = reloadHybridContent;

console.log('✅ Hybrid Loader listo');
