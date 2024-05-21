// markdown.js

function copyMarkdownToClipboard() {
    const contenidoACopiar = document.getElementById("contenido-lista");
    const contenido = obtenerTextoSinFormulas(contenidoACopiar);
    const textarea = document.createElement("textarea");
    textarea.value = contenido;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    
    // Mostrar el mensaje de "Documento copiado"
    showNotification("Documento copiado");
}

function obtenerTextoSinFormulas(elemento) {
    const clonElemento = elemento.cloneNode(true);
    const elementosExcluidos = clonElemento.querySelectorAll(".formula, .codigo");
    elementosExcluidos.forEach((elementoExcluido) => {
        elementoExcluido.remove();
    });

    return clonElemento.innerText;
}

const copyButton = document.getElementById("copy-button");
copyButton.addEventListener("click", copyMarkdownToClipboard);
