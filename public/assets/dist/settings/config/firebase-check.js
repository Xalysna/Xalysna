// Función para cargar y mostrar el contenido en la pestaña con resaltado y numeración de líneas
function loadAndShowContent(filePath, tabId, statusId) {
  fetch(filePath)
    .then(response => response.text())
    .then(data => {
      const tabContent = document.getElementById(tabId);
      const statusElement = document.getElementById(statusId);

      // Crear un elemento <pre> para mantener la estructura y agregar el código con numeración
      const codeElement = document.createElement('pre');
      const codeElementContent = document.createElement('code');
      codeElementContent.className = 'javascript';
      codeElementContent.setAttribute('contentEditable', 'false'); // Inicialmente deshabilitar la edición
      codeElementContent.setAttribute('spellcheck', 'false'); // Deshabilitar la corrección ortográfica

      // Dividir las líneas del código y agregar numeración
      const lines = data.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const lineElement = document.createElement('div');
        lineElement.className = 'line';

        const lineContent = document.createElement('span');
        lineContent.className = 'line-content';
        lineContent.innerText = lines[i]; // Usar innerText en lugar de innerHTML para evitar problemas con caracteres especiales

        lineElement.appendChild(lineContent);

        codeElementContent.appendChild(lineElement);
      }

      // Agregar contenido al contenedor de la pestaña
      codeElement.appendChild(codeElementContent);
      tabContent.appendChild(codeElement);

      // Mensaje de éxito
      const successMessage = document.createElement('p');
      successMessage.innerText = `Contenido cargado correctamente desde ${filePath}`;
      successMessage.className = 'ok';
      statusElement.appendChild(successMessage);
    })
    .catch(error => {
      // Mensaje de error
      console.error('Error fetching content:', error);
      const errorMessage = document.createElement('p');
      errorMessage.innerText = `Error al cargar contenido desde ${filePath}: ${error.message}`;
      errorMessage.className = 'failed';
      statusElement.appendChild(errorMessage);
    });
}

// Llama a la función para cargar el contenido en la pestaña Config
document.addEventListener('DOMContentLoaded', function () {
  // Cargar y mostrar contenido con resaltado y numeración de líneas
  loadAndShowContent('./firebase-config.js', 'configTab', 'configStatus');
  loadAndShowContent('./firebase-config-urls.js', 'urlsTab', 'urlsStatus');
  loadAndShowContent('https://www.gstatic.com/firebasejs/releases.json', 'cdnTab', 'Print');
});


// PRINT CONSOLE TAB

// firebase-config-urls.js

const isValidUrl = async (url) => {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    return false;
  }
};

const printToConsoleStatus = (message, color, scriptName) => {
  const printConsoleStatus = document.getElementById('printConsoleStatus');
  if (printConsoleStatus) {
    const isScrolledToBottom = printConsoleStatus.scrollHeight - printConsoleStatus.clientHeight <= printConsoleStatus.scrollTop + 1;

    const newParagraph = document.createElement('p');
    newParagraph.style.color = color || 'black';
    newParagraph.textContent = `[${scriptName}] ${message}`;

    printConsoleStatus.appendChild(newParagraph);

    if (isScrolledToBottom) {
      printConsoleStatus.scrollTop = printConsoleStatus.scrollHeight; // Auto scroll to the bottom if already at the bottom
    }
  }
};

const validateFirebaseUrl = async (url, scriptName) => {
  if (!(await isValidUrl(url))) {
    const errorMessage = `URL inválida o inaccesible en ${scriptName}: ${url}`;
    console.error(errorMessage);
    printToConsoleStatus(errorMessage, 'red', scriptName);
    return false;
  }
  const successMessage = `URL válida en ${scriptName}: ${url}`;
  console.log(successMessage);
  printToConsoleStatus(successMessage, 'green', scriptName);
  return true;
};

const validateFirebaseModule = (moduleName, url) => {
  console.log(`Validando el módulo ${moduleName}...`);
  return validateFirebaseUrl(url, 'firebase-config-urls.js');
};

const validateFirebaseConfigUrls = (firebaseUrls) => {
  for (const [moduleName, url] of Object.entries(firebaseUrls)) {
    if (!validateFirebaseModule(moduleName, url)) {
      return false;
    }
  }
  console.log('Todas las URLs son válidas en firebase-config-urls.js.');
  printToConsoleStatus('Todas las URLs son válidas en firebase-config-urls.js.', 'green', 'firebase-config-urls.js'); // Imprimir éxito en la consola de estado
  return true;
};

export { validateFirebaseConfigUrls };

// firebase-config.js

const isValidFirebaseConfig = (config) => {
  if (!config || typeof config !== 'object') {
    const errorMessage = 'Configuración de Firebase inválida en firebase-config.js. Debe ser un objeto.';
    console.error(errorMessage);
    printToConsoleStatus(errorMessage, 'red', 'firebase-config.js'); // Imprimir error en la consola de estado
    return false;
  }

  const requiredFields = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'storageBucket', 'messagingSenderId', 'appId', 'measurementId'];

  for (const field of requiredFields) {
    if (!config[field]) {
      const errorMessage = `Campo requerido faltante en la configuración de Firebase en firebase-config.js: ${field}`;
      console.error(errorMessage);
      printToConsoleStatus(errorMessage, 'red', 'firebase-config.js'); // Imprimir error en la consola de estado
      return false;
    }
  }

  const successMessage = 'Configuración de Firebase válida en firebase-config.js.';
  console.log(successMessage);
  printToConsoleStatus(successMessage, 'green', 'firebase-config.js'); // Imprimir éxito en la consola de estado
  return true;
};

export { isValidFirebaseConfig };
