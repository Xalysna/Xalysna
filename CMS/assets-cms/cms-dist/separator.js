// Mejora: Utilizar constantes descriptivas para los elementos y valores fijos
const separator = document.getElementById('line-separator');
const cmsContainer = document.getElementById('cms-container');
const previewContainer = document.getElementById('preview-container');

// Mejora: Utilizar desestructuración para obtener las coordenadas del evento
let isResizing = false;
let startX = 0;
let separatorOffset = 0;

// Mejora: Agregar funciones de escucha de eventos separadas
separator.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
window.addEventListener('mousemove', handleMouseMove);

function handleMouseDown(event) {
  isResizing = true;
  startX = event.clientX;
  separatorOffset = separator.offsetLeft;
  document.body.classList.add('resizing');
}

function handleMouseUp() {
  isResizing = false;
  document.body.classList.remove('resizing');
}

function handleMouseMove(event) {
  if (!isResizing) return;

  const { clientX } = event;
  const differenceX = clientX - startX;
  const newSeparatorOffset = separatorOffset + differenceX;

  const minOffset = 200;
  const maxOffset = window.innerWidth * 0.5; // Limitar el movimiento a la mitad del contenedor

  if (newSeparatorOffset >= minOffset && newSeparatorOffset <= maxOffset) {
    separator.style.left = newSeparatorOffset + 'px';
    cmsContainer.style.width = newSeparatorOffset + 'px';
    previewContainer.style.width = `calc(100% - ${newSeparatorOffset}px)`;
  }

  // Evitar que el separador se mueva más allá de -20px
  if (newSeparatorOffset <= -20) {
    separator.style.left = '-20px';
    cmsContainer.style.width = '20px';
    previewContainer.style.width = `calc(100% - 20px)`;
  }
}

