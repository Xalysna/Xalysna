// Función para insertar el anuncio de 300x250 en el contenedor
function insertarAnuncio300x250(codigoAnuncio) {
    var contenedor = document.querySelector('.banner-300x250-article');

    if (contenedor) {
        console.log('Encontrado el contenedor para el anuncio de 300x250.');

        // Crear un elemento script para cargar el anuncio como un script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = codigoAnuncio;

        // Manejo de errores al cargar el script
        script.onerror = function() {
            console.log('Error al cargar el anuncio de 300x250.');
        };

        contenedor.appendChild(script);

        console.log('Anuncio de 300x250 insertado correctamente.');
    } else {
        console.log('No se encontró ningún contenedor para el anuncio de 300x250.');
    }
}

// Función para insertar el anuncio de 728x90 en el contenedor
function insertarAnuncio728x90(codigoAnuncio) {
    var contenedor = document.querySelector('.banner-728x90-article');

    if (contenedor) {
        console.log('Encontrado el contenedor para el anuncio de 728x90.');

        // Crear un elemento script para cargar el anuncio como un script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = codigoAnuncio;

        // Manejo de errores al cargar el script
        script.onerror = function() {
            console.log('Error al cargar el anuncio de 728x90.');
        };

        contenedor.appendChild(script);

        console.log('Anuncio de 728x90 insertado correctamente.');
    } else {
        console.log('No se encontró ningún contenedor para el anuncio de 728x90.');
    }
}

// Función para insertar el script proporcionado debajo del contenedor con clase "social-bar"
function insertarAnuncioSocialBar(codigoScript) {
    var contenedor = document.querySelector('.social-bar');

    if (contenedor) {
        console.log('Encontrado el contenedor para el script en la barra social.');

        // Crear un elemento script para cargar el script externo
        var scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = codigoScript;

        // Manejo de errores al cargar el script
        scriptElement.onerror = function() {
            console.log('Error al cargar el script en la barra social.');
        };

        contenedor.appendChild(scriptElement);

        console.log('Script en la barra social insertado correctamente.');
    } else {
        console.log('No se encontró ningún contenedor para el script en la barra social.');
    }
}

// Código del anuncio proporcionado por Adsterra
var codigoAdsterra300x250 = `
    atOptions = {
        'key': '020ccad3bb21a8d6a15ebb60aa839725',
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
    };
    document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://www.profitablecreativeformat.com/020ccad3bb21a8d6a15ebb60aa839725/invoke.js"></scr' + 'ipt>');
`;

var codigoAdsterra728x90 = `
    atOptions = {
        'key': '2743745ab1c037d62e67633539a0921a',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {}
    };
    document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://www.profitablecreativeformat.com/2743745ab1c037d62e67633539a0921a/invoke.js"></scr' + 'ipt>');
`;

// Código del script proporcionado
var codigoScriptSocialBar = "//pl20563385.highcpmrevenuegate.com/19/45/16/1945161599a06be82444124fc0ad1852.js";

// Llamar a las funciones para insertar los anuncios y el script en los contenedores correspondientes
insertarAnuncio300x250(codigoAdsterra300x250);
insertarAnuncio728x90(codigoAdsterra728x90);
insertarAnuncioSocialBar(codigoScriptSocialBar);
