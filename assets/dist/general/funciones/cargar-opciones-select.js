// Función genérica para cargar opciones desde un archivo JSON
function cargarOpcionesDesdeJSON(jsonPath, selectorId, defaultOptionText) {
    const selector = document.getElementById(selectorId);

    // Utilizamos const para el selector directamente
    if (!selector) {
        console.error(`Error: No se encontró el elemento con el ID '${selectorId}' en el DOM.`);
        return;
    }

    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo JSON desde ${jsonPath}. Respuesta del servidor: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            limpiarYAgregarDefault(selector, defaultOptionText);
            agregarOpciones(selector, data.opciones);

            // Asegurar que la opción manual "Otro" esté seleccionada si ya existía
            const otroAnioOption = selector.querySelector('option[value="otro"]');
            if (otroAnioOption) {
                selector.appendChild(otroAnioOption);
            }

        })
        .catch(error => console.error(`Error al cargar las opciones desde ${jsonPath}`, error));
}

// Función para limpiar opciones y agregar la opción predeterminada
function limpiarYAgregarDefault(selector, defaultOptionText) {
    // Verificar si ya existe la opción manualmente agregada
    const otroAnioOption = selector.querySelector('option[value="otro"]');

    // Limpiar solo si no existe la opción manual
    if (!otroAnioOption) {
        selector.innerHTML = `<option value="" disabled selected>${defaultOptionText}</option>`;
    }
}


// Función para agregar opciones al selector desde un array de opciones
function agregarOpciones(selector, opciones) {
    opciones.forEach(opcion => {
        const optionElement = document.createElement('option');
        optionElement.value = opcion.valor;
        optionElement.textContent = opcion.label;
        selector.appendChild(optionElement);
    });
}

// Obtener la ruta base para los archivos JSON
const rutaBase = '/public/databases/options/';

// Función para cargar opciones cuando se abre la ventana modal
function cargarOpcionesEnModal() {
    const opciones = [
        { jsonPath: `${rutaBase}day.json`, selectorId: 'diaNacimientoPersona', defaultOptionText: 'Día'},
        { jsonPath: `${rutaBase}month.json`, selectorId: 'mesNacimientoPersona', defaultOptionText: 'Mes'},
        { jsonPath: `${rutaBase}year.json`, selectorId: 'anoNacimientoPersona', defaultOptionText: 'Año'},
        { jsonPath: `${rutaBase}genders.json`, selectorId: 'generoPersona', defaultOptionText: 'Seleccionar género'},
        { jsonPath: `${rutaBase}ubications-space.json`, selectorId: 'ubicacionEspacial', defaultOptionText: 'Seleccionar ubicación espacial'},
        { jsonPath: `${rutaBase}industries-business.json`, selectorId: 'industria', defaultOptionText: 'Seleccionar industria'},
        { jsonPath: `${rutaBase}year.json`, selectorId: 'creacionempresa', defaultOptionText: 'Seleccionar año de creación'},
        { jsonPath: `${rutaBase}prefix-phone.json`, selectorId: 'codigoPais', defaultOptionText: 'Seleccionar código de área'},
        { jsonPath: `${rutaBase}red-social.json`, selectorId: 'selectRedSocial', defaultOptionText: 'Seleccionar red social', opciones: [] }

        // Agrega más elementos según sea necesario
    ];
    

    opciones.forEach(opcion => {
        const { jsonPath, selectorId, defaultOptionText } = opcion;
        const selector = document.getElementById(selectorId);

        // Verificar que el elemento exista antes de llamar a cargarOpcionesDesdeJSON
        if (selector) {
            cargarOpcionesDesdeJSON(jsonPath, selectorId, defaultOptionText);
        }
    });
}

