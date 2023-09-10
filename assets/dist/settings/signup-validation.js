document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const emailInput = document.getElementById('emailRegister');
  const confirmEmailInput = document.getElementById('confirmEmailRegister');
  const passwordInput = document.getElementById('passwordRegister');
  const confirmPasswordInput = document.getElementById('confirmPasswordRegister');
  const emailError = document.getElementById('errorEmail');
  const confirmEmailError = document.getElementById('errorConfirmEmail');
  const passwordError = document.getElementById('errorPassword');
  const confirmPasswordError = document.getElementById('errorConfirmPassword');

  emailInput.addEventListener('input', validateEmail);
  confirmEmailInput.addEventListener('input', validateConfirmEmail);
  passwordInput.addEventListener('input', validatePassword);
  confirmPasswordInput.addEventListener('input', validateConfirmPassword);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    validateForm();
  });

  validateForm();

  function validateEmail() {
    const email = emailInput.value.trim();
    const isValidFormat = validateEmailFormat(email);

    setValidity(emailInput, emailError, isValidFormat, 'El formato del correo electrónico es inválido');
  }

  function validateConfirmEmail() {
    const email = emailInput.value.trim();
    const confirmEmail = confirmEmailInput.value.trim();
    const areEmailsMatching = email === confirmEmail;

    setValidity(confirmEmailInput, confirmEmailError, areEmailsMatching, 'El correo electrónico no coincide');
  }

  function validatePassword() {
    const password = passwordInput.value.trim();
    const isValidFormat = validatePasswordFormat(password);

    setValidity(passwordInput, passwordError, isValidFormat, 'La contraseña no cumple con los requisitos');
  }

  function validateConfirmPassword() {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const arePasswordsMatching = password === confirmPassword;

    setValidity(confirmPasswordInput, confirmPasswordError, arePasswordsMatching, 'Las contraseñas no coinciden');
  }

  function setValidity(inputElement, errorElement, isValid, errorMessage) {
    if (isValid) {
      inputElement.classList.remove('is-invalid');
      errorElement.textContent = '';
    } else {
      inputElement.classList.add('is-invalid');
      errorElement.textContent = errorMessage;
    }
  }

  function validateEmailFormat(email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  function validatePasswordFormat(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    return passwordRegex.test(password);
  }

  function validateForm() {
    validateEmail();
    validateConfirmEmail();
    validatePassword();
    validateConfirmPassword();

    const invalidInputs = document.querySelectorAll('.is-invalid');

    if (invalidInputs.length === 0) {
      form.submit();
    } else {
      // Mostrar mensajes de error generales en caso de que haya campos inválidos
      alert('Por favor, corrija los errores antes de enviar el formulario.');
    }
  }
});
