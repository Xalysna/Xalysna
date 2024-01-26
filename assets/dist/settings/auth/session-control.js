// Importar la configuración de Firebase desde firebase-config.js
import { firebaseConfig } from "../config/firebase-config.js";
import { firebaseUrls } from "../config/firebase-config-urls.js";

// Importar las funciones necesarias del SDK de Firebase desde los CDN
import { initializeApp } from firebaseUrls.app;
import { getAuth } from firebaseUrls.auth;

// Inicializar Firebase con la configuración importada
const app = initializeApp(firebaseConfig);

// Obtén la instancia de autenticación de Firebase
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
  var repositoryFolder = document.getElementById('repository');
  var logoutButton = document.getElementById('logout-button');

  auth.onAuthStateChanged(function(user) {
    if (user) {
      // El usuario ha iniciado sesión
      showElement(repositoryFolder);
      showElement(logoutButton);
    } else {
      // El usuario no ha iniciado sesión
      hideElement(repositoryFolder);
      hideElement(logoutButton);
    }
  });

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
