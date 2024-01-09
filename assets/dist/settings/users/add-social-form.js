// Función para agregar una nueva red social
function agregarRedSocial() {
    // Obtener el contenedor de redes sociales
    var container = document.getElementById('redesSocialesContainer');

    // Crear un nuevo div para la red social
    var nuevaRedSocial = document.createElement('div');
    nuevaRedSocial.classList.add('red-social-container'); // Agregar clase para estilos

    // Agregar un select con opciones de redes sociales
    var selectRedSocial = document.createElement('select');
    // Aquí deberías cargar dinámicamente las opciones desde Firestore

    // Agregar un input para el nombre de usuario
    var inputUsuario = document.createElement('input');
    inputUsuario.type = 'text';
    inputUsuario.placeholder = 'Nombre de usuario';

    // Agregar un div para contener los botones Confirmar y Eliminar
    var divBotones = document.createElement('div');
    divBotones.classList.add('botones-container');

    // Agregar un botón para confirmar el cambio
    var botonConfirmar = document.createElement('button');
    botonConfirmar.innerText = '✔ Confirmar';
    botonConfirmar.classList.add('boton-confirmar'); // Agregar la clase
    botonConfirmar.onclick = function () {
        // Aquí deberías guardar el cambio en localStorage y reflejarlo en la vista
    };

    // Agregar un espacio intermedio
    var espacioIntermedio = document.createElement('span');
    espacioIntermedio.innerHTML = '&nbsp;';

    // Agregar un botón para eliminar la red social
    var botonEliminar = document.createElement('button');
    botonEliminar.innerText = '✘ Eliminar';
    botonEliminar.classList.add('boton-eliminar'); // Agregar la clase
    botonEliminar.onclick = function () {
        // Aquí deberías eliminar la red social de la vista y localStorage
    };

    // Agregar elementos al contenedor de botones
    divBotones.appendChild(botonConfirmar);
    divBotones.appendChild(espacioIntermedio);
    divBotones.appendChild(botonEliminar);

    // Agregar elementos al nuevo div de red social
    nuevaRedSocial.appendChild(selectRedSocial);
    nuevaRedSocial.appendChild(inputUsuario);
    nuevaRedSocial.appendChild(divBotones);

    // Agregar el nuevo div al contenedor
    container.appendChild(nuevaRedSocial);
}
