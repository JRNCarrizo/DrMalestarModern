// ===========================================
// CLOUDINARY CONFIGURATION - DR. MALESTAR
// ===========================================

// Configuración de Cloudinary
const CLOUDINARY_CONFIG = {
    cloudName: 'daoo9nvfc',
    apiKey: '444999631333727',
    apiSecret: 'nAeLEgNoZgEg1BjgDSG4bceWBC0',
    uploadPreset: 'drmalestar' // Necesitarás crear este preset
};

// URL base para las imágenes
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/`;

// Función para verificar si Cloudinary está configurado
export function isCloudinaryConfigured() {
    return CLOUDINARY_CONFIG.apiKey !== 'tu-api-key-aqui' && 
           CLOUDINARY_CONFIG.apiSecret !== 'tu-api-secret-aqui';
}

// Función para mostrar errores de configuración
export function showCloudinaryConfigError() {
    console.error('❌ Cloudinary no está configurado correctamente');
    console.log('📝 Por favor, reemplaza la configuración en cloudinary-config.js con tus datos de Cloudinary');
    alert('Cloudinary no está configurado. Las imágenes se guardarán localmente.');
}

// Función para construir URL de imagen
export function getCloudinaryImageUrl(publicId, transformations = {}) {
    if (!publicId) return null;
    
    let url = CLOUDINARY_BASE_URL;
    
    // Agregar transformaciones
    if (Object.keys(transformations).length > 0) {
        const transformString = Object.entries(transformations)
            .map(([key, value]) => `${key}_${value}`)
            .join(',');
        url += transformString + '/';
    }
    
    url += publicId;
    return url;
}

// Función para obtener URL de imagen optimizada
export function getOptimizedImageUrl(publicId, width = null, height = null, quality = 'auto') {
    const transformations = {};
    
    if (width) transformations.w = width;
    if (height) transformations.h = height;
    if (quality) transformations.q = quality;
    
    return getCloudinaryImageUrl(publicId, transformations);
}

export default CLOUDINARY_CONFIG;
