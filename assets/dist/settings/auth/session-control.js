// Importar la configuración de Firebase
import { firebaseConfig } from "../config/firebase-config.js";
import { FIREBASE_APP_URL, FIREBASE_AUTH_URL } from "../config/firebase-config-urls.js";

// Imprimir las URLs para verificar que estén configuradas correctamente
console.log("FIREBASE_APP_URL:", FIREBASE_APP_URL);
console.log("FIREBASE_AUTH_URL:", FIREBASE_AUTH_URL);

// Importar las funciones necesarias del SDK de Firebase de forma dinámica
const { initializeApp } = await import(FIREBASE_APP_URL);
const { getAuth } = await import(FIREBASE_AUTH_URL);

// Inicializar Firebase con la configuración importada
const app = initializeApp(firebaseConfig);

// Obtén la instancia de autenticación de Firebase
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
  var repositoryFolder = document.getElementById('repository');
  var logoutButton = document.getElementById('logout-button');
  var loginButton = document.getElementById('login-button');
  var signupButton = document.getElementById('signup-button');

  // Verificar el estado del caché inmediatamente al cargar
  updateUIBasedOnAuth(localStorage.getItem('isUserLoggedIn') === 'true');

  auth.onAuthStateChanged(function(user) {
    if (user) {
      // El usuario ha iniciado sesión
      localStorage.setItem('isUserLoggedIn', 'true'); // Actualizar el estado del caché
      updateUIBasedOnAuth(true);
    } else {
      // El usuario no ha iniciado sesión
      localStorage.setItem('isUserLoggedIn', 'false'); // Actualizar el estado del caché
      updateUIBasedOnAuth(false);
    }
  });

  function updateUIBasedOnAuth(isLoggedIn) {
    if (isLoggedIn) {
      showElement(repositoryFolder);
      showElement(logoutButton);
      hideElement(loginButton);
      hideElement(signupButton);
    } else {
      hideElement(repositoryFolder);
      hideElement(logoutButton);
      showElement(loginButton);
      showElement(signupButton);
    }
  }

  function showElement(element) {
    if (element) {
      element.style.display = 'block';
    }
  }

  function hideElement(element) {
    if (element) {
      element.style.display = 'none';
    }
  }
});