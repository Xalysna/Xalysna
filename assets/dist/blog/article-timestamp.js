// Importar la configuración de Firebase desde firebase-config.js
import { firebaseConfig } from "../settings/config/firebase-config.js";
import { firebaseUrls } from "../settings/config/firebase-config-urls.js";

// Importar las funciones necesarias del SDK de Firebase desde las URLs de CDN
import { initializeApp } from firebaseUrls.app;
import { getFirestore, doc, setDoc, getDoc } from firebaseUrls.firestore;

// Inicializar Firebase con la configuración importada
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Función para obtener y mostrar la fecha y hora inicial desde Firestore
async function displayArticleTimestamp() {
  try {
    // Obtén los nombres del documento y la colección desde las variables globales
    const documentName = window.articleDocumentName;
    const collectionName = window.articleCollectionName;

    // Verificar si las variables tienen valores válidos
    if (!documentName || !collectionName) {
      console.error("Los nombres de documento y colección no están configurados correctamente.");
      return;
    }

    // Utiliza esos nombres para obtener la fecha y hora desde Firestore
    const timestampDocRef = doc(db, collectionName, documentName);

    console.log("Obteniendo fecha y hora desde Firestore...");
    // Verificar si el documento ya existe
    const docSnapshot = await getDoc(timestampDocRef);

    if (docSnapshot.exists()) {
      // Si el documento existe, obtén la fecha y hora y muéstrala
      console.log("El documento existe en Firestore.");
      const articleTimestampElement = document.getElementById('article-timestamp');
      const timestampData = docSnapshot.data();

      if (articleTimestampElement && timestampData && timestampData.timestamp) {
        articleTimestampElement.textContent = timestampData.timestamp;
        console.log("Fecha y hora obtenida desde Firestore:", timestampData.timestamp);
      }
    } else {
      // Si el documento no existe, crea la fecha y hora inicial y guárdala en Firestore
      const initialTimestamp = getCurrentFormattedDateTime();
      const articleTimestampElement = document.getElementById('article-timestamp');

      if (articleTimestampElement) {
        articleTimestampElement.textContent = initialTimestamp;
        console.log("Fecha y hora inicial generada:", initialTimestamp);
      }

      console.log("El documento no existe en Firestore. Creando documento...");
      // Guardar la fecha y hora en Firestore
      await setDoc(timestampDocRef, { timestamp: initialTimestamp });
      console.log("Documento creado en Firestore.");
    }
  } catch (error) {
    console.error("Error al obtener o crear el documento en Firestore:", error);
  }
}

// Función para obtener la fecha y hora actual en el formato deseado
function getCurrentFormattedDateTime() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('es-ES', { month: 'long' });
  const year = currentDate.getFullYear();
  const hour = currentDate.getHours().toString().padStart(2, '0');
  const minute = currentDate.getMinutes().toString().padStart(2, '0');

  const formattedDateTime = `${day} de ${month} del ${year} a las ${hour}:${minute}`;
  return formattedDateTime;
}

// Llamar a la función para mostrar la fecha y hora inicial
displayArticleTimestamp();
