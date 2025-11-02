// ===========================================
// CONFIGURACIÓN - Dr.Malestar
// Configura tus credenciales aquí
// ===========================================

const CONFIG = {
    // ==========================================
    // JSONBin (Para almacenar datos)
    // ==========================================
    // Obtén tus credenciales en: https://jsonbin.io
    BIN_ID: '67b0a0b8-5c4a-4b8a-9c1a-1a2b3c4d5e6f', // Tu Bin ID de JSONBin
    API_KEY: '$2a$10$oYe3uG0XIyCLhNeLvtrZjOSEAkLtqlABuEdQbM9QRKK0FRGVRdxfC', // Tu API Key
    BASE_URL: 'https://api.jsonbin.io/v3',
    
    // ==========================================
    // Cloudinary (Para almacenar imágenes)
    // ==========================================
    // Obtén tus credenciales en: https://cloudinary.com
    CLOUDINARY_CLOUD_NAME: 'daoo9nvfc',
    // Upload Presets: Si Cloudinary falla, el sistema usará base64 automáticamente
    // Para crear un preset: https://cloudinary.com/console/settings/upload
    // Debe ser tipo "Unsigned" para funcionar desde el navegador
    CLOUDINARY_UPLOAD_PRESETS: ['drmalestar_upload', 'drmalestar', 'ml_default'],
    
    // ==========================================
    // Admin
    // ==========================================
    ADMIN_USER: 'drmalestar',
    ADMIN_PASS: 'drmalestar2013'
};

// Hacer configuración disponible globalmente
window.CONFIG = CONFIG;

console.log('✅ Configuración cargada');