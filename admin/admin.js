// ===========================================
// ADMIN SIMPLIFICADO - Dr.Malestar
// Panel de administración simple y funcional
// ===========================================

console.log('🔧 Admin Simplificado - Dr.Malestar cargado');

// Estado
let isAuthenticated = false;
let isSubmitting = false;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Admin...');
    checkAuth();
    setupEventListeners();
});

// Verificar autenticación
function checkAuth() {
    const auth = localStorage.getItem('adminAuthenticated');
    if (auth === 'true') {
        showAdminPanel();
    } else {
        showLoginForm();
    }
}

// Mostrar formulario de login
function showLoginForm() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    isAuthenticated = false;
}

// Mostrar panel de admin
async function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    isAuthenticated = true;
    await loadAllContent();
}

// Configurar event listeners
function setupEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Formularios
    document.getElementById('flyerForm').addEventListener('submit', handleFlyerSubmit);
    document.getElementById('photoForm').addEventListener('submit', handlePhotoSubmit);
    document.getElementById('videoForm').addEventListener('submit', handleVideoSubmit);
    
    // Sync button
    const syncBtn = document.getElementById('syncBtn');
    if (syncBtn) {
        syncBtn.addEventListener('click', async () => {
            await loadAllContent();
            notify('Contenido recargado', 'success');
        });
    }
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const validUser = window.CONFIG?.ADMIN_USER || 'admin';
    const validPass = window.CONFIG?.ADMIN_PASS || 'admin123';
    
    if (username === validUser && password === validPass) {
        localStorage.setItem('adminAuthenticated', 'true');
        showAdminPanel();
        notify('Sesión iniciada', 'success');
    } else {
        notify('Credenciales incorrectas', 'error');
    }
}

// Manejar logout
function handleLogout() {
    localStorage.removeItem('adminAuthenticated');
    showLoginForm();
    notify('Sesión cerrada', 'info');
}

// Cargar todo el contenido
async function loadAllContent() {
    try {
        await Promise.all([
            loadFlyers(),
            loadPhotos(),
            loadVideos()
        ]);
        } catch (error) {
        console.error('❌ Error cargando contenido:', error);
        notify('Error cargando contenido', 'error');
    }
}

// ===========================================
// FLYERS
// ===========================================

async function loadFlyers() {
    try {
        const flyers = await api.getFlyers();
        displayFlyers(flyers);
        updateFlyerButtonState();
        
        // Mostrar contador
        const counter = document.getElementById('flyersCounter');
        if (counter) {
            counter.textContent = `Flyers: ${flyers.length}/4`;
            if (flyers.length >= 4) {
                counter.className = 'badge bg-warning';
            } else {
                counter.className = 'badge bg-info';
            }
            }
        } catch (error) {
        console.error('❌ Error cargando flyers:', error);
        document.getElementById('flyersList').innerHTML = '<p class="text-danger">Error cargando flyers</p>';
    }
}

