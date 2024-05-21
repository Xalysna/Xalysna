// Importar la configuración de Firebase
import { firebaseConfig } from "../settings/config/firebase-config.js";
import { FIREBASE_APP_URL, FIREBASE_AUTH_URL, } from "../settings/config/firebase-config-urls.js";

// Imprimir las URLs para verificar que estén configuradas correctamente
console.log("FIREBASE_APP_URL:", FIREBASE_APP_URL);
console.log("FIREBASE_AUTH_URL:", FIREBASE_AUTH_URL);

// Importar los módulos de Firebase desde el CDN
const { initializeApp } = await import(FIREBASE_APP_URL);
const { getAuth, onAuthStateChanged, signOut } = await import(FIREBASE_AUTH_URL);

// Inicializar Firebase con la configuración importada
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();


// Verificar el estado de autenticación cuando se cargue la página
if (firebaseApp) {
  onAuthStateChanged(auth, toggleElementsBasedOnAuthState);
}

// Función para mostrar el estado de autenticación
function showAuthStatus() {
  const user = auth.currentUser;
  const signOutButton = document.getElementById('logout-button');
  
  if (user) {
    // El usuario está autenticado
    signOutButton.style.display = 'inline-block';
  } else {
    // El usuario no está autenticado
    signOutButton.style.display = 'none';
  }
}


// Función para habilitar o deshabilitar elementos según el estado de autenticación
function toggleElementsBasedOnAuthState() {
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');
  const signupButton = document.getElementById('signup-button');
  const user = auth.currentUser;

    // Declara y asigna valor a panelElement
    const panelElement = document.createElement('panel');
    // Limpiar el panel antes de agregar los botones
    panelElement.innerHTML = '';
    // Agregar el panel al cuerpo del documento
    document.body.appendChild(panelElement);

  if (loginButton && logoutButton && signupButton) {
    // Mostrar el estado de autenticación
    showAuthStatus();

    if (user) {
      // El usuario está autenticado
      loginButton.style.display = 'none'; // Ocultar el botón de inicio de sesión
      logoutButton.style.display = 'block'; // Mostrar el botón de cerrar sesión
      signupButton.style.display = 'none'; // Ocultar el botón de registrarse
    } else {
      // El usuario no está autenticado
      loginButton.style.display = 'block'; // Mostrar el botón de inicio de sesión
      logoutButton.style.display = 'none'; // Ocultar el botón de cerrar sesión
      signupButton.style.display = 'inline-block'; // Mostrar el botón de registrarse
    }

// Limpiar el panel antes de agregar los botones
panelElement.innerHTML = '';

// Agregar el panel al cuerpo del documento
document.body.appendChild(panelElement);

  }

  if (signupButton) {
    // Manejador de evento para el botón de registrarse
    signupButton.addEventListener('click', () => {
      // Redirigir al usuario a la página de registro
      window.location.href = '/dashboard/auth/signup.html';
    });
  }
}

// Obtener el elemento del botón de inicio de sesión
const loginButton = document.getElementById('login-button');

// Obtener el elemento del botón de cerrar sesión
const logoutButton = document.getElementById('logout-button');

if (loginButton) {
  // Manejador de evento para el botón de inicio de sesión
  loginButton.addEventListener('click', () => {
    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = '/dashboard/auth/login.html';
  });
}

if (logoutButton) {
  // Manejador de evento para el botón de cerrar sesión
  logoutButton.addEventListener('click', () => {
    // Cerrar sesión del usuario
    signOut(auth)
      .then(() => {
        // Redirigir al usuario a la página de inicio
        window.location.href = '../index.html';
      })
      .catch(error => {
        // Manejar errores
        console.log(error.message);
      });
  });
}