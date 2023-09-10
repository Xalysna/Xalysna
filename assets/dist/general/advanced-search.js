// Obtener el elemento del formulario de búsqueda
const searchForm = document.getElementById("search-form");
const searchButton = document.getElementById("search-button");

// Agregar un evento de envío de formulario
searchForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Evitar el envío del formulario por defecto
  const searchQuery = document.getElementById("search-input").value;

  // Validar la consulta de búsqueda
  if (validateSearchQuery(searchQuery)) {
    // Realizar acciones adicionales con la consulta de búsqueda
    performSearch(searchQuery);
    resetForm();
  } else {
    // Mostrar mensaje de error si la consulta no cumple con los requisitos
    showError("Por favor, ingresa una consulta de búsqueda válida (entre 3 y 50 caracteres).");
  }
});

// Agregar un evento de clic al botón de búsqueda
searchButton.addEventListener("click", function (event) {
  event.preventDefault(); // Evitar el envío del formulario por defecto
  searchForm.submit(); // Enviar el formulario manualmente
});

// Función para validar la consulta de búsqueda
function validateSearchQuery(query) {
  const trimmedQuery = query.trim();
  return trimmedQuery.length >= 3 && trimmedQuery.length <= 50;
}

// Función para mostrar mensajes de error
function showError(errorMessage) {
  const errorElement = document.getElementById("error-message");
  errorElement.textContent = errorMessage;
  errorElement.style.display = "block";
}

// Función para limpiar mensajes de error
function clearError() {
  const errorElement = document.getElementById("error-message");
  errorElement.textContent = "";
  errorElement.style.display = "none";
}

// Función para realizar la búsqueda
function performSearch(query) {
  // Aquí puedes implementar la lógica para enviar la consulta de búsqueda a una API o procesarla localmente
  console.log("Búsqueda realizada:", query);
}

// Función para reiniciar el formulario
function resetForm() {
  searchForm.reset();
}
