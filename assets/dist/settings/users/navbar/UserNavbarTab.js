document.addEventListener('DOMContentLoaded', function() {
    var dropdownMenu = document.getElementById('UserDropdownMenu');
    dropdownMenu.style.display = 'none'; // Inicialmente oculto
});

function toggleNavbarTab(event) {
    event.stopPropagation();

    var dropdownMenu = document.getElementById('UserDropdownMenu');
    
    if (dropdownMenu.style.display === 'none') {
        dropdownMenu.style.display = 'block';
    } else {
        dropdownMenu.style.display = 'none';
    }
}

document.addEventListener('click', function() {
    var dropdownMenu = document.getElementById('UserDropdownMenu');

    if (dropdownMenu.style.display !== 'none') {
        dropdownMenu.style.display = 'none';
    }
});

document.getElementById('contenedorPerfil').addEventListener('click', toggleNavbarTab);

// Cerrar el menú desplegable si se hace clic en otra parte de la página
document.addEventListener('click', function(event) {
    if (!event.target.closest('#UserDropdownMenu') && !event.target.closest('#contenedorPerfil')) {
        var dropdownMenu = document.getElementById('UserDropdownMenu');
        dropdownMenu.style.display = 'none';
    }
});
