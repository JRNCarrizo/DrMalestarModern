// ===========================================
// DR. MALESTAR - MAIN JAVASCRIPT (VERSIÓN SIMPLE)
// ===========================================

// ===========================================
// INICIALIZACIÓN
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dr.Malestar - Aplicación inicializada (modo simple)');
    initializeApp();
    setupEventListeners();
    setupScrollAnimations();
});

function initializeApp() {
    console.log('🚀 Iniciando aplicación en modo simple...');
    
    // Cargar todo el contenido usando el sistema simple
    if (typeof loadAllSimpleContent === 'function') {
        loadAllSimpleContent();
    } else {
        console.error('❌ loadAllSimpleContent no está disponible');
    }
}

// ===========================================
// NAVEGACIÓN
// ===========================================
function setupEventListeners() {
    // Cerrar navbar en móviles al hacer clic en un enlace
    document.querySelectorAll('.navbar-nav .nav-link').forEach(item => {
        item.addEventListener('click', () => {
            const navbarCollapse = document.getElementById('navbarNav');
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        });
    });

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Botón de admin
    const adminToggle = document.getElementById('admin-toggle');
    if (adminToggle) {
        adminToggle.addEventListener('click', function() {
            window.location.href = 'admin/index.html';
        });
    }
}

// ===========================================
// FORMULARIO DE CONTACTO
// ===========================================
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simular envío (en una implementación real, enviarías a un servidor)
    console.log('Datos del formulario:', data);
    
    // Mostrar mensaje de éxito
    showNotification('Mensaje enviado correctamente', 'success');
    
    // Limpiar formulario
    e.target.reset();
}

// ===========================================
// ANIMACIONES DE SCROLL
// ===========================================
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar elementos con clases de animación
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

// ===========================================
// UTILIDADES
// ===========================================
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

// ===========================================
// FUNCIONES DEL MODAL DE IMÁGENES
// ===========================================
function openModal(imageSrc, caption) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("modalCaption");

    if (modal && modalImg && captionText) {
        modal.style.display = "block";
        modalImg.src = imageSrc;
        captionText.innerHTML = caption;
    }
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Cerrar modal al hacer clic fuera de la imagen
document.addEventListener('click', function(event) {
    const modal = document.getElementById("imageModal");
    if (event.target === modal) {
        closeModal();
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ===========================================
// FUNCIONES PÚBLICAS
// ===========================================
// Función para recargar contenido (útil para debugging)
async function reloadAllContent() {
    console.log('🔄 Recargando todo el contenido...');
    if (typeof loadAllSimpleContent === 'function') {
        await loadAllSimpleContent();
        console.log('✅ Contenido recargado');
    } else {
        console.error('❌ loadAllSimpleContent no está disponible');
    }
}

// Hacer funciones disponibles globalmente
window.reloadContent = reloadAllContent;

console.log('✅ Dr.Malestar - Sistema simple cargado');
console.log('💡 Comandos disponibles:');
console.log('   - reloadContent() - para recargar todo el contenido');
console.log('   - loadAllSimpleContent() - para cargar todo el contenido');
console.log('   - loadSimpleFlyers() - para cargar solo flyers');
console.log('   - loadSimplePhotos() - para cargar solo fotos');
console.log('   - loadSimpleVideos() - para cargar solo videos');


