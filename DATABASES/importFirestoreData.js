const admin = require('firebase-admin');
const serviceAccount = require('./xavayapage-firebase-adminsdk-clxw5-52eb7d1fb0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const opcionesPath = 'C:/Users/kevin/public/DATABASES'; // Reemplaza con la ruta a tu directorio que contiene los JSON
const timeout = 60000; // Ajusta el tiempo de espera según sea necesario (en milisegundos)
const batchSize = 900; // Ajusta el tamaño del lote según tus necesidades (en KB)
const maxDocumentSize = 1024 * 900; // 900 KB

async function importOpciones() {
  try {
    const files = ['UBICACIONES']; // Agrega más tipos según sea necesario

    for (const tipo of files) {
      const data = require(`${opcionesPath}/${tipo.toLowerCase()}.json`);
      const opciones = data.opciones;

      const totalBatches = Math.ceil(opciones.length / batchSize);
      let batchesCompleted = 0;

      for (let i = 0; i < totalBatches; i++) {
        const startIdx = i * batchSize;
        const endIdx = (i + 1) * batchSize;
        const batchOpciones = opciones.slice(startIdx, endIdx);

        const batch = firestore.batch();
        let currentBatchSize = 0;

        batchOpciones.forEach((opcion, index) => {
          const docRef = firestore.collection('DATABASES').doc(tipo).collection('opciones').doc((startIdx + index).toString());
          const docSize = JSON.stringify(opcion).length;

          if (currentBatchSize + docSize <= maxDocumentSize) {
            batch.set(docRef, { opcion }, { merge: true });
            currentBatchSize += docSize;
          } else {
            console.log(`Lote ${i + 1}/${totalBatches} excede el tamaño máximo. Dividiendo lote.`);
            batch.commit();
            currentBatchSize = 0;
          }
        });

        if (currentBatchSize > 0) {
          await batch.commit();
          batchesCompleted++;
          console.log(`Lote ${i + 1}/${totalBatches} de ${batchOpciones.length} datos para ${tipo} importados correctamente.`);
        }
      }

      console.log(`Datos para ${tipo} importados correctamente. Lotes completados: ${batchesCompleted}/${totalBatches}`);
    }
  } catch (error) {
    console.error('Error al importar datos:', error);
  } finally {
    admin.app().delete();
  }
}

// Establece un tiempo de espera para la operación
setTimeout(() => {
  console.error('Tiempo de espera excedido. La operación se ha cancelado.');
  process.exit(1);
}, timeout);

// Ejecuta la función de importación
importOpciones();
