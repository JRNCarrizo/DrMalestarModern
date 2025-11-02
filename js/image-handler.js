// ===========================================
// IMAGE HANDLER - Dr.Malestar
// Manejo simple de imágenes para desarrollo
// ===========================================

console.log('🖼️ Image Handler - Dr.Malestar cargado');

class ImageHandler {
    constructor() {
        this.maxSize = 5 * 1024 * 1024; // 5MB máximo
        this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    }

    // Procesar imagen subida
    async processImage(file) {
        return new Promise((resolve, reject) => {
            // Validar tipo de archivo
            if (!this.allowedTypes.includes(file.type)) {
                reject(new Error('Tipo de archivo no permitido. Solo JPG, PNG, GIF y WebP.'));
                return;
            }

            // Validar tamaño
            if (file.size > this.maxSize) {
                reject(new Error('Archivo demasiado grande. Máximo 5MB.'));
                return;
            }

            // Crear URL temporal para la imagen
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve({
                    url: e.target.result,
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
            };
            reader.onerror = function() {
                reject(new Error('Error leyendo el archivo.'));
            };
            reader.readAsDataURL(file);
        });
    }

    // Crear preview de imagen
    createPreview(imageData, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="image-preview">
                <img src="${imageData.url}" 
                     alt="Preview" 
                     style="max-width: 200px; max-height: 200px; object-fit: cover; border-radius: 8px;">
                <p class="mt-2 mb-0">
                    <small class="text-muted">
                        ${imageData.name} (${this.formatFileSize(imageData.size)})
                    </small>
                </p>
            </div>
        `;
    }

    // Formatear tamaño de archivo
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Limpiar preview
    clearPreview(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}

// Crear instancia global
const imageHandler = new ImageHandler();

// Función para manejar cambio de imagen
window.handleImageChange = function(input, previewId) {
    const file = input.files[0];
    if (!file) {
        imageHandler.clearPreview(previewId);
        return;
    }

    imageHandler.processImage(file)
        .then(imageData => {
            imageHandler.createPreview(imageData, previewId);
        })
        .catch(error => {
            console.error('❌ Error procesando imagen:', error);
            alert(error.message);
            input.value = ''; // Limpiar input
            imageHandler.clearPreview(previewId);
        });
};

console.log('✅ Image Handler listo');

