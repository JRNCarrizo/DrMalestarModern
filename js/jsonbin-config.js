// ===========================================
// CONFIGURACIÓN DE JSONBIN
// ===========================================

const JSONBIN_CONFIG = {
    // Tu API Key de JSONBin
    apiKey: '$2a$10$oYe3uG0XIyCLhNeLvtrZjOSEAkLtqlABuEdQbM9QRKK0FRGVRdxfC',
    
    // URL base de la API
    baseUrl: 'https://api.jsonbin.io/v3',
    
    // ID del bin (se creará automáticamente)
    binId: null,
    
    // Headers para las peticiones
    getHeaders: function() {
        return {
            'Content-Type': 'application/json',
            'X-Master-Key': this.apiKey
        };
    },
    
    // Headers para crear bins
    getCreateHeaders: function() {
        return {
            'Content-Type': 'application/json',
            'X-Master-Key': this.apiKey,
            'X-Bin-Name': 'DrMalestar-Content'
        };
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JSONBIN_CONFIG;
}
