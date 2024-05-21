// Variable global para rastrear el paso actual
let pasoActual = 0;

// Función para mostrar el siguiente paso
function siguientePaso() {
    if (validarPasoActual()) {
        ocultarPasoActual();
        pasoActual++;

        // Verificar si el formulario correspondiente debe mostrarse manualmente
        const tipoCuentaSelector = document.getElementById('tipoFormulario');
        if (tipoCuentaSelector.value !== '') {
            mostrarFormulario(tipoCuentaSelector.value);
        }

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
    const tipoCuentaSelector = document.getElementById('tipoFormulario');

    // Marcar la interacción del usuario
    tipoCuentaSelector.dataset.usuarioHaInteractuado = 'true';

    // Establecer el valor solo si no se ha seleccionado nada aún
    if (tipoCuentaSelector.value === '') {
        tipoCuentaSelector.value = tipoCuenta;

        // Simular el evento change para forzar la interacción del usuario
        const changeEvent = new Event('change');
        tipoCuentaSelector.dispatchEvent(changeEvent);
    }

    ocultarTodosLosFormularios();
    document.getElementById(`formulario${tipoCuenta}Datos`).style.display = 'block';
}


// Función para ocultar todos los formularios
function ocultarTodosLosFormularios() {
    document.getElementById('formularioPersonaDatos').style.display = 'none';
    document.getElementById('formularioEmpresaDatos').style.display = 'none';
 /* document.getElementById('formularioMarcaDatos').style.display = 'none';*/
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

         // Agregar evento de cambio para deshabilitar la opción predeterminada al seleccionar otra opción
    selector.addEventListener('change', function() {
        const defaultOption = selector.querySelector('option[value=""]');
        if (defaultOption) {
            defaultOption.disabled = true;
        }
    });
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
/*
cargarOpcionesDesdeJSON({ jsonPath: 'brand-categories.json', selectorId: 'categoriaMarca', defaultOptionText: 'Seleccione categoría de marca' });
*/

// Inicialmente muestra el paso 0
mostrarPasoActual();

// URL del archivo JSON
const ubicationCountries = '/databases/options/ubications-earth.json';

// Función para cargar opciones de países
function cargarPaises() {
    fetch(ubicationCountries)
        .then(response => response.json())
        .then(data => {
            var selectPais = document.getElementById("countrySelect");

            if (!selectPais) {
                console.error('Elemento con id "countrySelect" no encontrado.');
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

// Función para actualizar la ubicación seleccionada en el span correspondiente
function actualizarUbicacion() {
    // Obtener referencia al elemento select de país y al span correspondiente
    var countrySelect = document.getElementById("countrySelect");
    var locationCountrySpan = document.getElementById("locationCountry");
  
    // Obtener el valor seleccionado en el select de país
    var country = countrySelect.options[countrySelect.selectedIndex];
  
    // Verificar si se ha seleccionado un país
    var countryText = country ? country.text : "Seleccione un país";
  
    // Actualizar el contenido del span con el valor seleccionado
    locationCountrySpan.textContent = countryText;
  
    // Mostrar la información en la consola
    console.log("País seleccionado:", countryText);
  }
  
  // Llamar a la función para que se ejecute cada vez que se cambie la selección de país
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("countrySelect").addEventListener("change", actualizarUbicacion);
  });
  

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

        default:
            return true;
    }
}


document.getElementById("saveProfileButton").addEventListener("click", function() {
      // Inicializar el contador en 2 segundos
  let countdown = 2;
  
  // Mostrar la notificación inicial
  showNotification(`Redirigiendo en ${countdown} segundos...`);

  // Actualizar la notificación cada segundo
  const interval = setInterval(() => {
    countdown--;
    showNotification(`Redirigiendo en ${countdown} segundos...`);
    if (countdown <= 0) {
      clearInterval(interval);
    }
  }, 1000);
    // Espera 2 segundos y redirige al usuario a /index.html
    setTimeout(function() {
      window.location.href = "../../index.html";
    }, 2000); // 10000 milisegundos = 10 segundos
  });