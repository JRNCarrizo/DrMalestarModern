// ===========================================
// LOADER SIMPLIFICADO - Dr.Malestar
// Cargador de contenido para la página principal
// ===========================================

console.log('📱 Loader Simplificado - Dr.Malestar cargado');

// Cargar contenido cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Loader...');
    console.log('🔍 Verificando contenedores...');
    console.log('📋 flyers-container:', document.getElementById('flyers-container') ? '✅ Encontrado' : '❌ No encontrado');
    console.log('📋 photos-container:', document.getElementById('photos-container') ? '✅ Encontrado' : '❌ No encontrado');
    console.log('📋 videos-container:', document.getElementById('videos-container') ? '✅ Encontrado' : '❌ No encontrado');
    console.log('🔍 API disponible:', typeof api !== 'undefined' ? '✅ Sí' : '❌ No');
    
    // Esperar un poco para asegurar que todo esté cargado
    setTimeout(() => {
        loadAllContent();
        setupSyncListener();
    }, 100);
});

// Cargar todo el contenido
async function loadAllContent() {
    // Cargar cada sección de forma independiente para que un error no bloquee las demás
    console.log('🔄 Iniciando carga de contenido...');
    
    // Verificar que la API esté disponible
    if (typeof api === 'undefined') {
        console.error('❌ API no está disponible. Verifica que api.js esté cargado.');
        showError('Error: API no disponible. Recarga la página.');
        return;
    }
    
    // Cargar flyers
    loadFlyers().catch(err => {
        console.error('❌ Error cargando flyers:', err);
    });
    
    // Cargar fotos
    loadPhotos().catch(err => {
        console.error('❌ Error cargando fotos:', err);
    });
    
    // Cargar videos
    loadVideos().catch(err => {
        console.error('❌ Error cargando videos:', err);
    });

    // Cargar descargas
    loadDownloads().catch(err => {
        console.error('❌ Error cargando descargas:', err);
    });
    
    console.log('✅ Todas las secciones iniciadas');
}

// ===========================================
// FLYERS
// ===========================================

async function loadFlyers() {
    try {
        console.log('🔄 Cargando flyers...');
        const flyers = await api.getFlyers();
        console.log('📋 Flyers obtenidos:', flyers?.length || 0);
        console.log('📋 Flyers raw:', flyers);
        
        // Asegurar que flyers sea un array
        const flyersArray = Array.isArray(flyers) ? flyers : [];
        console.log('📋 Flyers array:', flyersArray);
        
        if (flyersArray.length === 0) {
            console.warn('⚠️ No hay flyers en el bin. Verifica que el Bin ID sea correcto.');
            console.warn('⚠️ Bin ID actual:', api.binId);
        }
        
        displayFlyers(flyersArray);
    } catch (error) {
        console.error('❌ Error cargando flyers:', error);
        console.error('❌ Error completo:', error);
        const container = document.getElementById('flyers-container');
        if (container) {
            // Mostrar mensaje más amigable
            container.innerHTML = `
                <div class="text-center text-muted" style="grid-column: 1/-1; padding: 3rem;">
                    <p>No se pudieron cargar los flyers.</p>
                    <small>Recarga la página o intenta más tarde.</small>
                    <br><small class="text-muted">Error: ${error.message}</small>
                </div>
            `;
        }
    }
}

