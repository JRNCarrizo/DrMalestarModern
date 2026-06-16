// ===========================================
// ADMIN SIMPLIFICADO - Dr.Malestar
// Panel de administración simple y funcional
// ===========================================

console.log('🔧 Admin Simplificado - Dr.Malestar cargado');

// Credenciales embebidas — el login no depende de que config.js cargue (caché / red)
const ADMIN_AUTH = {
    USER: 'drmalestar',
    PASS: 'drmalestar2013'
};

function getAdminCredentials() {
    return {
        user: (window.CONFIG?.ADMIN_USER || ADMIN_AUTH.USER).trim(),
        pass: window.CONFIG?.ADMIN_PASS || ADMIN_AUTH.PASS
    };
}

function isConfigLoaded() {
    return Boolean(window.CONFIG?.ADMIN_USER);
}

function updateConfigStatus() {
    const el = document.getElementById('loginConfigStatus');
    if (!el) return;
    if (isConfigLoaded()) {
        el.hidden = true;
        el.textContent = '';
        return;
    }
    el.hidden = false;
    el.textContent = 'config.js no cargó — igual podés entrar con drmalestar / drmalestar2013';
}

// Estado
let isAuthenticated = false;
let isSubmitting = false;

// Estado de edición
let editingFlyerId = null;
let editingFlyerImage = null;
let editingPhotoId = null;
let editingPhotoImage = null;
let editingVideoId = null;
let editingDownloadId = null;
let editingDownloadFile = null;
let cachedFlyers = [];
let cachedPhotos = [];
let cachedVideos = [];
let cachedDownloads = [];

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Admin...');
    updateConfigStatus();
    if (!isConfigLoaded()) {
        console.warn('⚠️ config.js no cargó — login con credenciales embebidas');
    }
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
    document.querySelector('.admin-container')?.classList.add('admin-container--login');
    isAuthenticated = false;
    updateConfigStatus();
    // No resetear contraseña acá: setPasswordVisible aún no está listo en el primer paint
}

// Mostrar panel de admin
async function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.querySelector('.admin-container')?.classList.remove('admin-container--login');
    isAuthenticated = true;
    await loadAllContent();
}

function setupAdminPanelTabs() {
    const tabs = document.querySelectorAll('.admin-panel-tab');
    const sections = document.querySelectorAll('.admin-panel-section');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sectionKey = tab.dataset.section;
            const sectionId = `adminSection${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}`;

            tabs.forEach(t => {
                const isActive = t === tab;
                t.classList.toggle('active', isActive);
                t.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            sections.forEach(section => {
                const isActive = section.id === sectionId;
                section.classList.toggle('active', isActive);
                if (isActive) {
                    section.removeAttribute('hidden');
                } else {
                    section.setAttribute('hidden', '');
                }
            });
        });
    });
}

function switchAdminTab(sectionKey) {
    const tab = document.querySelector(`.admin-panel-tab[data-section="${sectionKey}"]`);
    if (tab) tab.click();
}

function updateSectionCounter(elementId, count, max) {
    const counter = document.getElementById(elementId);
    if (!counter) return;
    counter.textContent = `${count}/${max}`;
    counter.classList.toggle('admin-panel-tab-count--full', count >= max);
}

function setSubmitButtonContent(form, faceHtml) {
    const btn = form?.querySelector('button[type="submit"]');
    if (!btn) return;
    const face = btn.querySelector('.admin-console-btn-face');
    if (!face) return;
    if (!btn.dataset.defaultText) {
        btn.dataset.defaultText = face.innerHTML;
    }
    face.innerHTML = faceHtml;
}

function resetSubmitButton(form, fallbackHtml) {
    const btn = form?.querySelector('button[type="submit"]');
    if (!btn) return;
    const face = btn.querySelector('.admin-console-btn-face');
    if (!face) return;
    face.innerHTML = btn.dataset.defaultText || fallbackHtml;
    btn.disabled = false;
    btn.className = 'admin-console-btn admin-console-btn--primary';
}

// Configurar event listeners
function setupEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    setupPasswordToggle();
    setupAdminPanelTabs();
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Formularios
    document.getElementById('flyerForm').addEventListener('submit', handleFlyerSubmit);
    document.getElementById('photoForm').addEventListener('submit', handlePhotoSubmit);
    document.getElementById('videoForm').addEventListener('submit', handleVideoSubmit);
    document.getElementById('downloadForm').addEventListener('submit', handleDownloadSubmit);

    setupAdminFilePreviews();
    
    // Sync button
    const syncBtn = document.getElementById('syncBtn');
    if (syncBtn) {
        syncBtn.addEventListener('click', async () => {
            await loadAllContent();
            notify('Contenido recargado', 'success');
        });
    }
}

