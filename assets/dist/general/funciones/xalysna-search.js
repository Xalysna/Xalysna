// Importar la configuración de Firebase
import { firebaseConfig } from "../../settings/config/firebase-config.js";
import { FIREBASE_APP_URL, FIREBASE_AUTH_URL, FIREBASE_FIRESTORE_URL } from "../../settings/config/firebase-config-urls.js";

// Imprimir las URLs para verificar que estén configuradas correctamente
console.log("FIREBASE_APP_URL:", FIREBASE_APP_URL);
console.log("FIREBASE_AUTH_URL:", FIREBASE_AUTH_URL);
console.log("FIREBASE_FIRESTORE_URL:", FIREBASE_FIRESTORE_URL);

// Importar las funciones necesarias del SDK de Firebase de forma dinámica
const { initializeApp } = await import(FIREBASE_APP_URL);
const { getAuth, onAuthStateChanged } = await import(FIREBASE_AUTH_URL);
const { getFirestore, collection, where, getDocs  } = await import(FIREBASE_FIRESTORE_URL);

// Inicializar la aplicación Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();

const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const suggestionsContainer = document.querySelector(".suggestions-container");
const searchOptions = document.querySelector(".search-options");
const searchHistory = document.querySelector(".search-history");
const shortcutText = document.querySelector(".shortcut-text");
const errorElement = document.querySelector(".error-element");

