// ===========================================
// SETUP DEVELOPMENT - Dr.Malestar
// Configuración automática para desarrollo
// ===========================================

console.log('🔧 Setup Development - Dr.Malestar cargado');

// Configuración de desarrollo
const devConfig = {
    autoSync: true,
    syncInterval: 30000, // 30 segundos
    debugMode: true,
    showNotifications: true
};

// Inicializar sistema de desarrollo
function initDevelopment() {
    console.log('🚀 Inicializando sistema de desarrollo...');
    
    // Verificar que las dependencias estén cargadas
    if (typeof localAPI === 'undefined') {
        console.error('❌ Local Storage API no está cargado');
        return false;
    }
    
    if (typeof gitSync === 'undefined') {
        console.error('❌ Git Sync no está cargado');
        return false;
    }
    
    // Configurar auto-sync si está habilitado
    if (devConfig.autoSync) {
        gitSync.startAutoSync();
        console.log('✅ Auto-sync habilitado');
    }
    
    // Mostrar estadísticas iniciales
    showInitialStats();
    
    // Configurar debugging
    if (devConfig.debugMode) {
        setupDebugging();
    }
    
    console.log('✅ Sistema de desarrollo inicializado');
    return true;
}

// Mostrar estadísticas iniciales
function showInitialStats() {
    const stats = localAPI.getStats();
    console.log('📊 Estadísticas iniciales:', stats);
    
    if (devConfig.showNotifications) {
        showNotification(`Sistema iniciado - ${stats.flyers} flyers, ${stats.photos} fotos, ${stats.videos} videos`, 'info');
    }
}

// Configurar debugging
function setupDebugging() {
    // Agregar funciones de debugging al window
    window.dev = {
        stats: () => localAPI.getStats(),
        clear: () => localAPI.clearAll(),
        sync: () => gitSync.syncToGit(),
        export: () => gitSync.exportForNetlify(),
        history: () => gitSync.getSyncHistory(),
        test: () => testSystem()
    };
    
    console.log('🔧 Funciones de debugging disponibles en window.dev');
    console.log('💡 Usa dev.stats() para ver estadísticas');
    console.log('💡 Usa dev.clear() para limpiar datos');
    console.log('💡 Usa dev.sync() para sincronizar con Git');
    console.log('💡 Usa dev.export() para exportar para Netlify');
}

// Probar sistema
async function testSystem() {
    console.log('🧪 Probando sistema de desarrollo...');
    
    try {
        // Probar Local Storage API
        console.log('🔄 Probando Local Storage API...');
        const testFlyer = {
            title: 'Flyer de Prueba Dev',
            date: '2024-12-31',
            time: '22:00',
            location: 'Lugar de Prueba Dev',
            description: 'Este es un flyer de prueba para desarrollo',
            image: 'img/bluseraflier.jpg'
        };
        
        const result = localAPI.addFlyer(testFlyer);
        console.log('✅ Flyer de prueba agregado:', result);
        
        // Probar Git Sync
        console.log('🔄 Probando Git Sync...');
        await gitSync.syncToGit();
        console.log('✅ Sincronización con Git exitosa');
        
        // Mostrar estadísticas finales
        const stats = localAPI.getStats();
        console.log('📊 Estadísticas finales:', stats);
        
        showNotification('Sistema probado exitosamente', 'success');
        return true;
        
    } catch (error) {
        console.error('❌ Error probando sistema:', error);
        showNotification('Error probando sistema: ' + error.message, 'error');
        return false;
    }
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    if (!devConfig.showNotifications) return;
    
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <strong>Dev Mode:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Crear archivo de configuración para Git
function createGitConfig() {
    const gitConfig = {
        name: 'Dr.Malestar Development',
        email: 'dev@drmalestar.com',
        branch: 'main',
        remote: 'origin',
        autoCommit: true,
        commitMessage: 'Actualización automática - {timestamp}'
    };
    
    const blob = new Blob([JSON.stringify(gitConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'git-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Configuración de Git creada');
}

// Crear archivo de datos de ejemplo
function createSampleData() {
    const sampleData = {
        flyers: [
            {
                id: '1',
                title: 'Flyer de Ejemplo',
                date: '2024-12-31',
                time: '22:00',
                location: 'Lugar de Ejemplo',
                description: 'Este es un flyer de ejemplo para desarrollo',
                image: 'img/bluseraflier.jpg',
                createdAt: new Date().toISOString()
            }
        ],
        photos: [
            {
                id: '1',
                title: 'Foto de Ejemplo',
                description: 'Esta es una foto de ejemplo para desarrollo',
                image: 'img/bluseraflier.jpg',
                createdAt: new Date().toISOString()
            }
        ],
        videos: [
            {
                id: '1',
                title: 'Video de Ejemplo',
                description: 'Este es un video de ejemplo para desarrollo',
                url: 'https://www.youtube.com/watch?v=example',
                createdAt: new Date().toISOString()
            }
        ]
    };
    
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Datos de ejemplo creados');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que se carguen las dependencias
    setTimeout(() => {
        initDevelopment();
    }, 1000);
});

// Funciones globales para desarrollo
window.setupDev = initDevelopment;
window.createGitConfig = createGitConfig;
window.createSampleData = createSampleData;
window.testDev = testSystem;

console.log('✅ Setup Development listo');

