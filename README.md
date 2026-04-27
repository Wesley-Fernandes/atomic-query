# ⚛️ Atomic Query

**Segurança máxima. Zero dependências. Performance pura.**

A Atomic Query é uma biblioteca de requisições HTTP ultra-leve, funcional e — acima de tudo — **segura**. Enquanto outras bibliotecas arrastam centenas de dependências (e os riscos que vêm com elas), a Atomic Query foi construída do zero utilizando apenas as APIs nativas do motor JavaScript moderno.

---

### 🛡️ Por que escolher a Atomic Query?

Recentemente, a comunidade foi abalada por ataques à cadeia de suprimentos em grandes bibliotecas. A Atomic Query nasceu para eliminar esse risco de forma definitiva:

- **Zero Dependências**: 0% de risco de supply chain attacks. Sem pacotes fantasmas, sem cavalos de troia.
- **Native-First**: Aproveita o poder real do `fetch`, `AbortController` e `ReadableStream` nativos do ambiente (Browser, Node, Bun).
- **Segurança Blindada**:
  - **Sanitização de Logs**: Mascara automaticamente tokens e cookies no console (pode ser desabilitado via `devMode` para debug).
  - **Memory Safety**: Limite de cache e buffers de stream para evitar ataques de negação de serviço (DoS).
  - **Protocol Guard**: Bloqueio de protocolos perigosos como `javascript:` e `data:`.
- **TypeScript Strict**: Tipagem rigorosa preparada para configurações de alta exigência.

---

### 🚀 Comece em segundos

```bash
npm install atomic-query
```

#### Uso básico

```ts
import { atom } from 'atomic-query';

// Tipagem genérica e segura
const { data } = await atom.get<User[]>('/users');
```

---

### 💎 Funcionalidades de Elite

#### 1. Stack de Produção Completa

Crie instâncias robustas com resiliência de nível enterprise em segundos:

```ts
import { createProductionAtom, loggerMiddleware, cacheMiddleware, IDBCacheStore } from 'atomic-query';

const api = createProductionAtom({
  baseUrl: 'https://api.example.com',
});

// Cache persistente com IndexedDB (Alta performance no Client)
api.use(
  cacheMiddleware({
    ttl: 1000 * 60 * 60, // 1 hora
    store: new IDBCacheStore('minha-app-db'),
  }),
);

// Logs seguros por padrão
api.use(loggerMiddleware());

// Quer ver tudo durante o desenvolvimento? Use o devMode:
// api.use(loggerMiddleware({ devMode: true }));
```

#### 2. Streaming & SSE (Server-Sent Events)

Perfeito para respostas de IA/LLM e dados em tempo real, com proteção contra flood de memória:

```ts
import { sseStream } from 'atomic-query';

for await (const token of sseStream('/api/chat')) {
  process.stdout.write(token);
}
```

#### 3. Integração com React (Ultra-light Query)

A Atomic Query oferece um hook nativo que traz a conveniência do TanStack Query sem adicionar dependências:

```ts
import { useAtom } from 'atomic-query';

function Profile() {
  // Refetch automático ao voltar para a aba (Window Focus) por padrão!
  const { data, loading, refetch } = useAtom<User>('/api/me');

  return <div>{data?.name}</div>;
}
```

#### 4. Gerenciamento Global de Estado (Invalidação e Mutações)

Chega de lógicas complexas. Manipule o cache de qualquer lugar do app de forma simples:

```ts
import { atom } from 'atomic-query';

// Invalida o cache e força todos os componentes useAtom('/users') a recarregarem
await atom.query.invalidate('/users');

// Optimistic Update: Troca os dados manualmente e avisa a UI instantaneamente
await atom.query.setData('/users', [...cachedUsers, newUser]);

// Remove dados do cache silenciosamente
await atom.query.remove('/old-path');
```

#### 3. Middlewares Customizáveis

Arquitetura plugável para Logger, Auth, Cache, CSRF e muito mais.

---

### ⚡ Performance e Estabilidade

- **Deduplicação**: Colapsa requisições GET idênticas em uma única Promise, economizando rede.
- **Tree-shaking**: Apenas o código que você usa vai para o seu bundle final.
- **Padrão Funcional**: Imutabilidade e previsibilidade em cada chamada.

---

### 📝 Licença

MIT. Desenvolvido para quem leva a segurança da infraestrutura a sério.
