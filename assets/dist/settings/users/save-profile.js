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
    console.log('Usuario no autenticado');
    return null;
  }
}

// Variable para almacenar la pestaña actual
let currentTab = 'datosBtn';

// Objeto que mapea las pestañas a los elementos correspondientes
const tabElements = {
  datosBtn: [
    'nombrePersona', 'apellidoPersona', 'diaNacimientoPersona', 'mesNacimientoPersona',
    'anoNacimientoPersona', 'generoPersona', 'nombreEmpresa', 'industria',
    'nombreMarca', 'categoriaMarca', 'usernameId', 'locationCountry',
    'locationState', 'locationCity', 'ubicacionEspacial'
  ],
  auroraBtn: [
    'hobby', 'intereses', 'profesion', 'slogan', 'creacionempresa',
    'creacionempresaEspecifico', 'mision', 'vision', 'objetivos',
    'eslogan', 'creacionMarca', 'creacionMarcaEspecifico', 'objetivosMarca'
  ],
  contactoBtn: [
    'userEmail', 'codigoPais', 'phone', 'sitioWeb', 'horariosDisponibilidad'
  ],
  cryptoBtn: [
    'userCryptoWalletAddress', 'favoriteCryptos', 'favoriteExchange'
  ],
  redesBtn: [
    'selectRedSocial', 'inputUsuarioRedSocial', 'listaRedes'
  ],
};

// Función para guardar o actualizar el perfil en Firestore
export async function saveProfile() {
  // Obtener UID y correo del usuario actual
  const { uid, email } = obtenerUIDyCorreo();

  if (!uid) {
    console.error('No se pudo obtener el UID del usuario.');
    return;
  }

  // Obtener referencia al documento del usuario en la colección "USERS"
  const userDocRef = doc(firestore, 'USERS', uid);

  // Obtener la fecha de creación del usuario
  const fechaCreacion = auth.currentUser.metadata.creationTime;

  // Obtener los elementos de la pestaña actual
  const currentTabElements = tabElements[currentTab];

  // Crear objeto para almacenar los valores de los campos de entrada
  const profileData = {};

  // Obtener los valores de los campos de entrada desde el formulario HTML
  currentTabElements.forEach((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      profileData[elementId] = element.value;
    }
  });

  // Validar campos obligatorios
  if (currentTabElements.some((elementId) => !profileData[elementId])) {
    console.error('Por favor, complete los campos obligatorios.');
    return;
  }

  // Agregar valores adicionales al objeto profileData
  Object.assign(profileData, {
    userUid: uid,
    fechaCreacion,
    ultimaVezAcceso: serverTimestamp(),
  });

  try {
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
    console.error('Error al guardar el perfil:', error);
  }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Obtener el botón de Guardar Perfil desde el DOM
  const saveProfileButton = document.getElementById('saveProfileButton');

  // Agregar un event listener al botón
  saveProfileButton.addEventListener('click', async () => {
    // Llamar a la función para guardar o actualizar el perfil en Firestore
    await saveProfile();
  });

  // Escuchar cambios en el estado de autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuario autenticado, mostrar UID y correo en la consola
      obtenerUIDyCorreo();
    } else {
      console.log('Usuario no autenticado');
    }
  });
});
