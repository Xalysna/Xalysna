const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const progress = require('progress');
const { promisify } = require('util');

const serviceAccount = require('./xavayapage-firebase-adminsdk-clxw5-52eb7d1fb0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const ubicacionesCollection = firestore.collection('DATABASES');

const uploadData = async (batchPath) => {
  console.log(`\nProcesando lote en: ${batchPath}`);
  
  const jsonData = fs.readFileSync(batchPath, 'utf-8');
  const batchData = JSON.parse(jsonData);

  const batch = firestore.batch();
  const documentKeys = Object.keys(batchData);

  const progressBar = new progress('[:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: documentKeys.length,
  });

  for (const key of documentKeys) {
    const docRef = ubicacionesCollection.doc('UBICACIONES').collection('CODES').doc(key);
    batch.set(docRef, batchData[key]);
    progressBar.tick();
  }

  await batch.commit();

  return batchPath; // Retornar la ruta del lote para moverlo después
};

const moveFile = async (sourcePath, destinationPath) => {
  await promisify(fs.rename)(sourcePath, destinationPath);
};

const uploadBatches = async () => {
  const batchesPath = 'C:/Users/kevin/public/DATABASES/LOTES/COMPLETADO/OK';
  const destinationPath = 'C:/Users/kevin/public/DATABASES/LOTES/COMPLETADO/OK/CARGADOS';
  const files = fs.readdirSync(batchesPath).filter(file => file.endsWith('.json'));

  if (files.length === 0) {
    console.log('No hay lotes para procesar en la carpeta.');
    return;
  }

  console.log(`\nProcesando ${files.length} lote(s)...\n`);

  for (const file of files) {
    const batchPath = path.join(batchesPath, file);
    try {
      await uploadData(batchPath);
      console.log(`\nLote ${file} subido correctamente.`);
      const uploadedPath = path.join(destinationPath, file);
      await moveFile(batchPath, uploadedPath);
      console.log(`Lote ${file} movido a la carpeta "CARGADOS".`);
    } catch (error) {
      console.error(`\nError al subir el lote ${file}: ${error.message}`);
    }
  }
};

const TIMEOUT = 20 * 60 * 1000; // 20 minutos
const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), TIMEOUT));

Promise.race([uploadBatches(), timeoutPromise])
  .then(() => console.log('\nSubida de lotes completada con éxito.'))
  .catch(error => console.error(`\nError general: ${error.message}`))
  .finally(() => process.exit(0));
