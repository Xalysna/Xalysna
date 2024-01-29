//BARRA DE NAVEGACION//
//////////////////////

const baseUrl = '/'; // Coloca aquí tu URL base

const navigationButtons = [
  { label: 'Inicio', link: `${baseUrl}index.html`, image: `${baseUrl}assets/img/nav/inicio.svg` },
  { 
    label: 'Blog',
    link: `/content/blog/index.html`,
    image: `${baseUrl}assets/img/nav/blog.svg`,
    subcategories: [
      { label: 'Business AI', link: `/content/blog/index.html`, image: `${baseUrl}assets/img/nav/business.svg` },
      { label: 'Creative AI', link: `${baseUrl}blog/creative-ai`, image: `${baseUrl}assets/img/nav/Creative.svg` },
      { label: 'Entertain AI', link: `${baseUrl}blog/entertain-ai`, image: `${baseUrl}assets/img/nav/Entertain.svg` },
      { label: 'FitSport', link: `${baseUrl}blog/fitsport`, image: `${baseUrl}assets/img/nav/FitSport.svg` },
      { label: 'Lifestyle AI', link: `${baseUrl}blog/lifestyle-ai`, image: `${baseUrl}assets/img/nav/Lifestyle.svg` },
      { label: 'Science Tech Minds', link: `${baseUrl}blog/science-tech-minds`, image: `${baseUrl}assets/img/nav/Science.svg` },
      { label: 'TechKnow', link: `${baseUrl}blog/techknow`, image: `${baseUrl}assets/img/nav/TechKnow.svg` },
      { label: 'TechVision360', link: `${baseUrl}blog/techvision360`, image: `${baseUrl}assets/img/nav/TechVision360.svg` }
    ]
  },
  { label: 'Xavaya Enciclopedia', link: `${baseUrl}xavaya-encyclopedia`, image: `${baseUrl}assets/img/nav/ency.svg` },
  { label: 'Utilidades', link: `${baseUrl}Utilities`, image: `${baseUrl}assets/img/nav/tool.svg` },
  { label: 'Repositorio', link: `/content/repository/repository.html`, image: `${baseUrl}assets/img/nav/repository.svg` },
  { label: 'Xavaya Token', link: `${baseUrl}xavaya-token`, image: `${baseUrl}assets/img/nav/token.svg` },
];


// Función para mostrar los botones de navegación en el elemento con el id "navigation"
function generateButtons() {
  const navigationElement = document.getElementById('navigation');
  const subcategoryPanel = document.getElementById('subcategory-panel');
  let activeButton = null;
  let isSubMenuVisible = false;

  navigationButtons.forEach(button => {
    const buttonElement = document.createElement('a');
    buttonElement.href = button.link;
    buttonElement.classList.add('btn');
    buttonElement.innerHTML = `
      <img src="${button.image}" alt="${button.label}" title="${button.comment}">
      <span>${button.label}</span>
    `;

    navigationElement.appendChild(buttonElement);

    // Si tiene subcategorías, generar los botones adicionales dentro de un panel desplegable
    if (button.subcategories) {
      buttonElement.classList.add('dropdown');

      buttonElement.addEventListener('mouseover', () => {
        // Guardar el botón activo y ocultar el panel de subcategorías si hay otro botón activo
        if (activeButton && activeButton !== buttonElement) {
          activeButton.classList.remove('active');
          subcategoryPanel.style.display = 'none';
          isSubMenuVisible = false;
        }

        activeButton = buttonElement;

        // Limpiar el panel antes de mostrar las subcategorías
        subcategoryPanel.innerHTML = '';

        button.subcategories.forEach(subcategory => {
          const subButtonElement = document.createElement('a');
          subButtonElement.href = subcategory.link;
          subButtonElement.innerHTML = `
            <img src="${subcategory.image}" alt="${subcategory.label}" title="${subcategory.comment}">
            <span>${subcategory.label}</span>
          `;

          subcategoryPanel.appendChild(subButtonElement);
        });

        // Mostrar el panel de subcategorías
        subcategoryPanel.style.display = 'block';
        isSubMenuVisible = true;

        // Posicionar el panel debajo del botón activo
        const buttonRect = buttonElement.getBoundingClientRect();
        subcategoryPanel.style.left = `${buttonRect.left}px`;
        subcategoryPanel.style.top = `${buttonRect.bottom}px`;
      });

      buttonElement.addEventListener('mouseout', () => {
        // Ocultar el panel de subcategorías al quitar el mouse del botón
        if (activeButton === buttonElement && !isSubMenuVisible) {
          activeButton.classList.remove('active');
          activeButton = null;
          subcategoryPanel.style.display = 'none';
        }
      });
    }
  });

  subcategoryPanel.addEventListener('mouseover', () => {
    // Mantener el panel de subcategorías abierto mientras el mouse está sobre él
    if (activeButton) {
      activeButton.classList.add('active');
      subcategoryPanel.style.display = 'block';
      isSubMenuVisible = true;
    }
  });

  subcategoryPanel.addEventListener('mouseout', () => {
    // Ocultar el panel de subcategorías al quitar el mouse del menú de subcategorías
    if (activeButton && !subcategoryPanel.contains(event.relatedTarget)) {
      activeButton.classList.remove('active');
      activeButton = null;
      subcategoryPanel.style.display = 'none';
      isSubMenuVisible = false;
    }
  });
}

// Generar los botones de navegación cuando se cargue la página
generateButtons();


//PERSONALIZACION DEL PANEL //
/////////////////////////////

// Obtener el nivel máximo de oscuridad permitido (ajusta este valor según tus necesidades)
const maxDarkness = -1000;

