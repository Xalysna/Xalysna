// Importar la configuración de Firebase
import { firebaseConfig } from "../config/firebase-config.js";
import { FIREBASE_APP_URL, FIREBASE_AUTH_URL, FIREBASE_FIRESTORE_URL, FIREBASE_STORAGE_URL } from "../config/firebase-config-urls.js";

// Imprimir las URLs para verificar que estén configuradas correctamente
console.log("FIREBASE_APP_URL:", FIREBASE_APP_URL);
console.log("FIREBASE_AUTH_URL:", FIREBASE_AUTH_URL);
console.log("FIREBASE_FIRESTORE_URL:", FIREBASE_FIRESTORE_URL);
console.log("FIREBASE_STORAGE_URL:", FIREBASE_STORAGE_URL);

// Importar las funciones necesarias del SDK de Firebase de forma dinámica
const { initializeApp } = await import(FIREBASE_APP_URL);
const { getAuth, onAuthStateChanged } = await import(FIREBASE_AUTH_URL);
const { getFirestore, doc, getDoc, setDoc, updateDoc } = await import(FIREBASE_FIRESTORE_URL);
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = await import(FIREBASE_STORAGE_URL);

//Importacion de recorte
import { mostrarModalRecorte } from './../../general/funciones/cropper-edit.js';

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de auth y firestore
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Función para obtener el UID y el correo del usuario actual
export function obtenerUIDyCorreo() {
    const user = auth.currentUser;

    if (user) {
        console.log('UID:', user.uid);
        console.log('Correo:', user.email);
        return { uid: user.uid, email: user.email };
    } else {
        console.error('Usuario no autenticado');
        return null;
    }
}


// Función para obtener la primera letra de usernameId
function obtenerPrimeraLetra(usernameId) {
    if (usernameId && usernameId.length > 0) {
        return usernameId.charAt(0).toUpperCase();
    } else {
        console.error('El usernameId no es válido.');
        return null;
    }
}

// Función para obtener el valor de usernameId dentro del documento del usuario en Firestore
async function obtenerUsernameId(uid) {
    try {
        // Obtener una referencia al documento del usuario en Firestore usando el UID
        const userDocRef = doc(firestore, 'USERS', uid);

        // Obtener los datos del documento
        const userDocSnapshot = await getDoc(userDocRef);

        // Verificar si el documento existe
        if (userDocSnapshot.exists()) {
            const { usernameId } = userDocSnapshot.data();

            if (usernameId) {
                console.log('usernameId del usuario:', usernameId);
                return usernameId;
            } else {
                console.log('usernameId no encontrado en el documento del usuario');
                return null;
            }
        } else {
            console.log('Usuario no encontrado');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
    }
}


// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Usuario autenticado, mostrar UID y correo en la consola
        const { uid } = obtenerUIDyCorreo();

        // Obtener y mostrar el usernameId del usuario actual
        const usernameId = await obtenerUsernameId(uid);

        if (!usernameId) {
            console.error('No se pudo obtener el usernameId del usuario.');
        } else {
            console.log('UsernameId del usuario actual:', usernameId);

            // Obtener y mostrar la primera letra del usernameId
            const primeraLetra = obtenerPrimeraLetra(usernameId);

            if (primeraLetra) {
                console.log('Primera letra del usernameId:', primeraLetra);

                // Obtener y mostrar la URL de la foto de perfil del usuario
                const userDocRef = doc(firestore, 'USERS', uid);
                const docSnapshot = await getDoc(userDocRef);
                const fotoPerfilURL = docSnapshot.data()?.photoProfile;

                // Mostrar la primera letra o la foto de perfil en el elemento HTML
                mostrarPrimeraLetraOImagen(primeraLetra, fotoPerfilURL);
            } else {
                console.error('No se pudo obtener la primera letra del usernameId.');
            }
        }
    } else {
        console.log('Usuario no autenticado');
    }
});

// Función para mostrar la primera letra o la foto de perfil en el elemento HTML
function mostrarPrimeraLetraOImagen(letra, fotoPerfilURL) {
    // Obtener el elemento div por su ID
    const primeraLetraContainer = document.getElementById('primeraLetraContainer');
    const imagenPerfil = document.getElementById('imagenPerfil'); // Ajusta el ID según tu estructura HTML

    // Verificar si el elemento existe
    if (primeraLetraContainer && imagenPerfil) {
        // Actualizar el contenido del elemento con la primera letra
        primeraLetraContainer.textContent = letra;

        // Mostrar la foto de perfil si está presente, de lo contrario, mostrar la letra
        if (fotoPerfilURL) {
            imagenPerfil.src = fotoPerfilURL;
            imagenPerfil.style.display = 'block';
            primeraLetraContainer.style.display = 'none';
        } else {
            imagenPerfil.style.display = 'none';
            primeraLetraContainer.style.display = 'block';
        }
    } else {
        console.error('Elemento HTML no encontrado');
    }
}

// Obtener referencia al botón de carga
const botonSubirFoto = document.getElementById('botonSubirFoto');

// Añadir listener para el evento de cambio
botonSubirFoto.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        // Crear instancia del lector de archivos
        const reader = new FileReader();

        // Definir la función que se ejecutará cuando la lectura esté completa
        reader.onload = function (e) {
            // Obtener el UID del usuario autenticado
            const { uid } = obtenerUIDyCorreo();

            // Mostrar el modal de recorte con la imagen cargada
            mostrarModalRecorte(file, uid);
        };

        // Leer el archivo como una URL de datos
        reader.readAsDataURL(file);
    } else {
        console.error('No se seleccionó ningún archivo.');
    }
});


