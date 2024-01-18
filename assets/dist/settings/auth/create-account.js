// Variable global para rastrear el paso actual
let pasoActual = 0;

// Función para mostrar el siguiente paso
function siguientePaso() {
    if (validarPasoActual()) {
        ocultarPasoActual();
        pasoActual++;
        mostrarPasoActual();
    } else {
        showNotification('Complete los campos obligatorios antes de pasar al siguiente paso.');
    }
}

// Función para mostrar el paso anterior
function anteriorPaso() {
    ocultarPasoActual();
    pasoActual--;
    mostrarPasoActual();
}

// Función para ocultar el paso actual
function ocultarPasoActual() {
    document.getElementById(`paso${pasoActual}`).style.display = 'none';
}

// Función para mostrar el paso actual
function mostrarPasoActual() {
    document.getElementById(`paso${pasoActual}`).style.display = 'block';
}

// Función para mostrar el formulario específico según el tipo de cuenta seleccionado
function mostrarFormulario(tipoCuenta) {
    ocultarTodosLosFormularios();
    document.getElementById(`formulario${tipoCuenta}Datos`).style.display = 'block';
}

// Función para ocultar todos los formularios
function ocultarTodosLosFormularios() {
    document.getElementById('formularioPersonaDatos').style.display = 'none';
    document.getElementById('formularioEmpresaDatos').style.display = 'none';
    document.getElementById('formularioMarcaDatos').style.display = 'none';
}

// Función para limpiar el selector y agregar una opción predeterminada
function limpiarYAgregarDefault(selector, defaultOptionText) {
    selector.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = defaultOptionText;
    selector.add(defaultOption);
}

// Obtener la ruta base para los archivos JSON
const rutaBase = '/databases/options/';

// Función genérica para cargar opciones desde un archivo JSON
function cargarOpcionesDesdeJSON(config) {
    const { jsonPath, selectorId, defaultOptionText } = config;
    const selector = document.getElementById(selectorId);

    if (!selector) {
        console.error(`Error: No se encontró el elemento con el ID '${selectorId}' en el DOM.`);
        return;
    }

    fetch(rutaBase + jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo JSON desde ${jsonPath}. Respuesta del servidor: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            limpiarYAgregarDefault(selector, defaultOptionText);
            agregarOpciones(selector, data.opciones);
        })
        .catch(error => console.error(`Error al cargar las opciones desde ${jsonPath}`, error));
}

// Función para agregar opciones al selector
function agregarOpciones(selector, opciones) {
    opciones.forEach(opcion => {
        const optionElement = document.createElement('option');
        optionElement.value = opcion.valor;
        optionElement.textContent = opcion.label;
        selector.appendChild(optionElement);
    });
}

// Llamadas a la función para cargar opciones específicas en los selectores
cargarOpcionesDesdeJSON({ jsonPath: 'day.json', selectorId: 'diaNacimientoPersona', defaultOptionText: 'Día' });
cargarOpcionesDesdeJSON({ jsonPath: 'month.json', selectorId: 'mesNacimientoPersona', defaultOptionText: 'Mes' });
cargarOpcionesDesdeJSON({ jsonPath: 'year.json', selectorId: 'anoNacimientoPersona', defaultOptionText: 'Año' });
cargarOpcionesDesdeJSON({ jsonPath: 'genders.json', selectorId: 'generoPersona', defaultOptionText: 'Seleccione género' });
cargarOpcionesDesdeJSON({ jsonPath: 'industries-business.json', selectorId: 'industria', defaultOptionText: 'Seleccione industria' });
cargarOpcionesDesdeJSON({ jsonPath: 'brand-categories.json', selectorId: 'categoriaMarca', defaultOptionText: 'Seleccione categoría de marca' });

// Inicialmente muestra el paso 0
mostrarPasoActual();

// URL del archivo JSON
const ubicationsURL = '/databases/options/ubications-earth.json';

// Función para cargar opciones de países
function cargarPaises() {
    fetch(ubicationsURL)
        .then(response => response.json())
        .then(data => {
            var selectPais = document.getElementById("locationCountry");

            if (!selectPais) {
                console.error('Elemento con id "locationCountry" no encontrado.');
                return;
            }

            for (var i = 0; i < data.opciones.length; i++) {
                var pais = data.opciones[i].pais;
                if (pais) {
                    if (!selectPais.querySelector(`option[value="${pais.valor}"]`)) {
                        var option = document.createElement("option");
                        option.value = pais.valor;
                        option.text = pais.label;
                        selectPais.add(option);
                    }
                }
            }
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Llamada a la función para cargar opciones de países después de cargar el contenido del documento
document.addEventListener('DOMContentLoaded', cargarPaises);

// Función para validar el paso actual
function validarPasoActual() {
    // Realiza la validación específica para cada paso aquí
    switch (pasoActual) {
        case 0:
            // Validación del paso 0: No se requiere validación específica
            return true;

        case 1:
            // Validación del paso 1: Nombre de usuario
            const username = document.getElementById('usernameId').value;
            return username.trim() !== '';

        case 2:
            // Validación del paso 2: Tipo de cuenta seleccionado
            const tipoCuentaSeleccionado = document.getElementById('tipoFormulario').value;
            return tipoCuentaSeleccionado !== '';

        case 3:
            // Validación del paso 3: Campos específicos según el tipo de cuenta
            const tipoCuenta = document.getElementById('tipoFormulario').value;
            return validarCamposSegunTipoCuenta(tipoCuenta);

        case 4:
            // Validación del paso 4: País seleccionado
            const paisSeleccionado = document.getElementById('locationCountry').value;
            return paisSeleccionado !== '';

        default:
            return true;
    }
}

// Función para validar campos según el tipo de cuenta seleccionado
function validarCamposSegunTipoCuenta(tipoCuenta) {
    switch (tipoCuenta) {
        case 'Persona':
            // Validación para el formulario de datos básicos de Persona
            const nombrePersona = document.getElementById('nombrePersona').value;
            const apellidoPersona = document.getElementById('apellidoPersona').value;
            const diaNacimiento = document.getElementById('diaNacimientoPersona').value;
            const mesNacimiento = document.getElementById('mesNacimientoPersona').value;
            const anoNacimiento = document.getElementById('anoNacimientoPersona').value;
            const generoPersona = document.getElementById('generoPersona').value;
        
            // Agrega más campos según sea necesario
            const fechaNacimientoCompleta = diaNacimiento && mesNacimiento && anoNacimiento;
            return nombrePersona.trim() !== '' && apellidoPersona.trim() !== '' && fechaNacimientoCompleta && generoPersona.trim() !== '';
        

        case 'Empresa':
            // Validación para el formulario de datos básicos de Empresa
            const nombreEmpresa = document.getElementById('nombreEmpresa').value;
            const industria = document.getElementById('industria').value;
            // Agrega más campos según sea necesario
            return nombreEmpresa.trim() !== '' && industria.trim() !== '';

        case 'Marca':
            // Validación para el formulario de datos básicos de Marca
            const nombreMarca = document.getElementById('nombreMarca').value;
            const categoriaMarca = document.getElementById('categoriaMarca').value;
            // Agrega más campos según sea necesario
            return nombreMarca.trim() !== '' && categoriaMarca.trim() !== '';

        default:
            return true;
    }
}