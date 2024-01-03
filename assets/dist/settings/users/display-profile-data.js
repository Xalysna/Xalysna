// Importaciones de módulos Firebase
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// Inicializar la aplicación Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();

// Función para obtener el UID y el correo del usuario actual
function obtenerUIDyCorreo() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Detener el listener después de la primera ejecución
      if (user) {
        console.log('Usuario autenticado');
        console.log('UID:', user.uid);
        console.log('Correo:', user.email);
        resolve({ uid: user.uid, email: user.email });
      } else {
        console.log('Usuario no autenticado');
        reject(new Error('Usuario no autenticado'));
      }
    });
  });
}

// Función para mostrar la información en la consola y en el HTML
async function displayProfileData() {
  try {
    // Obtener el UID y el correo del usuario actual
    const user = await obtenerUIDyCorreo();

    if (user) {
      const usuarioId = user.uid;
      console.log('UID del usuario actual:', usuarioId);

      // Construir la referencia al documento usando la colección "USERS" y el UID como nombre del documento
      const userDocRef = doc(db, 'USERS', usuarioId);
      console.log('Referencia al documento del usuario:', userDocRef);

      // Obtener el documento del usuario
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        console.log('El documento del usuario existe');
        // Obtener los datos del documento
        const userData = userDocSnapshot.data();
        console.log('Datos del usuario:', userData);

        // Mostrar datos en el HTML con comprobación de null o undefined
        setElementTextContent('fullName', userData && userData.fullName);
        setElementTextContent('alias', userData && userData.alias);
        setElementTextContent('userEmail', userData && userData.userEmail);
        setElementTextContent('phone', userData && userData.phone);
        setElementTextContent('locationCity', userData && userData.locationCity);
        setElementTextContent('locationCountry', userData && userData.locationCountry);
        setElementTextContent('locationPlanet', userData && userData.locationPlanet);
        setElementTextContent('bio', userData && userData.bio);
        setElementTextContent('edad', userData && userData.edad);
        setElementTextContent('profesion', userData && userData.profesion);
        setElementTextContent('intereses', userData && userData.intereses);

        // Redes Sociales
        setElementContent('facebook', 'https://www.facebook.com/' + (userData && userData.facebook), true);
        setElementContent('instagram', 'https://www.instagram.com/' + (userData && userData.instagram), true);
        setElementContent('youtube', 'https://www.youtube.com/' + (userData && userData.youtube), true);
        setElementContent('twitter', 'https://www.twitter.com/' + (userData && userData.twitter), true);
        setElementContent('tiktok', 'https://www.tiktok.com/' + (userData && userData.tiktok), true);
        setElementContent('vk', 'https://vk.com/' + (userData && userData.vk), true);

        // Otros datos
        setElementTextContent('userCryptoWalletAddress', userData && userData.userCryptoWalletAddress);
        setElementTextContent('userUid', usuarioId);
        setElementTextContent('fechaCreacion', userData && userData.fechaCreacion);

        // Formatear la fecha de "visto por última vez"
        const lastSeenTimestamp = userData && userData.ultimaVezAcceso;
        const formattedLastSeen = lastSeenTimestamp ? getCurrentFormattedDateTime(lastSeenTimestamp) : '';
        setElementTextContent('ultimaVezAcceso', formattedLastSeen); 

      } else {
        console.error('El documento del usuario no existe');
      }
    }
  } catch (error) {
    console.error('Error al obtener y mostrar datos:', error);
    throw error; // Propagar el error para que pueda ser manejado externamente si es necesario
  }
}

// Función para obtener la fecha y hora actual en el formato deseado
function getCurrentFormattedDateTime(timestamp) {
  const currentDate = new Date(timestamp.seconds * 1000); // Convertir segundos a milisegundos

  // Días de la semana en inglés
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = daysOfWeek[currentDate.getUTCDay()];

  // Meses en inglés
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[currentDate.getUTCMonth()];

  const day = currentDate.getUTCDate();
  const year = currentDate.getUTCFullYear();
  const hour = currentDate.getUTCHours().toString().padStart(2, '0');
  const minute = currentDate.getUTCMinutes().toString().padStart(2, '0');
  const second = currentDate.getUTCSeconds().toString().padStart(2, '0');

  return `${dayOfWeek}, ${day} ${month} ${year} ${hour}:${minute}:${second} GMT`;
}


// Función para establecer el contenido de un elemento de texto o un enlace
function setElementContent(elementId, content, isLink = false) {
  const element = document.getElementById(elementId);
  if (element) {
    if (isLink) {
      element.innerHTML = `<a href="${content}" target="_blank" rel="noopener noreferrer">${element.textContent}</a>`;
    } else {
      element.textContent = content || '';
    }
    console.log(`Contenido del elemento ${elementId} actualizado a:`, content);
  }
}

// Función para establecer el contenido de un elemento de texto
function setElementTextContent(elementId, content) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = content || '';
    console.log(`Contenido del elemento ${elementId} actualizado a:`, content);
  }
}

// Función para establecer el valor de un elemento de entrada
function setElementValue(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.value = value || '';
    console.log(`Valor del elemento de entrada ${elementId} actualizado a:`, value);
  }
}

// Llamar a la función para mostrar la información al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Página cargada. Iniciando la visualización de datos del perfil.');
    await displayProfileData();
    console.log('Visualización de datos del perfil completada.');
  } catch (error) {
    console.error('Error durante la visualización de datos del perfil:', error);
  }
});
