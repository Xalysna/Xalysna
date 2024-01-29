// Importar la configuración de Firebase
import { firebaseConfig } from "../../../assets/dist/settings/config/firebase-config.js";
import { FIREBASE_APP_URL, FIREBASE_STORAGE_URL } from "../../../assets/dist/settings/config/firebase-config-urls.js";

// Imprimir las URLs para verificar que estén configuradas correctamente
console.log("FIREBASE_APP_URL:", FIREBASE_APP_URL);
console.log("FIREBASE_STORAGE_URL:", FIREBASE_STORAGE_URL);

// Importar las funciones necesarias del SDK de Firebase de forma dinámica
const { initializeApp } = await import(FIREBASE_APP_URL);
const { getStorage, ref, uploadBytes, deleteObject, getDownloadURL, updateMetadata, getMetadata } = await import(FIREBASE_STORAGE_URL);

// Inicializa Firebase con la configuración
const firebaseApp = initializeApp(firebaseConfig);

// Obtiene una referencia al servicio de almacenamiento de Firebase
const storage = getStorage(firebaseApp);

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded');

    const imageUploadForm = document.getElementById('image-upload-form');
    const imageInput = document.getElementById('image-input');
    const articleTitleInput = document.getElementById('titulo'); // Campo para ingresar el título del artículo
    const currentNameInput = document.getElementById('current-name-input'); // Campo para ingresar el nombre actual del elemento
    const assignIdButton = document.getElementById('assign-id-button'); // Botón para asignar el ID permanente
    const editIdButton = document.getElementById('edit-id-button'); // Botón para editar el ID permanente
    const renameIdButton = document.getElementById('rename-id-button'); // Botón para renombrar el ID permanente
    const deleteImageButton = document.getElementById('delete-image-button'); // Botón para eliminar la imagen

    // Comprobar si todos los elementos necesarios están presentes en el DOM
    if (!imageUploadForm || !imageInput || !articleTitleInput || !currentNameInput || !assignIdButton || !editIdButton || !renameIdButton || !deleteImageButton) {
        console.error('No se encontraron elementos necesarios en el DOM.');
        return;
    }

    console.log('Todos los elementos necesarios están presentes.');

    let imageUploaded = false;

    // Deshabilitar inicialmente los elementos y el botón "Subir Imagen y Asignar ID Permanente"
    articleTitleInput.disabled = true;
    currentNameInput.disabled = true; // Campo de entrada del nombre actual
    editIdButton.disabled = true;
    renameIdButton.disabled = true;
    deleteImageButton.disabled = true;

    // Función para habilitar o deshabilitar el botón de eliminar imagen
    function toggleDeleteButton(enabled) {
        deleteImageButton.disabled = !enabled;
    }

    // Habilitar el botón "Subir Imagen y Asignar ID Permanente" solo cuando se elige una imagen
    imageInput.addEventListener('change', function () {
        if (imageInput.files.length > 0) {
            articleTitleInput.disabled = false;
            assignIdButton.disabled = false;
        } else {
            articleTitleInput.disabled = true;
            assignIdButton.disabled = true;
        }
    });

    async function uploadImage(imageFile, articleTitle) {
        // Verifica si se seleccionó un archivo de imagen
        if (!imageFile) {
            console.error('No se ha seleccionado ninguna imagen.');
            return;
        }

        const formattedTitle = `${articleTitle.replace(/\s+/g, '-')}.${imageFile.name.split('.').pop()}`;

        // Ruta en Firebase Storage donde se almacenará la imagen permanentemente con el mismo nombre que el ID
        const permanentStorageRef = ref(storage, `TEMPORARY/${formattedTitle}`);

        try {
            // Inicia la carga de la imagen
            const task = uploadBytes(permanentStorageRef, imageFile);
            console.log('Iniciando carga de imagen permanente...');

            // Espera a que la carga se complete
            await task;

            // La imagen se ha cargado correctamente
            console.log(`Imagen cargada con éxito con el ID permanente: ${formattedTitle}`);

            // Almacena el nombre del elemento más reciente
            currentNameInput.value = formattedTitle;

            // Habilita el botón "Editar ID permanente" y "Renombrar ID permanente"
            editIdButton.disabled = false;
            renameIdButton.disabled = false;

            // Habilita el botón de eliminar imagen
            toggleDeleteButton(true);

            // Bloquea el campo de entrada de ID permanente y el botón "Subir Imagen y Asignar ID Permanente"
            articleTitleInput.disabled = true;
            currentNameInput.disabled = true; // Deshabilitar campo de entrada del nombre actual
            assignIdButton.disabled = true;

            imageUploaded = true;

            // Limpiar el campo de entrada de archivos
            imageInput.value = ''; // Esto limpiará el valor del campo de entrada de archivos
        } catch (error) {
            // Maneja los errores de carga aquí y habilita el botón de envío
            console.error('Error al cargar la imagen:', error);
        }
    }

    assignIdButton.addEventListener('click', function () {
        const articleTitle = articleTitleInput.value.trim(); // Obtener el título del artículo ingresado por el usuario

        if (articleTitle === '') {
            console.error('Debes ingresar un título para el artículo antes de asignar el ID permanente.');
            return;
        }

        // Llamar a una función para cargar la imagen en Firebase Storage
        uploadImage(imageInput.files[0], articleTitle);

        // Bloquea el botón "Asignar ID permanente" después de iniciar el proceso
        assignIdButton.disabled = true;
    });

    editIdButton.addEventListener('click', function () {
        // Habilita la edición del campo de entrada de ID permanente
        articleTitleInput.disabled = false;

        // Bloquea el botón "Editar ID permanente" después de habilitar la edición
        editIdButton.disabled = true;

        // Habilita el botón "Renombrar ID permanente" si se ha subido una imagen
        if (imageUploaded) {
            renameIdButton.disabled = false;
        }
    });

    renameIdButton.addEventListener('click', async function () {
        const currentName = currentNameInput.value.trim(); // Obtener el nombre actual del elemento ingresado por el usuario
        const newTitle = articleTitleInput.value.trim(); // Obtener el nuevo título ingresado por el usuario
    
        if (currentName === '' || newTitle === '') {
            console.error('Debes ingresar un nombre actual y un nuevo título antes de renombrar el ID permanente.');
            return;
        }
    
        const formattedCurrentName = currentName.replace(/\s+/g, '-'); // Reemplazar espacios en el nombre actual con guiones
        const formattedNewTitle = newTitle.replace(/\s+/g, '-'); // Reemplazar espacios en el nuevo título con guiones
    
        // Crear una referencia al elemento actual en Firebase Storage
        const currentStorageRef = ref(storage, `TEMPORARY/${formattedCurrentName}`);
    
        try {
            // Verificar si el elemento actual existe en Firebase Storage
            const metadata = await getMetadata(currentStorageRef);
            if (metadata) {
                console.log('El elemento actual existe en Firebase Storage.');
    
                // Crear una nueva referencia en Firebase Storage con el nuevo título formateado
                const newStorageRef = ref(storage, `TEMPORARY/${formattedNewTitle}`);
    
                try {
                    // Obtener la URL de descarga de la imagen actual
                    const downloadURL = await getDownloadURL(currentStorageRef);
    
                    // Subir la imagen a la nueva ubicación con el nuevo nombre
                    await uploadBytes(newStorageRef, new TextEncoder().encode(downloadURL));
    
                    // Eliminar el elemento anterior
                    await deleteObject(currentStorageRef);
    
                    // Actualizar el campo "Ingresa el nombre actual del elemento" con el nuevo nombre
                    currentNameInput.value = newTitle; // Actualizar con el nuevo título
    
                    console.log('Elemento renombrado y actualizado con éxito.');
                } catch (copyDeleteError) {
                    console.error('Error al copiar o eliminar el elemento:', copyDeleteError);
                }
            } else {
                console.error('El elemento actual no existe en Firebase Storage.');
            }
        } catch (error) {
            console.error('Error al verificar el elemento:', error);
        }
    
        // Deshabilitar el botón "Renombrar ID permanente" después de iniciar el proceso
        renameIdButton.disabled = true;
    });

    deleteImageButton.addEventListener('click', async function () {
        const articleTitle = articleTitleInput.value.trim(); // Obtener el título del artículo ingresado por el usuario

        if (articleTitle === '') {
            console.error('Debes ingresar un título para el artículo antes de eliminar la imagen.');
            return;
        }

        const formattedTitle = articleTitle.replace(/\s+/g, '-'); // Reemplaza espacios con guiones

        // Referencia al archivo de imagen en Firebase Storage
        const permanentStorageRef = ref(storage, `TEMPORARY/${formattedTitle}`);

        try {
            // Elimina el archivo de imagen de Firebase Storage
            await deleteObject(permanentStorageRef);
            console.log(`Imagen con ID permanente '${formattedTitle}' eliminada con éxito.`);

            // Cambia el nombre de la carpeta permanente a "Temporary"
            const permanentFolderRef = ref(storage, 'TEMPORARY');
            await updateMetadata(permanentFolderRef, { customMetadata: { idPermanente: 'Temporary' } });

            // Habilita el botón "Subir Imagen y Asignar ID Permanente" después de eliminar la imagen
            assignIdButton.disabled = false;

            // Limpia el campo de entrada de ID permanente
            articleTitleInput.value = '';
            currentNameInput.value = ''; // Limpia el campo de nombre actual

            // Bloquea el campo de entrada de ID permanente y otros elementos
            articleTitleInput.disabled = true;
            currentNameInput.disabled = true; // Deshabilita el campo de entrada del nombre actual
            editIdButton.disabled = true;
            renameIdButton.disabled = true;
            toggleDeleteButton(false); // Deshabilita el botón de eliminar imagen
        } catch (error) {
            console.error('Error al eliminar la imagen:', error);
        }
    });

    // Manejar el envío del formulario de carga de imagen
    imageUploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const imageFile = imageInput.files[0]; // Obtener el archivo de imagen seleccionado

        // Llamar a una función para cargar la imagen en Firebase Storage
        uploadImage(imageFile, articleTitleInput.value.trim());
    });
});
