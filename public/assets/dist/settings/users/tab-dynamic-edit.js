document.addEventListener('DOMContentLoaded', function () {
    let tipoUsuarioSeleccionado = null;

    function obtenerTipoUsuarioSeleccionado() {
        const tipoFormularioSelect = document.getElementById('tipoFormulario');
        return tipoFormularioSelect ? tipoFormularioSelect.value : '';
    }

    function mostrarIdsEnConsola() {
        const idsEnPestana = obtenerIdsEnPestana();
        console.log('IDs en la pestaña actual:', idsEnPestana);
    }

    function obtenerIdsEnPestana() {
        const idsEnPestana = {};
        const elementosEnPestana = document.querySelectorAll('.formulario-datos, .formulario-aurora, #datosBtn, #auroraBtn, #contactoBtn, #cryptoBtn, #redesBtn');
        elementosEnPestana.forEach(elemento => {
            idsEnPestana[elemento.id] = elemento.id;
        });

        const contenidoPestana = document.getElementById('contenidoPestana');
        if (contenidoPestana) {
            const elementosEnHtmlDinamico = contenidoPestana.querySelectorAll('*[id]');
            elementosEnHtmlDinamico.forEach(elemento => {
                idsEnPestana[elemento.id] = elemento.id;
            });
        }

        return idsEnPestana;
    }

    function cargarPestana(pestana) {
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
                mostrarFormulario(tipoUsuarioSeleccionado);
                if (pestana === 'datos') {
                    cargarPaises();
                }
                mostrarIdsEnConsola();
            })
            .catch(error => console.error(error))
            .finally(() => {
                cargarOpcionesEnModal();
            });
    }

    function mostrarFormulario(tipoUsuario) {
        console.log(`Mostrando formulario para ${tipoUsuario}`);
        ocultarFormularios();
        if (tipoUsuario) {
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
        const formularios = document.querySelectorAll('.formulario-datos, .formulario-aurora');
        formularios.forEach(formulario => {
            formulario.style.display = 'none';
        });
    }

    function mostrarPestanas() {
        const pestanas = document.querySelectorAll('.pestanas');
        if (tipoUsuarioSeleccionado !== undefined && (tipoUsuarioSeleccionado === 'Persona' || tipoUsuarioSeleccionado === 'Empresa')) {
            pestanas.forEach(pestaña => {
                pestaña.style.display = 'block';
            });
            cargarOpcionesEnModal();
        } else {
            pestanas.forEach(pestaña => {
                pestaña.style.display = 'none';
            });
        }
    }

    function agregarEventListeners() {
        const tipoFormularioSelect = document.getElementById('tipoFormulario');
        tipoFormularioSelect.addEventListener('change', function () {
            tipoUsuarioSeleccionado = obtenerTipoUsuarioSeleccionado();
            cargarPestana('datos');
        });

        const btns = ['datosBtn', 'auroraBtn', 'contactoBtn', 'cryptoBtn', 'redesBtn'];
        btns.forEach(btnId => {
            const btn = document.getElementById(btnId);
            btn.addEventListener('click', function () {
                if (tipoUsuarioSeleccionado) {
                    cargarPestana(btnId.toLowerCase().replace('btn', ''));
                } else {
                    showNotification('Por favor, seleccione un tipo de usuario antes de abrir una pestaña.');
                }
            });
        });
    }

    function init() {
        tipoUsuarioSeleccionado = obtenerTipoUsuarioSeleccionado();
        mostrarPestanas();
        cargarPestana('datos');
        agregarEventListeners();
        mostrarIdsEnConsola();
    }

    init();
});
