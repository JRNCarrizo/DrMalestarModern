// ========================================
// 🎫 LOAD EXISTING FLYERS - Dr.Malestar
// ========================================
// Script para cargar flyers existentes en el panel de administración

console.log('🎫 Load Existing Flyers - Dr.Malestar cargado');

// ========================================
// 📋 FLYERS EXISTENTES
// ========================================

// Datos iniciales de flyers
const INITIAL_FLYERS = [
    {
        id: 'existing-flyer-1',
        title: 'Dr.Malestar en Memphis',
        date: '2024-10-31',
        time: '22:00',
        location: 'Memphis, Granville 1756',
        description: 'Show en vivo con toda la banda',
        image: '../img/flyer1malestar.jpg',
        fallback: '../img/bluseraflier.jpg'
    },
    {
        id: 'existing-flyer-2',
        title: 'Dr.Malestar en Memphis',
        date: '2024-10-31',
        time: '22:00',
        location: 'Memphis, Granville 1756',
        description: 'Show en vivo con toda la banda',
        image: '../img/flyer2malestar.jpg',
        fallback: '../img/bluseraflier.jpg'
    },
    {
        id: 'existing-flyer-3',
        title: 'Dr.Malestar en Memphis',
        date: '2024-10-31',
        time: '22:00',
        location: 'Memphis, Granville 1756',
        description: 'Show en vivo con toda la banda',
        image: '../img/flyer3malestar.jpg',
        fallback: '../img/bluseraflier.jpg'
    }
];

// Obtener flyers desde localStorage o usar los iniciales
function getExistingFlyers() {
    const stored = localStorage.getItem('drmalestar_existing_flyers');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error('Error parseando flyers desde localStorage:', error);
            return [...INITIAL_FLYERS];
        }
    }
    return [...INITIAL_FLYERS];
}

// Guardar flyers en localStorage
function saveExistingFlyers(flyers) {
    localStorage.setItem('drmalestar_existing_flyers', JSON.stringify(flyers));
}

// Obtener flyers actuales
let EXISTING_FLYERS = getExistingFlyers();

// ========================================
// 🔧 FUNCIONES DE CARGA
// ========================================

function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function loadExistingFlyers() {
    console.log('🎫 Cargando flyers existentes en el panel de administración...');
    
    const container = document.getElementById('flyersList');
    if (!container) {
        console.error('❌ No se encontró el contenedor de flyers');
        return;
    }

    // Limpiar contenedor
    container.innerHTML = '';

    // Cargar cada flyer
    for (const flyer of EXISTING_FLYERS) {
        const flyerItem = await createExistingFlyerItem(flyer);
        container.appendChild(flyerItem);
    }

    console.log('✅ Flyers existentes cargados en el panel de administración');
}

async function createExistingFlyerItem(flyer) {
    const item = document.createElement('div');
    item.className = 'media-item';
    
    // Verificar si la imagen existe
    const imageExists = await checkImageExists(flyer.image);
    const imageSrc = imageExists ? flyer.image : flyer.fallback;
    
    item.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2">
                <img src="${imageSrc}" alt="${flyer.title}" 
                     onerror="this.src='${flyer.fallback}'" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="col-md-8">
                <h5>${flyer.title}</h5>
                <p class="mb-1"><strong>Fecha:</strong> ${formatDate(flyer.date)}</p>
                <p class="mb-1"><strong>Lugar:</strong> ${flyer.location}</p>
                <p class="mb-1"><strong>Hora:</strong> ${flyer.time}</p>
                ${flyer.description ? `<p class="mb-0"><strong>Descripción:</strong> ${flyer.description}</p>` : ''}
                <small class="text-muted">${imageExists ? 'Imagen cargada' : 'Usando imagen de respaldo'}</small>
            </div>
            <div class="col-md-2 text-end">
                <button class="btn btn-danger-admin" onclick="deleteExistingFlyer('${flyer.id}')">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `;
    
    return item;
}

async function deleteExistingFlyer(flyerId) {
    console.log('🗑️ Eliminando flyer existente:', flyerId);
    if (confirm('¿Estás seguro de que quieres eliminar este flyer?')) {
        try {
            // Buscar el flyer en los datos existentes
            const flyer = EXISTING_FLYERS.find(f => f.id === flyerId);
            if (flyer) {
                // Eliminar de la lista local
                const index = EXISTING_FLYERS.findIndex(f => f.id === flyerId);
                if (index > -1) {
                    EXISTING_FLYERS.splice(index, 1);
                }
                
                // Guardar cambios en localStorage
                saveExistingFlyers(EXISTING_FLYERS);
                console.log('💾 Cambios guardados en localStorage');
                
                // Si hay cloudAPI disponible, eliminar también de ahí
                if (typeof cloudAPI !== 'undefined' && typeof cloudAPI.deleteFlyer === 'function') {
                    try {
                        await cloudAPI.deleteFlyer(flyerId);
                        console.log('✅ Flyer eliminado de CloudAPI');
                    } catch (error) {
                        console.log('⚠️ No se pudo eliminar de CloudAPI:', error.message);
                    }
                }
                
                console.log('✅ Flyer eliminado:', flyerId);
                showNotification('Flyer eliminado correctamente', 'success');
                
                // Recargar la lista
                await loadExistingFlyers();
            } else {
                showNotification('Flyer no encontrado', 'error');
            }
        } catch (error) {
            console.error('❌ Error eliminando flyer:', error);
            showNotification('Error eliminando flyer: ' + error.message, 'error');
        }
    }
}

// ========================================
// 🎯 FUNCIONES GLOBALES
// ========================================

// Hacer las funciones disponibles globalmente
window.loadExistingFlyers = loadExistingFlyers;
window.deleteExistingFlyer = deleteExistingFlyer;

// Función para resetear flyers a su estado inicial
window.resetExistingFlyers = function() {
    if (confirm('¿Estás seguro de que quieres resetear TODOS los flyers a su estado inicial? Esto restaurará los 3 flyers de Memphis.')) {
        EXISTING_FLYERS = [...INITIAL_FLYERS];
        saveExistingFlyers(EXISTING_FLYERS);
        loadExistingFlyers();
        showNotification('Flyers reseteados a su estado inicial', 'success');
    }
};

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos para la notificación
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

console.log('🎫 Load Existing Flyers - Dr.Malestar listo');
