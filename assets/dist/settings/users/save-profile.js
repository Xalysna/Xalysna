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
const { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } = await import(FIREBASE_FIRESTORE_URL);

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de auth y firestore
const auth = getAuth(app);
const firestore = getFirestore(app);


// Función para obtener el UID y el correo del usuario actual
function obtenerUIDyCorreo() {
  const user = auth.currentUser;

  if (user) {
    console.group('%cDatos del Usuario', 'color: #2ecc71; font-weight: bold;');
    console.log('UID:', user.uid);
    console.log('Correo:', user.email);
    console.groupEnd();
    return { uid: user.uid, email: user.email };
  } else {
    console.group('%cUsuario no autenticado', 'color: #e74c3c; font-weight: bold;');
    console.log('Usuario no autenticado');
    console.groupEnd();
    return null;
  }
}


// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario autenticado, mostrar UID y correo en la consola
    obtenerUIDyCorreo();
  } else {
    console.log('Usuario no autenticado');
  }
});

// Función para guardar o actualizar el perfil en Firestore
export async function saveProfile() {
  // Obtener UID y correo del usuario actual
  const { uid, email } = obtenerUIDyCorreo();

  if (!uid) {
    console.error('No se pudo obtener el UID del usuario.');
    showNotification('Error al obtener el UID del usuario. Por favor, inicie sesión nuevamente.', 'error');
    return;
  }

  // Obtener referencia al documento del usuario en la colección "USERS"
  const userDocRef = doc(firestore, 'USERS', uid);

// Verificar si el documento ya existe
const docSnapshot = await getDoc(userDocRef);

if (!docSnapshot.exists()) {
  console.error('El documento del usuario no existe en Firestore.');
  return;
}

// Obtener los datos del documento
const userData = docSnapshot.data();

// Verificar si el campo 'estadoCuenta' ya existe y su valor es true
if (userData.hasOwnProperty('estadoCuenta') && userData.estadoCuenta === true) {
  console.log('El estado de la cuenta ya está establecido como true. No se actualizará.');
} else {
  // Si el campo 'estadoCuenta' no existe o su valor es false, continúa con la lógica de actualización o creación
}

  // Obtener el tipo de usuario seleccionado desde el formulario HTML
  let tipoUsuario = document.getElementById('tipoFormulario')?.value;

  // Si el elemento 'tipoFormulario' no existe, obtener el valor del elemento 'tipo'
  if (!tipoUsuario) {
    const tipoElement = document.getElementById('tipo');
    
    if (tipoElement) {
      tipoUsuario = tipoElement.textContent.trim();
    } else {
      console.error('Ni "tipoFormulario" ni "tipo" encontrados en el DOM.');
      return;
    }
  }

      // Obtener los valores de las redes sociales del formulario
      const listaRedes = obtenerListaRedes();
      

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

    default:
      console.error('Tipo de usuario no reconocido.');
      return;
  }

  /*
// Verificar que todos los campos específicos para el tipo de usuario estén completos
for (const campo in camposEspecificos) {
  if (document.getElementById(campo)) { // Verificar si el campo está presente en el HTML
    const valorCampo = camposEspecificos[campo];
    if (!valorCampo) {
      console.error(`Por favor, complete el campo ${campo}.`);
      showNotification(`Por favor, complete el campo ${campo}.`);
      return;
    }
  }
}
*/

  // Obtener campos comunes a todos los tipos de usuario
  const camposComunes = {
    usernameId: getValue('usernameId'),
    userEmail: getValue('userEmail'),
    codigoPais: getValue('codigoPais'),
    phone: getValue('phone'),
    sitioWeb: getValue('sitioWeb'),
    locationCountry: getTextValue('locationCountry'),
    locationState: getTextValue('locationState'),
    locationCity: getTextValue('locationCity'),
    ubicacionEspacial: getValue('ubicacionEspacial'),
    horariosDisponibilidad: getValue('horariosDisponibilidad'),
    userCryptoWalletAddress: getValue('userCryptoWalletAddress'),
    favoriteCryptos: getValue('favoriteCryptos'),
    favoriteExchange: getValue('favoriteExchange'),
    listaRedes: listaRedes.join(', '),
  };


  // Obtener valores para los campos de ubicación
  let locationCountry = getTextValue('locationCountry');
  let locationState = getTextValue('locationState');
  let locationCity = getTextValue('locationCity');

  // Obtener el documento existente en Firestore para verificar los campos de ubicación
  try {
    const docSnapshot = await getDoc(userDocRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      // Si los campos de ubicación están vacíos, recuperar los valores existentes de Firestore
      if (!locationCountry) locationCountry = userData.locationCountry;
      if (!locationState) locationState = userData.locationState;
      if (!locationCity) locationCity = userData.locationCity;
    }
  } catch (error) {
    console.error('Error al obtener el documento de usuario:', error);
    return;
  }

  // Combinar campos de ubicación si se proporcionaron valores
  if (locationCountry && locationState && locationCity) {
    camposComunes.locationCountry = locationCountry;
    camposComunes.locationState = locationState;
    camposComunes.locationCity = locationCity;
  }


  // Combinar campos específicos y comunes
  const profileData = {
    ...camposEspecificos,
    ...camposComunes,
    tipo: tipoUsuario,
    userUid: uid,
    fechaCreacion: auth.currentUser.metadata.creationTime,
    ultimaVezAcceso: serverTimestamp(),
    estadoCuenta: true,
  };

  try {
    // Verificar si el documento ya existe
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      // Si el documento existe, actualizar los datos
      await updateDoc(userDocRef, profileData);
      console.log('Perfil actualizado con éxito.');
      showNotification('Perfil actualizado con éxito!', 'success');
    } else {
      // Si el documento no existe, crear uno nuevo
      await setDoc(userDocRef, profileData);
      console.log('Perfil creado con éxito.');
      showNotification('Perfil creado con éxito!', 'success');
    }

    // Imprimir los datos que se están subiendo a Firestore
    console.log('Datos subidos a Firestore:', profileData);
  } catch (error) {
    console.error('Error al guardar el perfil:', error);
    showNotification('Error al guardar el perfil. Por favor, intente nuevamente.', 'error');
  }
}

