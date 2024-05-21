document.addEventListener('DOMContentLoaded', function() {
    // Obtener la URL actual
    var currentURL = window.location.pathname;
  
    // Obtener todos los elementos de enlace en el menú
    var menuLinks = document.querySelectorAll('#category ul li a');
  
    // Iterar sobre los enlaces y resaltar la categoría correspondiente
    for (var i = 0; i < menuLinks.length; i++) {
      var link = menuLinks[i];
      var href = link.getAttribute('href');
  
      // Verificar si la URL actual coincide con la URL del enlace
      if (currentURL.indexOf(href) === 0) {
        // Agregar la clase "current" al elemento padre <li>
        link.parentNode.classList.add('current');
        break; // Terminar el bucle ya que se encontró la categoría
      }
    }
  });
  