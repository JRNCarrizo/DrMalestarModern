// ========================================
// 🧹 CLEAN ADMIN DATA - Dr.Malestar
// ========================================
// Script para limpiar datos residuales del panel de administración

console.log('🧹 Clean Admin Data - Dr.Malestar cargado');

// ========================================
// 🔧 FUNCIONES DE LIMPIEZA
// ========================================

function cleanAdminData() {
    console.log('🧹 Limpiando datos residuales del admin...');
    
    // Limpiar datos de CloudAPI que puedan estar causando conflictos
    const keysToClean = [
        'drmalestar_bin_id',
        'drmalestar_local_data',
        'siteData',
        'adminAuthenticated' // Mantener este para no cerrar sesión
    ];
    
    keysToClean.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`🗑️ Eliminado: ${key}`);
        }
    });
    
    console.log('✅ Datos residuales limpiados');
}

function resetAllAdminData() {
    console.log('🔄 Reseteando todos los datos del admin...');
    
    // Limpiar todo excepto la autenticación
    const adminAuth = localStorage.getItem('adminAuthenticated');
    
    // Limpiar localStorage
    localStorage.clear();
    
    // Restaurar autenticación
    if (adminAuth) {
        localStorage.setItem('adminAuthenticated', adminAuth);
    }
    
    console.log('✅ Todos los datos del admin reseteados');
}

// ========================================
// 🎯 FUNCIONES GLOBALES
// ========================================

// Hacer las funciones disponibles globalmente
window.cleanAdminData = cleanAdminData;
window.resetAllAdminData = resetAllAdminData;

// Limpiar datos al cargar
document.addEventListener('DOMContentLoaded', function() {
    // Limpiar datos residuales después de un pequeño delay
    setTimeout(() => {
        cleanAdminData();
    }, 100);
});

console.log('🧹 Clean Admin Data - Dr.Malestar listo');



