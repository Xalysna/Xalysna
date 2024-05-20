document.addEventListener('DOMContentLoaded', function () {
    var dropdownMenu = document.getElementById('UserDropdownMenu');
    var isMenuVisible = false;

    document.getElementById('contenedorPerfil').addEventListener('click', function (event) {
        event.stopPropagation();
        isMenuVisible = !isMenuVisible;
        updateDropdownVisibility();
    });

    document.addEventListener('click', function (event) {
        var dropdownMenu = document.getElementById('UserDropdownMenu');
        if (!event.target.closest('#UserDropdownMenu') && !event.target.closest('#contenedorPerfil')) {
            isMenuVisible = false;
            updateDropdownVisibility();
        }
    });

    function updateDropdownVisibility() {
        var dropdownMenu = document.getElementById('UserDropdownMenu');
        dropdownMenu.style.transition = 'none'; // Desactiva la transición para cambiar rápidamente la visibilidad
        dropdownMenu.style.display = isMenuVisible ? 'block' : 'none';

        // Activa la transición después de un pequeño retraso
        setTimeout(function () {
            dropdownMenu.style.transition = 'left 0.3s ease, max-width 0.3s ease';
        }, 10);
    }
});
