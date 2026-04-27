# Exemplo de uso com Vanilla JS (JS Puro)

A **Atom** é ideal para projetos que não utilizam frameworks pesados ou que precisam de máxima performance com zero dependências.

## 1. Configuração e Requisição Simples

```javascript
import { atom, loggerMiddleware } from 'atomic-query';

// Adiciona um logger para ver o que está acontecendo
atom.use(loggerMiddleware());

async function loadData() {
  try {
    const { data } = await atom.get('https://api.example.com/data');
    console.log('Dados carregados:', data);

    document.getElementById('content').innerText = JSON.stringify(data);
  } catch (err) {
    console.error('Falha na requisição:', err.message);
  }
}
```

## 2. Consumindo Server-Sent Events (SSE)

Ideal para chats de IA ou dashboards em tempo real. A Atom cuida do parse e do buffer de memória.

```javascript
import { sseStream } from 'atomic-query';

async function startStream() {
  const output = document.getElementById('chat-output');

  try {
    // Itera sobre o stream de forma assíncrona
    for await (const chunk of sseStream('/api/ai-chat')) {
      output.innerText += chunk;
    }
    console.log('Stream finalizado.');
  } catch (err) {
    output.innerText += '\n[Erro de conexão]';
  }
}
```

## 3. Gerenciamento Global de Estado (Sem React)

Você pode usar o `QueryManager` para sincronizar diferentes partes da sua página.

```javascript
import { api } from './api-config.js';

// Escuta mudanças globais na query '/profile'
api.query.subscribe((key, type, newData) => {
  if (key === '/profile' && type === 'update') {
    document.getElementById('user-name').innerText = newData.name;
    console.log('UI atualizada globalmente!');
  }
});

// Em outro lugar do seu código (ex: um modal de edição)
async function updateProfile(newName) {
  await api.patch('/profile', { name: newName });

  // Atualiza o cache manualmente e notifica todos os "subscribers" acima
  await api.query.setData('/profile', { name: newName });
}
```

## 4. Resiliência com Retry

Configurando uma instância que não desiste em conexões ruins.

```javascript
import { createAtom, retryMiddleware } from 'atomic-query';

const resilientApi = createAtom({ baseUrl: 'https://api.unstable.com' });

resilientApi.use(
  retryMiddleware({
    retries: 5,
    baseDelay: 1000, // Começa com 1s de espera
    shouldRetry: (err) => err.response?.status === 503, // Apenas se o servidor estiver ocupado
  }),
);

async function fetchData() {
  // Isso vai tentar até 5 vezes automaticamente antes de falhar
  const res = await resilientApi.get('/data');
  return res.data;
}
```
