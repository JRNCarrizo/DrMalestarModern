// ===========================================
// ADMIN SIMPLIFICADO - Dr.Malestar
// Panel de administración simple y funcional
// ===========================================

console.log('🔧 Admin Simplificado - Dr.Malestar cargado');

// Estado
let isAuthenticated = false;
let isSubmitting = false;

// Estado de edición
let editingFlyerId = null;
let editingFlyerImage = null;
let editingPhotoId = null;
let editingPhotoImage = null;
let editingVideoId = null;
let cachedFlyers = [];
let cachedPhotos = [];
let cachedVideos = [];

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
            counter.textContent = `Flyers: ${flyers.length}/6`;
            if (flyers.length >= 6) {
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
    cachedFlyers = Array.isArray(flyers) ? flyers.map(f => ({ ...f })) : [];

    if (!container) return;

    if (cachedFlyers.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">No hay flyers disponibles</p>';
        return;
    }
    
    // Escapar HTML para evitar problemas
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    };
    
    container.innerHTML = cachedFlyers.map(flyer => {
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
                    <div class="admin-flyer-actions d-flex flex-wrap gap-2">
                        <button class="btn btn-outline-secondary btn-sm" onclick="startFlyerEdit('${flyer.id}')">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button class="btn btn-danger-admin btn-sm" onclick="deleteFlyer('${flyer.id}')">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function startFlyerEdit(id) {
    const flyer = cachedFlyers.find(item => item.id === id);
    if (!flyer) {
        notify('No se encontró la información del flyer a editar.', 'error');
        return;
    }

    editingFlyerId = id;
    editingFlyerImage = flyer.image || 'img/bluseraflier.jpg';

    const form = document.getElementById('flyerForm');
    if (!form) return;

    const titleInput = document.getElementById('flyerTitle');
    const dateInput = document.getElementById('flyerDate');
    const timeInput = document.getElementById('flyerTime');
    const locationInput = document.getElementById('flyerLocation');
    const descriptionInput = document.getElementById('flyerDescription');
    const preview = document.getElementById('flyerPreview');
    const submitBtn = form.querySelector('button[type="submit"]');
    const cancelBtn = document.getElementById('flyerCancelEdit');
    const imageInput = document.getElementById('flyerImage');

    if (titleInput) titleInput.value = flyer.title || '';
    if (dateInput) dateInput.value = flyer.date || '';
    if (timeInput) timeInput.value = flyer.time || '';
    if (locationInput) locationInput.value = flyer.location || '';
    if (descriptionInput) descriptionInput.value = flyer.description || '';
    if (imageInput) imageInput.value = '';
    if (preview) {
        preview.innerHTML = flyer.image ? `<img src="${flyer.image}" alt="${flyer.title || ''}" class="img-fluid rounded shadow-sm">` : '';
    }
    if (submitBtn) {
        if (!submitBtn.dataset.defaultText) {
            submitBtn.dataset.defaultText = submitBtn.innerHTML;
        }
        submitBtn.innerHTML = '<i class="bi bi-save"></i> Guardar cambios';
    }
    if (cancelBtn) cancelBtn.classList.remove('d-none');

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    notify('Editando flyer. Realiza los cambios y guarda.', 'info');
}

function cancelFlyerEdit(showMessage = true) {
    editingFlyerId = null;
    editingFlyerImage = null;

    const form = document.getElementById('flyerForm');
    if (form) {
        form.reset();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = submitBtn.dataset.defaultText || 'Agregar Flyer';
        }
    }

    clearPreview('flyerPreview');
    const cancelBtn = document.getElementById('flyerCancelEdit');
    if (cancelBtn) cancelBtn.classList.add('d-none');

    const imageInput = document.getElementById('flyerImage');
    if (imageInput) imageInput.value = '';

    updateFlyerButtonState();

    if (showMessage) {
        notify('Edición de flyer cancelada', 'info');
    }
}

async function handleFlyerSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;
    
    try {
        const isEditing = Boolean(editingFlyerId);
        let currentFlyers = [];
        
        if (!isEditing) {
            currentFlyers = await api.getFlyers();
            if (currentFlyers.length >= 6) {
                notify('❌ Límite alcanzado: Solo se pueden tener 6 flyers. Elimina uno para agregar otro.', 'error');
                isSubmitting = false;
                return;
            }
        } else {
            currentFlyers = cachedFlyers;
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
        let finalImage = editingFlyerImage || 'img/bluseraflier.jpg';
        
        if (imageFile && imageFile.size > 0) {
            console.log('🔄 Subiendo imagen a Cloudinary...');
            const cloudinaryResult = await uploadToCloudinary(imageFile, 'drmalestar/flyers');
            finalImage = cloudinaryResult.url;
        } else if (!isEditing) {
            finalImage = 'img/bluseraflier.jpg';
        }
        
        flyerData.image = finalImage;
        
        if (isEditing) {
            await api.updateFlyer(editingFlyerId, flyerData);
            await loadFlyers();
            notify('✅ Flyer actualizado correctamente', 'success');
            cancelFlyerEdit(false);
            updateFlyerButtonState();
        } else {
            await api.addFlyer(flyerData);
            await loadFlyers();
            e.target.reset();
            clearPreview('flyerPreview');
            notify(`✅ Flyer agregado correctamente (${currentFlyers.length + 1}/6)`, 'success');
            updateFlyerButtonState();
        }
        
        // Notificar a la página principal
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
        } catch (error) {
        console.error('❌ Error guardando flyer:', error);
        notify('Error guardando flyer: ' + error.message, 'error');
    } finally {
        isSubmitting = false;
    }
}

// Actualizar estado del botón de agregar flyer
async function updateFlyerButtonState() {
    try {
        const flyers = await api.getFlyers();
        const form = document.getElementById('flyerForm');
        const addButton = form?.querySelector('button[type="submit"]');
        if (addButton && !addButton.dataset.defaultText) {
            addButton.dataset.defaultText = addButton.innerHTML;
        }
        if (addButton && !editingFlyerId) {
            if (flyers.length >= 6) {
                addButton.disabled = true;
                addButton.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Límite alcanzado (6/6)';
                addButton.className = 'btn btn-warning w-100';
        } else {
                addButton.disabled = false;
                addButton.innerHTML = addButton.dataset.defaultText;
                addButton.className = 'btn btn-admin';
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
            counter.textContent = `Fotos: ${photos.length}/10`;
            if (photos.length >= 10) {
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
    cachedPhotos = Array.isArray(photos) ? photos.map(p => ({ ...p })) : [];
    if (!container) {
        console.error('❌ Contenedor de fotos no encontrado');
        return;
    }
    
    if (!Array.isArray(cachedPhotos) || cachedPhotos.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">No hay fotos disponibles</p>';
            return;
        }
        
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    };
    
    container.innerHTML = cachedPhotos.map(photo => {
        const title = escapeHtml(photo.title || 'Sin título');
        const description = photo.description ? escapeHtml(photo.description) : '';
        const image = photo.image || 'img/bluseraflier.jpg';
        
        return `
            <div class="admin-photo-card" data-id="${photo.id}">
                <div class="admin-photo-image-wrapper">
                    <img src="${image}" class="admin-photo-image" alt="${title}" onerror="this.src='img/bluseraflier.jpg'">
                    <div class="admin-photo-overlay">
                        <div class="d-flex flex-column gap-2">
                            <button class="btn btn-outline-secondary btn-sm" onclick="startPhotoEdit('${photo.id}')">
                                <i class="bi bi-pencil-square"></i> Editar
                            </button>
                            <button class="btn btn-danger-admin btn-sm" onclick="deletePhoto('${photo.id}')">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
                        </div>
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

function startPhotoEdit(id) {
    const photo = cachedPhotos.find(item => item.id === id);
    if (!photo) {
        notify('No se encontró la información de la foto a editar.', 'error');
        return;
    }

    editingPhotoId = id;
    editingPhotoImage = photo.image || 'img/bluseraflier.jpg';

    const form = document.getElementById('photoForm');
    if (!form) return;

    const titleInput = document.getElementById('photoTitle');
    const descriptionInput = document.getElementById('photoDescription');
    const imageInput = document.getElementById('photoImage');
    const preview = document.getElementById('photoPreview');
    const submitBtn = form.querySelector('button[type="submit"]');
    const cancelBtn = document.getElementById('photoCancelEdit');

    if (titleInput) titleInput.value = photo.title || '';
    if (descriptionInput) descriptionInput.value = photo.description || '';
    if (imageInput) imageInput.value = '';
    if (preview) {
        preview.innerHTML = photo.image ? `<img src="${photo.image}" alt="${photo.title || ''}" class="img-fluid rounded shadow-sm">` : '';
    }
    if (submitBtn) {
        if (!submitBtn.dataset.defaultText) {
            submitBtn.dataset.defaultText = submitBtn.innerHTML;
        }
        submitBtn.innerHTML = '<i class="bi bi-save"></i> Guardar cambios';
    }
    if (cancelBtn) cancelBtn.classList.remove('d-none');

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    notify('Editando foto. Realiza los cambios y guarda.', 'info');
}

function cancelPhotoEdit(showMessage = true) {
    editingPhotoId = null;
    editingPhotoImage = null;

    const form = document.getElementById('photoForm');
    if (form) {
        form.reset();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = submitBtn.dataset.defaultText || 'Agregar Foto';
        }
    }

    clearPreview('photoPreview');
    const cancelBtn = document.getElementById('photoCancelEdit');
    if (cancelBtn) cancelBtn.classList.add('d-none');

    const imageInput = document.getElementById('photoImage');
    if (imageInput) imageInput.value = '';

    updatePhotoButtonState();

    if (showMessage) {
        notify('Edición de foto cancelada', 'info');
    }
}

async function handlePhotoSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;
    
    try {
        const isEditing = Boolean(editingPhotoId);
        let currentPhotos = [];
        if (!isEditing) {
            currentPhotos = await api.getPhotos();
            if (currentPhotos.length >= 10) {
                notify('❌ Límite alcanzado: Solo se pueden tener 10 fotos. Elimina una para agregar otra.', 'error');
                isSubmitting = false;
                return;
            }
        } else {
            currentPhotos = cachedPhotos;
        }
        
        const title = document.getElementById('photoTitle').value.trim();
        const description = document.getElementById('photoDescription').value.trim();
        const imageInput = document.getElementById('photoImage');
        const imageFile = imageInput?.files[0];
        
        let finalImage = editingPhotoImage || '';
        
        if (imageFile && imageFile.size > 0) {
            console.log('🔄 Subiendo imagen a Cloudinary...');
            const cloudinaryResult = await uploadToCloudinary(imageFile, 'drmalestar/photos');
            finalImage = cloudinaryResult.url;
        } else if (!isEditing) {
            if (!finalImage) {
                throw new Error('Debes subir una imagen');
            }
        }
        
        const photoData = {
            title: title || 'Foto sin título',
            description: description || '',
            image: finalImage || editingPhotoImage || ''
        };
        
        if (isEditing) {
            await api.updatePhoto(editingPhotoId, photoData);
            await loadPhotos();
            notify('✅ Foto actualizada correctamente', 'success');
            cancelPhotoEdit(false);
            updatePhotoButtonState();
        } else {
            await api.addPhoto(photoData);
            await loadPhotos();
        e.target.reset();
            clearPreview('photoPreview');
            notify(`✅ Foto agregada correctamente (${currentPhotos.length + 1}/10)`, 'success');
            updatePhotoButtonState();
        }
        
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error guardando foto:', error);
        notify('Error guardando foto: ' + error.message, 'error');
    } finally {
        if (document.getElementById('photoImage')) {
            document.getElementById('photoImage').value = '';
        }
        isSubmitting = false;
    }
}

// Actualizar estado del botón de agregar foto
async function updatePhotoButtonState() {
    try {
        const photos = await api.getPhotos();
        const form = document.getElementById('photoForm');
        const addButton = form?.querySelector('button[type="submit"]');
        if (addButton && !addButton.dataset.defaultText) {
            addButton.dataset.defaultText = addButton.innerHTML;
        }
        if (addButton && !editingPhotoId) {
            if (photos.length >= 10) {
                addButton.disabled = true;
                addButton.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Límite alcanzado (10/10)';
                addButton.className = 'btn btn-warning w-100';
            } else {
                addButton.disabled = false;
                addButton.innerHTML = addButton.dataset.defaultText;
                addButton.className = 'btn btn-admin';
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
            counter.textContent = `Videos: ${videos.length}/8`;
            if (videos.length >= 8) {
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
    cachedVideos = Array.isArray(videos) ? videos.map(v => ({ ...v })) : [];
    if (!container) {
        console.error('❌ Contenedor de videos no encontrado');
        return;
    }
    if (cachedVideos.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">No hay videos disponibles</p>';
        return;
    }
    
    // Escapar HTML
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    };
    
    container.innerHTML = cachedVideos.map(video => {
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
                    <div class="admin-video-actions d-flex flex-wrap gap-2">
                        <a href="${url}" target="_blank" class="btn btn-secondary btn-sm">
                            <i class="bi bi-youtube"></i> Ver en YouTube
                        </a>
                        <button class="btn btn-outline-secondary btn-sm" onclick="startVideoEdit('${video.id}')">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button class="btn btn-danger-admin btn-sm" onclick="deleteVideo('${video.id}')">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
                    </div>
            </div>
        </div>
    `;
    }).join('');
}

function startVideoEdit(id) {
    const video = cachedVideos.find(item => item.id === id);
    if (!video) {
        notify('No se encontró la información del video a editar.', 'error');
        return;
    }

    editingVideoId = id;

    const form = document.getElementById('videoForm');
    if (!form) return;

    const titleInput = document.getElementById('videoTitle');
    const descriptionInput = document.getElementById('videoDescription');
    const urlInput = document.getElementById('videoUrl');
    const submitBtn = form.querySelector('button[type="submit"]');
    const cancelBtn = document.getElementById('videoCancelEdit');

    if (titleInput) titleInput.value = video.title || '';
    if (descriptionInput) descriptionInput.value = video.description || '';
    if (urlInput) urlInput.value = video.url || video.videoId || '';
    if (submitBtn) {
        if (!submitBtn.dataset.defaultText) {
            submitBtn.dataset.defaultText = submitBtn.innerHTML;
        }
        submitBtn.innerHTML = '<i class="bi bi-save"></i> Guardar cambios';
    }
    if (cancelBtn) cancelBtn.classList.remove('d-none');

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    notify('Editando video. Realiza los cambios y guarda.', 'info');
}

function cancelVideoEdit(showMessage = true) {
    editingVideoId = null;

    const form = document.getElementById('videoForm');
    if (form) {
        form.reset();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = submitBtn.dataset.defaultText || 'Agregar Video';
        }
    }

    const cancelBtn = document.getElementById('videoCancelEdit');
    if (cancelBtn) cancelBtn.classList.add('d-none');

    updateVideoButtonState();

    if (showMessage) {
        notify('Edición de video cancelada', 'info');
    }
}

async function handleVideoSubmit(e) {
            e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;
    
    try {
        const isEditing = Boolean(editingVideoId);
        let currentVideos = [];
        if (!isEditing) {
            currentVideos = await api.getVideos();
            if (currentVideos.length >= 8) {
                notify('❌ Límite alcanzado: Solo se pueden tener 8 videos. Elimina uno para agregar otro.', 'error');
                isSubmitting = false;
                return;
            }
        } else {
            currentVideos = cachedVideos;
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
            
            // Si la URL contiene solo caracteres que parecen un ID de 11 caracteres
            const directIdMatch = cleanUrl.match(/([a-zA-Z0-9_-]{11})/);
            if (directIdMatch && directIdMatch[1].length === 11) {
                return directIdMatch[1];
            }
            
            return null;
        }
        
        const videoId = extractYouTubeId(url);
        if (!videoId) {
            throw new Error('No se pudo extraer el ID del video de YouTube. Verifica la URL.');
        }
        
        const videoData = {
            title: title || 'Video sin título',
            description: description || '',
            url,
            videoId
        };
        
        if (isEditing) {
            await api.updateVideo(editingVideoId, videoData);
            await loadVideos();
            notify('✅ Video actualizado correctamente', 'success');
            cancelVideoEdit(false);
            updateVideoButtonState();
        } else {
            await api.addVideo(videoData);
            await loadVideos();
            e.target.reset();
            notify(`✅ Video agregado correctamente (${currentVideos.length + 1}/8)`, 'success');
            updateVideoButtonState();
        }
        
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error guardando video:', error);
        notify('Error guardando video: ' + error.message, 'error');
    } finally {
        isSubmitting = false;
    }
}

// Actualizar estado del botón de agregar video
async function updateVideoButtonState() {
    try {
        const videos = await api.getVideos();
        const form = document.getElementById('videoForm');
        const addButton = form?.querySelector('button[type="submit"]');
        if (addButton && !addButton.dataset.defaultText) {
            addButton.dataset.defaultText = addButton.innerHTML;
        }
        if (addButton && !editingVideoId) {
            if (videos.length >= 8) {
                addButton.disabled = true;
                addButton.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Límite alcanzado (8/8)';
                addButton.className = 'btn btn-warning w-100';
            } else {
                addButton.disabled = false;
                addButton.innerHTML = addButton.dataset.defaultText;
                addButton.className = 'btn btn-admin';
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
window.startFlyerEdit = startFlyerEdit;
window.cancelFlyerEdit = cancelFlyerEdit;
window.startPhotoEdit = startPhotoEdit;
window.cancelPhotoEdit = cancelPhotoEdit;
window.startVideoEdit = startVideoEdit;
window.cancelVideoEdit = cancelVideoEdit;
window.handleImageChange = function(input, previewId) {
    if (!input || !input.files || input.files.length === 0) {
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