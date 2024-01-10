document.addEventListener('DOMContentLoaded', function () {

    let tipoUsuarioSeleccionado = null; // Inicializa en null

    function obtenerTipoUsuarioSeleccionado() {
        const tipoFormularioSelect = document.getElementById('tipoFormulario');
        return tipoFormularioSelect ? tipoFormularioSelect.value : '';
    }

    tipoUsuarioSeleccionado = obtenerTipoUsuarioSeleccionado();
    mostrarPestanas();

    // Actualiza la pestaña al seleccionar un tipo de usuario
    const tipoFormularioSelect = document.getElementById('tipoFormulario');
    tipoFormularioSelect.addEventListener('change', function () {
        tipoUsuarioSeleccionado = obtenerTipoUsuarioSeleccionado();
        cargarPestana('datos');  // Carga automáticamente la primera pestaña
    });

    // Asigna eventos a los botones de la ventana modal
    const datosBtn = document.getElementById('datosBtn');
    const auroraBtn = document.getElementById('auroraBtn');
    const contactoBtn = document.getElementById('contactoBtn');
    const cryptoBtn = document.getElementById('cryptoBtn');
    const redesBtn = document.getElementById('redesBtn');

    datosBtn.addEventListener('click', function () {
        // Verifica que se haya seleccionado un tipo de usuario antes de cargar la pestaña
        if (tipoUsuarioSeleccionado) {
            mostrarPestanas();
            cargarPestana('datos');
        } else {
            showNotification('Por favor, seleccione un tipo de usuario antes de abrir una pestaña.');
        }
    });
    
    auroraBtn.addEventListener('click', function () {
        // Verifica que se haya seleccionado un tipo de usuario antes de cargar la pestaña
        if (tipoUsuarioSeleccionado) {
            mostrarPestanas();
            cargarPestana('aurora');
        } else {
            showNotification('Por favor, seleccione un tipo de usuario antes de abrir una pestaña.');
        }
    });
    
    contactoBtn.addEventListener('click', function () {
        // Verifica que se haya seleccionado un tipo de usuario antes de cargar la pestaña
        if (tipoUsuarioSeleccionado) {
            cargarPestana('contacto');
        } else {
            showNotification('Por favor, seleccione un tipo de usuario antes de abrir una pestaña.');
        }
    });
    
    cryptoBtn.addEventListener('click', function () {
        // Verifica que se haya seleccionado un tipo de usuario antes de cargar la pestaña
        if (tipoUsuarioSeleccionado) {
            cargarPestana('crypto');
        } else {
            showNotification('Por favor, seleccione un tipo de usuario antes de abrir una pestaña.');
        }
    });
    
    redesBtn.addEventListener('click', function () {
        // Verifica que se haya seleccionado un tipo de usuario antes de cargar la pestaña
        if (tipoUsuarioSeleccionado) {
            cargarPestana('redes');
        } else {
            showNotification('Por favor, seleccione un tipo de usuario antes de abrir una pestaña.');
        }
    });
    

    function cargarPestana(pestana) {
        // Establece el valor predeterminado solo si no está definido
        tipoUsuarioSeleccionado = tipoUsuarioSeleccionado || 'Persona';

        fetch(`/dashboard/users/profile/profile-nav-edit-modal/${pestana}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`No se pudo cargar la pestaña: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('contenidoPestana').innerHTML = data;

                // Al cargar la pestaña, mostramos el formulario correspondiente
                mostrarFormulario(tipoUsuarioSeleccionado);
            })
            .catch(error => console.error(error));
    }


});


function mostrarFormulario(tipoUsuario) {
    console.log(`Mostrando formulario para ${tipoUsuario}`);
    
    // Oculta todos los formularios en ambas pestañas
    ocultarFormularios();

    // Verifica si tipoUsuario está definido antes de mostrar los formularios
    if (tipoUsuario) {
        // Muestra el formulario correspondiente según el tipo de usuario
        const formularioDatos = document.getElementById(`formulario${tipoUsuario}Datos`);
        const formularioAurora = document.getElementById(`formulario${tipoUsuario}Aurora`);

        if (formularioDatos) {
            formularioDatos.style.display = 'block';
        }

        if (formularioAurora) {
            formularioAurora.style.display = 'block';
        }
    }
}

function ocultarFormularios() {
    console.log('Ocultando todos los formularios');
    
    // Oculta todos los formularios en ambas pestañas
    const formularios = document.querySelectorAll('.formulario-datos, .formulario-aurora');
    formularios.forEach(formulario => {
        formulario.style.display = 'none';
    });
}

function mostrarPestanas() {
    // Muestra u oculta las pestañas según la selección del tipo de usuario
    const pestanas = document.querySelectorAll('.pestanas');
    
    if (tipoUsuarioSeleccionado !== undefined && (tipoUsuarioSeleccionado === 'Persona' || tipoUsuarioSeleccionado === 'Empresa')) {
        pestanas.forEach(pestaña => {
            pestaña.style.display = 'block';
        });
    } else {
        pestanas.forEach(pestaña => {
            pestaña.style.display = 'none';
        });
    }
}