function displayFlyers(flyers) {
    const container = document.getElementById('flyersList');
    if (flyers.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">No hay flyers disponibles</p>';
        return;
    }
    
    // Escapar HTML para evitar problemas
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    };
    
    container.innerHTML = flyers.map(flyer => {
        const title = escapeHtml(flyer.title || 'Sin título');
        const date = escapeHtml(flyer.date || 'Sin fecha');
        const time = escapeHtml(flyer.time || 'Sin hora');
        const location = escapeHtml(flyer.location || 'Sin lugar');
        const description = escapeHtml(flyer.description || '');
        const image = flyer.image || 'img/bluseraflier.jpg';
        
        return `
            <div class="admin-flyer-card" data-id="${flyer.id}">
                <div class="admin-flyer-image-wrapper">
                    <img src="${image}" class="admin-flyer-image" alt="${title}" onerror="this.src='img/bluseraflier.jpg'">
                    <div class="admin-flyer-badge">Show</div>
                </div>
                <div class="admin-flyer-content">
                    <h5 class="admin-flyer-title">${title}</h5>
                    <div class="admin-flyer-details">
                        <div class="admin-detail-row">
                            <i class="bi bi-calendar3"></i>
                            <span>${date}</span>
                        </div>
                        <div class="admin-detail-row">
                            <i class="bi bi-clock"></i>
                            <span>${time}</span>
                        </div>
                        <div class="admin-detail-row">
                            <i class="bi bi-geo-alt"></i>
                            <span>${location}</span>
                        </div>
                    </div>
                    ${description ? `<p class="admin-flyer-description">${description}</p>` : ''}
                    <div class="admin-flyer-actions">
                        <button class="btn btn-danger-admin btn-sm" onclick="deleteFlyer('${flyer.id}')">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function handleFlyerSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;
    
    try {
        // Verificar límite de flyers (máximo 4)
        const currentFlyers = await api.getFlyers();
        if (currentFlyers.length >= 4) {
            notify('❌ Límite alcanzado: Solo se pueden tener 4 flyers. Elimina uno para agregar otro.', 'error');
            isSubmitting = false;
            return;
        }
        
        const formData = new FormData(e.target);
        const flyerData = {
            title: formData.get('title'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            description: formData.get('description') || ''
        };
        
        // Subir imagen si existe
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            console.log('🔄 Subiendo imagen a Cloudinary...');
            const cloudinaryResult = await uploadToCloudinary(imageFile, 'drmalestar/flyers');
            flyerData.image = cloudinaryResult.url;
        } else {
            flyerData.image = 'img/bluseraflier.jpg'; // Imagen por defecto
        }
        
        await api.addFlyer(flyerData);
        await loadFlyers();
        e.target.reset();
        clearPreview('flyerPreview');
        notify(`✅ Flyer agregado correctamente (${currentFlyers.length + 1}/4)`, 'success');
        
        // Actualizar estado del botón
        updateFlyerButtonState();
        
        // Notificar a la página principal
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error agregando flyer:', error);
        notify('Error agregando flyer: ' + error.message, 'error');
    } finally {
        isSubmitting = false;
    }
}

// Actualizar estado del botón de agregar flyer
async function updateFlyerButtonState() {
    try {
        const flyers = await api.getFlyers();
        const addButton = flyerForm?.querySelector('button[type="submit"]');
        if (addButton) {
            if (flyers.length >= 4) {
                addButton.disabled = true;
                addButton.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Límite alcanzado (4/4)';
                addButton.className = 'btn btn-warning w-100';
        } else {
                addButton.disabled = false;
                addButton.innerHTML = '<i class="bi bi-plus-circle"></i> Agregar Flyer';
                addButton.className = 'btn btn-admin w-100';
            }
        }
    } catch (error) {
        console.error('Error actualizando estado del botón:', error);
    }
}

async function deleteFlyer(id) {
    if (!confirm('¿Estás seguro de eliminar este flyer?')) return;
    
    try {
        await api.deleteFlyer(id);
        await loadFlyers();
        notify('Flyer eliminado. Ya puedes agregar otro.', 'success');
        
        // Notificar a la página principal
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error eliminando flyer:', error);
        notify('Error eliminando flyer', 'error');
    }
}

// ===========================================
// FOTOS
// ===========================================

async function loadPhotos() {
    try {
        const photos = await api.getPhotos();
        displayPhotos(photos);
        updatePhotoButtonState();
        
        // Mostrar contador
        const counter = document.getElementById('photosCounter');
        if (counter) {
            counter.textContent = `Fotos: ${photos.length}/8`;
            if (photos.length >= 8) {
                counter.className = 'badge bg-warning';
            } else {
                counter.className = 'badge bg-info';
            }
        }
        } catch (error) {
        console.error('❌ Error cargando fotos:', error);
        document.getElementById('photosList').innerHTML = '<p class="text-danger">Error cargando fotos</p>';
    }
}

function displayPhotos(photos) {
    const container = document.getElementById('photosList');
    if (photos.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">No hay fotos disponibles</p>';
        return;
    }
    
    // Escapar HTML
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    };
    
    container.innerHTML = photos.map(photo => {
        const title = escapeHtml(photo.title || 'Sin título');
        const description = escapeHtml(photo.description || '');
        const image = photo.image || 'img/bluseraflier.jpg';
        
        return `
            <div class="admin-photo-card" data-id="${photo.id}">
                <div class="admin-photo-image-wrapper">
                    <img src="${image}" class="admin-photo-image" alt="${title}" onerror="this.src='img/bluseraflier.jpg'">
                    <div class="admin-photo-overlay">
                        <button class="btn btn-danger-admin btn-sm" onclick="deletePhoto('${photo.id}')">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
                <div class="admin-photo-content">
                    <h6 class="admin-photo-title">${title}</h6>
                    ${description ? `<p class="admin-photo-description">${description}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

async function handlePhotoSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;
    
    try {
        // Verificar límite de fotos (máximo 8)
        const currentPhotos = await api.getPhotos();
        if (currentPhotos.length >= 8) {
            notify('❌ Límite alcanzado: Solo se pueden tener 8 fotos. Elimina una para agregar otra.', 'error');
            isSubmitting = false;
            return;
        }
        
        const title = document.getElementById('photoTitle').value.trim();
        const description = document.getElementById('photoDescription').value.trim();
        const imageFile = document.getElementById('photoImage').files[0];
        
        if (!imageFile || imageFile.size === 0) {
            throw new Error('Debes subir una imagen');
        }
        
        const photoData = {
            title: title || 'Foto sin título',
            description: description || ''
        };
        
        console.log('🔄 Subiendo imagen a Cloudinary...');
        const cloudinaryResult = await uploadToCloudinary(imageFile, 'drmalestar/photos');
        photoData.image = cloudinaryResult.url;
        
        await api.addPhoto(photoData);
        await loadPhotos();
        e.target.reset();
        clearPreview('photoPreview');
        notify(`✅ Foto agregada correctamente (${currentPhotos.length + 1}/8)`, 'success');
        
        // Actualizar estado del botón
        updatePhotoButtonState();
        
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
        } catch (error) {
        console.error('❌ Error agregando foto:', error);
        notify('Error agregando foto: ' + error.message, 'error');
    } finally {
        isSubmitting = false;
    }
}

// Actualizar estado del botón de agregar foto
async function updatePhotoButtonState() {
    try {
        const photos = await api.getPhotos();
        const addButton = photoForm?.querySelector('button[type="submit"]');
        if (addButton) {
            if (photos.length >= 8) {
                addButton.disabled = true;
                addButton.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Límite alcanzado (8/8)';
                addButton.className = 'btn btn-warning w-100';
            } else {
                addButton.disabled = false;
                addButton.innerHTML = '<i class="bi bi-plus-circle"></i> Agregar Foto';
                addButton.className = 'btn btn-admin w-100';
            }
        }
    } catch (error) {
        console.error('Error actualizando estado del botón:', error);
    }
}

async function deletePhoto(id) {
    if (!confirm('¿Estás seguro de eliminar esta foto?')) return;
    
    try {
        await api.deletePhoto(id);
        await loadPhotos();
        notify('Foto eliminada. Ya puedes agregar otra.', 'success');
        
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error eliminando foto:', error);
        notify('Error eliminando foto', 'error');
    }
}

// ===========================================
// VIDEOS
// ===========================================

async function loadVideos() {
    try {
        const videos = await api.getVideos();
        displayVideos(videos);
        updateVideoButtonState();
        
        // Mostrar contador
        const counter = document.getElementById('videosCounter');
        if (counter) {
            counter.textContent = `Videos: ${videos.length}/6`;
            if (videos.length >= 6) {
                counter.className = 'badge bg-warning';
            } else {
                counter.className = 'badge bg-info';
            }
        }
    } catch (error) {
        console.error('❌ Error cargando videos:', error);
        document.getElementById('videosList').innerHTML = '<p class="text-danger">Error cargando videos</p>';
    }
}

function displayVideos(videos) {
    const container = document.getElementById('videosList');
    if (videos.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">No hay videos disponibles</p>';
            return;
        }
        
    // Escapar HTML
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    };
    
    container.innerHTML = videos.map(video => {
        const title = escapeHtml(video.title || 'Sin título');
        const description = escapeHtml(video.description || '');
        const url = escapeHtml(video.url || '');
        const videoId = video.videoId || '';
        const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';
        
        return `
            <div class="admin-video-card" data-id="${video.id}">
                ${embedUrl ? `
                <div class="admin-video-thumbnail">
                    <iframe 
                        src="${embedUrl}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        loading="lazy"
                        style="width: 100%; height: 100%; border: none;">
                    </iframe>
            </div>
                ` : `
                <div class="admin-video-placeholder">
                    <i class="bi bi-youtube" style="font-size: 3rem; color: var(--primary-color);"></i>
            </div>
                `}
                <div class="admin-video-content">
                    <h5 class="admin-video-title">${title}</h5>
                    ${description ? `<p class="admin-video-description">${description}</p>` : ''}
                    <div class="admin-video-actions">
                        <a href="${url}" target="_blank" class="btn btn-secondary btn-sm">
                            <i class="bi bi-youtube"></i> Ver en YouTube
                        </a>
                        <button class="btn btn-danger-admin btn-sm" onclick="deleteVideo('${video.id}')">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
                    </div>
            </div>
        </div>
    `;
    }).join('');
}

async function handleVideoSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;
    
    try {
        // Verificar límite de videos (máximo 6)
        const currentVideos = await api.getVideos();
        if (currentVideos.length >= 6) {
            notify('❌ Límite alcanzado: Solo se pueden tener 6 videos. Elimina uno para agregar otro.', 'error');
            isSubmitting = false;
            return;
        }
        
        let url = document.getElementById('videoUrl').value.trim();
        const title = document.getElementById('videoTitle').value.trim();
        const description = document.getElementById('videoDescription').value.trim();
        
        if (!url) {
            throw new Error('Debes ingresar una URL de YouTube o el ID del video');
        }
        
        // Si es solo un ID (11 caracteres), convertir a URL completa
        const originalUrl = url;
        if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
            url = `https://www.youtube.com/watch?v=${url}`;
            console.log('🔄 ID detectado, convirtiendo a URL:', url);
        }
        
        // Validar que sea una URL de YouTube o un ID válido (antes de convertir)
        if (!url.includes('youtube.com') && !url.includes('youtu.be') && !/^[a-zA-Z0-9_-]{11}$/.test(originalUrl)) {
            throw new Error('Debes ingresar una URL válida de YouTube o el ID del video (11 caracteres)');
        }
        
        // Función mejorada para extraer ID del video de YouTube
        function extractYouTubeId(url) {
            if (!url) return null;
            
            // Limpiar URL
            let cleanUrl = url.trim();
            
            // Remover espacios y parámetros adicionales que puedan causar problemas
            if (cleanUrl.includes('&')) {
                cleanUrl = cleanUrl.split('&')[0];
            }
            if (cleanUrl.includes('?')) {
                const parts = cleanUrl.split('?');
                cleanUrl = parts[0] + (parts[1] ? '?' + parts[1].split('&')[0] : '');
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
                        return possibleId;
                    }
                }
            }
            
            // Si la URL contiene solo caracteres que parecen un ID de 11 caracteres
            const directIdMatch = cleanUrl.match(/([a-zA-Z0-9_-]{11})/);
            if (directIdMatch && directIdMatch[1].length === 11) {
                return directIdMatch[1];
            }
            
            return null;
        }
        
        // Extraer ID del video
        const videoId = extractYouTubeId(url);
        
        console.log('🔍 Extracción de ID de YouTube:', {
            urlOriginal: originalUrl,
            urlProcesada: url,
            videoIdExtraido: videoId,
            longitud: videoId ? videoId.length : 0
        });
        
        if (!videoId || videoId.length !== 11) {
            console.error('❌ URL de video inválida:', url, 'ID extraído:', videoId);
            throw new Error(`No se pudo extraer el ID del video de YouTube. 
            
URL recibida: ${url}
ID extraído: ${videoId || 'ninguno'}

Formato esperado:
- https://www.youtube.com/watch?v=VIDEO_ID
- https://youtu.be/VIDEO_ID
- VIDEO_ID (solo el ID de 11 caracteres)

Verifica que la URL sea válida y que el video esté disponible públicamente.`);
        }
        
        console.log('✅ Video ID válido extraído:', videoId);
        
        const videoData = {
            title: title || 'Video sin título',
            description: description || '',
            url: url,
            videoId: videoId
        };
        
        await api.addVideo(videoData);
        await loadVideos();
        e.target.reset();
        notify(`✅ Video agregado correctamente (${currentVideos.length + 1}/6)`, 'success');
        
        // Actualizar estado del botón
        updateVideoButtonState();
        
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error agregando video:', error);
        notify('Error agregando video: ' + error.message, 'error');
    } finally {
        isSubmitting = false;
    }
}

