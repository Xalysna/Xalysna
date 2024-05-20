// Importar la configuración de Firebase
import { firebaseConfig } from "../config/firebase-config.js";
import { FIREBASE_APP_URL, FIREBASE_AUTH_URL, FIREBASE_FIRESTORE_URL } from "../config/firebase-config-urls.js";

// Imprimir las URLs para verificar que estén configuradas correctamente
console.log("FIREBASE_APP_URL:", FIREBASE_APP_URL);
console.log("FIREBASE_AUTH_URL:", FIREBASE_AUTH_URL);
console.log("FIREBASE_FIRESTORE_URL:", FIREBASE_FIRESTORE_URL);

// Importar las funciones necesarias del SDK de Firebase de forma dinámica
const { initializeApp } = await import(FIREBASE_APP_URL);
const { getAuth, onAuthStateChanged } = await import(FIREBASE_AUTH_URL);
const { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } = await import(FIREBASE_FIRESTORE_URL);

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de auth y firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Función auxiliar para verificar si un elemento está presente en el HTML y agrupar los elementos encontrados y no encontrados
function checkElementPresent(elementId, foundElements, notFoundElements) {
    const element = document.getElementById(elementId);
    if (element) {
        foundElements.push(elementId);
        console.log(`%c✅ Elemento con ID ${elementId} está presente en el HTML.`, 'color: #2ecc71'); // Verde claro
    } else {
        notFoundElements.push(elementId);
        console.log(`%c❌ Elemento con ID ${elementId} no encontrado en el HTML.`, 'color: #e74c3c'); // Rojo claro
    }
}

// Función auxiliar para establecer el valor de un campo HTML (input, select con json, span, etc.)
function setValue(elementId, value) {
    const element = document.getElementById(elementId);

    if (element) {
        if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'select') {
            // Deshabilitar las opciones con value="" si el valor no es nulo/undefined
            if (value !== null && value !== undefined) {
                const select = element.tagName.toLowerCase() === 'select' ? element : null;
                if (select) {
                    Array.from(select.options).forEach((opt) => {
                        if (opt.value === '') {
                            opt.disabled = true;
                        }
                    });
                }
            }

            element.value = value || ''; // Asignar el valor o una cadena vacía si es nulo/undefined
        } else if (element.tagName.toLowerCase() === 'span') {
            element.textContent = value || '';
        } else {
            console.warn(`%c❗ Tipo de elemento no soportado en HTML para la operación de establecer valor en el elemento con ID ${elementId}.`, 'color: #e74c3c'); // Rojo claro
        }
    } else {
        console.warn(`%c❌ Elemento con ID ${elementId} no encontrado en HTML, no se establece valor en HTML.`, 'color: #e74c3c'); // Rojo claro
    }
}



// Función para establecer el valor en un select manual
function setManualSelectValue(elementId, value) {
    const select = document.getElementById(elementId);

    if (select && select.tagName.toLowerCase() === 'select') {
        // Deshabilitar las opciones con value="" y seleccionar la opción correspondiente al valor proporcionado
        Array.from(select.options).forEach((opt) => {
            if (opt.value === '') {
                opt.disabled = true;
            }
            if (opt.value === value) {
                opt.selected = true;
            }
        });

        console.log(`%c✅ Valor '${value}' establecido en el select con ID ${elementId}.`, 'color: #2ecc71'); // Verde claro
    } else {
        console.warn(`%c❌ Elemento con ID ${elementId} no encontrado o no es un select.`, 'color: #e74c3c'); // Rojo claro
    }
}


function llenarListaRedesSociales(redes) {
    const listaRedesContainer = document.getElementById('listaRedes');
    if (listaRedesContainer) {
        listaRedesContainer.innerHTML = ''; // Limpiar el contenido actual

        redes.forEach(red => {
            const nuevaRed = document.createElement('p');
            nuevaRed.innerHTML = red;
            
            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.onclick = function() {
                // Obtener el elemento padre del botón (el <p> que contiene la red social) y eliminarlo
                const padre = this.parentNode;
                padre.parentNode.removeChild(padre);
            };
            
            nuevaRed.appendChild(eliminarBtn);
            listaRedesContainer.appendChild(nuevaRed);
        });
    } else {
        console.error("Elemento con ID 'listaRedes' no encontrado en el HTML.");
    }
}



