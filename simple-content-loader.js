// ===========================================
// SIMPLE CONTENT LOADER - DR. MALESTAR
// ===========================================

// Datos de ejemplo que SIEMPRE funcionan
const SIMPLE_DATA = {
    flyers: [
        {
            id: '1',
            title: 'Dr.Malestar en Memphis - Flyer 1',
            date: '2024-10-31',
            location: 'Memphis, Granville 1756',
            time: '22:00',
            description: 'Show en vivo de Dr.Malestar en Memphis',
            image: 'img/flyer1malestar.jpg'
        },
        {
            id: '2',
            title: 'Dr.Malestar en Memphis - Flyer 2',
            date: '2024-10-31',
            location: 'Memphis, Granville 1756',
            time: '22:00',
            description: 'Show en vivo de Dr.Malestar en Memphis',
            image: 'img/flyer2malestar.jpg'
        },
        {
            id: '3',
            title: 'Dr.Malestar en Memphis - Flyer 3',
            date: '2024-10-31',
            location: 'Memphis, Granville 1756',
            time: '22:00',
            description: 'Show en vivo de Dr.Malestar en Memphis',
            image: 'img/flyer3malestar.jpg'
        }
    ],
    photos: [
        {
            id: '1',
            title: 'Héctor Bass',
            description: 'Bajo y Fundador',
            image: 'img/hector1.jpg'
        },
        {
            id: '2',
            title: 'Hugo "Mosca" Fleitas',
            description: 'Batería',
            image: 'img/hugo1.jpg'
        },
        {
            id: '3',
            title: 'Jorge "Moncho" Carrizo',
            description: 'Guitarra y coros',
            image: 'img/moncho1.jpg'
        },
        {
            id: '4',
            title: 'Julio "Tano" Macaroni',
            description: 'Guitarra y coros',
            image: 'img/Tano1.jpg'
        },
        {
            id: '5',
            title: 'Gustavo "Negro" González',
            description: 'Voz y armónica',
            image: 'img/negro1.jpg'
        },
        {
            id: '6',
            title: 'Pappo',
            description: 'Nuestro homenaje',
            image: 'img/pappo1.avif'
        }
    ],
    videos: [
        {
            id: '1',
            title: 'Dr.Malestar - Macadam 3,2,1,0',
            description: 'Presentación en Rodney Bar',
            url: 'https://www.youtube.com/embed/8Gt6jMM7KgY'
        },
        {
            id: '2',
            title: 'Dr.Malestar - El Viejo',
            description: 'Interpretación clásica en vivo',
            url: 'https://www.youtube.com/embed/M6LpESnfHPY'
        },
        {
            id: '3',
            title: 'Dr.Malestar - Sucio y Desprolijo',
            description: 'ATP - Show completo',
            url: 'https://www.youtube.com/embed/vwMUqDtNn6g'
        },
        {
            id: '4',
            title: 'Dr.Malestar - Botas Sucias',
            description: 'Iaios Bar - Presentación especial',
            url: 'https://www.youtube.com/embed/yFczLmQ4TKk?start=73'
        }
    ]
};

// Función para verificar que una imagen existe
function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
    });
}

