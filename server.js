const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

app.use(express.json());

const projectDir = __dirname;

app.use('/assets', express.static(path.join(projectDir, 'assets')));
app.use('/', express.static(path.join(projectDir, 'Xavaya-CMS')));

// Middleware para manejar solicitudes PUT a cualquier archivo
app.put('*', async (req, res) => {
  try {
    const rutaArchivo = req.params[0]; // Obtiene la parte dinámica de la URL
    const archivoPath = path.join(projectDir, rutaArchivo);
    const datos = req.body;

    // Verificar si el archivo existe
    const existe = await fs.access(archivoPath).then(() => true).catch(() => false);

    if (!existe) {
      return res.status(404).json({ mensaje: 'El archivo no existe' });
    }

    // Realizar operaciones para actualizar el archivo
    await fs.writeFile(archivoPath, JSON.stringify(datos));

    res.json({ mensaje: `Archivo '${rutaArchivo}' actualizado correctamente` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el archivo' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
