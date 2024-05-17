// Obtén referencias a los elementos
const toggleButton = document.getElementById("toggle-button");
const footerNavigation = document.getElementById("footer-navigation");

// Evento para alternar la visibilidad del menú
toggleButton.addEventListener("click", () => {
  if (footerNavigation.classList.contains("hidden")) {
    footerNavigation.classList.remove("hidden");
  } else {
    footerNavigation.classList.add("hidden");
  }
});

// Función para cargar contenido sin recargar la página
function cargarContenido(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al cargar el contenido'); // Lanza un error si la respuesta no es exitosa
      }
      return response.text();
    })
    .then(html => {
      document.getElementById('contenido').innerHTML = html;
      window.history.pushState({ path: url }, '', url);
    })
    .catch(error => {
      console.error('Error al cargar la página: ', error);
      showNotification('Error al cargar el contenido, por favor intenta de nuevo.'); // Muestra una notificación de error
    });
}

// Manejo de eventos de popstate para navegación del historial
window.addEventListener('popstate', function(event) {
  // Carga el contenido basado en la URL del estado actual del historial
  if (event.state && event.state.path) {
    cargarContenido(event.state.path);
  }
});

// Creación de elementos del menú
const menuItems = [
  { label: 'Soporte y Foro', link: `${baseUrl}content/support/support-forum.html`, image: `${baseUrl}assets/img/nav/soporte.svg` },
  { label: 'Política y Términos de Uso', link: `${baseUrl}content/privacy/policy-and-terms.html`, image: `${baseUrl}assets/img/nav/terminos.svg` },
  { label: 'Acerca de, Contacto', link: `${baseUrl}content/about/about.html`, image: `${baseUrl}assets/img/nav/acerca.svg` },
  { label: 'Donate and Paypal or Crypto', link: `${baseUrl}content/donate/donate.html`, image: `${baseUrl}assets/img/footer/eth.svg` }
];

const footerMenu = document.createElement('ul');
footerMenu.classList.add('footer-menu');
footerMenu.id = 'footer-menu';

menuItems.forEach(item => {
  const menuItem = document.createElement('li');
  const menuItemLink = document.createElement('a');
  const menuItemImage = document.createElement('img');

  menuItemLink.href = item.link;
  menuItemLink.addEventListener('click', function(event) {
    event.preventDefault(); // Previene que el navegador siga el enlace
    cargarContenido(this.href); // Carga el contenido
  });
  
  menuItemImage.src = item.image;
  menuItemImage.alt = item.label;
  menuItemLink.appendChild(menuItemImage);
  menuItemLink.appendChild(document.createTextNode(item.label));
  menuItem.appendChild(menuItemLink);
  footerMenu.appendChild(menuItem);
});

// Agrega el menú al elemento footerNavigation
footerNavigation.appendChild(footerMenu);