function displayFlyers(flyers) {
    try {
        const container = document.getElementById('flyers-container');
        if (!container) {
            console.error('❌ Contenedor de flyers no encontrado');
            return;
        }
        
        if (!Array.isArray(flyers)) {
            console.error('❌ Flyers no es un array:', flyers);
            container.innerHTML = '<p class="text-center text-muted">Error en formato de datos</p>';
            return;
        }
        
        if (flyers.length === 0) {
            container.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1; padding: 3rem;">No hay flyers disponibles</p>';
            return;
        }
        
        if (window.FlyerRender) {
            container.innerHTML = FlyerRender.buildFlyerGrid(flyers, { showActions: true });
            console.log('✅ Flyers mostrados:', flyers.length);
            return;
        }

        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text || '';
            return div.innerHTML;
        };

        container.innerHTML = flyers.map(flyer => {
            const title = escapeHtml(flyer.title || 'Sin título');
            const date = flyer.date ? formatDate(flyer.date) : 'Fecha no disponible';
            const time = escapeHtml(flyer.time || 'Hora no disponible');
            const location = escapeHtml(flyer.location || 'Lugar no disponible');
            const description = flyer.description ? escapeHtml(flyer.description) : '';
            const image = flyer.image || 'img/bluseraflier.jpg';
            
            return `
                <div class="flyer-card">
                    <div class="flyer-image-wrapper">
                        <img src="${image}" class="flyer-image" alt="${title}" onerror="this.src='img/bluseraflier.jpg'">
                        <div class="flyer-overlay-top">
                            <div class="flyer-badge">Próximo Show</div>
                        </div>
                        <div class="flyer-info-overlay">
                            <div class="flyer-info-content">
                                <h3>${title}</h3>
                                <div class="flyer-details">
                                    <div class="flyer-detail-item">
                                        <i class="bi bi-calendar3"></i>
                                        <span>${date}</span>
                                    </div>
                                    <div class="flyer-detail-item">
                                        <i class="bi bi-clock"></i>
                                        <span>${time}</span>
                                    </div>
                                    <div class="flyer-detail-item">
                                        <i class="bi bi-geo-alt"></i>
                                        <span>${location}</span>
                                    </div>
                                </div>
                                ${description ? `<p class="flyer-description">${description}</p>` : ''}
                                <div class="flyer-actions">
                                    <a href="#" class="btn btn-secondary" onclick="window.shareFlyerOnFacebook('${image.replace(/'/g, "\\'")}', '${title.replace(/'/g, "\\'")}'); return false;">
                                        <i class="bi bi-facebook"></i> Compartir en Facebook
                                    </a>
                                    <a href="${image}" download="${title.replace(/[^a-z0-9]/gi, '_')}.jpg" class="btn btn-outline-secondary">
                                        <i class="bi bi-cloud-download"></i> Descargar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log('✅ Flyers mostrados:', flyers.length);
    } catch (error) {
        console.error('❌ Error mostrando flyers:', error);
        const container = document.getElementById('flyers-container');
        if (container) {
            container.innerHTML = '<p class="text-center text-danger">Error mostrando flyers</p>';
        }
    }
}

// ===========================================
// FOTOS
// ===========================================

async function loadPhotos() {
    try {
        console.log('🔄 Cargando fotos...');
        const photos = await api.getPhotos();
        console.log('📋 Fotos obtenidas:', photos?.length || 0);
        
        // Asegurar que photos sea un array
        const photosArray = Array.isArray(photos) ? photos : [];
        displayPhotos(photosArray);
    } catch (error) {
        console.error('❌ Error cargando fotos:', error);
        const container = document.getElementById('photos-container');
        if (container) {
            // Mostrar mensaje más amigable
            container.innerHTML = `
                <div class="text-center text-muted" style="grid-column: 1/-1; padding: 3rem;">
                    <p>No se pudieron cargar las fotos.</p>
                    <small>Recarga la página o intenta más tarde.</small>
                </div>
            `;
        }
    }
}

function displayPhotos(photos) {
    try {
        const container = document.getElementById('photos-container');
        if (!container) {
            console.error('❌ Contenedor de fotos no encontrado');
            return;
        }
        
        if (!Array.isArray(photos)) {
            console.error('❌ Photos no es un array:', photos);
            container.innerHTML = '<p class="text-center text-muted">Error en formato de datos</p>';
            return;
        }
        
        if (photos.length === 0) {
            container.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1; padding: 3rem;">No hay fotos disponibles</p>';
            return;
        }

        if (window.PhotoRender) {
            container.innerHTML = PhotoRender.buildPhotoGrid(photos, { adminContext: false });
            console.log('✅ Fotos mostradas:', photos.length);
            return;
        }

        // Escapar caracteres especiales
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        container.innerHTML = photos.map(photo => {
            const rawTitle = (photo.title || '').trim();
            const rawDescription = (photo.description || '').trim();
            const title = rawTitle ? escapeHtml(rawTitle) : '';
            const description = rawDescription ? escapeHtml(rawDescription) : '';
            const hasCaption = Boolean(rawTitle || rawDescription);
            const image = photo.image || 'img/bluseraflier.jpg';
            const altText = rawTitle ? escapeHtml(rawTitle) : '';

            const overlayHtml = hasCaption ? `
                    <div class="photo-overlay">
                        ${title ? `<h4 class="photo-title">${title}</h4>` : ''}
                        ${description ? `<p class="photo-description">${description}</p>` : ''}
                    </div>` : '';

            return `
                <div class="photo-card${hasCaption ? '' : ' photo-card--no-caption'}">
                    <img src="${image}" class="photo-image" alt="${altText}" onerror="this.src='img/bluseraflier.jpg'">
                    ${overlayHtml}
                </div>
            `;
        }).join('');
        
        console.log('✅ Fotos mostradas:', photos.length);
    } catch (error) {
        console.error('❌ Error mostrando fotos:', error);
        const container = document.getElementById('photos-container');
        if (container) {
            container.innerHTML = '<p class="text-center text-danger">Error mostrando fotos</p>';
        }
    }
}

// ===========================================
// DESCARGAS
// ===========================================

function getDefaultDownloads() {
    if (window.DownloadRender && typeof DownloadRender.getDefaultDownloads === 'function') {
        return DownloadRender.getDefaultDownloads();
    }
    return [{
        id: 'default-logo',
        title: 'Logo Dr.Malestar',
        description: 'Logo oficial de la banda en alta calidad.',
        file: 'img/logoNuevo-malestar.png',
        fileName: 'logoNuevo-malestar.png',
        isDefault: true
    }];
}

async function loadDownloads() {
    try {
        console.log('🔄 Cargando descargas...');
        const downloads = await api.getDownloads();
        const downloadsArray = Array.isArray(downloads) ? downloads : [];
        displayDownloads(downloadsArray);
    } catch (error) {
        console.error('❌ Error cargando descargas:', error);
        const container = document.getElementById('downloads-container');
        if (container) {
            container.innerHTML = `
                <div class="text-center text-muted py-5">
                    <p>No se pudieron cargar las descargas.</p>
                    <small>Recarga la página o intenta más tarde.</small>
                </div>
            `;
        }
    }
}

function displayDownloads(downloads) {
    try {
        const container = document.getElementById('downloads-container');
        if (!container) {
            console.error('❌ Contenedor de descargas no encontrado');
            return;
        }

        const list = Array.isArray(downloads) && downloads.length ? downloads : getDefaultDownloads();

        if (!window.DownloadRender) {
            container.innerHTML = '<p class="text-center text-muted py-5">Módulo de descargas no disponible.</p>';
            return;
        }

        container.innerHTML = DownloadRender.buildDownloadCarousel(list, { adminContext: false });
        DownloadRender.initDownloadCarousel(container.querySelector('[data-download-carousel]'));
        console.log('✅ Descargas mostradas:', list.length);
    } catch (error) {
        console.error('❌ Error mostrando descargas:', error);
        const container = document.getElementById('downloads-container');
        if (container) {
            container.innerHTML = '<p class="text-center text-danger py-5">Error mostrando descargas</p>';
        }
    }
}

// ===========================================
// VIDEOS
// ===========================================

async function loadVideos() {
    try {
        console.log('🔄 Cargando videos...');
        const videos = await api.getVideos();
        console.log('📋 Videos obtenidos:', videos?.length || 0);
        
        // Asegurar que videos sea un array
        const videosArray = Array.isArray(videos) ? videos : [];
        displayVideos(videosArray);
    } catch (error) {
        console.error('❌ Error cargando videos:', error);
        const container = document.getElementById('videos-container');
        if (container) {
            // Mostrar mensaje más amigable
            container.innerHTML = `
                <div class="text-center text-muted" style="grid-column: 1/-1; padding: 3rem;">
                    <p>No se pudieron cargar los videos.</p>
                    <small>Recarga la página o intenta más tarde.</small>
                </div>
            `;
        }
    }
}

function displayVideos(videos) {
    try {
        const container = document.getElementById('videos-container');
        if (!container) {
            console.error('❌ Contenedor de videos no encontrado');
            return;
        }
        
        if (!Array.isArray(videos)) {
            console.error('❌ Videos no es un array:', videos);
            container.innerHTML = '<p class="text-center text-muted">Error en formato de datos</p>';
            return;
        }
        
        if (videos.length === 0) {
            container.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1; padding: 3rem;">No hay videos disponibles</p>';
            return;
        }

        if (window.VideoRender) {
            container.innerHTML = VideoRender.buildVideoGrid(videos, { checkEmbed: true });
            console.log('✅ Videos mostrados:', videos.length);
            return;
        }

        container.innerHTML = '<p class="text-center text-muted">Error cargando videos</p>';
    } catch (error) {
        console.error('❌ Error mostrando videos:', error);
        const container = document.getElementById('videos-container');
        if (container) {
            container.innerHTML = '<p class="text-center text-danger">Error mostrando videos</p>';
        }
    }
}

// ===========================================
// FUNCIONES DE COMPARTIR
// ===========================================

// Función para obtener la URL completa de la imagen
function getFullImageUrl(imageUrl) {
    // Si ya es una URL completa (http/https), devolverla tal cual
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    
    // Si es una URL de Cloudinary, devolverla tal cual
    if (imageUrl.includes('cloudinary.com') || imageUrl.includes('res.cloudinary.com')) {
        return imageUrl;
    }
    
    // Si es una ruta relativa, construir la URL completa del sitio
    const siteUrl = window.location.origin; // Ejemplo: http://drmalestar.netlify.app
    const baseUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${siteUrl}${baseUrl}`;
}

// Función para compartir flyer en Facebook (global)
window.shareFlyerOnFacebook = function(imageUrl, title) {
    try {
        // Obtener la URL completa de la imagen
        const fullImageUrl = getFullImageUrl(imageUrl);
        
        // Construir la URL de Facebook Share
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullImageUrl)}`;
        
        // Abrir en nueva ventana
        window.open(facebookUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        
        console.log('🔗 Compartiendo en Facebook:', fullImageUrl);
    } catch (error) {
        console.error('❌ Error compartiendo en Facebook:', error);
        alert('Error al compartir. Intenta copiando el enlace de la imagen.');
    }
};

// Función para compartir flyer (nativa o Facebook)
function shareFlyer(imageUrl, title) {
    // Intentar usar la Web Share API nativa
    if (navigator.share) {
        const fullImageUrl = getFullImageUrl(imageUrl);
        navigator.share({
            title: title,
            text: `Check out this show: ${title}`,
            url: fullImageUrl
        }).catch(err => {
            console.log('Error compartiendo:', err);
            // Fallback a Facebook
            shareFlyerOnFacebook(imageUrl, title);
        });
    } else {
        // Fallback a Facebook si no hay soporte nativo
        shareFlyerOnFacebook(imageUrl, title);
    }
}

// ===========================================
// UTILIDADES
// ===========================================

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-AR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function showError(message) {
    const containers = ['flyers-container', 'photos-container', 'videos-container'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = `<p class="text-center text-danger">${message}</p>`;
        }
    });
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
    
    // También escuchar cambios en localStorage (para desarrollo)
    window.addEventListener('storage', function(event) {
        if (event.key === 'drmalestar_bin_id') {
            console.log('🔄 Bin ID actualizado, recargando...');
            loadAllContent();
        }
    });
}


console.log('✅ Loader Simplificado listo');
