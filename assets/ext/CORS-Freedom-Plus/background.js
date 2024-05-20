// Configuración inicial de preferencias
const prefs = {
  enabled: false,
  overwriteOrigin: true,
  overwriteMethods: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH', 'PROPFIND', 'PROPPATCH', 'MKCOL', 'COPY', 'MOVE', 'LOCK']
};

// Identificadores únicos para los menús
const testCorsId = 'test-cors';

// Regla declarativa para modificar las cabeceras de respuesta CORS
const ruleId = 1;
const rule = {
  id: ruleId,
  priority: 1,
  condition: {
    urlFilter: '.*'
  },
  action: {
    type: 'modifyHeaders',
    responseHeaders: [
      {
        header: 'Access-Control-Allow-Origin',
        operation: 'set',
        value: prefs.overwriteOrigin ? '*' : undefined
      },
      {
        header: 'Access-Control-Allow-Methods',
        operation: 'set',
        value: prefs.overwriteMethods ? prefs.methods.join(', ') : undefined
      }
    ]
  }
};

// Función para manejar errores y mostrar console logs
const handleError = (error) => {
  console.error('Error:', error);
  // Puedes agregar aquí más lógica para manejar errores, como notificar al usuario.
};

// Función para manejar el cambio de preferencias
const handlePreferencesChange = () => {
  try {
    chrome.storage.local.set(prefs);
    handleCommand();
  } catch (error) {
    handleError(error);
  }
};

// Función para manejar comandos
const handleCommand = () => {
  try {
    const iconPrefix = prefs.enabled ? '' : 'disabled/';

    // Cambiar el icono
    chrome.action.setIcon({
      path: {
        '16': `data/icons/${iconPrefix}icon-16.png`,
        '32': `data/icons/${iconPrefix}icon-32.png`,
        '48': `data/icons/${iconPrefix}icon-48.png`,
        '64': `data/icons/${iconPrefix}icon-64.png`,
      },
    });

    // Cambiar el título
    chrome.action.setTitle({
      title: prefs.enabled
        ? 'Access-Control-Allow-Origin is unblocked'
        : 'Disabled: Default server behavior',
    });
  } catch (error) {
    handleError(error);
  }
};

// Función para manejar el clic en la extensión
const handleExtensionClick = () => {
  try {
    prefs.enabled = !prefs.enabled;
    chrome.storage.local.set({ enabled: prefs.enabled }, () => {
      handleCommand();
      updateDeclarativeNetRequestRules();
    });
  } catch (error) {
    handleError(error);
  }
};

// Función para manejar clics en los menús contextuales
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === testCorsId) {
    // Abrir una nueva pestaña con la URL deseada
    chrome.tabs.create({ url: 'https://webbrowsertools.com/test-cors/' });
  }

  // Actualizar preferencias y reglas
  handlePreferencesChange();
});

// Función para actualizar las reglas declarativas
const updateDeclarativeNetRequestRules = () => {
  try {
    const rules = prefs.enabled ? [rule] : [];
    chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [ruleId],
      addRules: rules
    });
  } catch (error) {
    handleError(error);
  }
};

// Inicializar la extensión
const initializeExtension = () => {
  try {
    chrome.contextMenus.removeAll();

    chrome.contextMenus.create({
      title: 'Test CORS',
      id: testCorsId,
      contexts: ['action']
    });

    handleCommand();
    updateDeclarativeNetRequestRules();
  } catch (error) {
    handleError(error);
  }
};

// Manejar clic en la extensión
chrome.action.onClicked.addListener(handleExtensionClick);

// Instalar la extensión al iniciar
chrome.runtime.onInstalled.addListener(initializeExtension);

// Inicialización
chrome.storage.local.get(prefs, (storedPrefs) => {
  Object.assign(prefs, storedPrefs);
  initializeExtension();
});

// Desinstalar la extensión al desinstalar
chrome.runtime.onSuspend.addListener(() => {
  try {
    chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [ruleId],
      addRules: []
    });
  } catch (error) {
    handleError(error);
  }
});

// Actualizar preferencias desde el almacenamiento
chrome.storage.onChanged.addListener((changes) => {
  Object.keys(changes).forEach(name => {
    prefs[name] = changes[name].newValue;
  });
  handlePreferencesChange();
});
