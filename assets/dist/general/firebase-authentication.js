// Importar la configuración de Firebase desde firebase-config.js
import { firebaseConfig } from "./firebase-config.js";

// Importar los módulos necesarios del SDK de Firebase desde los enlaces CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Inicializar Firebase con la configuración importada
const firebaseApp = initializeApp(firebaseConfig);

// Obtener una instancia de autenticación de Firebase
const auth = getAuth(firebaseApp);

// Obtener referencia al botón de inicio de sesión con Google
const googleLoginButton = document.getElementById('googleLoginButton');

if (googleLoginButton) {
  // Agregar un event listener al botón de inicio de sesión con Google
  googleLoginButton.addEventListener('click', function() {
    // Iniciar el proceso de inicio de sesión con Google
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(function(result) {
        // El usuario ha iniciado sesión exitosamente con Google
        // Redirigirlo a la página principal
        window.location.href = "../index.html";
      })
      .catch(function(error) {
        // Hubo un error durante el inicio de sesión con Google
        // Manejo de errores específicos del inicio de sesión con Google
        if (error.code === 'auth/popup-closed-by-user') {
          console.log('El usuario cerró la ventana emergente de inicio de sesión.');
          // Puedes mostrar un mensaje al usuario informando que cerró la ventana emergente
        } else {
          console.error(error);
          // Puedes mostrar un mensaje de error al usuario o realizar otras acciones
        }
      });
  });
}

const emailInput = document.getElementById('emailLogin');
const passwordInput = document.getElementById('passwordLogin');
const registerButton = document.getElementById('registerButton');

if (registerButton) {
  registerButton.addEventListener('click', function() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === '') {
      console.error('El campo de correo electrónico está vacío.');
      return;
    }

    if (password === '') {
      console.error('El campo de contraseña está vacío.');
      return;
    }

    // Crear una cuenta de usuario con correo electrónico y contraseña
    createUserWithEmailAndPassword(auth, email, password)
      .then(function(userCredential) {
        // El usuario se registró exitosamente
        const user = userCredential.user;
        // Redirigirlo a la página de verificación de correo electrónico
        const verificationUrl = `../auth/action/verificacion.html?mode=action&oobCode=${user.uid}`;
        window.location.href = verificationUrl;
      })
      .catch(function(error) {
        // Hubo un error durante el registro
        const errorCode = error.code;
        const errorMessage = error.message;
        // Puedes mostrar un mensaje de error al usuario o realizar otras acciones
        console.error('Error durante el registro: ' + errorMessage);
      });
  });
}
