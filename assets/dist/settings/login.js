// Importaciones de módulos y configuraciones necesarios
import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// Inicialización de la aplicación Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Selección de elementos del DOM
const googleLoginButton = document.getElementById('googleLoginButton');
const loginButton = document.getElementById('loginButton');
const signupButton = document.querySelector('.signup-link');
const email = document.getElementById('emailLogin');
const password = document.getElementById('passwordLogin');
const errorElement = document.getElementById('errorMessage');

// Event listener para el botón de inicio de sesión con Google
if (googleLoginButton) {
  googleLoginButton.addEventListener('click', loginWithGoogle);
}

// Event listener para el botón de inicio de sesión con correo y contraseña
if (loginButton) {
  loginButton.addEventListener('click', submitLoginForm);
}

// Event listener para el botón de redirección al registro
if (signupButton) {
  signupButton.addEventListener('click', redirectToSignup);
}

// Función para iniciar sesión con Google
function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  handleHCaptcha()
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
      console.error('Error en hCaptcha:', error);
      showErrorMessage('Por favor, verifica que no eres un robot');
    });
}

// Función para enviar el formulario de inicio de sesión con correo y contraseña
function submitLoginForm() {
  const emailValue = email.value.trim();
  const passwordValue = password.value;

  if (!emailValue || !passwordValue) {
    showErrorMessage('Ingresa un correo electrónico y una contraseña válidos');
    return;
  }

  handleHCaptcha()
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
      console.error('Error en hCaptcha:', error);
      showErrorMessage('Por favor, verifica que no eres un robot');
    });
}

// Función para redirigir a la página principal después de un inicio de sesión exitoso
function redirectToMainPage() {
  window.location.href = 'no';
}

// Función para redirigir a la página de registro
function redirectToSignup() {
  window.location.href = '../auth/signup.html';
}

// Función para mostrar un mensaje de error en el DOM
function showErrorMessage(message) {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

// Función para manejar hCaptcha
function handleHCaptcha() {
  return new Promise((resolve, reject) => {
    const hcaptchaSiteKey = 'be2f837e-7ca8-47a0-b846-d01dab1f199f';
    const hcaptchaContainer = document.querySelector('[data-hcaptcha-sitekey]');

    if (hcaptchaContainer) {
      const hcaptchaScript = document.createElement('script');
      hcaptchaScript.src = 'https://hcaptcha.com/1/api.js';
      hcaptchaScript.async = true;

      hcaptchaScript.onload = function () {
        const hcaptchaDiv = document.createElement('div');
        hcaptchaDiv.setAttribute('class', 'h-captcha');
        hcaptchaDiv.setAttribute('data-sitekey', hcaptchaSiteKey);

        hcaptchaContainer.appendChild(hcaptchaDiv);

        window.hcaptcha.render(hcaptchaDiv, {
          'theme': 'light',
          'language': 'es',
          'onError': function (error) {
            console.error('Error en hCaptcha:', error);
            reject(error);
          },
          'onLoad': function () {
            console.log('hCaptcha se ha cargado correctamente');
          },
          'onSuccess': function (response) {
            console.log('hCaptcha se ha completado con éxito:', response);
            resolve(response);
          },
          'onExpire': function () {
            console.log('hCaptcha ha caducado debido a inactividad');
          },
          'onClose': function () {
            console.log('El usuario cerró el diálogo de hCaptcha sin completar el desafío');
          },
        });
      };

      document.body.appendChild(hcaptchaScript);

      hcaptchaScript.onerror = function () {
        console.error('Error al cargar la librería de hCaptcha');
        reject('Error al cargar la librería de hCaptcha');
      };
    } else {
      reject('Elemento con data-hcaptcha-sitekey no encontrado');
    }
  });
}

// Event listener para el cambio de estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Usuario autenticado:', user);
  } else {
    console.log('Usuario no autenticado');
  }
});
