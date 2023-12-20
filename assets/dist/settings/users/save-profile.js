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

  // Obtener los valores de los campos de entrada desde el formulario HTML
  const fullName = document.getElementById('fullName');
  const alias = document.getElementById('alias');
  const userEmail = document.getElementById('userEmail'); 
  const phone = document.getElementById('phone');
  const locationCity = document.getElementById('locationCity');
  const locationCountry = document.getElementById('locationCountry');
  const locationPlanet = document.getElementById('locationPlanet');
  const bio = document.getElementById('bio');
  const edad = document.getElementById('edad');
  const profesion = document.getElementById('profesion');
  const intereses = document.getElementById('intereses');
  const facebook = document.getElementById('facebook');
  const instagram = document.getElementById('instagram');
  const youtube = document.getElementById('youtube');
  const twitter = document.getElementById('twitter');
  const linkedin = document.getElementById('linkedin');
  const wechat = document.getElementById('wechat');
  const tiktok = document.getElementById('tiktok');
  const vk = document.getElementById('vk');
  const userCryptoWalletAddress = document.getElementById('userCryptoWalletAddress');

  // Validar que todos los elementos estén presentes
  if (
    !fullName || !alias || !userEmail || !phone ||
    !locationCity || !locationCountry || !locationPlanet ||
    !bio || !edad || !profesion || !intereses || 
    !facebook || !instagram || !youtube || !twitter || 
    !linkedin || !wechat || !tiktok || !vk || !userCryptoWalletAddress
  ) {
    console.error('No se encontraron todos los elementos del formulario.');
    return;
  }

  // Obtener los valores de los campos de entrada desde el formulario HTML
  const fullNameValue = fullName.value;
  const aliasValue = alias.value;
  const userEmailValue = userEmail.value; 
  const phoneValue = phone.value;
  const locationCityValue = locationCity.value;
  const locationCountryValue = locationCountry.value;
  const locationPlanetValue = locationPlanet.value;
  const bioValue = bio.value;
  const edadValue = edad.value;
  const profesionValue = profesion.value;
  const interesesValue = intereses.value;
  const facebookValue = facebook.value;
  const instagramValue = instagram.value;
  const youtubeValue = youtube.value;
  const twitterValue = twitter.value;
  const linkedinValue = linkedin.value;
  const wechatValue = wechat.value;
  const tiktokValue = tiktok.value;
  const vkValue = vk.value;
  const userCryptoWalletAddressValue = userCryptoWalletAddress.value;

  // Validar campos obligatorios
  if (!fullNameValue || !aliasValue || !userEmailValue) {
    console.error('Por favor, complete los campos obligatorios.');
    return;
  }

  // Supongamos que tienes un objeto llamado "profileData" con los valores del perfil desde el formulario HTML
  const profileData = {
    fullName: fullNameValue,
    alias: aliasValue,
    userEmail: userEmailValue,
    phone: phoneValue,
    locationCity: locationCityValue,
    locationCountry: locationCountryValue,
    locationPlanet: locationPlanetValue,
    bio: bioValue,
    edad: edadValue,
    profesion: profesionValue,
    intereses: interesesValue,
    facebook: facebookValue,
    instagram: instagramValue,
    youtube: youtubeValue,
    twitter: twitterValue,
    linkedin: linkedinValue,
    wechat: wechatValue,
    tiktok: tiktokValue,
    vk: vkValue,
    userCryptoWalletAddress: userCryptoWalletAddressValue,
    userUid: uid,
    fechaCreacion,
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
