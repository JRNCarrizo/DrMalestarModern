// ===========================================
// CONFIGURACIÓN DESARROLLO - Dr.Malestar
// Para desarrollo sin JSONBin
// ===========================================

const CONFIG = {
    // Usar localStorage para desarrollo
    USE_LOCAL_STORAGE: true,
    
    // Credenciales de admin
    ADMIN_USER: 'admin',
    ADMIN_PASS: 'admin123'
};

// Hacer configuración disponible globalmente
window.CONFIG = CONFIG;

console.log('✅ Configuración de desarrollo cargada');
console.log('📝 Usando localStorage para desarrollo');


