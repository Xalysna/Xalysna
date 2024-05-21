// Función para actualizar el título personalizado
function actualizarTituloPersonalizado() {
    // Obtener la parte del título personalizado
    var tituloPersonalizado = document.title.split(" - ")[0];

    // Obtener la referencia al elemento con id "titulo"
    var tituloElement = document.getElementById("titulo");

    // Crear un elemento <h2> para representar el título personalizado
    var h2Element = document.createElement("h2");
    h2Element.textContent = tituloPersonalizado;

    // Reemplazar el contenido del elemento con el nuevo <h2> en negrilla
    tituloElement.innerHTML = ""; // Eliminar cualquier contenido anterior
    tituloElement.appendChild(h2Element);
}

// Script para actualizar el contenido de #autor desde el meta tag "author"
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el contenido del meta tag "author"
    var authorMetaTag = document.querySelector('meta[name="author"]');
    var authorContent = authorMetaTag.getAttribute("content");

    // Obtener la referencia al elemento con id "autor"
    var autorElement = document.getElementById("autor");

    // Actualizar el contenido del elemento con el valor del meta tag en negrilla
    if (autorElement) {
        autorElement.innerHTML = "<strong>Autor:</strong> " + authorContent;
    }
});

// Obtener el contenido del meta tag "description"
var metaDescriptionMetaTag = document.querySelector('meta[name="description"]');
var metaDescriptionContent = metaDescriptionMetaTag.getAttribute("content");

// Obtener la mitad de la descripción
var mitadDescripcion = metaDescriptionContent.substring(0, Math.floor(metaDescriptionContent.length / 2));

// Agregar un punto al final si no está presente
if (mitadDescripcion.charAt(mitadDescripcion.length - 1) !== '.') {
    mitadDescripcion += '.';
}

// Obtener la referencia al elemento con id "metaDescripcion"
var metaDescripcionElement = document.getElementById("metaDescripcion");

// Actualizar el contenido del elemento con la mitad de la descripción en negrilla
metaDescripcionElement.innerHTML = "<strong>Descripción:</strong> " + mitadDescripcion;

// Llamar a la función al cargar la página
window.onload = actualizarTituloPersonalizado;

// Definir mainTitle en el ámbito global
var mainTitle;

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene el título de la página
    const pageTitle = document.title;

    // Busca el índice del guion "-"
    const dashIndex = pageTitle.indexOf('-');

    // Obtiene la parte del título antes del guion y elimina espacios adicionales
    mainTitle = (dashIndex !== -1) ? pageTitle.substring(0, dashIndex).trim() : pageTitle;
});
