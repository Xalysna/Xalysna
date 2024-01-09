// Importaciones de módulos Firebase
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
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
export async function followUser() {
  // Supongamos que tienes un botón con el ID 'btnSeguir' y un elemento 'alias' en tu HTML
  const btnSeguir = document.getElementById('btnSeguir');
  const aliasElement = document.getElementById('alias');

  if (btnSeguir && aliasElement) {
    btnSeguir.addEventListener('click', async () => {
      const userIdToFollow = aliasElement.getAttribute('data-user-id'); // Obtener el ID del usuario a seguir del atributo de datos
      const { uid } = obtenerUIDyCorreo();

      if (!uid) {
        console.error('No se pudo obtener el UID del usuario.');
        return;
      }

      const followingCollection = collection(firestore, 'SOCIAL', uid, 'FOLLOWING');

      try {
        const timestamp = serverTimestamp();
        const userProfile = await getDoc(doc(firestore, 'SOCIAL', userIdToFollow));
        
        if (userProfile.exists()) {
          const userData = userProfile.data();
          const { fullName, userEmail, alias } = userData;

          await setDoc(followingCollection, { [userIdToFollow]: { timestamp, fullName, userEmail, alias } }, { merge: true });
          console.log('Ahora sigues a', userIdToFollow);
        } else {
          console.error('El usuario a seguir no existe.');
        }
      } catch (error) {
        console.error('Error al seguir al usuario:', error);
      }
    });
  }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', followUser);
