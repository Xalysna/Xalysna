import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {getAuth,signInWithPopup,GoogleAuthProvider,signInWithEmailAndPassword,onAuthStateChanged,} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const googleLoginButton = document.getElementById('googleLoginButton');
const loginButton = document.getElementById('loginButton');
const signupButton = document.querySelector('.signup-link');
const email = document.getElementById('emailLogin');
const password = document.getElementById('passwordLogin');
const errorElement = document.getElementById('errorMessage');
if (errorElement) {
  const message = "Error message goes here"; // Define and assign a value to the message variable
  errorElement.textContent = message;
  errorElement.style.display = 'block';
} else {
  console.error('Element with ID "errorMessage" not found.');
}


if (googleLoginButton) {
  googleLoginButton.addEventListener('click', loginWithGoogle);
}

if (loginButton) {
  loginButton.addEventListener('click', submitLoginForm);
}

if (signupButton) {
  signupButton.addEventListener('click', redirectToSignup);
}

function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  handleRecaptchaToken()
    .then(() => {
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log('Inicio de sesión con Google exitoso:', result.user);
          redirectToMainPage();
        })
        .catch((error) => {
          console.error('Error en inicio de sesión con Google:', error);
          showErrorMessage('No se pudo iniciar sesión con Google');
        });
    })
    .catch((error) => {
      console.error('Error al verificar el token de reCAPTCHA:', error);
      showErrorMessage('Por favor, verifica que no eres un robot');
    });
}

function submitLoginForm() {
  const emailValue = email.value.trim();
  const passwordValue = password.value;

  if (!emailValue || !passwordValue) {
    showErrorMessage('Ingresa un correo electrónico y una contraseña válidos');
    return;
  }

  handleRecaptchaToken()
    .then(() => {
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((result) => {
          redirectToMainPage();
        })
        .catch((error) => {
          console.error('Error en inicio de sesión:', error);
          showErrorMessage('No se pudo iniciar sesión');
        });
    })
    .catch((error) => {
      console.error('Error al verificar el token de reCAPTCHA:', error);
      showErrorMessage('Por favor, verifica que no eres un robot');
    });
}

function redirectToMainPage() {
  window.location.href = '../index.html';
}

function redirectToSignup() {
  window.location.href = '../auth/signup.html';
}

function showErrorMessage(message) {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

function handleRecaptchaToken() {
  return new Promise((resolve, reject) => {
    // Implementa aquí la lógica para verificar el token de reCAPTCHA
    // Puedes usar la API de reCAPTCHA o cualquier otra solución que estés utilizando
    // Llama a resolve() si la verificación es exitosa y a reject() si hay algún error
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Usuario autenticado:', user);
  } else {
    console.log('Usuario no autenticado');
  }
});
