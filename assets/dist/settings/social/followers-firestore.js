// Importar la configuración de Firebase desde firebase-config.js
import { firebaseConfig } from "../config/firebase-config.js";
import { firebaseUrls } from "../config/firebase-config-urls.js";

// Importar las funciones necesarias del SDK de Firebase desde los CDN
import { initializeApp } from firebaseUrls.app;
import { getAuth, onAuthStateChanged } from firebaseUrls.auth;
import { getFirestore, doc, setDoc, serverTimestamp, collection, getDoc } from firebaseUrls.firestore;

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
    console.log('Usuario no autenticado');
    return null;
  }
}

// Función para seguir a un usuario
export async function followUser(userIdToFollow) {
  const { uid } = obtenerUIDyCorreo();

  if (!uid) {
    console.error('No se pudo obtener el UID del usuario.');
    return;
  }

  const followersCollection = collection(firestore, 'followers', userIdToFollow);

  try {
    const followersCollectionSnapshot = await getDoc(followersCollection);
    if (!followersCollectionSnapshot.exists()) {
      await setDoc(followersCollection, {});
    }

    await setDoc(followersCollection, { [uid]: true }, { merge: true });

    console.log('Ahora sigues a', userIdToFollow);
  } catch (error) {
    console.error('Error al seguir al usuario:', error);
  }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Supongamos que tienes un botón con el ID 'btnSeguir' en tu HTML
  document.getElementById('btnSeguir').addEventListener('click', async () => {
    const userIdToFollow = 'el_id_del_usuario_a_seguir'; // Reemplazar con el ID real del usuario a seguir
    await followUser(userIdToFollow);
  });
});