// Función auxiliar para obtener la lista de redes sociales del formulario
function obtenerListaRedes() {
  const listaRedes = [];
  const redesContainer = document.getElementById("listaRedes");

  // Verificar si el contenedor de redes existe
  if (redesContainer) {
    const redes = redesContainer.getElementsByTagName("p");

    for (let i = 0; i < redes.length; i++) {
      const red = redes[i];
      const imgSrc = red.querySelector("img").getAttribute("src");
      const nombreRed = red.textContent.trim().split(":")[0];
      const textoRed = Array.from(red.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim();
      const usuario = textoRed.split(":")[1].trim();
      const elementoLista = `<img src="${imgSrc}" alt="${nombreRed} Icono"> ${nombreRed}: ${usuario}`;
      listaRedes.push(elementoLista);
    }
  } else {
    console.warn('El contenedor de redes no existe en el HTML.');
  }

  return listaRedes;
}



// Función auxiliar para obtener el valor de un campo HTML
function getValue(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const value = element.value;
    if (value === '') {
      console.log(`El campo ${elementId} está vacío.`);
    }
    return value;
  } else {
    console.log(`Elemento con ID ${elementId} no encontrado.`);
    return '';
  }
}

// Función auxiliar para obtener el texto de un elemento HTML
function getTextValue(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const text = element.textContent.trim();
    if (text === '') {
      console.log(`El elemento ${elementId} está vacío.`);
    }
    return text;
  } else {
    console.log(`Elemento con ID ${elementId} no encontrado.`);
    return '';
  }
}



// Función para subir datos a Firestore
window.uploadToFirestore = function () {
  // Llamar a la función para guardar o actualizar el perfil en Firestore
  saveProfile();
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Agregar un event listener al botón
  document.getElementById('saveProfileButton').addEventListener('click', async () => {    // Llamar a la función para guardar o actualizar el perfil en Firestore
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
