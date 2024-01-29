// Carpeta específica desde la cual se debe comenzar a buscar
const startDir = 'content';

// Función para buscar archivos HTML en una carpeta y sus subcarpetas
function findHtmlFiles(dir) {
    const htmlFiles = [];

    function traverse(currentDir) {
        if (!currentDir || !currentDir.children) {
            return;
        }

        currentDir.children.forEach(file => {
            if (file.isDirectory) {
                traverse(file);
            } else if (file.name.endsWith('.html')) {
                const fileUrl = '/' + file.relativePath.replace(/\\/g, '/'); // Formatear la ruta para que sea válida en un sitemap
                htmlFiles.push(fileUrl);
            }
        });
    }

    traverse(startDir);
    return htmlFiles;
}

// Genera el sitemap y lo guarda en el archivo sitemap.xml en la ubicación específica
function generateSitemap() {
    const sitemapContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>/index.html</loc></url> <!-- Agrega el index.html de la raíz -->
        ${findHtmlFiles(startDir).map(url => `<url><loc>${url}</loc></url>`).join('\n')}
    </urlset>
    `;

    // Crear un objeto Blob con el contenido del sitemap
    const blob = new Blob([sitemapContent], { type: 'text/xml' });

    // Ruta completa donde se guarda el cambio (en este caso, en C:\Users\kevin\public)
    const fullPath = 'C:/Users/kevin/public/sitemap.xml';

    // Realizar una solicitud fetch para guardar el sitemap en el servidor
    fetch(fullPath, {
        method: 'PUT',
        body: blob,
        headers: {
            'Content-Type': 'text/xml',
        },
    })
    .then(response => {
        if (response.ok) {
            console.log(`Sitemap generado y guardado con éxito en ${fullPath}`);
        } else {
            console.error('Error al guardar el sitemap.');
        }
    })
    .catch(error => {
        console.error('Error al guardar el sitemap:', error);
    });
}

// Ejecutar la función para generar y guardar el sitemap cuando sea necesario
generateSitemap();
