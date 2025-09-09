// ===========================================
// CLOUDINARY UPLOAD - DR. MALESTAR
// ===========================================

import { CLOUDINARY_CONFIG, isCloudinaryConfigured, showCloudinaryConfigError } from './cloudinary-config.js';

// ===========================================
// FUNCIONES DE SUBIDA
// ===========================================

// Subir imagen a Cloudinary
export async function uploadImageToCloudinary(file, folder = 'drmalestar') {
    try {
        if (!isCloudinaryConfigured()) {
            showCloudinaryConfigError();
            return { success: false, error: 'Cloudinary no configurado' };
        }

        // Crear FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        formData.append('folder', folder);

        // Subir a Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error al subir imagen: ${response.statusText}`);
        }

        const result = await response.json();
        
        console.log('✅ Imagen subida a Cloudinary:', result.public_id);
        return {
            success: true,
            publicId: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height
        };
    } catch (error) {
        console.error('❌ Error al subir imagen:', error);
        return { success: false, error: error.message };
    }
}

// Subir múltiples imágenes
export async function uploadMultipleImages(files, folder = 'drmalestar') {
    try {
        const results = [];
        
        for (const file of files) {
            const result = await uploadImageToCloudinary(file, folder);
            results.push(result);
        }
        
        return { success: true, results: results };
    } catch (error) {
        console.error('❌ Error al subir múltiples imágenes:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// FUNCIONES DE UTILIDAD
// ===========================================

// Validar archivo de imagen
export function validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Tipo de archivo no válido. Solo se permiten JPG, PNG, GIF y WebP.' };
    }
    
    if (file.size > maxSize) {
        return { valid: false, error: 'El archivo es demasiado grande. Máximo 10MB.' };
    }
    
    return { valid: true };
}

// Obtener URL optimizada de imagen
export function getOptimizedImageUrl(publicId, options = {}) {
    if (!publicId) return null;
    
    const {
        width = null,
        height = null,
        quality = 'auto',
        format = 'auto',
        crop = 'fill',
        gravity = 'auto'
    } = options;
    
    let url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/`;
    
    // Agregar transformaciones
    const transformations = [];
    
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);
    if (crop) transformations.push(`c_${crop}`);
    if (gravity) transformations.push(`g_${gravity}`);
    
    if (transformations.length > 0) {
        url += transformations.join(',') + '/';
    }
    
    url += publicId;
    return url;
}

// Obtener URL de imagen con diferentes tamaños
export function getResponsiveImageUrls(publicId) {
    if (!publicId) return null;
    
    return {
        thumbnail: getOptimizedImageUrl(publicId, { width: 150, height: 150, crop: 'fill' }),
        small: getOptimizedImageUrl(publicId, { width: 400, height: 300, crop: 'fill' }),
        medium: getOptimizedImageUrl(publicId, { width: 800, height: 600, crop: 'fill' }),
        large: getOptimizedImageUrl(publicId, { width: 1200, height: 900, crop: 'fill' }),
        original: getOptimizedImageUrl(publicId, { quality: 'auto' })
    };
}

// ===========================================
// FUNCIONES DE PREVIEW
// ===========================================

// Crear preview de imagen antes de subir
export function createImagePreview(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve({
                url: e.target.result,
                name: file.name,
                size: file.size,
                type: file.type
            });
        };
        reader.readAsDataURL(file);
    });
}

// ===========================================
// FUNCIONES DE NOTIFICACIÓN
// ===========================================

// Mostrar notificación de subida
export function showUploadNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `upload-notification upload-notification-${type}`;
    notification.innerHTML = `
        <div class="upload-notification-content">
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos para la notificación
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

