// ===========================================
// FIREBASE CONFIGURATION - DR. MALESTAR
// ===========================================

// Importar los módulos de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Configuración de Firebase (reemplaza con tu configuración)
const firebaseConfig = {
    // ⚠️ REEMPLAZA ESTOS VALORES CON TU CONFIGURACIÓN DE FIREBASE
    apiKey: "tu-api-key-aqui",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "tu-app-id"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// Exportar la app para uso general
export default app;

// ===========================================
// FUNCIONES DE UTILIDAD
// ===========================================

// Función para verificar si Firebase está configurado
export function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "tu-api-key-aqui" && firebaseConfig.apiKey !== undefined;
}

// Función para mostrar errores de configuración
export function showConfigError() {
    console.error('❌ Firebase no está configurado correctamente');
    console.log('📝 Por favor, reemplaza la configuración en firebase-config.js con tus datos de Firebase');
    alert('Firebase no está configurado. Por favor, contacta al administrador.');
}

// ===========================================
// CONFIGURACIÓN DE REGLAS DE SEGURIDAD
// ===========================================

/*
REGLAS DE FIRESTORE (copia estas en la consola de Firebase):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura a todos los usuarios autenticados
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}

REGLAS DE STORAGE (copia estas en la consola de Firebase):

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
*/
