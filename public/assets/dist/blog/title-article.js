// Variable global para almacenar el título del artículo
let globalArticleTitle = '';

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene el título de la página
    const pageTitle = document.title;

    // Busca el índice del guion "-"
    const dashIndex = pageTitle.indexOf('-');

    // Obtiene la parte del título antes del guion y elimina espacios adicionales
    const mainTitle = (dashIndex !== -1) ? pageTitle.substring(0, dashIndex).trim() : pageTitle;

    // Actualiza el contenido del elemento h1#main-title con el título de la página sin espacios adicionales
    const mainTitleElement = document.getElementById('main-title');
    mainTitleElement.textContent = mainTitle;

    // Almacena el título en la variable global
    globalArticleTitle = mainTitle;
});
