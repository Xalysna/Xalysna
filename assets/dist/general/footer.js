// Obtén referencias a los elementos
const toggleButton = document.getElementById("toggle-button");
const footerNavigation = document.getElementById("footer-navigation");

// Agrega un evento click al botón de icono
toggleButton.addEventListener("click", () => {
  // Cambia la visibilidad de la navegación del pie de página
  if (footerNavigation.classList.contains("hidden")) {
    footerNavigation.classList.remove("hidden");
  } else {
    footerNavigation.classList.add("hidden");
  }
});


// Agrega el código para crear los elementos del menú aquí
const menuItems = [
  { label: 'Soporte y Foro', link: `${baseUrl}/support-forum`, image: `${baseUrl}assets/img/nav/soporte.svg` },
  { label: 'Política y Términos de Uso', link: `/content/privacy/policy-and-terms.html`, image: `${baseUrl}assets/img/nav/terminos.svg` },
  { label: 'Acerca de, Contacto y Donaciones', link: `${baseUrl}/about-contact-donations`, image: `${baseUrl}assets/img/nav/acerca.svg` },
  { label: 'Dona Ethereum', link: `${baseUrl}/settings`, image: `${baseUrl}assets/img/footer/eth.svg` }
];

const footerMenu = document.createElement('ul');
footerMenu.classList.add('footer-menu');
footerMenu.id = 'footer-menu';

menuItems.forEach(item => {
  const menuItem = document.createElement('li');
  const menuItemLink = document.createElement('a');
  const menuItemImage = document.createElement('img');

  menuItemLink.href = item.link;
  menuItemImage.src = item.image;
  menuItemImage.alt = item.label;
  menuItemLink.appendChild(menuItemImage);
  menuItemLink.appendChild(document.createTextNode(item.label));
  menuItem.appendChild(menuItemLink);
  footerMenu.appendChild(menuItem);
});

// Agrega el menú al elemento footerNavigation
footerNavigation.appendChild(footerMenu);
