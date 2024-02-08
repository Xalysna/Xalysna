

// Función para cargar las opciones en los elementos <select>
function cargarOpciones() {
    cargarOpcionesEnModal(); 
    cargarPaises();
    
}

// Llamar a la función para cargar las opciones cuando se cargue el documento
document.addEventListener("DOMContentLoaded", function() {
    cargarOpciones();
});
