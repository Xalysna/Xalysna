// Importar la configuración de Firebase
import { firebaseConfig } from "../config/firebase-config.js";
import { FIREBASE_APP_URL, FIREBASE_AUTH_URL, FIREBASE_FIRESTORE_URL } from "../config/firebase-config-urls.js";

// Imprimir las URLs para verificar que estén configuradas correctamente
console.log("FIREBASE_APP_URL:", FIREBASE_APP_URL);
console.log("FIREBASE_AUTH_URL:", FIREBASE_AUTH_URL);
console.log("FIREBASE_FIRESTORE_URL:", FIREBASE_FIRESTORE_URL);

// Importar las funciones necesarias del SDK de Firebase de forma dinámica
const { initializeApp } = await import(FIREBASE_APP_URL);
const { getAuth, onAuthStateChanged } = await import(FIREBASE_AUTH_URL);
const { getFirestore, doc, getDoc } = await import(FIREBASE_FIRESTORE_URL);

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de auth y firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Variable global para almacenar el valor del campo "tipo"
let tipoGlobal = null;

// Función para obtener solo el valor del campo "tipo" del documento en Firestore
async function obtenerTipo(uid) {
    try {
        // Obtener referencia al documento del usuario en la colección "USERS"
        const userDocRef = doc(firestore, 'USERS', uid);

        // Obtener el snapshot del documento
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
            // Si el documento existe, obtener el valor del campo "tipo"
            const userData = docSnapshot.data();
            tipoGlobal = userData.tipo; // Almacenar en la variable global

            console.log('Valor del campo "tipo":', tipoGlobal);

            // Llamar a la función para mostrar u ocultar pestañas después de obtener el valor
            mostrarOcultarPestañas(tipoGlobal);

            return tipoGlobal;
        } else {
            console.log('El documento no existe en Firestore.');
            tipoGlobal = null; // Si el documento no existe, establecer la variable global en null
            return tipoGlobal;
        }
    } catch (error) {
        console.error('Error al obtener el valor del campo "tipo" desde Firestore:', error);
        tipoGlobal = null; // Manejar el error estableciendo la variable global en null
        return tipoGlobal;
    }
}

// Función para mostrar u ocultar pestañas según el tipo de cuenta
function mostrarOcultarPestañas(tipoCuenta) {
    console.log('Mostrar u ocultar pestañas para:', tipoCuenta);

    const pestañasPersona = document.querySelectorAll('.section-datos-persona, .section-aurora-persona');
    const pestañasEmpresa = document.querySelectorAll('.section-datos-empresa, .section-aurora-empresa');

    // Convierte a minúsculas para hacer coincidencias no sensibles a mayúsculas
    const tipoCuentaMin = tipoCuenta.toLowerCase();

    if (tipoCuentaMin.includes('persona')) {
        pestañasPersona.forEach(tab => {
            console.log('Mostrar pestaña:', tab.id);
            tab.style.display = 'block';
        });
        pestañasEmpresa.forEach(tab => {
            console.log('Ocultar pestaña:', tab.id);
            tab.style.display = 'none';
        });
    } else if (tipoCuentaMin.includes('empresa')) {
        pestañasPersona.forEach(tab => {
            console.log('Ocultar pestaña:', tab.id);
            tab.style.display = 'none';
        });
        pestañasEmpresa.forEach(tab => {
            console.log('Mostrar pestaña:', tab.id);
            tab.style.display = 'block';
        });
    } else {
        console.log('Tipo de cuenta no reconocido:', tipoCuenta);
    }
}

// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Usuario autenticado, obtener el valor del campo "tipo"
        await obtenerTipo(user.uid);

        // Hacer lo que necesites con el valor del campo "tipo"
        if (tipoGlobal) {
            // Puedes imprimir el valor o realizar otras acciones
            console.log('Valor del campo "tipo":', tipoGlobal);
        }
    } else {
        console.log('Usuario no autenticado');
    }
});

// Exportar la variable tipoGlobal al objeto global
window.tipoGlobal = tipoGlobal;