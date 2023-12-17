// Importaciones de módulos Firebase
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithRedirect, getRedirectResult } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// Inicializar Firebase con la configuración importada
const firebaseApp = initializeApp(firebaseConfig);

// Obtener una instancia de autenticación de Firebase
const auth = getAuth(firebaseApp);

document.addEventListener('DOMContentLoaded', () => {
  const googleLoginButton = document.getElementById('googleSignupButton');
  const registerButton = document.getElementById('registerButton');

  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', () => loginWithGoogle());
  }

  if (registerButton) {
    registerButton.addEventListener('click', () => registerWithEmailAndPassword());
  }

  function loginWithGoogle() {
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


  function registerWithEmailAndPassword() {
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
    return `../auth/action/verificacion.html?${actionURL}&oobCode=${user.uid}`;
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
    window.location.href = '../../../index.html';
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
});