function setupPasswordToggle() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const passwordReveal = document.getElementById('passwordReveal');
    const passwordFields = document.getElementById('passwordFields');
    if (!togglePassword || !passwordInput || !passwordReveal || !passwordFields) return;

    passwordInput.addEventListener('input', function() {
        if (passwordFields.classList.contains('is-revealed')) {
            passwordReveal.value = passwordInput.value;
        }
    });

    passwordInput.addEventListener('animationstart', function(e) {
        if (e.animationName === 'adminAutofillStart') {
            passwordReveal.value = passwordInput.value;
        }
    });

    passwordReveal.addEventListener('input', function() {
        passwordInput.value = passwordReveal.value;
    });

    togglePassword.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const show = !passwordFields.classList.contains('is-revealed');
        setPasswordVisible(show);
    });
}

function setPasswordVisible(show) {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const passwordReveal = document.getElementById('passwordReveal');
    const passwordFields = document.getElementById('passwordFields');
    if (!togglePassword || !passwordInput || !passwordReveal || !passwordFields) return;

    if (show) {
        passwordReveal.value = passwordInput.value;
        passwordFields.classList.add('is-revealed');
        passwordReveal.tabIndex = 0;
        passwordReveal.focus();
        const len = passwordReveal.value.length;
        passwordReveal.setSelectionRange(len, len);
    } else {
        passwordInput.value = passwordReveal.value;
        passwordFields.classList.remove('is-revealed');
        passwordReveal.tabIndex = -1;
        passwordInput.focus();
    }

    togglePassword.setAttribute('aria-pressed', show ? 'true' : 'false');
    togglePassword.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
    togglePassword.setAttribute('title', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
    const icon = togglePassword.querySelector('i');
    if (icon) {
        icon.className = show ? 'bi bi-eye-slash' : 'bi bi-eye';
    }
}

function getLoginPassword() {
    syncPasswordFields();
    const passwordFields = document.getElementById('passwordFields');
    const passwordReveal = document.getElementById('passwordReveal');
    const passwordInput = document.getElementById('password');
    if (passwordFields?.classList.contains('is-revealed') && passwordReveal) {
        return passwordReveal.value;
    }
    return passwordInput ? passwordInput.value : '';
}

function syncPasswordFields() {
    const passwordFields = document.getElementById('passwordFields');
    const passwordReveal = document.getElementById('passwordReveal');
    const passwordInput = document.getElementById('password');
    if (!passwordFields || !passwordReveal || !passwordInput) return;
    if (passwordFields.classList.contains('is-revealed')) {
        passwordInput.value = passwordReveal.value;
    } else {
        passwordReveal.value = passwordInput.value;
    }
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    syncPasswordFields();
    const username = document.getElementById('username').value.trim();
    const password = getLoginPassword();

    const { user: validUser, pass: validPass } = getAdminCredentials();

    const userOk = username.toLowerCase() === validUser.toLowerCase();
    const passOk = password === validPass;

    if (userOk && passOk) {
        clearLoginError();
        localStorage.setItem('adminAuthenticated', 'true');
        showAdminPanel();
        notify('Sesión iniciada', 'success');
        return;
    }

    const hint = isConfigLoaded()
        ? 'Usuario o contraseña incorrectos.'
        : 'Usuario o contraseña incorrectos. (config.js no cargó — probá drmalestar / drmalestar2013)';
    showLoginError(hint);
    notify('Credenciales incorrectas', 'error');
}

function showLoginError(message) {
    const el = document.getElementById('loginError');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
}

function clearLoginError() {
    const el = document.getElementById('loginError');
    if (!el) return;
    el.textContent = '';
    el.hidden = true;
}

// Manejar logout
function handleLogout() {
    localStorage.removeItem('adminAuthenticated');
    showLoginForm();
    setPasswordVisible(false);
    notify('Sesión cerrada', 'info');
}

// Cargar todo el contenido
async function loadAllContent() {
    try {
        await Promise.all([
            loadFlyers(),
            loadPhotos(),
            loadVideos(),
            loadDownloads()
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
        
        updateSectionCounter('flyersCounter', flyers.length, 6);
        } catch (error) {
        console.error('❌ Error cargando flyers:', error);
        document.getElementById('flyersList').innerHTML = '<p class="admin-empty-state admin-empty-state--error"><i class="bi bi-exclamation-triangle"></i> Error cargando flyers</p>';
    }
}

function displayFlyers(flyers) {
    const container = document.getElementById('flyersList');
    cachedFlyers = Array.isArray(flyers) ? flyers.map(f => ({ ...f })) : [];

    if (!container) return;

    if (cachedFlyers.length === 0) {
        container.innerHTML = '<p class="admin-empty-state admin-empty-state--grid"><i class="bi bi-calendar-x"></i> No hay flyers publicados todavía.</p>';
        return;
    }

    if (window.FlyerRender) {
        container.innerHTML = FlyerRender.buildFlyerGrid(cachedFlyers, {
            adminList: true,
            adminContext: true
        });
    } else {
        container.innerHTML = '<p class="admin-empty-state admin-empty-state--error">No se pudo cargar la vista de cartelera.</p>';
    }
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
    const cancelBtn = document.getElementById('flyerCancelEdit');
    const imageInput = document.getElementById('flyerImage');

    if (titleInput) titleInput.value = flyer.title || '';
    if (dateInput) dateInput.value = flyer.date || '';
    if (timeInput) timeInput.value = flyer.time || '';
    if (locationInput) locationInput.value = flyer.location || '';
    if (descriptionInput) descriptionInput.value = flyer.description || '';
    if (imageInput) imageInput.value = '';
    if (form) {
        setSubmitButtonContent(form, '<i class="bi bi-save"></i> GUARDAR CAMBIOS');
    }
    if (cancelBtn) cancelBtn.classList.remove('d-none');

    showAdminFilePreview('flyerPreview', editingFlyerImage);

    switchAdminTab('flyers');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    notify('Editando flyer. Realiza los cambios y guarda.', 'info');
}

function cancelFlyerEdit(showMessage = true) {
    editingFlyerId = null;
    editingFlyerImage = null;

    const form = document.getElementById('flyerForm');
    if (form) {
        form.reset();
        resetSubmitButton(form, '<i class="bi bi-plus-lg"></i> AGREGAR FLYER');
    }

    const cancelBtn = document.getElementById('flyerCancelEdit');
    if (cancelBtn) cancelBtn.classList.add('d-none');

    const imageInput = document.getElementById('flyerImage');
    if (imageInput) imageInput.value = '';
    clearPreview('flyerPreview');

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
        if (!addButton || editingFlyerId) return;

        if (flyers.length >= 6) {
            addButton.disabled = true;
            setSubmitButtonContent(form, '<i class="bi bi-exclamation-triangle"></i> LÍMITE 6/6');
        } else {
            resetSubmitButton(form, '<i class="bi bi-plus-lg"></i> AGREGAR FLYER');
        }
    } catch (error) {
        console.error('Error actualizando estado del botón:', error);
    }
}

async function moveFlyer(id, direction) {
    if (!id || !direction) return;
    try {
        await api.moveFlyer(id, direction);
        await loadFlyers();
        notify('Orden de cartelera actualizado', 'success');
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error moviendo flyer:', error);
        notify('No se pudo cambiar la posición', 'error');
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
        
        updateSectionCounter('photosCounter', photos.length, 10);
    } catch (error) {
        console.error('❌ Error cargando fotos:', error);
        document.getElementById('photosList').innerHTML = '<p class="admin-empty-state admin-empty-state--error"><i class="bi bi-exclamation-triangle"></i> Error cargando fotos</p>';
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
        container.innerHTML = '<p class="admin-empty-state admin-empty-state--grid"><i class="bi bi-image"></i> No hay fotos en la galería todavía.</p>';
        return;
    }

    if (window.PhotoRender) {
        container.innerHTML = PhotoRender.buildPhotoGrid(cachedPhotos, {
            adminList: true,
            adminContext: true
        });
    } else {
        container.innerHTML = '<p class="admin-empty-state admin-empty-state--error">No se pudo cargar la vista de galería.</p>';
    }
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
    const cancelBtn = document.getElementById('photoCancelEdit');

    if (titleInput) titleInput.value = photo.title || '';
    if (descriptionInput) descriptionInput.value = photo.description || '';
    if (imageInput) imageInput.value = '';
    if (form) {
        setSubmitButtonContent(form, '<i class="bi bi-save"></i> GUARDAR CAMBIOS');
    }
    if (cancelBtn) cancelBtn.classList.remove('d-none');

    showAdminFilePreview('photoPreview', editingPhotoImage);

    switchAdminTab('photos');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    notify('Editando foto. Realiza los cambios y guarda.', 'info');
}

function cancelPhotoEdit(showMessage = true) {
    editingPhotoId = null;
    editingPhotoImage = null;

    const form = document.getElementById('photoForm');
    if (form) {
        form.reset();
        resetSubmitButton(form, '<i class="bi bi-plus-lg"></i> AGREGAR FOTO');
    }

    const cancelBtn = document.getElementById('photoCancelEdit');
    if (cancelBtn) cancelBtn.classList.add('d-none');

    const imageInput = document.getElementById('photoImage');
    if (imageInput) imageInput.value = '';
    clearPreview('photoPreview');

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
        if (!addButton || editingPhotoId) return;

        if (photos.length >= 10) {
            addButton.disabled = true;
            setSubmitButtonContent(form, '<i class="bi bi-exclamation-triangle"></i> LÍMITE 10/10');
        } else {
            resetSubmitButton(form, '<i class="bi bi-plus-lg"></i> AGREGAR FOTO');
        }
    } catch (error) {
        console.error('Error actualizando estado del botón:', error);
    }
}

async function movePhoto(id, direction) {
    if (!id || !direction) return;
    try {
        await api.movePhoto(id, direction);
        await loadPhotos();
        notify('Orden de galería actualizado', 'success');
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error moviendo foto:', error);
        notify('No se pudo cambiar la posición', 'error');
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
        
        updateSectionCounter('videosCounter', videos.length, 8);
    } catch (error) {
        console.error('❌ Error cargando videos:', error);
        document.getElementById('videosList').innerHTML = '<p class="admin-empty-state admin-empty-state--error"><i class="bi bi-exclamation-triangle"></i> Error cargando videos</p>';
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
        container.innerHTML = '<p class="admin-empty-state admin-empty-state--grid"><i class="bi bi-play-btn"></i> No hay videos publicados todavía.</p>';
        return;
    }

    if (window.VideoRender) {
        container.innerHTML = VideoRender.buildVideoGrid(cachedVideos, {
            adminList: true,
            adminContext: true
        });
    } else {
        container.innerHTML = '<p class="admin-empty-state admin-empty-state--error">No se pudo cargar la vista de videos.</p>';
    }
}

async function moveVideo(id, direction) {
    try {
        await api.moveVideo(id, direction);
        await loadVideos();
        notify('Orden de videos actualizado', 'success');
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error moviendo video:', error);
        notify('No se pudo cambiar la posición', 'error');
    }
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
    if (form) {
        setSubmitButtonContent(form, '<i class="bi bi-save"></i> GUARDAR CAMBIOS');
    }
    if (cancelBtn) cancelBtn.classList.remove('d-none');

    switchAdminTab('videos');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    notify('Editando video. Realiza los cambios y guarda.', 'info');
}

function cancelVideoEdit(showMessage = true) {
    editingVideoId = null;

    const form = document.getElementById('videoForm');
    if (form) {
        form.reset();
        resetSubmitButton(form, '<i class="bi bi-plus-lg"></i> AGREGAR VIDEO');
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
        if (!addButton || editingVideoId) return;

        if (videos.length >= 8) {
            addButton.disabled = true;
            setSubmitButtonContent(form, '<i class="bi bi-exclamation-triangle"></i> LÍMITE 8/8');
        } else {
            resetSubmitButton(form, '<i class="bi bi-plus-lg"></i> AGREGAR VIDEO');
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
// DESCARGAS
// ===========================================

async function loadDownloads() {
    try {
        const downloads = await api.getDownloads();
        displayDownloads(downloads);
        updateDownloadButtonState();
        updateSectionCounter('downloadsCounter', downloads.length, 12);
    } catch (error) {
        console.error('❌ Error cargando descargas:', error);
        document.getElementById('downloadsList').innerHTML = '<p class="admin-empty-state admin-empty-state--error"><i class="bi bi-exclamation-triangle"></i> Error cargando descargas</p>';
    }
}

function displayDownloads(downloads) {
    const container = document.getElementById('downloadsList');
    cachedDownloads = Array.isArray(downloads) ? downloads.map(d => ({ ...d })) : [];

    if (!container) return;

    if (window.DownloadRender) {
        container.innerHTML = DownloadRender.buildAdminDownloadGrid(cachedDownloads);
        return;
    }

    container.innerHTML = '<p class="admin-empty-state admin-empty-state--error">Módulo de descargas no disponible.</p>';
}

function getDownloadById(id) {
    const fromCache = cachedDownloads.find(entry => entry.id === id);
    if (fromCache) return fromCache;
    if (window.DownloadRender && DownloadRender.isDefaultDownload({ id })) {
        return DownloadRender.getDefaultDownloads().find(entry => entry.id === id) || null;
    }
    return null;
}

function startDownloadEdit(id) {
    const item = getDownloadById(id);
    if (!item) {
        notify('No se encontró la descarga a editar.', 'error');
        return;
    }

    const isDefault = window.DownloadRender && DownloadRender.isDefaultDownload(item);

    editingDownloadId = isDefault ? null : id;
    editingDownloadFile = item.file || 'img/logoNuevo-malestar.png';

    const form = document.getElementById('downloadForm');
    const titleInput = document.getElementById('downloadTitle');
    const descriptionInput = document.getElementById('downloadDescription');
    const fileNameInput = document.getElementById('downloadFileName');
    const fileInput = document.getElementById('downloadFile');
    const cancelBtn = document.getElementById('downloadCancelEdit');

    if (titleInput) titleInput.value = item.title || '';
    if (descriptionInput) descriptionInput.value = item.description || '';
    if (fileNameInput) fileNameInput.value = item.fileName || '';
    if (fileInput) fileInput.value = '';
    if (cancelBtn) cancelBtn.classList.remove('d-none');
    if (form) setSubmitButtonContent(form, isDefault ? '<i class="bi bi-plus-lg"></i> PUBLICAR DESCARGA' : '<i class="bi bi-save"></i> GUARDAR CAMBIOS');

    showAdminFilePreview('downloadPreview', editingDownloadFile, item.fileName || downloadFileNameFromPath(editingDownloadFile));

    switchAdminTab('downloads');
    notify(
        isDefault
            ? 'Completá el formulario para publicar esta descarga en la base de datos.'
            : 'Editando descarga. Realiza los cambios y guarda.',
        'info'
    );
}

function cancelDownloadEdit(showMessage = true) {
    editingDownloadId = null;
    editingDownloadFile = null;

    const form = document.getElementById('downloadForm');
    if (form) form.reset();
    const cancelBtn = document.getElementById('downloadCancelEdit');
    if (cancelBtn) cancelBtn.classList.add('d-none');
    const fileInput = document.getElementById('downloadFile');
    if (fileInput) fileInput.value = '';
    clearPreview('downloadPreview');

    resetSubmitButton(form, '<i class="bi bi-plus-lg"></i> AGREGAR DESCARGA');
    updateDownloadButtonState();

    if (showMessage) {
        notify('Edición de descarga cancelada', 'info');
    }
}

async function handleDownloadSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;

    try {
        const isEditing = Boolean(editingDownloadId);
        let currentDownloads = [];

        if (!isEditing) {
            currentDownloads = await api.getDownloads();
            if (currentDownloads.length >= 12) {
                notify('❌ Límite alcanzado: Solo se pueden tener 12 descargas.', 'error');
                isSubmitting = false;
                return;
            }
        } else {
            currentDownloads = cachedDownloads;
        }

        const title = document.getElementById('downloadTitle').value.trim();
        const description = document.getElementById('downloadDescription').value.trim();
        const fileName = document.getElementById('downloadFileName').value.trim();
        const fileInput = document.getElementById('downloadFile');
        const file = fileInput?.files?.[0];

        if (!title) {
            notify('El título es obligatorio', 'error');
            isSubmitting = false;
            return;
        }

        if (!isEditing && !file && !editingDownloadFile) {
            notify('Seleccioná un archivo para subir', 'error');
            isSubmitting = false;
            return;
        }

        let finalFile = editingDownloadFile || '';

        if (file && file.size > 0) {
            console.log('🔄 Subiendo archivo de descarga a Cloudinary...');
            const cloudinaryResult = await uploadToCloudinary(file, 'drmalestar/photos');
            finalFile = cloudinaryResult.url;
        } else if (!isEditing && !finalFile) {
            throw new Error('Debes subir un archivo');
        }

        if (!finalFile) {
            throw new Error('No se pudo obtener el archivo para guardar');
        }

        const downloadData = {
            title,
            description,
            file: finalFile
        };

        if (fileName) {
            downloadData.fileName = fileName;
        } else if (file) {
            downloadData.fileName = file.name;
        }

        if (isEditing) {
            await api.updateDownload(editingDownloadId, downloadData);
            await loadDownloads();
            notify('✅ Descarga actualizada correctamente', 'success');
            cancelDownloadEdit(false);
        } else {
            await api.addDownload(downloadData);
            await loadDownloads();
            document.getElementById('downloadForm').reset();
            clearPreview('downloadPreview');
            notify(`✅ Descarga agregada correctamente (${currentDownloads.length + 1}/12)`, 'success');
        }

        updateDownloadButtonState();

        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error guardando descarga:', error);
        notify('Error guardando descarga: ' + error.message, 'error');
    } finally {
        if (document.getElementById('downloadFile')) {
            document.getElementById('downloadFile').value = '';
        }
        isSubmitting = false;
    }
}

async function updateDownloadButtonState() {
    try {
        const downloads = await api.getDownloads();
        const form = document.getElementById('downloadForm');
        const addButton = form?.querySelector('button[type="submit"]');
        if (!addButton || editingDownloadId) return;

        if (downloads.length >= 12) {
            addButton.disabled = true;
            setSubmitButtonContent(form, '<i class="bi bi-exclamation-triangle"></i> LÍMITE 12/12');
        } else {
            resetSubmitButton(form, '<i class="bi bi-plus-lg"></i> AGREGAR DESCARGA');
        }
    } catch (error) {
        console.error('Error actualizando estado del botón de descargas:', error);
    }
}

async function moveDownload(id, direction) {
    if (!id || !direction) return;
    try {
        await api.moveDownload(id, direction);
        await loadDownloads();
        notify('Orden de descargas actualizado', 'success');
        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error moviendo descarga:', error);
        notify('No se pudo cambiar la posición', 'error');
    }
}

async function deleteDownload(id) {
    if (window.DownloadRender && DownloadRender.isDefaultDownload({ id })) {
        notify('Este logo es el contenido por defecto del sitio. Publicá una descarga nueva si querés reemplazarlo.', 'info');
        return;
    }

    if (!confirm('¿Estás seguro de eliminar esta descarga?')) return;

    try {
        await api.deleteDownload(id);
        await loadDownloads();
        notify('Descarga eliminada.', 'success');

        if (window.opener) {
            window.opener.postMessage('contentUpdated', '*');
        }
    } catch (error) {
        console.error('❌ Error eliminando descarga:', error);
        notify('Error eliminando descarga', 'error');
    }
}

// ===========================================
// CLOUDINARY
// ===========================================

async function uploadToCloudinary(file, folder = 'drmalestar') {
    const cloudName = window.CONFIG?.CLOUDINARY_CLOUD_NAME || 'daoo9nvfc';
    const uploadPresets = window.CONFIG?.CLOUDINARY_UPLOAD_PRESETS || ['drmalestar_upload', 'drmalestar', 'ml_default'];
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
    const resourceType = isPdf ? 'raw' : 'image';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    const foldersToTry = Array.from(new Set([
        folder,
        'drmalestar/photos',
        'drmalestar/flyers',
        'drmalestar'
    ].filter(Boolean)));

    let lastError = null;

    for (const targetFolder of foldersToTry) {
        for (const preset of uploadPresets) {
            try {
                console.log(`🔄 Subiendo a Cloudinary (${resourceType}, carpeta: ${targetFolder}, preset: ${preset})...`);

                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', preset);
                formData.append('folder', targetFolder);

                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`❌ Error con carpeta ${targetFolder} / preset ${preset}:`, response.status, errorText);
                    lastError = `HTTP ${response.status}: ${errorText}`;
                    continue;
                }

                const result = await response.json();
                const fileUrl = result.secure_url || result.url;
                if (!fileUrl) {
                    lastError = 'Cloudinary no devolvió URL del archivo';
                    continue;
                }

                console.log('✅ Archivo subido exitosamente:', fileUrl);
                return {
                    url: fileUrl,
                    secure_url: fileUrl,
                    publicId: result.public_id
                };
            } catch (error) {
                console.error(`❌ Error con carpeta ${targetFolder} / preset ${preset}:`, error);
                lastError = error.message;
            }
        }
    }

    if (isPdf) {
        throw new Error(lastError || 'No se pudo subir el PDF a Cloudinary. Verificá el preset de subida.');
    }

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

function downloadFileNameFromPath(path) {
    if (!path) return '';
    const parts = String(path).split('/');
    return parts[parts.length - 1] || '';
}

function isPdfSource(source, fileName) {
    const name = fileName || (typeof source === 'string' ? source : source?.name) || '';
    const type = typeof source === 'object' && source ? source.type : '';
    return type === 'application/pdf' || /\.pdf$/i.test(name);
}

function isImageSource(source, fileName) {
    const name = fileName || (typeof source === 'string' ? source : source?.name) || '';
    const type = typeof source === 'object' && source ? source.type : '';
    if (type && type.startsWith('image/')) return true;
    return /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i.test(name);
}

function resolveAdminPreviewSrc(path) {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    if (path.startsWith('img/')) return `../${path}`;
    if (path.startsWith('/img/')) return `..${path}`;
    return path;
}

function renderAdminFilePreviewMarkup(source, fileName) {
    const label = fileName || downloadFileNameFromPath(typeof source === 'string' ? source : source?.name) || 'Archivo seleccionado';

    if (isPdfSource(source, fileName)) {
        return `
            <div class="admin-console-preview-file">
                <i class="bi bi-file-earmark-pdf" aria-hidden="true"></i>
                <span>${label}</span>
            </div>
        `;
    }

    if (typeof source === 'string') {
        const src = resolveAdminPreviewSrc(source);
        const fallback = resolveAdminPreviewSrc('img/logoNuevo-malestar.png');
        return `<img src="${src}" alt="Vista previa de ${label}" onerror="this.src='${fallback}'">`;
    }

    return '';
}

function showAdminFilePreview(previewId, source, fileName) {
    const preview = document.getElementById(previewId);
    if (!preview) return;

    if (!source) {
        preview.innerHTML = '';
        return;
    }

    if (source instanceof File || (typeof source === 'object' && source && 'size' in source && 'name' in source)) {
        const file = source;
        if (isPdfSource(file)) {
            preview.innerHTML = renderAdminFilePreviewMarkup(file, file.name);
            return;
        }
        if (!isImageSource(file)) {
            preview.innerHTML = `
                <div class="admin-console-preview-file">
                    <i class="bi bi-file-earmark" aria-hidden="true"></i>
                    <span>${file.name}</span>
                </div>
            `;
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Vista previa de ${file.name}">`;
        };
        reader.readAsDataURL(file);
        return;
    }

    if (typeof source === 'string') {
        if (isPdfSource(source, fileName)) {
            preview.innerHTML = renderAdminFilePreviewMarkup(source, fileName);
            return;
        }
        preview.innerHTML = renderAdminFilePreviewMarkup(source, fileName);
    }
}

function handleAdminFileInputChange(input, previewId) {
    if (!input || !input.files || input.files.length === 0) {
        clearPreview(previewId);
        return;
    }

    showAdminFilePreview(previewId, input.files[0]);
}

function setupAdminFilePreviews() {
    const bindings = [
        { inputId: 'flyerImage', previewId: 'flyerPreview' },
        { inputId: 'photoImage', previewId: 'photoPreview' },
        { inputId: 'downloadFile', previewId: 'downloadPreview' }
    ];

    bindings.forEach(function(binding) {
        const input = document.getElementById(binding.inputId);
        if (!input) return;
        input.addEventListener('change', function() {
            handleAdminFileInputChange(input, binding.previewId);
        });
    });
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
window.moveFlyer = moveFlyer;
window.movePhoto = movePhoto;
window.moveVideo = moveVideo;
window.deletePhoto = deletePhoto;
window.deleteVideo = deleteVideo;
window.startFlyerEdit = startFlyerEdit;
window.cancelFlyerEdit = cancelFlyerEdit;
window.startPhotoEdit = startPhotoEdit;
window.cancelPhotoEdit = cancelPhotoEdit;
window.startVideoEdit = startVideoEdit;
window.cancelVideoEdit = cancelVideoEdit;
window.handleImageChange = function(input, previewId) {
    handleAdminFileInputChange(input, previewId);
};

console.log('✅ Admin Simplificado listo');