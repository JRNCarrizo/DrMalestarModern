// ========================================
// 🚀 DEBUG CONTENT SIMPLE - Dr.Malestar
// ========================================
// Script simple para cargar contenido de debug
// Sin dependencias externas, solo contenido hardcodeado

console.log('🎵 Debug Content Simple - Dr.Malestar cargado');

// ========================================
// 📋 DATOS DE DEBUG
// ========================================

const DEBUG_FLYERS = [
    {
        id: 'debug-flyer-1',
        title: 'Dr.Malestar en Memphis',
        date: '2024-10-31',
        time: '22:00',
        location: 'Memphis, Granville 1756',
        description: 'Show en vivo con toda la banda',
        image: 'img/flyer1malestar.jpg',
        fallback: 'img/bluseraflier.jpg'
    },
    {
        id: 'debug-flyer-2',
        title: 'Dr.Malestar en Memphis',
        date: '2024-10-31',
        time: '22:00',
        location: 'Memphis, Granville 1756',
        description: 'Show en vivo con toda la banda',
        image: 'img/flyer2malestar.jpg',
        fallback: 'img/bluseraflier.jpg'
    },
    {
        id: 'debug-flyer-3',
        title: 'Dr.Malestar en Memphis',
        date: '2024-10-31',
        time: '22:00',
        location: 'Memphis, Granville 1756',
        description: 'Show en vivo con toda la banda',
        image: 'img/flyer3malestar.jpg',
        fallback: 'img/bluseraflier.jpg'
    }
];

const DEBUG_PHOTOS = [
    {
        id: 'debug-photo-1',
        title: 'Héctor Bass',
        description: 'Bajo y Fundador',
        image: 'img/hector1.jpg',
        fallback: 'img/bluseraflier.jpg'
    },
    {
        id: 'debug-photo-2',
        title: 'Hugo "Mosca" Fleitas',
        description: 'Batería',
        image: 'img/hugo1.jpg',
        fallback: 'img/bluseraflier.jpg'
    },
    {
        id: 'debug-photo-3',
        title: 'Jorge "Moncho" Carrizo',
        description: 'Guitarra y coros',
        image: 'img/moncho1.jpg',
        fallback: 'img/bluseraflier.jpg'
    },
    {
        id: 'debug-photo-4',
        title: 'Julio "Tano" Macaroni',
        description: 'Guitarra y coros',
        image: 'img/Tano1.jpg',
        fallback: 'img/bluseraflier.jpg'
    },
    {
        id: 'debug-photo-5',
        title: 'Gustavo "Negro" González',
        description: 'Voz y armónica',
        image: 'img/negro1.jpg',
        fallback: 'img/bluseraflier.jpg'
    },
    {
        id: 'debug-photo-6',
        title: 'Pappo',
        description: 'Nuestro homenaje',
        image: 'img/pappo1.avif',
        fallback: 'img/bluseraflier.jpg'
    }
];

const DEBUG_VIDEOS = [
    {
        id: 'debug-video-1',
        title: 'Dr.Malestar - Show en Vivo',
        description: 'Concierto completo desde Memphis',
        youtubeId: 'dQw4w9WgXcQ'
    },
    {
        id: 'debug-video-2',
        title: 'Dr.Malestar - Tributo a Pappo',
        description: 'Homenaje completo a la leyenda del rock argentino',
        youtubeId: 'dQw4w9WgXcQ'
    },
    {
        id: 'debug-video-3',
        title: 'Dr.Malestar - En el Estudio',
        description: 'Grabando nuestro próximo álbum',
        youtubeId: 'dQw4w9WgXcQ'
    },
    {
        id: 'debug-video-4',
        title: 'Dr.Malestar - Entrevista',
        description: 'Hablamos sobre nuestra música y proyectos',
        youtubeId: 'dQw4w9WgXcQ'
    }
];

// ========================================
// 🔧 FUNCIONES DE DEBUG
// ========================================

function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
    });
}

function loadDebugFlyers() {
    console.log('🎫 Cargando flyers de debug...');
    const container = document.getElementById('flyers-container');
    if (!container) {
        console.error('❌ No se encontró el contenedor de flyers');
        return;
    }

    container.innerHTML = '';

    DEBUG_FLYERS.forEach(async (flyer, index) => {
        const flyerCard = document.createElement('div');
        flyerCard.className = 'flyer-card';
        flyerCard.innerHTML = `
            <img src="${flyer.image}" alt="${flyer.title}" class="flyer-image" 
                 onerror="this.src='${flyer.fallback}'">
            <div class="flyer-info">
                <h3>${flyer.title}</h3>
                <p>Fecha: ${flyer.date}<br>Lugar: ${flyer.location}<br>Hora: ${flyer.time}</p>
                <p class="flyer-description">${flyer.description}</p>
            </div>
            <div class="flyer-actions">
                <button class="btn btn-primary">Ver Detalles</button>
                <button class="btn btn-secondary">Compartir</button>
            </div>
        `;
        container.appendChild(flyerCard);
    });

    console.log('✅ Flyers de debug cargados');
}

function loadDebugPhotos() {
    console.log('📸 Cargando fotos de debug...');
    const container = document.getElementById('photos-container');
    if (!container) {
        console.error('❌ No se encontró el contenedor de fotos');
        return;
    }

    container.innerHTML = '';

    DEBUG_PHOTOS.forEach((photo, index) => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.onclick = () => openModal(photo.image, photo.title);
        photoCard.innerHTML = `
            <img src="${photo.image}" alt="${photo.title}" class="photo-image" 
                 onerror="this.src='${photo.fallback}'">
            <div class="photo-overlay">
                <h4 class="photo-title">${photo.title}</h4>
                <p class="photo-description">${photo.description}</p>
            </div>
        `;
        container.appendChild(photoCard);
    });

    console.log('✅ Fotos de debug cargadas');
}

function loadDebugVideos() {
    console.log('🎥 Cargando videos de debug...');
    const container = document.getElementById('videos-container');
    if (!container) {
        console.error('❌ No se encontró el contenedor de videos');
        return;
    }

    container.innerHTML = '';

    DEBUG_VIDEOS.forEach((video, index) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${video.youtubeId}" 
                        title="${video.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            </div>
        `;
        container.appendChild(videoCard);
    });

    console.log('✅ Videos de debug cargados');
}

function loadDebugContent() {
    console.log('🚀 Iniciando carga de contenido de debug...');
    
    // Cargar todo el contenido
    loadDebugFlyers();
    loadDebugPhotos();
    loadDebugVideos();
    
    console.log('✅ Todo el contenido de debug cargado');
}

// ========================================
// 🎯 FUNCIONES GLOBALES
// ========================================

// Hacer las funciones disponibles globalmente
window.loadDebugContent = loadDebugContent;
window.loadDebugFlyers = loadDebugFlyers;
window.loadDebugPhotos = loadDebugPhotos;
window.loadDebugVideos = loadDebugVideos;

console.log('🎵 Debug Content Simple - Dr.Malestar listo');



