document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('emailLogin');
  const passwordInput = document.getElementById('passwordLogin');
  const errorEmail = document.getElementById('errorEmail');
  const errorPassword = document.getElementById('errorPassword');

  if (form && emailInput && passwordInput) {
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      validateForm();
    });

    validateForm();
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    const isValidFormat = validateEmailFormat(email);
    const suggestionMessage = isValidFormat ? '' : 'Introduce un formato de correo válido';

    setValidity(emailInput, isValidFormat, errorEmail, 'El formato del correo electrónico es inválido', suggestionMessage);
  }

  function validatePassword() {
    const password = passwordInput.value.trim();
    const isValidFormat = validatePasswordFormat(password);
    const suggestionMessage = isValidFormat ? '' : 'La contraseña debe tener al menos 6 caracteres';

    setValidity(passwordInput, isValidFormat, errorPassword, 'La contraseña no cumple con los requisitos', suggestionMessage);
  }

  function setValidity(inputElement, isValid, errorElement, errorMessage, suggestionMessage) {
    if (isValid) {
      inputElement.classList.remove('is-invalid');
      errorElement.textContent = '';
    } else {
      inputElement.classList.add('is-invalid');
      errorElement.textContent = errorMessage;
      if (suggestionMessage) {
        errorElement.textContent += ' ' + suggestionMessage;
      }
    }
  }

  function validateEmailFormat(email) {
    // Expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  function validatePasswordFormat(password) {
    return password.length >= 6;
  }

  function validateForm() {
    validateEmail();
    validatePassword();

    const invalidInputs = document.querySelectorAll('.is-invalid');

    if (invalidInputs.length === 0) {
      // Realizar acciones de inicio de sesión aquí
      form.submit();
    }
  }
});
