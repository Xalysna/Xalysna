// firebase-config-urls.js
import { validateFirebaseConfigUrls } from './firebase-check.js';

const firebaseCdn = 'https://www.gstatic.com/firebasejs/10.7.2/';

const moduleNames = {
    app: 'firebase-app.js',
    auth: 'firebase-auth.js',
    firestore: 'firebase-firestore.js',
    storage: 'firebase-storage.js',
    database: 'firebase-database.js',
    messaging: 'firebase-messaging.js',
    functions: 'firebase-functions.js',
    analytics: 'firebase-analytics.js',
    performance: 'firebase-performance.js',
    remoteConfig: 'firebase-remote-config.js',
};

// Crear constantes para cada módulo
const {
    app,
    auth,
    firestore,
    storage,
    database,
    messaging,
    functions,
    analytics,
    performance,
    remoteConfig,
} = moduleNames;

const firebaseUrls = {
    app: `${firebaseCdn}${app}`,
    auth: `${firebaseCdn}${auth}`,
    firestore: `${firebaseCdn}${firestore}`,
    storage: `${firebaseCdn}${storage}`,
    database: `${firebaseCdn}${database}`,
    messaging: `${firebaseCdn}${messaging}`,
    functions: `${firebaseCdn}${functions}`,
    analytics: `${firebaseCdn}${analytics}`,
    performance: `${firebaseCdn}${performance}`,
    remoteConfig: `${firebaseCdn}${remoteConfig}`,
};

export { firebaseUrls };

validateFirebaseConfigUrls(firebaseUrls);
