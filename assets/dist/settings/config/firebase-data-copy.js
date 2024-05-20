async function obtenerVersionesFirebase() {
    try {
        const response = await fetch('https://www.gstatic.com/firebasejs/releases.json');
        const data = await response.json();

        const { current, live, components } = data;

        // Obtener solo la versión de 'current'
        const versionCurrent = current.version;

        // Obtener solo la versión de 'live'
        const versionLive = live.version;

        // Construir la URL personalizada sin agregar firebase-app.js
        const urlPersonalizada = `https://www.gstatic.com/firebasejs/${versionCurrent}/`;

        // Agregar firebase-app.js solo para la validación
        const urlConFirebaseApp = `${urlPersonalizada}firebase-app.js`;

        // Obtener los componentes y sus archivos .js con información de operacionalidad
        let componentesHTML = '<table border="1"><tr><th>Componente</th><th>Status</th></tr>';
        await Promise.all(Object.keys(components).map(async componente => {
            const archivoJS = components[componente];
            const nombreComponente = componente.split('/').pop().replace('.js', '');
            const componenteURL = `${archivoJS}`;
            const operacionalidad = await verificarOperacionalidad(componenteURL);
            const operacionalidadIcono = operacionalidad ? '✔️' : '❌';
            const color = operacionalidad ? 'green' : 'red';

            componentesHTML += `<tr><td><span class="copyable" data-before="${nombreComponente}" onclick="copiarAlPortapapeles('${componenteURL}')" style="color: ${color};">${componenteURL}</span></td><td style="color: ${color};">${operacionalidadIcono}</td></tr>`;
        }));

        componentesHTML += '</table>';

        // Verificar operacionalidad de la URL personalizada
        const urlOperacional = await verificarOperacionalidad(urlConFirebaseApp);
        const urlOperacionalIcono = urlOperacional ? '✔️' : '❌';
        const urlColor = urlOperacional ? 'green' : 'red';

        // Mostrar resultados en el div con id "resultado"
        const resultadoElement = document.getElementById('resultado');
        resultadoElement.innerHTML = `
            <p>URL Personalizada: <span class="copyable" onclick="copiarAlPortapapeles('${urlPersonalizada}')" style="color: ${urlColor};">${urlOperacionalIcono} ${urlPersonalizada}</span></p>
            <p>Versión de "current": ${versionCurrent}</p>
            <p>Versión de "live": ${versionLive}</p>
            ${componentesHTML}
        `;

        // Agregar clase CSS dinámicamente al elemento de la URL según la operacionalidad
        resultadoElement.classList.remove('operacional-rojo', 'operacional-verde');
        resultadoElement.classList.add(urlOperacional ? 'operacional-verde' : 'operacional-rojo');
    } catch (error) {
        console.error('Error al obtener las versiones de Firebase:', error.message);
    }
}

async function verificarOperacionalidad(url) {
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (error) {
        return false;
    }
}

function copiarAlPortapapeles(texto) {
    const elementoTemporizador = document.createElement('textarea');
    elementoTemporizador.value = texto;
    document.body.appendChild(elementoTemporizador);
    elementoTemporizador.select();
    document.execCommand('copy');
    document.body.removeChild(elementoTemporizador);
    showNotification(`¡Copiado al portapapeles!\n\n${texto}`);
}

// Llamada a la función
obtenerVersionesFirebase();
