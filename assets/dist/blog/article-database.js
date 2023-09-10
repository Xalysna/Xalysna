// Importar la configuración de Firebase desde firebase-config.js
import { firebaseConfig } from "../settings/firebase-config.js";

// Importar los módulos necesarios del SDK de Firebase desde los enlaces CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, doc, setDoc, collection, getDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Identificador del script de generación de título
const titleScriptIdentifier = "Script Generador de Título";

// Variable global para almacenar la fecha y hora formateada
let formattedDateTime = "";

// Función para generar el nombre del documento
function generateDocumentName() {
  // Obtiene la URL actual
  const currentUrl = document.location.href;

  // Obtiene la última parte de la URL como el nombre del archivo
  const fileName = currentUrl.split('/').pop();

  // Remueve la extensión del archivo (por ejemplo, ".html")
  const fileNameWithoutExtension = fileName.split('.')[0];

  // Formatea el nombre del archivo reemplazando espacios por guiones
  return fileNameWithoutExtension.replace(/\s+/g, '-');
}

// Función para generar colores aleatorios por letra del alfabeto
function generateColorsByLetter() {
  const coloresTextoPorLetra = {};
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let letra of letras) {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    coloresTextoPorLetra[letra] = color;
  }

  return coloresTextoPorLetra;
}

// Función para obtener la fecha almacenada en Firestore
async function getFirestoreDate(db, collectionName, documentName) {
  try {
    const docRef = doc(collection(db, collectionName), documentName);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const documentData = docSnapshot.data();
      return documentData.fecha;
    }
  } catch (error) {
    console.error("Error al obtener la fecha de Firestore:", error);
  }
  return null; // Devuelve null si no se pudo obtener la fecha de Firestore
}

// Función para crear una colección y un documento en Firestore
async function createFirestoreCollectionAndDocument(collectionName, documentName, documentData, db) {
  try {
    // Verifica si collectionName y documentName están definidos
    if (!collectionName || !documentName) {
      console.error("Nombre de colección o documento vacío.");
      return;
    }

    // Crear la referencia al documento
    const docRef = doc(collection(db, collectionName), documentName);

    // Intenta obtener el documento
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      // Si el documento no existe, crea la colección y el documento
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.toLocaleString('es-ES', { month: 'long' });
      const year = currentDate.getFullYear();
      const hour = currentDate.getHours().toString().padStart(2, '0');
      const minute = currentDate.getMinutes().toString().padStart(2, '0');
      const formattedDateTime = `${day} de ${month} del ${year} a las ${hour}:${minute}`;
      
      // Agrega la fecha al documentoData
      documentData.fecha = formattedDateTime;

      await setDoc(docRef, documentData);
      console.log("Colección y documento creados exitosamente.");
    } else {
      // Si el documento existe, verifica si hay cambios en los datos antes de actualizarlo
      const existingData = docSnapshot.data();

      if (!isEqual(existingData, documentData)) {
        // Actualiza el documento solo si hay cambios en los datos
        await setDoc(docRef, documentData);
        console.log("Documento actualizado con los nuevos datos.");
      } else {
        console.log("La colección y el documento ya existen y no se han realizado cambios.");
      }
    }
  } catch (error) {
    console.error("Error al crear la colección o el documento:", error);
  }
}

// Función para comparar objetos
function isEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}



// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Inicializar Firebase con la configuración importada
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);

    // Genera el nombre del documento
    const documentName = generateDocumentName();

    // Muestra el título formateado en la consola
    console.log(titleScriptIdentifier + ": Título formateado: " + documentName);

    // Obtén la última carpeta desde la URL
    const ruta = window.location.pathname;
    const segmentos = ruta.split("/");
    
    // Obtener la carpeta antes del archivo
    const categoria = segmentos[segmentos.length - 2]; // Cambio aquí para obtener la carpeta correcta
    const ultimaCarpeta = segmentos.pop();

    // Asigna el nombre de la última carpeta como categoría del documento
    document.getElementById("categoria").textContent = "Categoría: " + categoria; // Cambio aquí para mostrar la categoría correcta

    // Obtén la primera letra de la última carpeta
    const primeraLetra = categoria.charAt(0).toUpperCase();

    // Genera colores para letras del alfabeto
    const coloresTextoPorLetra = generateColorsByLetter();

    // Utiliza la función para obtener el color de texto basado en la primera letra
    const colorTexto = coloresTextoPorLetra[primeraLetra] || "#000000"; // Color negro predeterminado

    // Obtén todos los elementos con la clase "categoria" y establece el color de texto
    const elementosCategoria = document.getElementsByClassName("categoria");
    for (let i = 0; i < elementosCategoria.length; i++) {
      elementosCategoria[i].style.color = colorTexto;
    }

    // Llama a la función para actualizar el título personalizado
    actualizarTituloPersonalizado(); // Llamada agregada aquí

    // Utiliza "categoria" como el nombre de la colección en Firestore y el nombre del documento generado
    const documentData = {
      fecha: await getFirestoreDate(db, categoria, documentName) || formattedDateTime, // Obtiene la fecha de Firestore al crear el documento o utiliza la fecha local si no está disponible
      autor: document.getElementById('autor').textContent,
      titulo: document.getElementById('titulo').textContent,
      metaDescripcion: document.getElementById('metaDescripcion').textContent,
      lista: document.getElementById('lista').textContent,
      contenido: document.getElementById('contenido').textContent,
      conclusion: document.getElementById('conclusion').textContent,
      creditos: document.getElementById('creditos').textContent,
      enlaces: document.getElementById('enlaces').textContent
    };

    // Muestra la fecha obtenida de Firestore en el elemento HTML con el id "article-timestamp"
    const articleTimestamp = document.getElementById('article-timestamp');
    if (articleTimestamp) {
      articleTimestamp.textContent = documentData.fecha;
    }

    // Utiliza "categoria" como el nombre de la colección en Firestore y el nombre del documento generado
    await createFirestoreCollectionAndDocument(categoria, documentName, documentData, db);

    // Exporta la variable ultimaCarpeta después de asignarle un valor
    console.log("Exportando ultimaCarpeta:", ultimaCarpeta);
  } catch (error) {
    console.error("Error:", error);
  }
});
