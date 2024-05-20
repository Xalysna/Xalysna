// cargar-opciones-ubicacion.js

// URL del archivo JSON
const ubicationsURL = '/public/databases/options/ubications-earth.json';

// Declarar variables globales
let paisSeleccionadoGlobal;

// Función para cargar opciones de países
function cargarPaises() {
  fetch(ubicationsURL)
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

// Función para activar el siguiente select cuando se selecciona un país
function seleccionarPais() {
  var selectPais = document.getElementById("countrySelect");
  var selectEstado = document.getElementById("stateSelect");

  if (!selectPais || !selectEstado) {
    console.error('Elemento con id "countrySelect" o "stateSelect" no encontrado.');
    return;
  }

  // Guardar el valor en la variable global
  paisSeleccionadoGlobal = selectPais.value;

  selectEstado.innerHTML = '<option value="" selected disabled>Seleccione un estado</option>';
  selectEstado.disabled = true;

  if (paisSeleccionadoGlobal) {
    cargarEstados(paisSeleccionadoGlobal);
    selectEstado.disabled = false;
  }
}


// Función para cargar opciones de estados según el país seleccionado
function cargarEstados(paisSeleccionado) {
  fetch(ubicationsURL)
    .then(response => response.json())
    .then(data => {
      var selectEstado = document.getElementById("stateSelect");

      for (var i = 0; i < data.opciones.length; i++) {
        var opcion = data.opciones[i];
        if (opcion.pais.valor == paisSeleccionado) {
          var estado = opcion.estado;
          if (!selectEstado.querySelector(`option[value="${estado.valor}"]`)) {
            var option = document.createElement("option");
            option.value = estado.valor;
            option.text = estado.label;
            selectEstado.add(option);
          }
        }
      }
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Función para activar el siguiente select cuando se selecciona un estado
function seleccionarEstado() {
  var selectEstado = document.getElementById("stateSelect");
  var selectCiudad = document.getElementById("citySelect");

  var estadoSeleccionado = selectEstado.value;

  selectCiudad.innerHTML = '<option value="" selected disabled>Seleccione una ciudad</option>';
  selectCiudad.disabled = true;

  if (estadoSeleccionado) {
    cargarCiudades(estadoSeleccionado);
    selectCiudad.disabled = false;
  }
}

// Función para cargar opciones de ciudades según el estado seleccionado
function cargarCiudades(estadoSeleccionado) {
  fetch(ubicationsURL)
    .then(response => response.json())
    .then(data => {
      var selectCiudad = document.getElementById("citySelect");

      for (var i = 0; i < data.opciones.length; i++) {
        var opcion = data.opciones[i];
        if (opcion.estado.valor == estadoSeleccionado) {
          var ciudad = opcion.ciudad;
          if (!selectCiudad.querySelector(`option[value="${ciudad.valor}"]`)) {
            var option = document.createElement("option");
            option.value = ciudad.valor;
            option.text = ciudad.label;
            selectCiudad.add(option);
          }
        }
      }
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Función para actualizar la ubicación seleccionada en los spans correspondientes
function actualizarUbicacion() {
  // Obtener referencias a los elementos select y span
  var countrySelect = document.getElementById("countrySelect");
  var stateSelect = document.getElementById("stateSelect");
  var citySelect = document.getElementById("citySelect");
  var locationCountrySpan = document.getElementById("locationCountry");
  var locationStateSpan = document.getElementById("locationState");
  var locationCitySpan = document.getElementById("locationCity");

  // Obtener los valores seleccionados en los select
  var country = countrySelect.options[countrySelect.selectedIndex];
  var state = stateSelect.options[stateSelect.selectedIndex];
  var city = citySelect.options[citySelect.selectedIndex];

  // Verificar si se ha seleccionado un país
  var countryText = country ? country.text : "Seleccione un país";
  // Verificar si se ha seleccionado un estado
  var stateText = state ? state.text : "Seleccione un estado";
  // Verificar si se ha seleccionado una ciudad
  var cityText = city ? city.text : "Seleccione una ciudad";

  // Actualizar el contenido de los spans con los valores seleccionados
  locationCountrySpan.textContent = countryText;
  locationStateSpan.textContent = stateText;
  locationCitySpan.textContent = cityText;

  // Mostrar la información en la consola
  console.log("País seleccionado:", countryText);
  console.log("Estado seleccionado:", stateText);
  console.log("Ciudad seleccionada:", cityText);
}



// Llamar a la función para que se ejecute cada vez que se cambie alguna selección
document.addEventListener('DOMContentLoaded', () => {
document.getElementById("countrySelect").addEventListener("change", actualizarUbicacion);
document.getElementById("stateSelect").addEventListener("change", actualizarUbicacion);
document.getElementById("citySelect").addEventListener("change", actualizarUbicacion);
});