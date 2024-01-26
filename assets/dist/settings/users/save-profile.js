// Importar la configuración de Firebase desde firebase-config.js
import { firebaseConfig } from "../config/firebase-config.js";
import { firebaseUrls } from "../config/firebase-config-urls.js";

// Importar las funciones necesarias del SDK de Firebase desde los CDN
import { initializeApp } from firebaseUrls.app;
import { getAuth, onAuthStateChanged } from firebaseUrls.auth;
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } from firebaseUrls.firestore;

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

  // Obtener el tipo de usuario seleccionado desde el formulario HTML
  const tipoUsuario = document.getElementById('tipoFormulario').value;

  // Validar que se haya seleccionado un tipo de usuario
  if (!tipoUsuario) {
    console.error('Por favor, seleccione un tipo de usuario.');
    return;
  }

  // Obtener los valores de los campos del formulario específicos para cada tipo de usuario
  let camposEspecificos = {};

  switch (tipoUsuario) {
    case 'Persona':
      camposEspecificos = {
        nombrePersona: getValue('nombrePersona'),
        apellidoPersona: getValue('apellidoPersona'),
        diaNacimientoPersona: getValue('diaNacimientoPersona'),
        mesNacimientoPersona: getValue('mesNacimientoPersona'),
        anoNacimientoPersona: getValue('anoNacimientoPersona'),
        generoPersona: getValue('generoPersona'),
        hobby: getValue('hobby'),
        intereses: getValue('intereses'),
        profesion: getValue('profesion'),
      };
      break;

    case 'Empresa':
      camposEspecificos = {
        nombreEmpresa: getValue('nombreEmpresa'),
        industria: getValue('industria'),
        sloganEmpresa: getValue('sloganEmpresa'),
        creacionempresa: getValue('creacionempresa'),
        creacionempresaEspecifico: getValue('creacionempresaEspecifico'),
        mision: getValue('mision'),
        vision: getValue('vision'),
        objetivos: getValue('objetivos'),
      };
      break;

    case 'Marca':
      camposEspecificos = {
        nombreMarca: getValue('nombreMarca'),
        categoriaMarca: getValue('categoriaMarca'),
        sloganMarca: getValue('sloganMarca'),
        creacionMarca: getValue('creacionMarca'),
        creacionMarcaEspecifico: getValue('creacionMarcaEspecifico'),
        objetivosMarca: getValue('objetivosMarca'),
      };
      break;

    default:
      console.error('Tipo de usuario no reconocido.');
      return;
  }

  // Obtener campos comunes a todos los tipos de usuario
  const camposComunes = {
    usernameId: getValue('usernameId'),
    userEmail: getValue('userEmail'),
    codigoPais: getValue('codigoPais'),
    phone: getValue('phone'),
    sitioWeb: getValue('sitioWeb'),
    locationCountry: getValue('locationCountry'),
    locationState: getValue('locationState'),
    locationCity: getValue('locationCity'),
    ubicacionEspacial: getValue('ubicacionEspacial'),
    horariosDisponibilidad: getValue('horariosDisponibilidad'),
    userCryptoWalletAddress: getValue('userCryptoWalletAddress'),
    favoriteCryptos: getValue('favoriteCryptos'),
    favoriteExchange: getValue('favoriteExchange'),
    listaRedes: getValue('listaRedes'),
  };

  // Combinar campos específicos y comunes
  const profileData = {
    ...camposEspecificos,
    ...camposComunes,
    tipo: tipoUsuario,
    userUid: uid,
    fechaCreacion: auth.currentUser.metadata.creationTime,
    ultimaVezAcceso: serverTimestamp(),
  };

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

// Función auxiliar para obtener el valor de un campo HTML
function getValue(elementId) {
  const element = document.getElementById(elementId);
  return element ? element.value : '';
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
