// ===========================================
// FIREBASE AUTHENTICATION - DR. MALESTAR
// ===========================================

import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth, isFirebaseConfigured, showConfigError } from './firebase-config.js';

// ===========================================
// FUNCIONES DE AUTENTICACIÓN
// ===========================================

// Iniciar sesión con email y contraseña
export async function loginUser(email, password) {
    try {
        if (!isFirebaseConfigured()) {
            showConfigError();
            return { success: false, error: 'Firebase no configurado' };
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('✅ Usuario autenticado:', user.email);
        return { success: true, user: user };
    } catch (error) {
        console.error('❌ Error al iniciar sesión:', error);
        return { success: false, error: error.message };
    }
}

// Crear nuevo usuario
export async function createUser(email, password) {
    try {
        if (!isFirebaseConfigured()) {
            showConfigError();
            return { success: false, error: 'Firebase no configurado' };
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('✅ Usuario creado:', user.email);
        return { success: true, user: user };
    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        return { success: false, error: error.message };
    }
}

// Cerrar sesión
export async function logoutUser() {
    try {
        await signOut(auth);
        console.log('✅ Usuario desconectado');
        return { success: true };
    } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        return { success: false, error: error.message };
    }
}

// Obtener usuario actual
export function getCurrentUser() {
    return auth.currentUser;
}

// Verificar si el usuario está autenticado
export function isUserAuthenticated() {
    return auth.currentUser !== null;
}

// ===========================================
// OBSERVADOR DE ESTADO DE AUTENTICACIÓN
// ===========================================

// Función para monitorear cambios en el estado de autenticación
export function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('👤 Usuario autenticado:', user.email);
            callback({ authenticated: true, user: user });
        } else {
            console.log('👤 Usuario no autenticado');
            callback({ authenticated: false, user: null });
        }
    });
}

// ===========================================
// FUNCIONES DE UTILIDAD
// ===========================================

// Verificar si el usuario es administrador
export function isAdmin(user) {
    if (!user) return false;
    
    // Lista de emails de administradores
    const adminEmails = [
        'admin@drmalestar.com',
        'hector@drmalestar.com',
        'moncho@drmalestar.com',
        'hugo@drmalestar.com',
        'negro@drmalestar.com',
        'tano@drmalestar.com'
    ];
    
    return adminEmails.includes(user.email);
}

// Obtener información del usuario para mostrar
export function getUserDisplayInfo(user) {
    if (!user) return null;
    
    return {
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        isAdmin: isAdmin(user),
        uid: user.uid
    };
}

// ===========================================
// FUNCIONES DE NOTIFICACIÓN
// ===========================================

// Mostrar notificación de autenticación
export function showAuthNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    notification.innerHTML = `
        <div class="auth-notification-content">
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

