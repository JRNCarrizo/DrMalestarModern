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
        
        // Escapar caracteres especiales para evitar problemas con HTML
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
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
        
        // Escapar caracteres especiales
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        container.innerHTML = photos.map(photo => {
            const title = escapeHtml(photo.title || 'Sin título');
            const description = photo.description ? escapeHtml(photo.description) : '';
            const image = photo.image || 'img/bluseraflier.jpg';
            const safeImage = image.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const safeTitle = title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            
            return `
                <div class="photo-card" onclick="openModal('${safeImage}', '${safeTitle}')">
                    <img src="${image}" class="photo-image" alt="${title}" onerror="this.src='img/bluseraflier.jpg'">
                    <div class="photo-overlay">
                        <h4 class="photo-title">${title}</h4>
                        ${description ? `<p class="photo-description">${description}</p>` : ''}
                        <div class="photo-zoom-icon">
                            <i class="bi bi-zoom-in"></i>
                        </div>
                    </div>
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
        
        // Escapar caracteres especiales
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        container.innerHTML = videos.map(video => {
        // Función mejorada para extraer ID del video de YouTube
        function extractYouTubeId(url) {
            if (!url) return null;
            
            // Limpiar URL
            let cleanUrl = url.trim();
            
            // Remover parámetros adicionales
            if (cleanUrl.includes('&')) {
                cleanUrl = cleanUrl.split('&')[0];
            }
            
            // Diferentes patrones de URLs de YouTube (IDs tienen 11 caracteres)
            // Incluir soporte para Shorts/Reels
            const patterns = [
                /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,
                /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,  // Shorts/Reels
                /youtu\.be\/([a-zA-Z0-9_-]{11})/,
                /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
                /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
                /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
                /^([a-zA-Z0-9_-]{11})$/  // Si solo es el ID
            ];
            
            for (const pattern of patterns) {
                const match = cleanUrl.match(pattern);
                if (match && match[1] && match[1].length === 11) {
                    return match[1];
                }
            }
            
            // Extracción manual si los patrones fallan
            if (cleanUrl.includes('v=')) {
                const parts = cleanUrl.split('v=');
                if (parts.length > 1) {
                    const possibleId = parts[1].split(/[&?#]/)[0].trim();
                    if (possibleId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(possibleId)) {
                        return possibleId;
                    }
                }
            }
            
            if (cleanUrl.includes('youtu.be/')) {
                const parts = cleanUrl.split('youtu.be/');
                if (parts.length > 1) {
                    const possibleId = parts[1].split(/[?&#]/)[0].trim();
                    if (possibleId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(possibleId)) {
                        return possibleId;
                    }
                }
            }
            
            // Extraer de URLs de Shorts/Reels
            if (cleanUrl.includes('/shorts/')) {
                const parts = cleanUrl.split('/shorts/');
                if (parts.length > 1) {
                    const possibleId = parts[1].split(/[?&#]/)[0].trim();
                    if (possibleId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(possibleId)) {
                        console.log('✅ Short/Reel detectado, ID extraído:', possibleId);
                        return possibleId;
                    }
                }
            }
            
            return null;
        }
        
        // Obtener videoId (priorizar el guardado, luego extraer de la URL)
        let videoId = video.videoId || extractYouTubeId(video.url);
        
        // Log para debugging
        console.log('🔍 Procesando video:', {
            title: video.title,
            url: video.url,
            videoId: video.videoId,
            extractedId: extractYouTubeId(video.url),
            finalId: videoId
        });
        
        // Validar que el videoId sea válido (exactamente 11 caracteres)
        if (!videoId || videoId.length !== 11 || !/^[a-zA-Z0-9_-]+$/.test(videoId)) {
            console.warn('⚠️ Video ID inválido:', videoId, 'URL:', video.url);
            const title = escapeHtml(video.title || 'Video sin título');
            const description = video.description ? escapeHtml(video.description) : '';
            const url = video.url || '';
            return `
                <div class="video-card">
                    <div class="video-container">
                        <div class="admin-video-placeholder">
                            <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #dc3545;"></i>
                            <p style="margin-top: 1rem; color: var(--text-muted);">Video ID inválido</p>
                        </div>
                    </div>
                    <div class="video-info">
                        <h3>${title}</h3>
                        ${description ? `<p>${description}</p>` : ''}
                        <p class="text-danger"><small>Error: ID de video inválido (${videoId || 'no extraído'})</small></p>
                        ${url ? `<a href="${url}" target="_blank" class="btn btn-secondary btn-sm">
                            <i class="bi bi-youtube"></i> Ver en YouTube
                        </a>` : ''}
                    </div>
                </div>
            `;
        }
        
        // Detectar si es un Short/Reel (videos cortos de YouTube)
        // Los Shorts a veces necesitan parámetros diferentes
        const isShort = video.url && (video.url.includes('/shorts/') || video.url.includes('youtube.com/shorts/'));
        
        // Construir URL de embed correcta con parámetros para mejor compatibilidad
        // Para Shorts/Reels usamos parámetros ligeramente diferentes
        let embedUrl;
        if (isShort) {
            embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
        } else {
            embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
        }
        
        console.log('🎬 Tipo de video:', isShort ? 'Short/Reel' : 'Video normal', 'ID:', videoId);
        
        // Validar que la URL de embed sea correcta antes de crear el iframe
        if (!embedUrl.includes('/embed/') || embedUrl === 'https://www.youtube.com/embed/' || !videoId) {
            console.error('❌ URL de embed inválida generada:', embedUrl, 'VideoId:', videoId);
            const title = escapeHtml(video.title || 'Video sin título');
            const description = video.description ? escapeHtml(video.description) : '';
            const url = video.url || '';
            return `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <h5 class="card-title">${title}</h5>
                            ${description ? `<p class="card-text">${description}</p>` : ''}
                            <p class="text-danger"><small>Error generando URL de embed</small></p>
                            ${url ? `<a href="${url}" target="_blank" class="btn btn-primary btn-sm">Ver en YouTube</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
        
        const title = escapeHtml(video.title || 'Video sin título');
        const description = video.description ? escapeHtml(video.description) : '';
        const url = video.url || '';
        
        return `
            <div class="video-card" data-video-id="${videoId}">
                <div class="video-container" id="video-wrapper-${videoId}">
                    <iframe 
                        id="ytplayer-${videoId}"
                        src="${embedUrl}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen
                        loading="lazy"
                        style="width: 100%; height: 100%;"
                        onload="checkVideoLoad('${videoId}')"
                        title="${escapeHtml(title)}">
                    </iframe>
                    <div class="video-error-overlay" id="error-${videoId}" style="display: none;">
                        <div class="video-error-content">
                            <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #ffc107; margin-bottom: 1rem;"></i>
                            <p style="color: var(--text-light); margin-bottom: 0.5rem;">Este video no permite reproducción embebida</p>
                            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Haz clic en el botón para verlo en YouTube</p>
                            <a href="${url}" target="_blank" class="btn btn-primary">
                                <i class="bi bi-youtube"></i> Ver en YouTube
                            </a>
                        </div>
                    </div>
                </div>
                <div class="video-info">
                    <h3>${title}</h3>
                    ${description ? `<p>${description}</p>` : ''}
                    ${url ? `<a href="${url}" target="_blank" class="btn btn-secondary btn-sm">
                        <i class="bi bi-youtube"></i> Ver en YouTube
                    </a>` : ''}
                </div>
            </div>
        `;
        }).join('');
        
        // Función para verificar si el video cargó correctamente
        window.checkVideoLoad = function(videoId) {
            setTimeout(() => {
                const iframe = document.getElementById(`ytplayer-${videoId}`);
                const errorOverlay = document.getElementById(`error-${videoId}`);
                const wrapper = document.getElementById(`video-wrapper-${videoId}`);
                
                if (iframe && wrapper) {
                    try {
                        // Intentar detectar si el video tiene restricciones de embedding
                        // Esto se hace verificando si el iframe tiene contenido o está bloqueado
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                        
                        // Si no podemos acceder al documento (cross-origin), asumimos que está bien
                        // Si podemos acceder y no hay contenido, podría ser un problema
                        if (iframeDoc) {
                            const body = iframeDoc.body;
                            if (body && body.textContent.includes('no disponible') || body.textContent.includes('not available')) {
                                console.warn('⚠️ Video con restricciones de embedding detectado:', videoId);
                                if (errorOverlay) {
                                    errorOverlay.style.display = 'flex';
                                    iframe.style.display = 'none';
                                }
                            }
                        }
                    } catch (e) {
                        // Cross-origin error es normal, significa que el iframe está cargando
                        console.log('✅ Iframe de video cargado (cross-origin normal):', videoId);
                    }
                }
            }, 2000);
        };
        
        console.log('✅ Videos mostrados:', videos.length);
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

// Función para abrir modal de imagen
function openModal(imageSrc, imageTitle) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    if (modal && modalImage && modalCaption) {
        modalImage.src = imageSrc;
        modalCaption.textContent = imageTitle || '';
        
        // Mostrar modal (usando Bootstrap si está disponible)
        if (typeof bootstrap !== 'undefined') {
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        } else {
            modal.style.display = 'block';
        }
    }
}

// Función para cerrar modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        if (typeof bootstrap !== 'undefined') {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();
        } else {
            modal.style.display = 'none';
        }
    }
}

// Hacer funciones globales
window.openModal = openModal;
window.closeModal = closeModal;

console.log('✅ Loader Simplificado listo');
