// Importaciones de módulos Firebase
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de auth y firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Función para obtener el UID y el correo del usuario actual
function obtenerUIDyCorreo() {
  const user = auth.currentUser;

  if (user) {
    console.log('UID:', user.uid);
    console.log('Correo:', user.email);
    return { uid: user.uid, email: user.email };
  } else {
    console.error('Usuario no autenticado');
    return null;
  }
}

// Función para guardar o actualizar el perfil en Firestore
export async function saveProfile() {
  try {
    // Obtener UID y correo del usuario actual
    const { uid, email } = obtenerUIDyCorreo();

    if (!uid) {
      throw new Error('No se pudo obtener el UID del usuario.');
    }

    // Obtener referencia al documento del usuario en la colección "USERS"
    const userDocRef = doc(firestore, 'USERS', uid);

    // Obtener la fecha de último acceso del usuario
    const ultimaVezAcceso = serverTimestamp();

    if (!ultimaVezAcceso) {
      throw new Error('Error al obtener la marca de tiempo del servidor.');
    }

    // Fecha de último acceso a la cuenta.
    const profileData = {
      ultimaVezAcceso: ultimaVezAcceso,
    };

    // Verificar si el documento ya existe
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      // Si el documento existe, actualizar los datos
      await updateDoc(userDocRef, profileData);
      console.log('Perfil actualizado con éxito.');
    } else {
      // Si el documento no existe, crear uno nuevo
      await setDoc(userDocRef, profileData);
      console.log('Perfil creado con éxito.');
    }
  } catch (error) {
    console.error('Error al guardar el perfil:', error.message);
  }
}

// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario autenticado, mostrar UID y correo en la consola
    obtenerUIDyCorreo();
    
    // Llamar a la función para guardar o actualizar el perfil en Firestore
    saveProfile();
  } else {
    console.log('Usuario no autenticado');
  }
});
