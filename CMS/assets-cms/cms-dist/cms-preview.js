// Obtener referencias a los elementos HTML de la vista previa
const previewContainer = document.getElementById('preview-content');
const metaDescriptionPreview = document.createElement('p');
const metaKeywordsPreview = document.createElement('p');
const metaAuthorPreview = document.createElement('p');
const blogTitlePreview = document.createElement('h2');
const blogTextPreview = document.createElement('p');
const bodyTitlePreview = document.createElement('h2');
const bodyTextPreview = document.createElement('p');
const bodyConclusionPreview = document.createElement('p');
const imagesTitlePreview = document.createElement('h2');
const imagesTextPreview = document.createElement('p');
const ctaTitlePreview = document.createElement('h2');
const ctaTextPreview = document.createElement('p');

// Función para actualizar la vista previa
function updatePreview() {
  // Obtener los valores ingresados en el formulario del CMS
  const metaDescription = document.getElementById('meta-description').value;
  const metaKeywords = document.getElementById('meta-keywords').value;
  const metaAuthor = document.getElementById('meta-author').value;
  const blogTitle = document.getElementById('blog-title').value;
  const blogText = document.getElementById('blog-text').value;
  const bodyTitle = document.getElementById('body-title').value;
  const bodyText = document.getElementById('body-text').value;
  const bodyConclusion = document.getElementById('body-conclusion').value;
  const imagesTitle = document.getElementById('images-title').value;
  const imagesText = document.getElementById('images-text').value;
  const ctaTitle = document.getElementById('cta-title').value;
  const ctaText = document.getElementById('cta-text').value;

  // Actualizar el contenido de la vista previa con los valores ingresados
  metaDescriptionPreview.textContent = `Descripción: ${metaDescription}`;
  metaKeywordsPreview.textContent = `Palabras clave: ${metaKeywords}`;
  metaAuthorPreview.textContent = `Autor: ${metaAuthor}`;
  blogTitlePreview.textContent = blogTitle;
  blogTextPreview.textContent = blogText;
  bodyTitlePreview.textContent = bodyTitle;
  bodyTextPreview.textContent = bodyText;
  bodyConclusionPreview.textContent = bodyConclusion;
  imagesTitlePreview.textContent = imagesTitle;
  imagesTextPreview.textContent = imagesText;
  ctaTitlePreview.textContent = ctaTitle;
  ctaTextPreview.textContent = ctaText;

  // Limpiar el contenido existente en la vista previa
  previewContainer.innerHTML = '';

  // Agregar los elementos actualizados a la vista previa
  previewContainer.appendChild(metaDescriptionPreview);
  previewContainer.appendChild(metaKeywordsPreview);
  previewContainer.appendChild(metaAuthorPreview);
  previewContainer.appendChild(blogTitlePreview);
  previewContainer.appendChild(blogTextPreview);
  previewContainer.appendChild(bodyTitlePreview);
  previewContainer.appendChild(bodyTextPreview);
  previewContainer.appendChild(bodyConclusionPreview);
  previewContainer.appendChild(imagesTitlePreview);
  previewContainer.appendChild(imagesTextPreview);
  previewContainer.appendChild(ctaTitlePreview);
  previewContainer.appendChild(ctaTextPreview);
}

// Escuchar el evento 'input' en los campos del formulario del CMS
document.getElementById('metadata-form').addEventListener('input', updatePreview);
document.getElementById('post-form').addEventListener('input', updatePreview);
