// Espera a que se cargue el contenido del documento HTML
document.addEventListener('DOMContentLoaded', () => {
  // Obtener referencias a los elementos del formulario y los mensajes de error
  const form = document.getElementById('registerForm');
  const emailInput = document.getElementById('emailRegister');
  const passwordInput = document.getElementById('passwordRegister');
  const emailError = document.getElementById('errorEmail'); // Corregir el ID del emailError
  const passwordError = document.getElementById('errorPasswordRegister');

  // Agregar event listeners para validar en tiempo real mientras se escribe
  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', validatePassword);

  // Agregar event listener para manejar el envío del formulario
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío por defecto
    validateForm(); // Llama a la función principal de validación
  });

  // Validar el formulario una vez al cargar la página
  validateForm();

  // Función para validar el formato del correo electrónico
  function validateEmail() {
    const email = emailInput.value.trim();

    // Verificar si el campo está vacío antes de realizar la validación
    if (email === '') {
      setValidity(emailInput, emailError, false, 'Por favor, ingrese un correo electrónico');
      return;
    }

    const isValidFormat = validateEmailFormat(email);

    setValidity(emailInput, emailError, isValidFormat, 'El formato del correo electrónico es inválido');

    // Si el correo es válido, notificar sobre la contraseña
    if (isValidFormat) {
      passwordInput.removeAttribute('disabled');
    } else {
      passwordInput.setAttribute('disabled', 'disabled');
      passwordInput.value = ''; // Limpiar el campo de contraseña si el correo no es válido
    }
  }

  // Función para validar el formato de la contraseña
  function validatePassword() {
    const password = passwordInput.value.trim();

    // Verificar si el campo está vacío antes de realizar la validación
    if (password === '') {
      setValidity(passwordInput, passwordError, false, 'Por favor, ingrese una contraseña');
      return;
    }

    const isValidFormat = validatePasswordFormat(password);

    setValidity(passwordInput, passwordError, isValidFormat, 'La contraseña no cumple con los requisitos');
  }

  // Función para establecer la validez y mostrar mensajes de error
  function setValidity(inputElement, errorElement, isValid, errorMessage) {
    if (isValid) {
      inputElement.classList.remove('is-invalid');
      errorElement.textContent = '';
    } else {
      inputElement.classList.add('is-invalid');
      errorElement.textContent = errorMessage;
    }
  }

  // Función para validar el formato del correo electrónico
  function validateEmailFormat(email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  // Función para validar el formato de la contraseña
  function validatePasswordFormat(password) {
    // Requisitos: más de 8 caracteres, al menos una minúscula, una mayúscula y un carácter especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{9,}$/;
    return passwordRegex.test(password);
  }

  // Función principal para validar todo el formulario
  function validateForm() {
    validateEmail();
    validatePassword();

    const invalidInputs = document.querySelectorAll('.is-invalid');

    if (invalidInputs.length === 0) {
      // No hay errores, puedes enviar el formulario aquí
      console.log('Formulario válido. Enviando...');
      form.submit(); // Enviar el formulario si no hay errores
    } else {
      // No mostrar mensajes de error generales en caso de campos inválidos
      // alert('Por favor, corrija los errores antes de enviar el formulario.');
    }
  }
});
