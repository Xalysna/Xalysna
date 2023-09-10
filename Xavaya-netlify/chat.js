// chat.js

const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/chat/completions';

// Función para enviar una pregunta al modelo GPT-3.5 Turbo
async function sendQuestion(question) {
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: question }],
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result.choices[0].message.content;
}

// Exporta la función para usarla en otros scripts si es necesario
export { sendQuestion };
