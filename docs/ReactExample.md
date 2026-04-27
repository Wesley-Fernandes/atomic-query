# Exemplo de uso com React

Este exemplo demonstra como utilizar a **Atom** em uma aplicação React real, aproveitando o cache persistente, o hook customizado e o gerenciador global de queries.

## 1. Configuração da Instância (`api.ts`)

O ideal é criar uma instância centralizada para que o cache e o gerenciador de queries sejam compartilhados por toda a aplicação.

```tsx
import {
  createProductionAtom,
  IDBCacheStore,
  cacheMiddleware,
  loggerMiddleware,
} from 'atomic-query';

export const api = createProductionAtom({
  baseUrl: 'https://api.meu-app.com',
});

// Ativa o cache persistente no IndexedDB
api.use(
  cacheMiddleware({
    ttl: 1000 * 60 * 5, // 5 minutos
    store: new IDBCacheStore('meu-app-db'),
  }),
);

// Logger para debug (desabilitado sanitização em dev)
api.use(loggerMiddleware({ devMode: process.env.NODE_ENV === 'development' }));
```

## 2. Componente de Lista (`UserList.tsx`)

Usando o hook `useAtom` para buscar dados com suporte a _Refetch on Window Focus_.

```tsx
import React from 'react';
import { useAtom } from 'atomic-query';
import { api } from './api';

export function UserList() {
  // O hook se integra automaticamente com o cache e o QueryManager da instância
  const { data: users, loading, error, refetch } = useAtom('/users', { instance: api });

  if (loading) return <div>Carregando usuários...</div>;
  if (error) return <div>Erro ao carregar: {error.message}</div>;

  return (
    <div>
      <h1>Usuários</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <button onClick={() => refetch()}>Forçar Atualização</button>
    </div>
  );
}
```

## 3. Componente de Ação e Invalidação (`AddUser.tsx`)

Como atualizar a interface de qualquer lugar usando o `QueryManager`.

```tsx
import React, { useState } from 'react';
import { api } from './api';

export function AddUser() {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Faz o POST para criar o usuário
      await api.post('/users', { name });

      // 2. Invalida a query de lista
      // Isso avisa instantaneamente o componente UserList para recarregar!
      await api.query.invalidate('/users');

      setName('');
      alert('Usuário adicionado!');
    } catch (err) {
      alert('Falha ao adicionar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
      <button type="submit">Adicionar Usuário</button>
    </form>
  );
}
```

## 4. Atualização Otimista (Optimistic Update)

Se você quiser uma interface ainda mais rápida, pode trocar os dados manualmente antes mesmo da resposta do servidor.

```tsx
const handleUpdateName = async (id, newName) => {
  const oldUsers = await api.query.store.get('/users');

  // Atualiza a UI instantaneamente
  const optimisticUsers = oldUsers.response.data.map((u) =>
    u.id === id ? { ...u, name: newName } : u,
  );
  await api.query.setData('/users', optimisticUsers);

  try {
    await api.patch(`/users/${id}`, { name: newName });
  } catch (err) {
    // Em caso de erro, reverte ou invalida
    await api.query.invalidate('/users');
  }
};
```
