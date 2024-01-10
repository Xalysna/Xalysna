// cargarOpcionesDatabases.js

// Importaciones de módulos Firebase y configuración
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// Inicializar la aplicación Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();

// Función para cargar opciones desde la colección "DATABASES" en Firestore
async function cargarOpcionesDatabases(selectId, tipo) {
  const select = document.getElementById(selectId);

  // Asegúrate de que el select existe
  if (select) {
    try {
      // Obtén las opciones desde Firestore
      const opcionesSnapshot = await getDoc(doc(db, 'DATABASES', tipo));
      const opciones = opcionesSnapshot.data().opciones;

      // Agrega cada opción al select
      opciones.forEach((opcion) => {
        const option = document.createElement('option');
        option.value = opcion;
        option.text = opcion;
        select.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar opciones desde Firestore:', error);
    }
  }
}

// Llama a la función para cargar las opciones en los selects
cargarOpcionesDatabases('diaNacimientoPersona', 'DIA');
cargarOpcionesDatabases('mesNacimientoPersona', 'MES');
cargarOpcionesDatabases('anoNacimientoPersona', 'AÑO');
cargarOpcionesDatabases('edadPersona', 'EDAD');
cargarOpcionesDatabases('paisPersona', 'PAIS');
cargarOpcionesDatabases('ciudadPersona', 'CIUDAD');
cargarOpcionesDatabases('estadoPersona', 'ESTADO');
// Puedes agregar más llamadas para otros tipos de opciones
