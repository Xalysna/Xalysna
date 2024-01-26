// Importar la configuración de Firebase desde firebase-config.js
import { firebaseConfig } from "../settings/config/firebase-config.js";
import { firebaseUrls } from "../settings/config/firebase-config-urls.js";

// Importar las funciones necesarias del SDK de Firebase desde las URLs de CDN
import { initializeApp } from firebaseUrls.app;
import { getStorage, ref, getDownloadURL } from firebaseUrls.storage;

// Inicializa Firebase con la configuración
const firebaseApp = initializeApp(firebaseConfig);

// Obtiene una referencia al servicio de almacenamiento de Firebase
const storage = getStorage(firebaseApp);

// Obtén el nombre del archivo HTML actual sin la extensión
const nombreHTML = window.location.pathname.split('/').pop().replace('.html', '');

// Construye el nombre del archivo de imagen correspondiente con la extensión PNG en el almacenamiento de Firebase
const nombreImagen = nombreHTML + '.png'; // Cambia '.png' por la extensión real de tus imágenes en formato PNG

// Crea una referencia al archivo de imagen en el almacenamiento de Firebase
const storageRef = ref(storage, nombreImagen);

// Obtén la URL de descarga de la imagen
getDownloadURL(storageRef)
  .then((url) => {
    // Una vez que obtengas la URL, puedes mostrar la imagen en tu HTML
    const imagen = document.createElement('img');
    imagen.src = url;
    
    // Agrega la clase 'img-background' al cuerpo de la página
    document.body.classList.add('img-background');
    
    // Agrega un console.log para verificar la URL de la imagen
    console.log('URL de la imagen:', url);
  })
  .catch((error) => {
    // Manejo de errores: muestra un mensaje de error en la consola
    console.error('Error al obtener la URL de la imagen:', error);
  });