// Función para crear tarjeta de flyer
function createSimpleFlyerCard(flyer) {
    const card = document.createElement('div');
    card.className = 'flyer-card fade-in';
    
    const dateFormatted = flyer.date ? formatDate(flyer.date) : 'Fecha por confirmar';
    const timeFormatted = flyer.time ? ` a las ${flyer.time}` : '';
    const locationFormatted = flyer.location || 'Lugar por confirmar';
    const descriptionFormatted = flyer.description || '';
    
    card.innerHTML = `
        <img src="${flyer.image}" alt="${flyer.title}" class="flyer-image" onerror="this.src='img/bluseraflier.jpg'">
        <div class="flyer-info">
            <h3>${flyer.title}</h3>
            <p><i class="bi bi-calendar"></i> ${dateFormatted}${timeFormatted}</p>
            <p><i class="bi bi-geo-alt"></i> ${locationFormatted}</p>
            ${descriptionFormatted ? `<p>${descriptionFormatted}</p>` : ''}
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

// Función para crear tarjeta de foto
function createSimplePhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card fade-in';
    card.innerHTML = `
        <img src="${photo.image}" alt="${photo.title}" class="photo-image">
        <div class="photo-overlay">
            <h4 class="photo-title">${photo.title}</h4>
            <p class="photo-description">${photo.description}</p>
        </div>
    `;
    
    // Agregar funcionalidad de modal
    card.addEventListener('click', () => {
        showImageModal(photo);
    });
    
    return card;
}

// Función para crear tarjeta de video
function createSimpleVideoCard(video) {
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

// Función para formatear fecha
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para mostrar modal de imagen
function showImageModal(photo) {
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
        
        modal.querySelector('.close').addEventListener('click', closeImageModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeImageModal();
        });
    }
    
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

// Función principal para cargar flyers
async function loadSimpleFlyers() {
    console.log('🔄 Cargando flyers (modo simple)...');
    const container = document.getElementById('flyers-container');
    if (!container) return;

    container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    
    try {
        // Verificar imágenes y usar fallbacks si es necesario
        const flyers = [];
        for (const flyer of SIMPLE_DATA.flyers) {
            const imageExists = await checkImageExists(flyer.image);
            const finalFlyer = {
                ...flyer,
                image: imageExists ? flyer.image : 'img/bluseraflier.jpg'
            };
            flyers.push(finalFlyer);
        }
        
        container.innerHTML = '';
        flyers.forEach(flyer => {
            const flyerCard = createSimpleFlyerCard(flyer);
            container.appendChild(flyerCard);
        });
        
        console.log(`✅ ${flyers.length} flyers cargados`);
    } catch (error) {
        console.error('❌ Error cargando flyers:', error);
        container.innerHTML = '<p class="text-center text-muted">Error cargando flyers</p>';
    }
}

// Función principal para cargar fotos
async function loadSimplePhotos() {
    console.log('🔄 Cargando fotos (modo simple)...');
    const container = document.getElementById('photos-container');
    if (!container) return;

    container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    
    try {
        container.innerHTML = '';
        SIMPLE_DATA.photos.forEach(photo => {
            const photoCard = createSimplePhotoCard(photo);
            container.appendChild(photoCard);
        });
        
        console.log(`✅ ${SIMPLE_DATA.photos.length} fotos cargadas`);
    } catch (error) {
        console.error('❌ Error cargando fotos:', error);
        container.innerHTML = '<p class="text-center text-muted">Error cargando fotos</p>';
    }
}

// Función principal para cargar videos
async function loadSimpleVideos() {
    console.log('🔄 Cargando videos (modo simple)...');
    const container = document.getElementById('videos-container');
    if (!container) return;

    container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    
    try {
        container.innerHTML = '';
        SIMPLE_DATA.videos.forEach(video => {
            const videoCard = createSimpleVideoCard(video);
            container.appendChild(videoCard);
        });
        
        console.log(`✅ ${SIMPLE_DATA.videos.length} videos cargados`);
    } catch (error) {
        console.error('❌ Error cargando videos:', error);
        container.innerHTML = '<p class="text-center text-muted">Error cargando videos</p>';
    }
}

// Función para cargar todo el contenido
async function loadAllSimpleContent() {
    console.log('🚀 Iniciando carga simple de contenido...');
    await loadSimpleFlyers();
    await loadSimplePhotos();
    await loadSimpleVideos();
    console.log('✅ Todo el contenido cargado');
}

// Hacer funciones disponibles globalmente
window.loadSimpleFlyers = loadSimpleFlyers;
window.loadSimplePhotos = loadSimplePhotos;
window.loadSimpleVideos = loadSimpleVideos;
window.loadAllSimpleContent = loadAllSimpleContent;

// Mostrar instrucciones
console.log('🎯 Simple Content Loader - Dr.Malestar');
console.log('💡 Instrucciones:');
console.log('   1. Ejecuta: loadAllSimpleContent() - para cargar todo el contenido');
console.log('   2. Ejecuta: loadSimpleFlyers() - para cargar solo flyers');
console.log('   3. Ejecuta: loadSimplePhotos() - para cargar solo fotos');
console.log('   4. Ejecuta: loadSimpleVideos() - para cargar solo videos');
console.log('');
console.log('✅ Este sistema es simple y confiable - siempre funciona');



