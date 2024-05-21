// Objeto para almacenar los usuarios por red social
var usuariosPorRedSocial = {};

// Function to agregarRedSocial
function agregarRedSocial() {
    // Obtener valores del formulario
    var seleccionRedSocial = document.getElementById("selectRedSocial");
    var usuarioRedSocial = document.getElementById("inputUsuarioRedSocial").value.trim(); // Eliminar espacios en blanco al inicio y al final

    // Validar que se haya seleccionado una red social y se haya ingresado un usuario
    if (seleccionRedSocial.value === "" || usuarioRedSocial === "") {
        showNotification("Por favor, selecciona una red social e ingresa el usuario.");
        return;
    }

    // Verificar si la red social ya tiene usuarios registrados
    if (!usuariosPorRedSocial[seleccionRedSocial.value]) {
        usuariosPorRedSocial[seleccionRedSocial.value] = [];
    }

    // Validar si el usuario ya existe para la red social seleccionada
    if (usuariosPorRedSocial[seleccionRedSocial.value].includes(usuarioRedSocial)) {
        showNotification("Este usuario ya fue agregado para esta red social.");
        return;
    }

    // Validar el formato del nombre de usuario (solo letras y números)
    var usuarioRegex = /^[a-zA-Z0-9]+$/;
    if (!usuarioRegex.test(usuarioRedSocial)) {
        showNotification("El nombre de usuario solo puede contener letras y números.");
        return;
    }

    // Obtener la ruta del icono asociado a la red social seleccionada
    var iconoRuta = "/assets/img/social/icons8-" + seleccionRedSocial.value.toLowerCase() + "-48.png";

    // Crear un nuevo elemento para mostrar la red social agregada con icono y botón de eliminación
    var nuevaRedSocial = document.createElement("p");
    nuevaRedSocial.innerHTML = `
        <img src="${iconoRuta}" alt="${seleccionRedSocial.value} Icono"> 
        ${seleccionRedSocial.value}: @${usuarioRedSocial}
        <button onclick="eliminarRedSocial(this)">Eliminar</button>`;

    // Agregar el nuevo elemento a la lista de redes sociales
    var listaRedes = document.getElementById("listaRedes");
    listaRedes.appendChild(nuevaRedSocial);

    // Registrar el usuario para la red social seleccionada
    usuariosPorRedSocial[seleccionRedSocial.value].push(usuarioRedSocial);

    // Limpiar el formulario
    seleccionRedSocial.value = "";
    document.getElementById("inputUsuarioRedSocial").value = "";
}

// Function to eliminarRedSocial
function eliminarRedSocial(elemento) {
    // Obtener el elemento padre (el <p> que contiene la red social)
    var padre = elemento.parentNode;

    // Obtener la red social asociada al elemento eliminado
    var redSocial = padre.textContent.trim().split(':')[0].trim();

    // Eliminar el elemento padre de la lista
    padre.parentNode.removeChild(padre);

    // Reinicializar el registro de usuarios para la red social seleccionada
    usuariosPorRedSocial[redSocial] = [];
}