// Actualizar estado del botón de agregar video
async function updateVideoButtonState() {
    try {
        const videos = await api.getVideos();
        const addButton = videoForm?.querySelector('button[type="submit"]');
        if (addButton) {
            if (videos.length >= 6) {
                addButton.disabled = true;
                addButton.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Límite alcanzado (6/6)';
                addButton.className = 'btn btn-warning w-100';
            } else {
                addButton.disabled = false;
                addButton.innerHTML = '<i class="bi bi-plus-circle"></i> Agregar Video';
                addButton.className = 'btn btn-admin w-100';
            }
        }
    } catch (error) {
        console.error('Error actualizando estado del botón:', error);
    }
}

async function deleteVideo(id) {
    if (!confirm('¿Estás seguro de eliminar este video?')) return;
    
    try {
        await api.deleteVideo(id);
        await loadVideos();
        notify('Video eliminado. Ya puedes agregar otro.', 'success');
        
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
        } catch (error) {
        console.error('❌ Error eliminando video:', error);
        notify('Error eliminando video', 'error');
    }
}

// ===========================================
// CLOUDINARY
// ===========================================

async function uploadToCloudinary(file, folder = 'drmalestar') {
    const cloudName = window.CONFIG?.CLOUDINARY_CLOUD_NAME || 'daoo9nvfc';
    // Intentar diferentes presets desde config o usar defaults
    const uploadPresets = window.CONFIG?.CLOUDINARY_UPLOAD_PRESETS || ['drmalestar_upload', 'drmalestar', 'ml_default'];
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    let lastError = null;
    
    // Intentar con cada preset
    for (const preset of uploadPresets) {
        try {
            console.log(`🔄 Intentando subir con preset: ${preset}...`);
            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', preset);
            formData.append('folder', folder);
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Error con preset ${preset}:`, response.status, errorText);
                lastError = `HTTP ${response.status}: ${errorText}`;
                continue; // Intentar siguiente preset
            }
            
            const result = await response.json();
            console.log('✅ Imagen subida exitosamente:', result.secure_url);
            return { url: result.secure_url, publicId: result.public_id };
            
        } catch (error) {
            console.error(`❌ Error con preset ${preset}:`, error);
            lastError = error.message;
            continue;
        }
    }
    
    // Si todos los presets fallaron, usar base64 como fallback
    console.warn('⚠️ Cloudinary falló, usando base64 como fallback...');
    return await convertToBase64(file);
}

// Convertir imagen a base64 como fallback
async function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result;
            console.log('✅ Imagen convertida a base64');
            resolve({ 
                url: base64, 
                publicId: null,
                isBase64: true 
            });
        };
        reader.onerror = function() {
            reject(new Error('Error leyendo archivo'));
        };
        reader.readAsDataURL(file);
    });
}

// ===========================================
// UTILIDADES
// ===========================================

function clearPreview(id) {
    const preview = document.getElementById(id);
    if (preview) preview.innerHTML = '';
}

function notify(message, type = 'info') {
    // Crear notificación simple
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Funciones globales para llamadas desde HTML
window.deleteFlyer = deleteFlyer;
window.deletePhoto = deletePhoto;
window.deleteVideo = deleteVideo;
window.handleImageChange = function(input, previewId) {
    const file = input.files[0];
    if (!file) {
        clearPreview(previewId);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        if (preview) {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin-top: 10px;">`;
        }
    };
    reader.readAsDataURL(file);
};

console.log('✅ Admin Simplificado listo');