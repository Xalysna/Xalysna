// Importaciones de módulos Firebase
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// Inicializar Firebase con la configuración importada
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);



// Función para manejar la solicitud de cambio de dirección de correo electrónico
async function handleChangeEmailForm(newEmail) {
  try {
    console.log('Enviando solicitud de cambio de dirección de correo electrónico para:', newEmail);

    // Verificar si el correo electrónico es válido antes de enviar la solicitud
    if (!isValidEmail(newEmail)) {
      throw new Error('Correo electrónico no válido.');
    }

    const actionCodeSettings = {
      url: 'https://tu-sitio-web.com/dashboard/auth/action/change-email-successful.html',
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, newEmail, actionCodeSettings);

    console.info('Correo electrónico de cambio enviado correctamente.');

    // Redirigir a la página de confirmación de envío de correo electrónico exitosa
    window.location.href = '/dashboard/auth/action/send-mail-change-email-successful.html';
  } catch (error) {
    console.error('Error al enviar el correo electrónico de cambio:', error.message);
    // Mostrar el error en la página
    document.getElementById('errorMessageChangeEmail').textContent = `Error: ${error.message}`;
  }
}



// Función para manejar la verificación y cambio de dirección de correo electrónico
async function handleVerifyAndChangeEmailForm(newEmail, oobCode) {
  try {
    console.log('Verificando y cambiando la dirección de correo electrónico...');
    console.log('Nuevo Correo Electrónico:', newEmail);
    console.log('Código OOB:', oobCode);

    // Verificar que el código OOB esté presente
    if (!oobCode) {
      console.error('Código OOB no válido.');
      // Mostrar el mensaje en la página
      document.getElementById('errorMessageChangeEmail').textContent = 'Código OOB no válido.';
      return;
    }

    // Verificar si el enlace es válido
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Confirmar la dirección de correo electrónico
      await signInWithEmailLink(auth, newEmail, window.location.href);

      console.info('Cambio de dirección de correo electrónico confirmado correctamente.');

      // Redirigir a la página de verificación exitosa
      window.location.href = '/dashboard/auth/action/change-email-successful.html';
    } else {
      console.error('Enlace no válido para confirmar el cambio de dirección de correo electrónico.');
      // Redirigir a la página de error en cambio de dirección de correo electrónico
      window.location.href = '/dashboard/auth/action/change-email-error.html';
    }
  } catch (error) {
    console.error('Error al cambiar la dirección de correo electrónico:', error.message);

    // Verificar si el error se debe a un código OOB no válido
    if (error.code === 'auth/expired-action-code' || error.code === 'auth/invalid-action-code') {
      // Redirigir a la página de error en cambio de dirección de correo electrónico
      window.location.href = '/dashboard/auth/action/change-email-error.html';
    } else {
      // Mostrar el error en la página
      document.getElementById('errorMessageChangeEmail').textContent = `Error: ${error.message}`;
    }
  }
}

// Función para validar la dirección de correo electrónico
function isValidEmail(email) {
  // Puedes implementar una lógica más avanzada para validar el formato del correo electrónico
  return /\S+@\S+\.\S+/.test(email);
}

// Función para obtener el código OOB de la URL
function getOobCodeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('oobCode');
}

// Función para almacenar el código OOB en sessionStorage
function storeOobCodeInSession(oobCode) {
  sessionStorage.setItem('oobCode', oobCode);
}

// Función para obtener el código OOB de sessionStorage
function getOobCodeFromSession() {
  return sessionStorage.getItem('oobCode');
}

// Obtener el código OOB de sessionStorage
let oobCode = sessionStorage.getItem('oobCode');
console.log('Código OOB obtenido de sessionStorage:', oobCode);

// Si no se encuentra el código OOB en sessionStorage, intentar obtenerlo de la URL
if (!oobCode) {
  oobCode = getOobCodeFromUrl();
  console.log('Código OOB obtenido de la URL:', oobCode);
}

// Detectar la página actual
const currentPage = window.location.pathname;

// Manejar eventos según la página actual
if (currentPage === '/dashboard/auth/action/change-email.html') {
  // Página de cambio de dirección de correo electrónico
  const changeEmailForm = document.getElementById('changeEmailForm');
  if (changeEmailForm) {
    changeEmailForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const newEmail = document.getElementById('newEmail').value;
      await handleChangeEmailForm(newEmail);
    });
  }
} else if (currentPage === '/dashboard/auth/action/send-mail-change-email.html') {
  // Página de solicitud de cambio de dirección de correo electrónico
  const sendMailChangeEmailForm = document.getElementById('sendMailChangeEmailForm');
  if (sendMailChangeEmailForm) {
    sendMailChangeEmailForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const newEmail = document.getElementById('newEmail').value;

      // Verificar si el código OOB está presente en sessionStorage
      if (!oobCode) {
        console.error('Código OOB no válido.');
        // Redirigir a la página de error en cambio de dirección de correo electrónico
        window.location.href = '/dashboard/auth/action/change-email-error.html';
        return;
      }

      await handleVerifyAndChangeEmailForm(newEmail, oobCode);
    });
  }
}
