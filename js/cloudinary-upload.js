// ===========================================
// CLOUDINARY UPLOAD - DR. MALESTAR
// ===========================================

class CloudinaryUploader {
    constructor() {
        this.cloudName = 'daoo9nvfc';
        this.uploadPreset = 'drmalestar';
        this.uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    }

    async uploadImage(file) {
        try {
            // Crear FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', this.uploadPreset);
            formData.append('folder', 'drmalestar');

            // Subir imagen
            const response = await fetch(this.uploadUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error subiendo imagen: ${response.status}`);
            }

            const result = await response.json();
            
            return {
                success: true,
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height
            };
        } catch (error) {
            console.error('Error subiendo a Cloudinary:', error);
            return {
                success: false,
                error: error.message,
                fallback: URL.createObjectURL(file) // Fallback a blob URL
            };
        }
    }

    // Función para subir múltiples imágenes
    async uploadMultipleImages(files) {
        const results = [];
        
        for (const file of files) {
            const result = await this.uploadImage(file);
            results.push(result);
        }
        
        return results;
    }

    // Función para eliminar imagen de Cloudinary
    async deleteImage(publicId) {
        try {
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
                throw new Error(`Error eliminando imagen: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error eliminando de Cloudinary:', error);
            return { success: false, error: error.message };
        }
    }

    // Función para obtener URL optimizada
    getOptimizedUrl(publicId, width = null, height = null, quality = 'auto') {
        let url = `https://res.cloudinary.com/${this.cloudName}/image/upload/`;
        
        const transformations = [];
        if (width) transformations.push(`w_${width}`);
        if (height) transformations.push(`h_${height}`);
        if (quality) transformations.push(`q_${quality}`);
        
        if (transformations.length > 0) {
            url += transformations.join(',') + '/';
        }
        
        url += publicId;
        return url;
    }
}

// Crear instancia global
const cloudinaryUploader = new CloudinaryUploader();