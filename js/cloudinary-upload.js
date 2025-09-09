// ===========================================
// CLOUDINARY UPLOAD - DR. MALESTAR
// ===========================================

class CloudinaryUpload {
    constructor() {
        this.cloudName = 'daoo9nvfc';
        this.uploadPreset = 'drmalestar';
        this.baseUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    }

    // Subir imagen a Cloudinary (versión simple)
    async uploadImage(file, folder = 'drmalestar') {
        try {
            console.log('🔄 Subiendo imagen a Cloudinary...');
            console.log('📁 Archivo:', file.name, 'Tamaño:', (file.size / 1024).toFixed(1) + 'KB');
            console.log('🔧 Preset:', this.uploadPreset);
            console.log('📂 Folder:', folder);
            
            // Crear FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', this.uploadPreset);
            formData.append('folder', folder);
            
            // Subir imagen (sin transformaciones adicionales, usa las del preset)
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error HTTP:', response.status, response.statusText);
                console.error('❌ Error details:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Imagen subida a Cloudinary:', result.secure_url);
            console.log(`📏 Tamaño: ${(result.bytes / 1024).toFixed(1)}KB`);
            
            return {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                size: result.bytes
            };
        } catch (error) {
            console.error('❌ Error subiendo imagen:', error);
            throw error;
        }
    }

    // Subir imagen con compresión personalizada
    async uploadImageCompressed(file, maxWidth = 800, quality = 'auto', folder = 'drmalestar') {
        try {
            console.log('🔄 Subiendo imagen comprimida a Cloudinary...');
            console.log('📁 Archivo:', file.name, 'Tamaño:', (file.size / 1024).toFixed(1) + 'KB');
            console.log('🔧 Preset:', this.uploadPreset);
            console.log('📂 Folder:', folder);
            
            // Crear FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', this.uploadPreset);
            formData.append('folder', folder);
            
            // Configuraciones de optimización
            const transformation = `f_auto,q_${quality},w_${maxWidth}`;
            formData.append('transformation', transformation);
            
            console.log('🔧 Transformation:', transformation);
            
            // Subir imagen
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error HTTP:', response.status, response.statusText);
                console.error('❌ Error details:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Imagen comprimida subida:', result.secure_url);
            console.log(`📏 Tamaño: ${(result.bytes / 1024).toFixed(1)}KB`);
            
            return {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                size: result.bytes
            };
        } catch (error) {
            console.error('❌ Error subiendo imagen comprimida:', error);
            throw error;
        }
    }

    // Eliminar imagen de Cloudinary
    async deleteImage(publicId) {
        try {
            console.log('🗑️ Eliminando imagen de Cloudinary:', publicId);
            
            const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    public_id: publicId,
                    api_key: '444999631333727',
                    api_secret: 'nAeLEgNoZgEg1BjgDSG4bceWBC0'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Imagen eliminada de Cloudinary');
            return result;
        } catch (error) {
            console.error('❌ Error eliminando imagen:', error);
            throw error;
        }
    }

    // Obtener URL optimizada
    getOptimizedUrl(publicId, width = 800, quality = 'auto') {
        return `https://res.cloudinary.com/${this.cloudName}/image/upload/f_auto,q_${quality},w_${width}/${publicId}`;
    }
}

// Crear instancia global
const cloudinaryUpload = new CloudinaryUpload();

// Funciones de debugging
window.testCloudinary = async function() {
    console.log('🧪 Probando Cloudinary...');
    try {
        // Crear una imagen de prueba
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 100, 100);
        
        // Convertir a blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
        const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });
        
        // Subir imagen de prueba
        const result = await cloudinaryUpload.uploadImageCompressed(file);
        console.log('✅ Imagen de prueba subida:', result);
        
        // Eliminar imagen de prueba
        await cloudinaryUpload.deleteImage(result.publicId);
        console.log('✅ Imagen de prueba eliminada');
        
        console.log('🎉 Cloudinary funcionando perfectamente');
        return true;
    } catch (error) {
        console.error('❌ Error en prueba de Cloudinary:', error);
        return false;
    }
};