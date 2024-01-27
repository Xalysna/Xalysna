// Importar la configuración de Firebase
import { firebaseConfig } from "../../../assets/dist/settings/config/firebase-config.js";
import { FIREBASE_APP_URL, FIREBASE_FIRESTORE_URL } from "../../../assets/dist/settings/config/firebase-config-urls.js";

// Imprimir las URLs para verificar que estén configuradas correctamente
console.log("FIREBASE_APP_URL:", FIREBASE_APP_URL);
console.log("FIREBASE_FIRESTORE_URL:", FIREBASE_FIRESTORE_URL);

// Importar las funciones necesarias del SDK de Firebase de forma dinámica
const { initializeApp } = await import(FIREBASE_APP_URL);
const { getFirestore, collection, doc, setDoc, serverTimestamp } = await import(FIREBASE_FIRESTORE_URL);

// Inicializar la app de Firebase
initializeApp(firebaseConfig);

// Referencia a la colección de publicaciones en Firestore
const firestore = getFirestore();
const db = collection(firestore, 'publicaciones');

// Función para guardar los datos localmente
function saveLocally(data, filename) {
  const htmlContent = generateHTML(data);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Función para generar el contenido HTML
function generateHTML(data) {
  const {
    folder,
    title,
    blogText,
    bodyTitle,
    bodyText,
    bodyConclusion,
    imagesTitle,
    imagesText,
    ctaTitle,
    ctaText,
    metaDescription,
    metaKeywords,
    metaAuthor
  } = data;

  const template = `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <!-- Metadatos -->
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Xavaya Blog: Explora, Aprende y Descubre</title>
      <meta name="description" content="${metaDescription}">
      <meta name="keywords" content="${metaKeywords}">
      <meta name="author" content="${metaAuthor}">
      <meta name="robots" content="index, follow">
      <meta http-equiv="x-content-type-options" content="nosniff">
  
      <!-- Variables base -->
      <script>
        const baseUrl = '/'; // Coloca aquí tu URL base
        const cssBaseUrl = \`\${baseUrl}/assets/css\`;
        const jsBaseUrl = \`\${baseUrl}/assets/dist\`;
      </script>
  
      <!-- Etiquetas meta adicionales para redes sociales -->
      <meta property="og:title" content="Xavaya Blog: Explora, Aprende y Descubre">
      <meta property="og:image" content="URL_DE_LA_IMAGEN">
  
      <!-- Estilos -->
      <link rel="stylesheet" href="/assets/css/blog/article.css">
      <link rel="stylesheet" href="/assets/css/blog/blog.css">
      <link rel="stylesheet" href="/assets/css/home/index.css">
      <link rel="stylesheet" href="/assets/css/general/panel.css">
      <link rel="stylesheet" href="/assets/css/general/footer.css">
    </head>
    <body>
      <div id="panel">
        <p id="status"></p>
        <nav id="navigation"></nav>
        <div id="subcategory-panel"></div>
        <button id="login-button">Iniciar sesión</button>
        <button id="logout-button" style="display: none;">Cerrar sesión</button>
        <button id="signup-button" style="display: none;">Registrarse</button>
      </div>
  
      <header>
        <h1 id="main-title">${title}</h1>
        <p id="greeting"></p>
  
        <nav id="category">
          <h3>Categorías</h3>
          <ul>
            <li><a href="/content/blog/business-ai/index.html">Business AI</a></li>
            <li><a href="/content/blog/creative-ai/index.html">Creative AI</a></li>
            <li><a href="/content/blog/entertain-ai/index.html">Entertain AI</a></li>
            <li><a href="/content/blog/FitSport/index.html">FitSport</a></li>
            <li><a href="/content/blog/lifestyle-ai/index.html">Lifestyle AI</a></li>
            <li><a href="/content/blog/science-tech-minds/index.html">Science &amp; Tech Minds</a></li>
            <li><a href="/content/blog/techknow/index.html">TechKnow</a></li>
            <li><a href="/content/blog/techvision360/index.html">TechVision360</a></li>
          </ul>
        </nav>
      </header>

      
  <!--///////////////////////// EDITABLE ///////////////////////////////////-->
  <!--///////////////////////// EDITABLE ///////////////////////////////////-->
  
      <div class="papel-antiguo">
        <article>

        <!-- Agrega el elemento para mostrar el timestamp aquí -->
        <p id="article-timestamp">${data.timestamp}</p>

          <section>
            <h2 id="blog-title">${title}</h2>
            <p id="blog-text">${blogText}</p>
          </section>
  
          <section>
            <h2 id="body-title">${bodyTitle}</h2>
            <p id="body-text">${bodyText}</p>
            <p id="body-conclusion">${bodyConclusion}</p>
          </section>
  
          <section>
            <h2 id="images-title">${imagesTitle}</h2>
            <p id="images-text">${imagesText}</p>
          </section>
  
          <section>
            <h2 id="cta-title">${ctaTitle}</h2>
            <p id="cta-text">${ctaText}</p>
          </section>
        </article>
      </div>
      
  <!--///////////////////////// EDITABLE ///////////////////////////////////-->
  <!--///////////////////////// EDITABLE ///////////////////////////////////-->
  
      <aside id="ad-section">
        <div class="ad-box">
          <h2>Anuncio de prueba</h2>
          <p>¡Aprovecha nuestra oferta especial!</p>
          <a href="#" class="ad-link">Más información</a>
        </div>
  
        <div class="ad-box">
          <h2>Anuncio destacado</h2>
          <p>Descubre nuestros productos exclusivos</p>
          <a href="#" class="ad-link">Ver ahora</a>
        </div>
      </aside>
  
      <footer>
        <nav class="footer-navigation">
          <ul id="footer-menu"></ul>
        </nav>
      </footer>
  
      <!-- Scripts personalizados -->
      <script src="/assets/dist/settings/firebase-config.js" type="module"></script>
      <script src="/assets/dist/general/current-year.js" type="module"></script>
      <script src="/assets/dist/settings/session-control.js" type="module"></script>
    
      <!-- Los scripts se colocan después de los estilos -->
      <script src="/assets/dist/general/panel.js" type="module" defer></script>
      <script src="/assets/dist/general/footer.js" defer></script>
      <script src="/assets/dist/blog/article-timestamp.js" type="module" defer></script>
      <script src="/assets/dist/blog/title-article.js" defer></script>
      <script src="/assets/dist/blog/category-menu.js" defer></script>

    </body>
  </html>`.trim();
  
  return template;
}

// Función para crear una nueva publicación
function createPost(event) {
  event.preventDefault();

  const folder = document.getElementById('folder').value;
  const title = document.getElementById('blog-title').value;
  const blogText = document.getElementById('blog-text').value;
  const bodyTitle = document.getElementById('body-title').value;
  const bodyText = document.getElementById('body-text').value;
  const bodyConclusion = document.getElementById('body-conclusion').value;
  const imagesTitle = document.getElementById('images-title').value;
  const imagesText = document.getElementById('images-text').value;
  const ctaTitle = document.getElementById('cta-title').value;
  const ctaText = document.getElementById('cta-text').value;

  const metaDescription = document.getElementById('meta-description').value;
  const metaKeywords = document.getElementById('meta-keywords').value;
  const metaAuthor = document.getElementById('meta-author').value;

  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
  const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;

  const data = {
    folder,
    title,
    blogText,
    bodyTitle,
    bodyText,
    bodyConclusion,
    imagesTitle,
    imagesText,
    ctaTitle,
    ctaText,
    metaDescription,
    metaKeywords,
    metaAuthor,
    timestamp: serverTimestamp() // Agregar el campo 'timestamp' con serverTimestamp()
  };

  // Guardar los datos de la publicación en Firestore
  setDoc(doc(db, id), data)
    .then(() => {
      // Mostrar mensaje de éxito
      alert('Publicación guardada exitosamente en Firestore.');

      // Guardar los datos localmente si se seleccionó esa opción
      const confirmSave = window.confirm('¿Deseas guardar la publicación localmente?');
      if (confirmSave) {
        saveLocally(data, filename);
        alert('Publicación guardada localmente.');
      }

      // Limpiar el formulario
      document.getElementById('post-form').reset();
    })
    .catch(error => {
      console.error('Error al guardar la publicación:', error);
    });
}

// Escuchar el evento de envío del formulario
document.getElementById('post-form').addEventListener('submit', createPost);
