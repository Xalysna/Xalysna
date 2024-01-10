const fs = require('fs');
const path = require('path');

// Ruta del archivo que contiene los datos originales
const filePath = 'C:/Users/kevin/public/DATABASES/LOTES/COMPLETADO/batch.json';

// Leer el archivo y parsear los datos
const jsonData = fs.readFileSync(filePath, 'utf-8');
const documentData = JSON.parse(jsonData);

// Tamaño del lote
const batchSize = 4000;

// Dividir el documento en lotes
const documentKeys = Object.keys(documentData.UBICACIONES.CODES);
const totalBatches = Math.ceil(documentKeys.length / batchSize);

// Crear y guardar cada lote en un archivo
for (let i = 0; i < totalBatches; i++) {
  const startIdx = i * batchSize;
  const endIdx = Math.min((i + 1) * batchSize, documentKeys.length);

  const batchData = {};
  for (let j = startIdx; j < endIdx; j++) {
    const key = documentKeys[j];
    batchData[key] = documentData.UBICACIONES.CODES[key];
  }

  const batchFilePath = path.join('C:/Users/kevin/public/DATABASES/LOTES/COMPLETADO/OK', `batch_${i + 1}.json`);
  fs.writeFileSync(batchFilePath, JSON.stringify(batchData));

  console.log(`Lote ${i + 1} creado: ${batchFilePath}`);
}

console.log('División de lotes completada.');
