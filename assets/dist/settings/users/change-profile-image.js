// Importaciones de módulos Firebase
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de auth y firestore
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Función para obtener el UID y el correo del usuario actual
function obtenerUIDyCorreo() {
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
        // Obtener el UID del usuario autenticado
        const { uid } = obtenerUIDyCorreo();

        // Llamar a la función para subir la foto de perfil
        subirFotoPerfilYActualizar(uid, file);
    } else {
        console.error('No se seleccionó ningún archivo.');
    }
});

// Función para subir la foto de perfil y actualizar el documento del usuario
async function subirFotoPerfilYActualizar(uid, fotoPerfilFile) {
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

// Función para eliminar la foto de perfil y actualizar el documento del usuario
async function eliminarFotoPerfilYActualizar(uid) {
    try {
        // Obtener la referencia al documento del usuario en Firestore
        const userDocRef = doc(firestore, 'USERS', uid);

        // Obtener los datos del documento
        const docSnapshot = await getDoc(userDocRef);

        // Verificar si el documento existe
        if (docSnapshot.exists()) {
            // Obtener la URL de la foto de perfil desde los datos del documento
            const fotoPerfilURL = docSnapshot.data()?.photoProfile;

            // Verificar si hay una foto de perfil para eliminar
            if (fotoPerfilURL) {
                // Obtener la referencia al archivo en Storage
                const storageRef = ref(storage, `USERS/${uid}/PHOTO/${uid}.${getExtensionFromURL(fotoPerfilURL)}`);

                // Eliminar el archivo de Storage
                await deleteObject(storageRef);

                // Actualizar el documento del usuario en Firestore sin la URL de la foto de perfil
                await setDoc(userDocRef, { photoProfile: null }, { merge: true });

                console.log('Foto de perfil eliminada y documento actualizado.');
            } else {
                console.log('No hay foto de perfil para eliminar.');
            }
        } else {
            console.error('Error: El documento del usuario no existe.');
        }
    } catch (error) {
        console.error('Error al eliminar la foto de perfil:', error);
    }
}

// Función para obtener la extensión de un archivo a partir de su URL
function getExtensionFromURL(url) {
    return url.split('.').pop().toLowerCase();
}
