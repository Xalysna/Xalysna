// Importar la configuración de Firebase desde firebase-config.js
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, signInWithRedirect, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const baseUrl = window.location.origin;
const googleLoginButton = document.getElementById('googleLoginButton');
const loginButton = document.getElementById('loginButton');
const signupButton = document.querySelector('.signup-link');
const email = document.getElementById('emailLogin');
const password = document.getElementById('passwordLogin');
const errorElement = document.getElementById('errorMessage');

if (googleLoginButton) {
  googleLoginButton.addEventListener('click', () => loginWithGoogle());
}

if (loginButton) {
  loginButton.addEventListener('click', () => submitLoginForm());
}

if (signupButton) {
  signupButton.addEventListener('click', () => redirectToSignup());
}

// Función para iniciar sesión con Google
function loginWithGoogle() {
  signInWithRedirect(auth, new GoogleAuthProvider());
}

// Función para enviar el formulario de inicio de sesión con correo electrónico y contraseña
function submitLoginForm() {
  const emailValue = email.value.trim();
  const passwordValue = password.value;

  if (!emailValue || !passwordValue) {
    showErrorMessage('Ingresa un correo electrónico y una contraseña válidos');
    return;
  }

  signInWithEmailAndPassword(auth, emailValue, passwordValue)
    .then((result) => redirectToMainPage())
    .catch((error) => handleLoginError(error));
}

// Función para manejar errores de inicio de sesión
function handleLoginError(error) {
  if (error.code === 'auth/user-not-found') {
    showErrorMessage('El correo electrónico no está registrado. Regístrate primero.');
  } else {
    showErrorMessage('No se pudo iniciar sesión. Verifica tus credenciales.');
  }
}

// Redirigir a la página principal después de iniciar sesión
function redirectToMainPage() {
  const urlToIndex = `${baseUrl}/../../index.html`;
  window.location.href = urlToIndex;
}

// Redirigir a la página de registro
function redirectToSignup() {
  const urlToSignup = `${baseUrl}/signup.html`;
  window.location.href = urlToSignup;
}

// Mostrar mensajes de error y éxito
function showErrorMessage(message) {
  showErrorNotification(message);
}

function showSuccessMessage(message) {
  showSuccessNotification(message);
}

// Mostrar notificación de error
function showErrorNotification(message) {
  errorElement.textContent = message;
  errorElement.className = 'error-notification'; // Agrega la clase de notificación de error
  errorElement.style.display = 'block';
}

// Mostrar notificación de éxito
function showSuccessNotification(message) {
  errorElement.textContent = message;
  errorElement.className = 'success-notification'; // Agrega la clase de notificación de éxito
  errorElement.style.display = 'block';
}

// Comprobar el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Usuario autenticado:', user);
    redirectToMainPage(); // Redirigir si el usuario está autenticado
  } else {
    console.log('Usuario no autenticado');
  }
});
