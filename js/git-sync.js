// ===========================================
// GIT SYNC - Dr.Malestar
// Sincronización automática con Git/Netlify
// ===========================================

console.log('🔄 Git Sync - Dr.Malestar cargado');

class GitSync {
    constructor() {
        this.localAPI = window.localAPI;
        this.syncInterval = 30000; // 30 segundos
        this.isAutoSync = false;
        this.syncHistory = [];
    }

    // Iniciar sincronización automática
    startAutoSync() {
        if (this.isAutoSync) {
            console.log('⚠️ Auto-sync ya está activo');
            return;
        }
        
        this.isAutoSync = true;
        console.log('🔄 Iniciando auto-sync cada', this.syncInterval / 1000, 'segundos');
        
        setInterval(() => {
            this.syncToGit();
        }, this.syncInterval);
    }

    // Detener sincronización automática
    stopAutoSync() {
        this.isAutoSync = false;
        console.log('⏹️ Auto-sync detenido');
    }

    // Sincronizar datos locales con Git
    async syncToGit() {
        try {
            console.log('🔄 Sincronizando con Git...');
            
            // Obtener datos actuales
            const data = this.localAPI.getData();
            
            // Crear archivo de datos para Git
            const gitData = {
                flyers: data.flyers,
                photos: data.photos,
                videos: data.videos,
                lastSync: new Date().toISOString(),
                version: '1.0.0'
            };
            
            // Guardar en archivo local (para que Git lo detecte)
            await this.saveToFile('data/content.json', JSON.stringify(gitData, null, 2));
            
            // Crear archivo de imágenes para Git
            await this.saveImagesToGit(data.flyers, data.photos);
            
            // Registrar sincronización
            this.syncHistory.push({
                timestamp: new Date().toISOString(),
                flyers: data.flyers.length,
                photos: data.photos.length,
                videos: data.videos.length,
                status: 'success'
            });
            
            console.log('✅ Sincronización con Git completada');
            this.showSyncNotification('Datos sincronizados con Git', 'success');
            
        } catch (error) {
            console.error('❌ Error sincronizando con Git:', error);
            this.syncHistory.push({
                timestamp: new Date().toISOString(),
                status: 'error',
                error: error.message
            });
            this.showSyncNotification('Error sincronizando con Git', 'error');
        }
    }

    // Guardar archivo en el sistema
    async saveToFile(filename, content) {
        try {
            // Crear blob y descargar
            const blob = new Blob([content], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('✅ Archivo guardado:', filename);
        } catch (error) {
            console.error('❌ Error guardando archivo:', error);
            throw error;
        }
    }

    // Guardar imágenes para Git
    async saveImagesToGit(flyers, photos) {
        try {
            console.log('🔄 Guardando imágenes para Git...');
            
            // Crear lista de imágenes únicas
            const images = new Set();
            
            // Recopilar imágenes de flyers
            flyers.forEach(flyer => {
                if (flyer.image && flyer.image !== 'img/bluseraflier.jpg') {
                    images.add(flyer.image);
                }
            });
            
            // Recopilar imágenes de fotos
            photos.forEach(photo => {
                if (photo.image) {
                    images.add(photo.image);
                }
            });
            
            // Crear archivo de lista de imágenes
            const imageList = Array.from(images);
            await this.saveToFile('data/images.json', JSON.stringify(imageList, null, 2));
            
            console.log('✅ Lista de imágenes guardada:', imageList.length, 'imágenes');
            
        } catch (error) {
            console.error('❌ Error guardando imágenes para Git:', error);
        }
    }

    // Crear commit automático
    async createCommit() {
        try {
            console.log('🔄 Creando commit automático...');
            
            const commitMessage = `Actualización automática - ${new Date().toLocaleString()}`;
            
            // Crear archivo de commit
            const commitData = {
                message: commitMessage,
                timestamp: new Date().toISOString(),
                files: ['data/content.json', 'data/images.json']
            };
            
            await this.saveToFile('data/commit.json', JSON.stringify(commitData, null, 2));
            
            console.log('✅ Commit creado:', commitMessage);
            this.showSyncNotification('Commit creado para Git', 'info');
            
        } catch (error) {
            console.error('❌ Error creando commit:', error);
        }
    }

    // Mostrar notificación de sincronización
    showSyncNotification(message, type = 'info') {
        // Crear notificación simple
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            <strong>Git Sync:</strong> ${message}
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

    // Obtener historial de sincronización
    getSyncHistory() {
        return this.syncHistory;
    }

    // Limpiar historial de sincronización
    clearSyncHistory() {
        this.syncHistory = [];
        console.log('✅ Historial de sincronización limpiado');
    }

    // Exportar datos para Netlify
    async exportForNetlify() {
        try {
            console.log('🔄 Exportando datos para Netlify...');
            
            const data = this.localAPI.getData();
            
            // Crear estructura para Netlify
            const netlifyData = {
                site: 'drmalestar',
                data: {
                    flyers: data.flyers,
                    photos: data.photos,
                    videos: data.videos
                },
                metadata: {
                    lastUpdated: new Date().toISOString(),
                    version: '1.0.0',
                    source: 'local-storage'
                }
            };
            
            await this.saveToFile('netlify-deploy.json', JSON.stringify(netlifyData, null, 2));
            
            console.log('✅ Datos exportados para Netlify');
            this.showSyncNotification('Datos exportados para Netlify', 'success');
            
        } catch (error) {
            console.error('❌ Error exportando para Netlify:', error);
        }
    }
}

// Crear instancia global
const gitSync = new GitSync();

// Funciones de debugging
window.startGitSync = function() {
    console.log('🔄 Iniciando Git Sync...');
    gitSync.startAutoSync();
};

window.stopGitSync = function() {
    console.log('⏹️ Deteniendo Git Sync...');
    gitSync.stopAutoSync();
};

window.syncNow = function() {
    console.log('🔄 Sincronizando ahora...');
    gitSync.syncToGit();
};

window.createCommit = function() {
    console.log('🔄 Creando commit...');
    gitSync.createCommit();
};

window.exportForNetlify = function() {
    console.log('🔄 Exportando para Netlify...');
    gitSync.exportForNetlify();
};

window.getSyncHistory = function() {
    console.log('📋 Historial de sincronización:', gitSync.getSyncHistory());
    return gitSync.getSyncHistory();
};

console.log('✅ Git Sync listo');

