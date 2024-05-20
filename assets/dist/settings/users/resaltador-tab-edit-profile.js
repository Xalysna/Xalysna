document.addEventListener("DOMContentLoaded", function() {
    // Obtén todos los botones de pestaña
    var tabButtons = document.querySelectorAll('.modal-header button');

    // Añade un evento de clic a cada botón de pestaña
    tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Remueve la clase activa de todos los botones
            tabButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });

            // Agrega la clase activa al botón clickeado
            this.classList.add('active');
        });
    });
});
