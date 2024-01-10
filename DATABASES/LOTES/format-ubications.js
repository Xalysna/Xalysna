const fs = require('fs');
const path = require('path');

const filePath = 'C:/Users/kevin/public/DATABASES/LOTES/UBICACIONES.json';

async function formatAndSaveData() {
  try {
    const data = require(filePath);

    // Crear un objeto para representar el documento principal
    const documentData = {
      UBICACIONES: {
        CODES: {}, // Inicializar la subcolección CODES como un objeto vacío
      },
    };

    // Formatear los datos y agregarlos a la subcolección CODES
    for (const opcion of data.opciones) {
      const docId = opcion.valor.toString();
      documentData.UBICACIONES.CODES[docId] = {
        nombre: opcion.label,
        descripcion: `Estado: ${opcion.estado.label}, País: ${opcion.estado.pais.label}`,
        opcion: {
          valor: opcion.valor,
          label: opcion.label,
          estado: {
            valor: opcion.estado.valor,
            label: opcion.estado.label,
            pais: {
              valor: opcion.estado.pais.valor,
              label: opcion.estado.pais.label,
            },
          },
        },
      };
    }

    // Guardar el documento en un archivo
    const batchFilePath = path.join('C:/Users/kevin/public/DATABASES/LOTES/COMPLETADO', 'batch.json');
    fs.writeFileSync(batchFilePath, JSON.stringify(documentData));

    console.log(`Documento "UBICACIONES" creado: ${batchFilePath}`);
  } catch (error) {
    console.error('Error al formatear y guardar el archivo:', error);
  }
}

// Ejecutar la función de formateo y guardado
formatAndSaveData();
