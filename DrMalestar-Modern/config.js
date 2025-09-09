// ===========================================
// CONFIGURACIÓN DEL PROYECTO DR. MALESTAR
// ===========================================

const CONFIG = {
    // Información de la banda
    band: {
        name: "Dr.Malestar",
        fullName: "Dr.Malestar - Tributo a Pappo",
        description: "Banda tributo a Norberto Aníbal Napolitano (Pappo)",
        email: "contacto@drmalestar.com",
        phone: "+54 11 1234-5678",
        location: "Buenos Aires, Argentina",
        social: {
            facebook: "#",
            instagram: "#",
            youtube: "#"
        }
    },

    // Configuración del panel de administración
    admin: {
        username: "admin",
        password: "drmalestar2024",
        sessionKey: "drmalestar_admin_session",
        autoLogout: 30 * 60 * 1000 // 30 minutos en milisegundos
    },

    // Configuración de la API (para futuras implementaciones)
    api: {
        baseUrl: "https://api.drmalestar.com",
        endpoints: {
            flyers: "/api/flyers",
            photos: "/api/photos",
            videos: "/api/videos",
            contact: "/api/contact"
        }
    },

    // Configuración de notificaciones
    notifications: {
        duration: 3000, // 3 segundos
        position: "top-right",
        types: {
            success: {
                icon: "check-circle",
                color: "#28a745"
            },
            error: {
                icon: "exclamation-circle",
                color: "#dc3545"
            },
            info: {
                icon: "info-circle",
                color: "#17a2b8"
            },
            warning: {
                icon: "exclamation-triangle",
                color: "#ffc107"
            }
        }
    },

    // Configuración de animaciones
    animations: {
        duration: 300,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        scrollOffset: 50
    },

    // Configuración de imágenes
    images: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
        quality: 0.8
    },

    // Configuración de videos
    videos: {
        platforms: {
            youtube: {
                embedUrl: "https://www.youtube.com/embed/",
                watchUrl: "https://www.youtube.com/watch?v=",
                shortUrl: "https://youtu.be/"
            }
        }
    },

    // Configuración de formularios
    forms: {
        contact: {
            fields: {
                name: { required: true, minLength: 2 },
                email: { required: true, type: "email" },
                message: { required: true, minLength: 10 }
            }
        }
    },

    // Configuración de desarrollo
    development: {
        debug: false,
        logLevel: "info", // debug, info, warn, error
        mockData: true
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}

