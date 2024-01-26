// cropper-edit.js

import { subirFotoPerfilYActualizar } from './../../settings/users/change-profile-image.js';
import { obtenerUIDyCorreo } from './../../settings/users/change-profile-image.js';

// Obtener referencia al botón de carga
const botonSubirFoto = document.getElementById('botonSubirFoto');

// Obtener referencia al modal y a la imagen dentro del modal
const modalRecorte = document.getElementById('modalRecorte');
const imagenRecorte = document.getElementById('imagenRecorte');

// Obtener referencia a los botones de aceptar y cancelar en el modal
const btnAceptarRecorte = document.getElementById('btnAceptarRecorte');
const btnCancelarRecorte = document.getElementById('btnCancelarRecorte');

// Variable para el objeto Cropper
let cropper;


// Función para mostrar el modal de recorte
function mostrarModalRecorte(file) {
    modalRecorte.style.display = 'block';

    const reader = new FileReader();
    reader.onload = function (e) {
        // Mostrar la imagen en el modal
        imagenRecorte.addEventListener('load', function () {
            // Crear el objeto Cropper después de cargar completamente la imagen en el modal
            iniciarCropper();
        });
        imagenRecorte.src = e.target.result;
    };

    reader.readAsDataURL(file);

// Agregar listener para el evento de cambio
botonSubirFoto.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        // Mostrar el modal de recorte
        mostrarModalRecorte(file);
    } else {
        console.error('No se seleccionó ningún archivo.');
    }
});


    // Agregar un listener al botón de aceptar en el modal
    btnAceptarRecorte.addEventListener('click', async function () {
        try {
            // Verificar si cropper está inicializado
            if (cropper) {
                // Obtener la imagen recortada como base64
                const canvas = cropper.getCroppedCanvas();

                // Verificar que se obtuvo el lienzo recortado
                if (!canvas) {
                    throw new Error('Error: No se pudo obtener el lienzo recortado. Asegúrate de que la imagen se haya cargado completamente.');
                }

                // Obtener la imagen recortada como base64 nuevamente después de asegurarse de que la imagen se haya cargado completamente
                const imagenRecortadaBase64 = canvas.toDataURL('image/png');

                // Verificar que la base64 sea válida
                if (!imagenRecortadaBase64.startsWith('data:image/')) {
                    throw new Error('Error: No se pudo obtener el lienzo recortado. La base64 no es válida.');
                }

                // Convertir la imagen recortada de base64 a un objeto File
                const imagenRecortadaFile = await convertirBase64AFile(imagenRecortadaBase64);

                // Llamar a la función para subir la foto de perfil después del recorte
                await subirFotoPerfilYActualizar(obtenerUIDyCorreo().uid, imagenRecortadaFile);

                // Ocultar el modal y destruir el objeto Cropper después de la operación
                modalRecorte.style.display = 'none';
                cropper.destroy();
            } else {
                throw new Error('Error: Cropper no inicializado correctamente. Asegúrate de que la imagen se haya cargado correctamente.');
            }
        } catch (error) {
            console.error('Error al obtener la imagen recortada:', error.message);
        }
    });

    // Agregar un listener al botón de cancelar en el modal
    btnCancelarRecorte.addEventListener('click', function () {
        // Ocultar el modal y destruir el objeto Cropper
        modalRecorte.style.display = 'none';
        if (cropper) {
            cropper.destroy();
        }
    });

    // Función para inicializar Cropper
    function iniciarCropper() {
        // Verificar que la imagen tenga dimensiones válidas antes de inicializar Cropper
        if (imagenRecorte.naturalWidth > 0 && imagenRecorte.naturalHeight > 0) {
            // Asegúrate de que cropper esté destruido antes de volver a inicializarlo
            if (cropper) {
                cropper.destroy();
            }

            cropper = new Cropper(imagenRecorte, {
                viewMode: 1,
                aspectRatio: 1,
                autoCropArea: 0.8,
                crop: function (event) {
                    // Puedes agregar lógica adicional aquí si es necesario
                },
                modal: true,
                guides: false,
                highlight: false,
                background: false,
                movable: false,
                zoomable: false,
                rotatable: false,
            });
        } else {
            console.error('Error: La imagen no tiene dimensiones válidas.');
            // Puedes agregar lógica adicional si es necesario
        }
    }
}

// Función para convertir base64 a un objeto File
function convertirBase64AFile(base64) {
    return new Promise((resolve, reject) => {
        try {
            // Convertir el contenido base64 a un Blob
            const blob = dataURItoBlob(base64);

            // Crear un objeto File a partir del Blob
            const file = new File([blob], 'imagen_recortada.png', { type: 'image/png' });

            if (file.size > 0) {
                resolve(file);
            } else {
                throw new Error('Error: El archivo recortado está vacío.');
            }
        } catch (error) {
            reject(new Error('Error al convertir base64 a File: ' + error.message));
        }
    });
}

// Función para convertir una cadena base64 a un Blob
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
}

export { mostrarModalRecorte };