// Obtener el nivel máximo de claridad permitido (ajusta este valor según tus necesidades)
const maxLightness = 5505;

// Obtener el panel que se desea cambiar de color
const panelElement = document.getElementById('panel'); // Reemplaza 'panel' con el ID real del elemento del panel

// Obtener la barra de navegación
const navigationElement = document.getElementById('navigation');

// Crear el elemento de la imagen del icono SVG
const iconImage = document.createElement('img');
iconImage.src = `${baseUrl}assets/img/nav/color.svg`;
iconImage.alt = 'Icono';
iconImage.style.width = '24px';
iconImage.style.height = '24px';
iconImage.id = 'color-icon'; // Asignar el ID 'color-icon' al primer elemento de imagen del icono SVG

// Establecer estilos para el icono como botón
iconImage.classList.add('boton-navegacion');

// Verificar si hay un color guardado en el almacenamiento local
const savedGradient = localStorage.getItem('panelGradient');

// Definir el degradado predeterminado para el color de fondo del panel
const defaultGradient = 'linear-gradient(to right, #F3F1BA, #A1AFFF)'; // Coloca el degradado predeterminado deseado aquí

// Restaurar el degradado guardado en el panel o establecer el degradado predeterminado
panelElement.style.backgroundImage = savedGradient || defaultGradient;

// Actualizar el color del icono y los textos en el inicio
updateIconAndTextColors(panelElement.style.backgroundImage);

// Manejador de evento para el clic en el icono
iconImage.addEventListener('click', () => {
  // Generar colores aleatorios para el degradado
  const randomColor1 = getRandomColor();
  const randomColor2 = getRandomColor();

  // Generar el degradado aleatorio
  const randomGradient = `linear-gradient(to right, ${randomColor1}, ${randomColor2})`;

  // Aplicar el degradado al panel
  panelElement.style.backgroundImage = randomGradient;

  // Actualizar el color del icono y los textos en el nuevo fondo
  updateIconAndTextColors(randomGradient);

  // Guardar el degradado en el almacenamiento local
  localStorage.setItem('panelGradient', randomGradient);
});

// Función para generar un color aleatorio en formato hexadecimal
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Función para actualizar el color del icono y los textos
function updateIconAndTextColors(gradient) {
  // Obtener los colores del degradado
  const colors = gradient.match(/#[0-9A-Fa-f]{6}/g);

  if (colors && colors.length >= 2) {
    // Obtener el primer y último color del degradado
    const firstColor = colors[0];
    const lastColor = colors[colors.length - 1];

    // Verificar si el primer y último color son oscuros o claros
    const isDarkFirstColor = isDarkColor(firstColor);
    const isDarkLastColor = isDarkColor(lastColor);

    // Establecer el color del icono basado en los colores del degradado
    const iconColor = isDarkFirstColor && isDarkLastColor ? '#FFFFFF' : '#000000';
    iconImage.style.fill = iconColor;

    // Obtener todos los elementos <a> dentro del elemento de navegación
    const navigationLinks = navigationElement.getElementsByTagName('a');

    // Recorrer los enlaces de navegación y establecer su color
    for (let i = 0; i < navigationLinks.length; i++) {
      navigationLinks[i].style.color = iconColor;
    }

    // Establecer el color de los textos en el estado de autenticación
    statusElement.style.color = isDarkLastColor ? '#FFFFFF' : '#000000';
  }
}

// Función para verificar si un color es oscuro o claro
function isDarkColor(color) {
  // Convertir el color hexadecimal a RGB
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  // Calcular el brillo del color
  const [r, g, b] = hexToRgb(color);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Retornar true si el brillo es menor o igual al nivel máximo de oscuridad permitido
  return brightness <= maxDarkness;
}

// Crear el botón y establecer estilos
const buttonElement = document.createElement('button');
buttonElement.style.border = 'none';
buttonElement.style.background = 'none';
buttonElement.style.padding = '0';
buttonElement.style.cursor = 'pointer';
buttonElement.style.width = '32px';
buttonElement.style.height = '32px';

// Agregar el icono al botón
buttonElement.appendChild(iconImage);

// Crear el botón de restablecer y establecer estilos
const resetButton = document.createElement('button');
resetButton.style.border = 'none';
resetButton.style.background = 'none';
resetButton.style.padding = '0';
resetButton.style.cursor = 'pointer';
resetButton.style.marginLeft = '10px';

// Crear el icono SVG para el botón de restablecer
const resetIcon = document.createElement('img');
resetIcon.src = `${baseUrl}assets/img/nav/reset.svg`; // Utilizando la variable baseUrl para construir la ruta
resetIcon.alt = 'Restablecer';
resetIcon.style.width = '24px';
resetIcon.style.height = '24px';
resetIcon.id = 'reset-icon'; // Asignar el ID 'reset-icon' al segundo elemento de imagen del icono SVG

// Agregar el icono al botón de restablecer
resetButton.appendChild(resetIcon);

// Agregar los botones al panel
panelElement.appendChild(buttonElement);
panelElement.appendChild(resetButton);

// Manejador de evento para el clic en el botón de restablecer
resetButton.addEventListener('click', () => {
  // Restablecer el degradado del panel al degradado predeterminado
  panelElement.style.backgroundImage = defaultGradient;

  // Actualizar el color del icono y los textos en el nuevo fondo
  updateIconAndTextColors(defaultGradient);

  // Eliminar el degradado guardado en el almacenamiento local
  localStorage.removeItem('panelGradient');

  // Actualizar la página
  location.reload();
});