// Función para subir la foto de perfil y actualizar el documento del usuario
export async function subirFotoPerfilYActualizar(uid, fotoPerfilFile) {
    // Extensiones permitidas
    const extensionesValidas = ['xbm', 'tif', 'pjp', 'apng', 'svgz', 'jpg', 'jpeg', 'ico', 'tiff', 'gif', 'svg', 'jfif', 'webp', 'png', 'bmp', 'pjpeg', 'avif', 'heif', 'heic'];

    // Obtener la extensión del archivo
    const extension = fotoPerfilFile.name.split('.').pop().toLowerCase();

    // Validar si el archivo es una imagen y si la extensión es válida
    if (!extensionesValidas.includes(extension)) {
        console.error('Error: La extensión del archivo no es válida o no es una imagen.');
        return;
    }

    const storagePath = `USERS/${uid}/PHOTO/${uid}.${extension}`;
    const storageRef = ref(storage, storagePath);

    try {
        // Subir la imagen al almacenamiento
        await uploadBytes(storageRef, fotoPerfilFile);

        // Obtener la URL de descarga de la imagen
        const fotoPerfilURL = await getDownloadURL(storageRef);
        console.log('URL de la foto de perfil subida:', fotoPerfilURL);

        // Actualizar el documento del usuario con la URL de la imagen de perfil
        const userDocRef = doc(firestore, 'USERS', uid);
        await setDoc(userDocRef, { photoProfile: fotoPerfilURL }, { merge: true });

        // Mostrar la foto de perfil actualizada
        mostrarFotoDePerfil(uid);
    } catch (error) {
        console.error('Error al subir la foto de perfil:', error);
    }
}

// Función para mostrar la foto de perfil actualizada
function mostrarFotoDePerfil(uid) {
    // Obtener la referencia al documento del usuario
    const userDocRef = doc(firestore, 'USERS', uid);

    // Obtener los datos del documento
    getDoc(userDocRef)
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                // Obtener la URL de la foto de perfil desde los datos del documento
                const fotoPerfilURL = docSnapshot.data()?.photoProfile;

                // Mostrar la foto de perfil en un elemento de imagen
                const imagenPerfil = document.getElementById('imagenPerfil'); // Ajusta el ID según tu estructura HTML
                imagenPerfil.src = fotoPerfilURL;

                // Mostrar la primera letra o la foto de perfil en el elemento HTML
                mostrarPrimeraLetraOImagen(obtenerPrimeraLetra(docSnapshot.data()?.usernameId), fotoPerfilURL);
            } else {
                console.error('Error: El documento del usuario no existe.');
            }
        })
        .catch((error) => {
            console.error('Error al obtener la foto de perfil:', error);
        });
}

// Función para eliminar la foto de perfil del almacenamiento y del documento del usuario
async function eliminarFotoPerfil(uid) {
    try {
        // Obtener la referencia al documento del usuario
        const userDocRef = doc(firestore, 'USERS', uid);

        // Obtener los datos del documento
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
            // Obtener la URL de la foto de perfil desde los datos del documento
            const fotoPerfilURL = docSnapshot.data()?.photoProfile;

            // Verificar si hay una foto de perfil para eliminar
            if (fotoPerfilURL) {
                // Eliminar la foto de perfil del almacenamiento
                const storagePath = `USERS/${uid}/PHOTO/${uid}.${fotoPerfilURL.split('.').pop()}`;
                const storageRef = ref(storage, storagePath);

                try {
                    // Verificar si el objeto existe obteniendo su URL de descarga
                    await getDownloadURL(storageRef);

                    // Objeto existe, entonces eliminarlo
                    await deleteObject(storageRef);

                    console.log('Eliminando la foto de perfil en Firebase Storage...');
                    
                } catch (error) {
                    if (error.code !== 'storage/object-not-found') {
                        // Otro tipo de error
                        console.error('Error al eliminar la foto de perfil en Firebase Storage:', error);
                        throw error; // Re-lanzar el error para detener la ejecución
                    }
                    // El objeto no se encuentra (ya fue eliminado), no se imprime ningún mensaje.
                }

                // Eliminar la referencia de la foto de perfil del documento del usuario
                await updateDoc(userDocRef, { photoProfile: null });

                console.log('Foto de perfil eliminada con éxito.');

                setTimeout(() => {
                    location.reload(true);
                }, 1200); 
                
            } else {
                console.log('El usuario no tiene una foto de perfil para eliminar.');
            }
        } else {
            console.error('Error: El documento del usuario no existe.');
        }
    } catch (error) {
        console.error('Error al eliminar la foto de perfil:', error);
    }
}


// Agregar un evento de clic al botón oculto
eliminarFotoPerfilBtn.addEventListener('click', () => {
    // Mostrar la ventana modal de confirmación
    const confirmacionModal = new bootstrap.Modal(document.getElementById('confirmacionModal'));
    confirmacionModal.show();

    // Agregar un evento de clic al botón de confirmación dentro de la modal
    const confirmarEliminacionBtn = document.getElementById('confirmarEliminacionBtn');
    confirmarEliminacionBtn.addEventListener('click', async () => {
        // Obtener el UID y el correo del usuario actual
        const usuarioActual = obtenerUIDyCorreo();

        if (usuarioActual) {
            // Llamar a la función eliminarFotoPerfil con el UID como parámetro
            await eliminarFotoPerfil(usuarioActual.uid);

            // Cerrar la ventana modal después de la eliminación
            confirmacionModal.hide();
        }
    });
});
