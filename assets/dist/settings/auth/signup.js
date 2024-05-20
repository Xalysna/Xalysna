// Importar la configuración de Firebase
import { firebaseConfig } from "../config/firebase-config.js";
import { FIREBASE_APP_URL, FIREBASE_AUTH_URL } from "../config/firebase-config-urls.js";

// Imprimir las URLs para verificar que estén configuradas correctamente
console.log("FIREBASE_APP_URL:", FIREBASE_APP_URL);
console.log("FIREBASE_AUTH_URL:", FIREBASE_AUTH_URL);

// Importar las funciones necesarias del SDK de Firebase de forma dinámica
const { initializeApp } = await import(FIREBASE_APP_URL);
const { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithRedirect, getRedirectResult, GoogleAuthProvider } = await import(FIREBASE_AUTH_URL);

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const baseUrl = window.location.origin;
const googleLoginButton = document.getElementById('googleLoginButton');
const registerButton = document.getElementById('registerButton');

if (googleLoginButton) {
  googleLoginButton.addEventListener('click', () => loginWithGoogle());
}

if (registerButton) {
  registerButton.addEventListener('click', () => submitRegisterForm());
}

function loginWithGoogle() {
  console.log('Función loginWithGoogle ejecutada');
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
}

// Manejar el resultado del redireccionamiento después de la carga de la página
getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      handleAuthResult(result.user);
    }
  })
  .catch((error) => {
    handleFirebaseError(error);
  });


function submitRegisterForm() {
  const emailInput = document.getElementById('emailRegister');
  const passwordInput = document.getElementById('passwordRegister');

  if (!emailInput || !passwordInput) {
    console.error('Error: Elementos de entrada no encontrados.');
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!isValidEmail(email) || password.length < 6) {
    console.error('Error: Campos de entrada inválidos.');
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user) {
        handleAuthResult(user);
      } else {
        console.error('Error: No se pudo obtener el usuario después de la creación de la cuenta.');
        handleFirebaseError({ code: 'user-not-found', message: 'No se pudo obtener el usuario después de la creación de la cuenta.' });
      }
    })
    .catch((error) => handleFirebaseError(error));
}

function sendVerificationEmail(user) {
  sendEmailVerification(auth.currentUser)
    .then(() => {
      redirectToVerificationPage(user);
    })
    .catch((error) => handleFirebaseError(error));
}

function redirectToVerificationPage(user) {
  const verificationUrl = buildVerificationURL(user);
  window.location.href = verificationUrl;
}

function buildVerificationURL(user) {
  const actionURL = getActionURL();
  return `${baseUrl}/public/dashboard/auth/action/verificacion.html?${actionURL}&oobCode=${user.uid}`;
}

function getActionURL() {
  return 'action=verifyEmail';
}

function handleAuthResult(user) {
  if (user && user.emailVerified) {
    redirectToMainPage();
  } else {
    // Si el correo no está verificado, envía el correo de verificación
    sendVerificationEmail(user);
  }
}

function redirectToMainPage() {
  console.log('Redirigiendo a la página principal...');
  window.location.href = 'create-account.html';
}

function isValidEmail(email) {
  // Implementación simple de validación de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function handleFirebaseError(error) {
  console.error('Error de Firebase:', error.code, error.message);

  switch (error.code) {
    default:
      console.error('Ocurrió un error durante la autenticación.');
  }
}