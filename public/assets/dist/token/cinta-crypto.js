// script.js
const apiKey = '55b43507210e1a598523ba0444aca3d83d9516ae93844a4e6a65b95b0c2cf990'; // Reemplaza con tu propia clave de API

const cryptoLogos = {
  'BTC': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  'ETH': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  'LTC': 'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png',
  'BNB': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  'XRP': 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
  'BCH': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png',
  'ETC': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png',
  'ADA': 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
  'DOT': 'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png',
  'LINK': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
  'MATIC': 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  'DOGE': 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
  'XLM': 'https://s2.coinmarketcap.com/static/img/coins/64x64/512.png',
  'AAVE': 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png',
  'UNI': 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
  'SNX': 'https://s2.coinmarketcap.com/static/img/coins/64x64/2586.png',
  'COMP': 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png',
  'MKR': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png',
  'SOL': 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  'AVAX': 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
  'FTM': 'https://s2.coinmarketcap.com/static/img/coins/64x64/3513.png',
  'RUNE': 'https://s2.coinmarketcap.com/static/img/coins/64x64/4157.png',
  'SHIBA': 'https://s2.coinmarketcap.com/static/img/coins/64x64/14341.png'
};

const cryptos = Object.keys(cryptoLogos);

// Ordena el array 'cryptos' alfabéticamente
cryptos.sort();

// Función para obtener y mostrar datos de criptomonedas
async function fetchAndDisplayCryptoData() {
  try {
    const cryptoSymbols = cryptos.join(','); // Convierte el array en una cadena separada por comas
    const apiUrl = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoSymbols}&tsyms=USD&api_key=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('No se pudo obtener una respuesta válida de la API.');
    }

    const data = await response.json();

    // Limpia cualquier contenido previo en la cinta
    const ticker = document.getElementById('ticker');
    ticker.innerHTML = '';

    // Agrega los datos de criptomonedas a la cinta
    cryptos.forEach((symbol) => {
      const cryptoData = data.RAW[symbol];

      if (cryptoData) {
        const info = cryptoData.USD;
        const li = document.createElement('li');

        const percentage = parseFloat(info.CHANGEPCTDAY);
        const percentageText = info.CHANGEPCTDAY.toFixed(2);

        // Reemplaza los paréntesis con un espacio en blanco
        const formattedPercentageText = percentageText.replace(/\(|\)/g, ' ');

        // Agrega las clases CSS para el color
        const percentageClass = percentage > 0 ? 'up-percent' : percentage < 0 ? 'down-percent' : '';

        // Define la ruta del ícono SVG
        const arrowIcon = `<img src="${baseUrl}assets/img/token/triangulo.svg" alt="Flecha" width="16" height="16" style="transform: rotate(${percentage < 0 ? '180deg' : '0deg'}); vertical-align: middle;">`;

        li.innerHTML = `<img src="${cryptoLogos[symbol]}" alt="${symbol} Logo" width="32" height="32"> ${symbol} ${info.PRICE.toFixed(2)} USD&nbsp;<span class="${percentageClass}">${arrowIcon}${formattedPercentageText}%</span>`;

        ticker.appendChild(li);
      }
    });
  } catch (error) {
    console.error('Error al obtener datos de criptomonedas:', error);
  }
}

// Llama a la función para obtener y mostrar datos de criptomonedas
fetchAndDisplayCryptoData();

// Actualiza los datos cada 60 segundos (ajusta este intervalo según tus necesidades)
setInterval(fetchAndDisplayCryptoData, 60000);
