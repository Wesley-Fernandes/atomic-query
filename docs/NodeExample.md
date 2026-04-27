# Exemplo de uso com Node.js (Backend)

A **Atom** brilha no Node.js (v18+) por ser uma biblioteca sem dependências, o que reduz drasticamente a superfície de ataque e o tempo de inicialização do seu servidor.

## 1. Integração entre Microsserviços

Em um ambiente de backend, a segurança e a performance são cruciais.

```javascript
import { createProductionAtom, authMiddleware, cacheMiddleware } from 'atomic-query';

// Instância configurada para comunicação entre serviços
const serviceApi = createProductionAtom({
  baseUrl: 'https://internal-service.local',
  timeout: 5000, // Timeouts curtos para evitar travamento de recursos
});

// Autenticação via Token de Serviço
serviceApi.use(authMiddleware(() => process.env.SERVICE_TOKEN));

// Cache em memória para dados que mudam pouco (ex: configurações)
serviceApi.use(cacheMiddleware({ ttl: 60000 })); // 1 minuto de cache

async function getInternalConfig() {
  const { data } = await serviceApi.get('/config');
  return data;
}
```

## 2. Tratamento de Erros Robusto

Diferenciar erros de timeout, cancelamento ou erro de negócio é essencial no backend.

```javascript
import { atom, isAtomError, isAtomTimeout } from 'atomic-query';

async function safeRequest() {
  try {
    return await atom.get('https://external-api.com');
  } catch (err) {
    if (isAtomTimeout(err)) {
      console.error('A API externa demorou demais para responder.');
    } else if (isAtomError(err)) {
      console.error(`Erro da API (${err.response.status}):`, err.response.data);
    } else {
      console.error('Erro inesperado:', err);
    }
  }
}
```

## 3. Streaming de Resposta (Proxy)

Você pode usar o streaming da Atom para repassar dados de uma API externa diretamente para o seu cliente sem carregar tudo na memória.

```javascript
import { sseStream } from 'atomic-query';

// Exemplo em um handler do Express/Fastify
async function handleChatStream(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  
  try {
    for await (const chunk of sseStream('https://ai-provider.com/v1/chat')) {
      res.write(`data: ${chunk}\n\n`);
    }
    res.end();
  } catch (err) {
    res.status(500).end();
  }
}
```

## 4. Segurança de Logs em Produção

Ao usar sistemas como CloudWatch ou Logstash, você não quer que chaves de API apareçam nos logs.

```javascript
import { atom, loggerMiddleware } from 'atomic-query';

// O loggerMiddleware da Atom mascara automaticamente:
// Authorization, Cookie, X-API-Key, etc.
atom.use(loggerMiddleware());

// Isso é seguro mesmo em produção
const res = await atom.get('/secure-data', {
  headers: { 'X-API-Key': 'secret_12345' }
});
// Log: Options: { headers: { 'X-API-Key': '********' } }
```
