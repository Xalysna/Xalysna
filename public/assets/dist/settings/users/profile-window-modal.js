// profile-window-modal.js

// Función para mostrar la ventana modal
function mostrarModal() {
    document.getElementById('myModal').style.display = 'block';
}

// Función para cancelar y cerrar la ventana modal
function cancelarModal() {
    console.log('Botón Cancelar clickeado');
    cerrarModal();
}

// Función para cerrar la ventana modal
function cerrarModal() {
    document.getElementById('myModal').style.display = 'none';
}

// Función para mostrar una sección específica
function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    var secciones = document.querySelectorAll('.seccion-oculta');
    secciones.forEach(function(seccion) {
        seccion.style.display = 'none';
    });

    // Mostrar la sección específica
    var seccionEspecifica = document.getElementById(seccionId);
    if (seccionEspecifica) {
        seccionEspecifica.style.display = 'block';
    }
}

// Agregar la función mostrarFormulario
function mostrarFormulario(tipoUsuario) {
    console.log(`Mostrando formulario para ${tipoUsuario}`);
    // ... lógica para mostrar el formulario
}
