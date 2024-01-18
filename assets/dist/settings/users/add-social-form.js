// Function to agregarRedSocial
function agregarRedSocial() {
    // Obtener valores del formulario
    var seleccionRedSocial = document.getElementById("selectRedSocial");
    var usuarioRedSocial = document.getElementById("inputUsuarioRedSocial").value;

    // Validar que se haya seleccionado una red social y se haya ingresado un usuario
    if (seleccionRedSocial.value === "" || usuarioRedSocial === "") {
        showNotification("Por favor, selecciona una red social e ingresa el usuario.");
        return;
    }

    // Obtener la ruta del icono asociado a la red social seleccionada
    var iconoRuta = "/assets/img/social/icons8-" + seleccionRedSocial.value.toLowerCase() + "-48.png";

    // Crear un nuevo elemento para mostrar la red social agregada con icono y botón de eliminación
    var nuevaRedSocial = document.createElement("div");
    nuevaRedSocial.innerHTML = `
        <p>
            <img src="${iconoRuta}" alt="${seleccionRedSocial.value} Icono"> 
            ${seleccionRedSocial.value}: @${usuarioRedSocial}
            <button onclick="eliminarRedSocial(this)">Eliminar</button>
        </p>`;

    // Agregar el nuevo elemento a la lista de redes sociales
    var listaRedes = document.getElementById("listaRedes");
    listaRedes.appendChild(nuevaRedSocial);

    // Limpiar el formulario
    seleccionRedSocial.value = "";
    document.getElementById("inputUsuarioRedSocial").value = "";
}

// Function to eliminarRedSocial
function eliminarRedSocial(elemento) {
    // Obtener el elemento padre (el <p> que contiene la red social)
    var padre = elemento.parentNode;

    // Eliminar el elemento padre de la lista
    padre.parentNode.removeChild(padre);
}
