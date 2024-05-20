import { initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import configs from "./configs";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

// Inicializar la aplicación Firebase
const firebaseApp = initializeApp(JSON.parse(configs.firebaseConfig));

// Inicializar Firestore con persistencia habilitada
const db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Obtener instancias de los servicios de autenticación y almacenamiento
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export { db };
