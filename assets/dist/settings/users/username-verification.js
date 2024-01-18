// Importaciones de módulos Firebase
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore, doc, getDoc, query, collection, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de auth y firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Función para validar la existencia de un usernameId en cualquier documento de la colección "USERS"
async function validarExistenciaUsernameId(usernameId) {
    const usersCollectionRef = collection(firestore, 'USERS');
    
    try {
        // Realizar una consulta para verificar la existencia de usernameId en cualquier documento de la colección
        const querySnapshot = await getDocs(query(usersCollectionRef, where('usernameId', '==', usernameId)));

        // Retorna true si encuentra al menos un documento con el mismo usernameId
        return !querySnapshot.empty;
    } catch (error) {
        console.error('Error al validar la existencia del usernameId:', error);
        return false; // En caso de error, tratamos como que el usernameId no existe
    }
}

// Obtener el elemento del campo de entrada y el elemento del mensaje desde el DOM
const usernameInput = document.getElementById('usernameId');
const mensajeUsuario = document.getElementById('mensajeUsuario');
const btnSiguientePaso = document.getElementById('btnSiguientePaso'); // Asegúrate de usar el ID correcto

// Agregar un event listener al campo de entrada para validar continuamente mientras el usuario escribe
usernameInput.addEventListener('input', async () => {
    // Llamar a la función para validar la existencia del usernameId en Firestore
    const usernameId = usernameInput.value;
    const usernameIdExistente = await validarExistenciaUsernameId(usernameId);

    if (usernameIdExistente) {
        mostrarMensaje('Este nombre de usuario ya está en uso. Por favor, elija otro.');
        // Desactivar el botón de siguiente paso
        btnSiguientePaso.disabled = true;
    } else {
        mostrarMensaje('Este nombre de usuario está disponible. Puede utilizarlo.');
        // Activar el botón de siguiente paso
        btnSiguientePaso.disabled = false;
    }
});

// Función para mostrar el mensaje debajo del campo de entrada
function mostrarMensaje(mensaje) {
    mensajeUsuario.textContent = mensaje;
}
