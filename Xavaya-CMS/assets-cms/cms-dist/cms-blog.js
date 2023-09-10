document.addEventListener('DOMContentLoaded', function () {
    // Obtener los valores del formulario de edición
    const titulo = editForm.titulo.value;
    const descripcion = editForm.descripcion.value;
    const keywords = editForm.keywords.value;
    const author = editForm.author.value;
    const lista = editForm.lista.value;
    const contenido = editForm.contenido.value;
    const conclusion = editForm.conclusion.value;
    const creditos = editForm.creditos.value;
    const enlaces = editForm.enlaces.value;
  
    // Crear un archivo HTML con los contenidos editados
  const archivoHTMLResultante = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <!-- Meta información -->
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${titulo} - Xavaya: Inspira el Futuro, Desbloquea tu Potencial</title>
      <meta name="description" content="${descripcion}">
      <meta name="keywords" content="${keywords}">
      <meta name="author" content="${author}">
  
      <!-- Configuración general para redes sociales -->
      <meta property="og:title" content="Xavaya - Inspira el Futuro, Desbloquea tu Potencial">
      <meta property="og:description" content="Bienvenido a Xavaya Blog, donde puedes explorar, aprender y descubrir. Sumérgete en nuestro contenido diverso que abarca negocios, creatividad, entretenimiento, deporte, estilo de vida, ciencia y tecnología. Encuentra inspiración, consejos prácticos y recursos para desbloquear tu potencial. Únete a nosotros en esta emocionante aventura de crecimiento.">
      <meta property="og:image" content="https://www.xavaya.com/assets/img/web/Xavaya-Open-GraphColorSlogan.png">
      <meta property="og:url" content="https://www.xavaya.com">
      <meta property="og:site_name" content="Xavaya">
  
      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="Xavaya - Inspira el Futuro, Desbloquea tu Potencial">
      <meta name="twitter:description" content="Explora, aprende y descubre en Xavaya Blog. Temas variados como negocios, creatividad, entretenimiento, deporte, estilo de vida, ciencia y tecnología. Encuentra inspiración y consejos para desbloquear tu potencial. Únete a nosotros en esta emocionante aventura.">
      <meta name="twitter:image" content="https://www.xavaya.com/assets/img/web/Xavaya-Open-GraphColorSlogan.png">
      <meta name="twitter:site" content="@Xavaya">
      <meta name="twitter:creator" content="@Xavaya">
  
      <!-- Etiqueta para YouTube -->
      <meta property="og:video" content="https://www.youtube.com/watch?v=NqaQpXTcCcA">
      <meta property="og:video:secure_url" content="https://www.youtube.com/watch?v=NqaQpXTcCcA">
      <meta property="og:video:type" content="video/youtube">
  
      <!-- Etiqueta para TikTok -->
      <meta property="og:type" content="tiktok:profile">
      <meta property="tiktok:url" content="https://www.tiktok.com/@xavayaai">
      <meta property="tiktok:creator" content="@xavayaai">
  
      <!-- Etiqueta para Facebook -->
      <meta property="fb:profile_id" content="XavayaCatalyst">
  
      <!-- JavaScript para configuración -->
      <script>
          const baseUrl = '/'; // Coloca aquí tu URL base
          const imgBaseUrl = \`\${baseUrl}assets/img\`;
          const cssBaseUrl = \`\${baseUrl}assets/css\`;
          const jsBaseUrl = \`\${baseUrl}assets/dist\`;
      </script>
  
      <!-- Estilos CSS -->
      <link rel="stylesheet" href="/assets/css/blog/article.css">
      <link rel="stylesheet" href="/assets/css/blog/blog.css">
      <link rel="stylesheet" href="/assets/css/home/index.css">
      <link rel="stylesheet" href="/assets/css/general/panel.css">
      <link rel="stylesheet" href="/assets/css/general/footer.css">
      <link rel="stylesheet" href="/assets/css/blog/markdown.css">
      <link rel="stylesheet" href="/assets/css/general/funciones/copy-wallet.css">
      <link rel="stylesheet" href="/assets/css/general/backgroundImage.css">
  
      <!-- Estilos CSS para anuncios -->
      <link rel="stylesheet" href="/assets/css/general/anuncios/anuncios-article.css">
  
      <!-- Favicon -->
      <link rel="icon" type="image/png" href="/assets/img/web/favicon-32x32.png">
  </head>
  
  <body>
      <!-- Panel de navegación -->
      <div id="panel">
          <p id="status"></p>
          <nav id="navigation"></nav>
          <div id="subcategory-panel"></div>
          <button id="login-button">Iniciar sesión</button>
          <button id="logout-button" style="display: none;">Cerrar sesión</button>
          <button id="signup-button" style="display: none;">Registrarse</button>
      </div>
  
      <!-- Encabezado -->
      <header>
        <h1 id="main-title" data-article-id="${titulo}">${titulo}</h1>
        <p id="greeting"></p>
      </header>
  
  
      <div id="documentName"></div>
  
  
      <!-- 🌟✨ ARTÍCULO ✨🌟 -->
  
      <!-- Contenido principal -->
      <div class="papel-antiguo">
          <article>
              <!-- Contenedor del markdown y botón de copiar -->
              <div class="contenedor-markdown">
                  <!-- Texto "Formato Markdown" -->
                  <div class="formato-markdown">Formato Markdown:</div>
                  <!-- Botón "Copiar" -->
                  <button id="copy-button">Copiar</button>
              </div>
  
              <!-- Elementos informativos -->
              <div class="informacion">
                  <p id="fecha"><strong>Fecha de publicación:</strong><span id="article-timestamp"></span></p>
                  <p id="autor">${author}</p>
                  <p id="categoria" class="categoria"><strong>Categoría:</strong></p> <!-- Aquí se mostrará la categoría y se aplicará el color automáticamente -->
              </div>
              <!-- Lista de contenido -->
              <ul id="contenido-lista">
                  <li id="titulo"><strong>Titulo:</strong></li>
                  <li id="metaDescripcion"><strong>Descripción:</strong>${descripcion}</li>
                  <li id="lista"><strong>Lista:</strong>${lista}</li>
                  <li id="contenido"><strong>Contenido:</strong>${contenido}</li>
                  <li id="conclusion"><strong>Conclusión:</strong>${conclusion}</li>
                  <li id="creditos"><strong>Creditos:</strong>${creditos}</li>
                  <li id="enlaces"><strong>Enlaces:</strong>${enlaces}</li>
              </ul>
          </article>
      </div>
  
      <!-- 🌟✨ ARTÍCULO ✨🌟 -->
  
  
      <!-- Pie de página -->
      <footer>
          <nav class="footer-navigation" id="footer-navigation">
              <ul id="footer-menu"></ul>
              <a href="#" id="wallet-address" class="wallet-address" data-copy="0x96dFa67FDff3B167C0923b2fA3697E2a2b298869">
                  ❤️ Apoya con Ethereum (ETH) - Dirección de donación: 0x96dFa67FDff3B167C0923b2fA3697E2a2b298869
              </a>
          </nav>
          <button id="toggle-button" class="icon-button">
              <img src="/assets/img/footer/sidebar.svg" alt="Icono de menú">
          </button>
      </footer>
  
      <!-- Banners y elementos adicionales -->
      <div class="banner-300x250-article">
          <!-- Ubicación: Lateral medio -->
      </div>
  
      <div class="banner-728x90-article">
          <!-- Ubicación: Abajo izquierda -->
      </div>
  
       <!-- <div class="social-bar">
          <!-- Ubicación: Abajo derecha -->
      </div>
  
      <!-- Scripts personalizados -->
      <script src="/assets/dist/settings/firebase-config.js" type="module"></script>
      <script src="/assets/dist/general/current-year.js" type="module"></script>
      <script src="/assets/dist/settings/session-control.js" type="module"></script>
  
      <!-- Scripts de funcionalidad -->
      <script src="/assets/dist/general/panel.js" type="module" defer></script>
      <script src="/assets/dist/general/footer.js" defer></script>
      <script src="/assets/dist/blog/title-article.js" defer></script>
      <script src="/assets/dist/blog/espejo-articulo.js" defer></script>
      <script src="/assets/dist/blog/category-menu.js" defer></script>
      <script src="/assets/dist/blog/article-database.js" type="module" defer></script>
      <script src="/assets/dist/blog/markdown.js" defer></script>
      <script src="/assets/dist/general/funciones/copy-wallet.js" defer></script>
      <script src="/assets/dist/general/funciones/notificaciones.js" defer></script>
      <script src="/assets/dist/general/backgroundImage.js" type="module" defer></script>
  
      <!-- Enlace externo -->
      <script type="text/javascript" src="/assets/dist/general/anuncios/anuncios-article.js"></script>
  </body>
  </html>`.trim();
  
    // Crear un Blob con el contenido del archivo HTML resultante
    const archivoBlob = new Blob([archivoHTMLResultante], { type: 'text/html' });
  
    // Guardar el archivo en la ubicación que desees utilizando FileSaver.js
    saveAs(archivoBlob, 'archivo_editado.html');
  });
        