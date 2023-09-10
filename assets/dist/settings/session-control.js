// Importar la configuración de Firebase desde firebase-config.js
import { firebaseConfig } from './firebase-config.js';

// Importar las funciones necesarias del SDK de Firebase desde los CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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
