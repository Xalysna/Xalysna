// Importar la configuración de Firebase
import { firebaseConfig } from "../../../assets/dist/settings/config/firebase-config.js";
import { FIREBASE_APP_URL, FIREBASE_STORAGE_URL } from "../../../assets/dist/settings/config/firebase-config-urls.js";

// Imprimir las URLs para verificar que estén configuradas correctamente
console.log("FIREBASE_APP_URL:", FIREBASE_APP_URL);
console.log("FIREBASE_STORAGE_URL:", FIREBASE_STORAGE_URL);

// Importar las funciones necesarias del SDK de Firebase de forma dinámica
const { initializeApp } = await import(FIREBASE_APP_URL);
const { getStorage, ref, uploadBytes } = await import(FIREBASE_STORAGE_URL);

// Inicializa Firebase con la configuración
const firebaseApp = initializeApp(firebaseConfig);

// Obtiene una referencia al servicio de almacenamiento de Firebase
const storage = getStorage(firebaseApp);

document.addEventListener('DOMContentLoaded', function () {
    const imageUploadForm = document.getElementById('image-upload-form');
    const imageInput = document.getElementById('image-input');

    imageUploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtiene el ID del artículo desde el atributo data-article-id del elemento h1
        const articleId = document.getElementById('main-title').getAttribute('data-article-id');
        
        const imageFile = imageInput.files[0]; // Obtiene el archivo de imagen seleccionado
        
        // Llama a una función para cargar la imagen en Firebase Storage y asociarla con el artículo
        uploadAndAssociateImageWithArticle(articleId, imageFile);
    });
});

function uploadAndAssociateImageWithArticle(articleId, imageFile) {
    // Verifica si se seleccionó un archivo de imagen
    if (!imageFile) {
        console.error('No se ha seleccionado ninguna imagen.');
        return;
    }

    // Genera un nombre único para la imagen
    const imageName = `${articleId}-${imageFile.name}`;

    // Ruta en Firebase Storage donde se almacenará la imagen
    const storageRef = ref(storage, `media/blog/${articleId}/${imageName}`);

    // Inicia la carga de la imagen
    const task = uploadBytes(storageRef, imageFile);

    // Escucha los eventos para monitorear el progreso de la carga
    task.on('state_changed',
        function progress(snapshot) {
            // Puedes mostrar el progreso de carga aquí
            const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Progreso: ${percentage}%`);
        },
        function error(err) {
            // Maneja los errores de carga aquí
            console.error('Error al cargar la imagen:', err);
        },
        function complete() {
            // La imagen se ha cargado correctamente, ahora puedes asociarla con el artículo en tu base de datos o hacer cualquier otra operación necesaria
            console.log('Imagen cargada con éxito.');

            // Ejemplo: Asociar la URL de la imagen con el artículo en la base de datos
            getDownloadURL(task.snapshot.ref).then((imageUrl) => {
                associateImageWithArticle(articleId, imageUrl);
            }).catch((error) => {
                console.error('Error al obtener la URL de la imagen:', error);
            });
        }
    );
}

function associateImageWithArticle(articleId, imageUrl) {
    // Aquí puedes realizar la lógica necesaria para asociar la URL de la imagen con el artículo en tu base de datos
    // Por ejemplo, puedes guardar la URL en la base de datos del artículo
    console.log(`Asociando la imagen con el artículo ${articleId}. URL de la imagen: ${imageUrl}`);
}

// Obtén la ubicación actual del HTML
const rutaHTML = window.location.pathname;

// Encuentra la posición de "content" en la ruta
const inicio = rutaHTML.indexOf("/content/");

if (inicio !== -1) {
  // Elimina la parte de la ruta antes de "content"
  const rutaRelativa = rutaHTML.substring(inicio + 9); // El 9 es la longitud de "/content/"

  // Elimina la extensión ".html" del nombre del HTML
  const nombreHTML = rutaRelativa.replace(".html", "");

  // Construye la ruta de almacenamiento en Firebase Storage
  const rutaEnStorage = `media/${rutaRelativa.replace(".html", ".png")}`;
  
  // Ahora puedes utilizar `rutaEnStorage` para cargar la imagen desde Firebase Storage
  console.log(`Ruta en Firebase Storage: ${rutaEnStorage}`);
} else {
  console.error("La ruta del HTML no contiene la carpeta 'content'.");
}
