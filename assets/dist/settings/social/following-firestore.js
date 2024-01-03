// Importaciones de módulos Firebase
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp, collection, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

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

  const followingCollection = collection(firestore, 'following', uid);

  try {
    const followingCollectionSnapshot = await getDoc(followingCollection);
    if (!followingCollectionSnapshot.exists()) {
      await setDoc(followingCollection, {});
    }

    await setDoc(followingCollection, { [userIdToFollow]: true }, { merge: true });

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
