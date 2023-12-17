// Importar la configuración de Firebase desde firebase-config.js
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, applyActionCode } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// Inicializar Firebase con la configuración importada
const firebaseApp = initializeApp(firebaseConfig);

// Obtener una instancia de autenticación de Firebase
const auth = getAuth(firebaseApp);

// Obtener los parámetros de la URL actual
const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get('oobCode');
const action = urlParams.get('action');
const mode = urlParams.get('mode');

// Verificar la dirección de correo electrónico en Firebase usando los parámetros
if (action === 'verifyEmail') {
  if (mode === 'verifyEmail') {
    // Realizar la verificación de correo y redirigir según corresponda
    applyActionCode(auth, oobCode)
      .then(() => {
        // Almacenar el código OOB en sessionStorage
        sessionStorage.setItem('oobCode', oobCode);

        window.location.href = '/dashboard/auth/action/verificacion_exitosa.html';
      })
      .catch((error) => {
        console.error('Error de verificación de correo:', error);

        switch (error.code) {
          case 'auth/expired-action-code':
            console.error('El código de acción expiró');
            window.location.href = '/dashboard/auth/action/verificacion_expirada.html';
            break;

          case 'auth/invalid-action-code':
            console.error('El código de acción es inválido');
            window.location.href = '/dashboard/auth/action/verificacion_invalida.html';
            break;

          default:
            console.error('Error desconocido de verificación de correo');
            window.location.href = '/dashboard/auth/action/verificacion_error.html';
            break;
        }
      });
  } else if (mode === 'resetPassword') {
    // Almacenar el código OOB en sessionStorage
    sessionStorage.setItem('oobCode', oobCode);

    // Redireccionar al usuario a la página de cambio de contraseña
    window.location.href = '/dashboard/auth/action/change-password.html';
  }
}