// Función para rellenar los <span> con los nombres de país, estado y ciudad
async function rellenarNombresSpan(userData) {
    try {
        // Obtener el nombre del país
        const nombrePais = userData.locationCountry;

        // Obtener el nombre del estado
        const nombreEstado = userData.locationState;

        // Obtener el nombre de la ciudad
        const nombreCiudad = userData.locationCity;

        // Actualizar los <span> en el HTML con los nombres obtenidos si existen los elementos
        const countrySpan = document.getElementById("locationCountrySpan");
        const stateSpan = document.getElementById("locationStateSpan");
        const citySpan = document.getElementById("locationCitySpan");

        if (countrySpan !== null) {
            countrySpan.textContent = nombrePais;
        }
        if (stateSpan !== null) {
            stateSpan.textContent = nombreEstado;
        }
        if (citySpan !== null) {
            citySpan.textContent = nombreCiudad;
        }

        if (countrySpan === null && stateSpan === null && citySpan === null) {
            console.log('Ningún ID encontrado en el HTML.');
        }

    } catch (error) {
        console.error('Error al obtener nombres desde Firestore:', error);
    }
}



// Función para rellenar el formulario con datos desde Firestore
async function rellenarFormulario(uid) {
    console.groupCollapsed('%c📝 Rellenar formulario para UID:', 'color: #3498db; font-weight: bold;', uid);

    const foundElements = [];
    const notFoundElements = [];

    try {
        // Obtener referencia al documento del usuario en la colección "USERS"
        const userDocRef = doc(firestore, 'USERS', uid);

        console.log('  %c🔗 User Doc Reference:', 'color: #3498db;', userDocRef); // Registrar la referencia del documento

        // Obtener el snapshot del documento
        const docSnapshot = await getDoc(userDocRef);

        console.log('  %c📸 Doc Snapshot:', 'color: #3498db;', docSnapshot); // Registrar el snapshot del documento

        if (docSnapshot.exists()) {
            // Si el documento existe, obtener los datos y rellenar el formulario
            const userData = docSnapshot.data();

            // Almacenar datos en sessionStorage
            sessionStorage.setItem('userData', JSON.stringify(userData));
            console.log('Datos del usuario almacenados en sessionStorage:', userData);


            console.groupCollapsed('%c📦 Datos obtenidos de Firestore', 'color: #3498db; font-weight: bold;');

            // Verificar y mostrar en consola los IDs que están en el HTML
            checkElementPresent('usernameId', foundElements, notFoundElements);
            checkElementPresent('userEmail', foundElements, notFoundElements);
            checkElementPresent('codigoPais', foundElements, notFoundElements);
            checkElementPresent('phone', foundElements, notFoundElements);
            checkElementPresent('sitioWeb', foundElements, notFoundElements);
            checkElementPresent('locationCountrySpan', foundElements, notFoundElements);
            checkElementPresent('locationStateSpan', foundElements, notFoundElements);
            checkElementPresent('locationCitySpan', foundElements, notFoundElements);
            checkElementPresent('ubicacionEspacial', foundElements, notFoundElements);
            checkElementPresent('horariosDisponibilidad', foundElements, notFoundElements);
            checkElementPresent('userCryptoWalletAddress', foundElements, notFoundElements);
            checkElementPresent('favoriteCryptos', foundElements, notFoundElements);
            checkElementPresent('favoriteExchange', foundElements, notFoundElements);
            checkElementPresent('listaRedes', foundElements, notFoundElements);

            // IDs específicos de Persona
            checkElementPresent('nombrePersona', foundElements, notFoundElements);
            checkElementPresent('apellidoPersona', foundElements, notFoundElements);
            checkElementPresent('diaNacimientoPersona', foundElements, notFoundElements);
            checkElementPresent('mesNacimientoPersona', foundElements, notFoundElements);
            checkElementPresent('anoNacimientoPersona', foundElements, notFoundElements);
            checkElementPresent('generoPersona', foundElements, notFoundElements);
            checkElementPresent('hobby', foundElements, notFoundElements);
            checkElementPresent('intereses', foundElements, notFoundElements);
            checkElementPresent('profesion', foundElements, notFoundElements);

            // IDs específicos de Empresa
            checkElementPresent('nombreEmpresa', foundElements, notFoundElements);
            checkElementPresent('industria', foundElements, notFoundElements);
            checkElementPresent('sloganEmpresa', foundElements, notFoundElements);
            checkElementPresent('creacionempresa', foundElements, notFoundElements);
            checkElementPresent('creacionempresaEspecifico', foundElements, notFoundElements);
            checkElementPresent('mision', foundElements, notFoundElements);
            checkElementPresent('vision', foundElements, notFoundElements);
            checkElementPresent('objetivos', foundElements, notFoundElements);

            console.groupEnd(); // Cerrar el grupo de elementos llamados en el script

            // Establecer el valor para el select manual
            setManualSelectValue('tipoFormulario', userData.tipo);
            
            // Obtener y establecer el valor del elemento en userData
            const valorTipo = userData.tipo;
            setValue('tipo', valorTipo);

            // Rellenar campos comunes
            setValue('usernameId', userData.usernameId);
            setValue('userEmail', userData.userEmail);
            setValue('codigoPais', userData.codigoPais);
            setValue('phone', userData.phone);
            setValue('sitioWeb', userData.sitioWeb);
            setValue('locationCountryStarter', userData.locationCountry);
            setValue('ubicacionEspacial', userData.ubicacionEspacial);
            setValue('horariosDisponibilidad', userData.horariosDisponibilidad);
            setValue('userCryptoWalletAddress', userData.userCryptoWalletAddress);
            setValue('favoriteCryptos', userData.favoriteCryptos);
            setValue('favoriteExchange', userData.favoriteExchange);
            setValue('listaRedes', userData.listaRedes ? userData.listaRedes.split(', ') : []);


            // Rellenar lista de redes sociales
            if (userData.listaRedes) {
            llenarListaRedesSociales(userData.listaRedes.split(', '));
            }
            
          // Llamar a la función para rellenar los <span> con los nombres de país, estado y ciudad
          rellenarNombresSpan(userData);

            // Rellenar campos específicos según el tipo de usuario
            switch (userData.tipo) {
                case 'Persona':
                    setValue('nombrePersona', userData.nombrePersona);
                    setValue('apellidoPersona', userData.apellidoPersona);
                    setValue('diaNacimientoPersona', userData.diaNacimientoPersona);
                    setValue('mesNacimientoPersona', userData.mesNacimientoPersona);
                    setValue('anoNacimientoPersona', userData.anoNacimientoPersona);
                    setValue('generoPersona', userData.generoPersona);
                    setValue('hobby', userData.hobby);
                    setValue('intereses', userData.intereses);
                    setValue('profesion', userData.profesion);
                    break;

                case 'Empresa':
                    setValue('nombreEmpresa', userData.nombreEmpresa);
                    setValue('industria', userData.industria);
                    setValue('sloganEmpresa', userData.sloganEmpresa);
                    setValue('creacionempresa', userData.creacionempresa);
                    setValue('creacionempresaEspecifico', userData.creacionempresaEspecifico);
                    setValue('mision', userData.mision);
                    setValue('vision', userData.vision);
                    setValue('objetivos', userData.objetivos);
                    break;

                default:
                    console.error('❗ Tipo de usuario no reconocido.');
                    return;
            }
        } else {
            console.log('  ❌ El documento no existe en Firestore.');
        }
    } catch (error) {
        console.error('❌ Error al obtener datos desde Firestore:', error);

        // Verificar si el error es debido a la falta de conexión o permisos insuficientes
        if (error.code === 'unavailable' || error.code === 'permission-denied') {
            console.error('❌ Firestore no está disponible o se denegaron los permisos.');
        }
        
    }

    // Mostrar en grupos los elementos encontrados y no encontrados
    console.group('%c✅ Elementos Encontrados', 'color: #2ecc71; font-weight: bold;');
    foundElements.forEach(elementId => {
        console.log(`%c✅ Elemento con ID ${elementId} está presente en el HTML.`, 'color: #2ecc71'); // Verde claro
    });
    console.groupEnd();

    console.group('%c❌ Elementos No Encontrados', 'color: #e74c3c; font-weight: bold;');
    notFoundElements.forEach(elementId => {
        console.log(`%c❌ Elemento con ID ${elementId} no encontrado.`, 'color: #e74c3c'); // Rojo claro
    });
    console.groupEnd();
    console.groupEnd(); // Cerrar grupo de rellenarFormulario
}

// Función para obtener el UID y el correo del usuario actual
function obtenerUIDyCorreo() {
    const user = auth.currentUser;

    if (user) {
        console.group('%c👤 Datos del Usuario', 'color: #2ecc71; font-weight: bold;');
        console.log('  UID:', user.uid);
        console.log('  Correo:', user.email);
        console.groupEnd();
        return { uid: user.uid, email: user.email };
    } else {
        console.group('%c❌ Usuario no autenticado', 'color: #e74c3c; font-weight: bold;');
        console.log('  Usuario no autenticado');
        console.groupEnd();
        return null;
    }
}

// Escuchar cambios en el estado de autenticación
setTimeout(() => {
    // Escuchar cambios en el estado de autenticación
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario autenticado, mostrar UID y correo en la consola
            obtenerUIDyCorreo();
            // Obtener el UID y rellenar el formulario
            rellenarFormulario(user.uid);
            
        } else {
            console.log('Usuario no autenticado');
        }
    });
}, 1200);  // 1000 milisegundos = 1 segundos
