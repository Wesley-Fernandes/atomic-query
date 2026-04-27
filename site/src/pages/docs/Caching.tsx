import { Database, RefreshCw, Zap } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function Caching() {
  const code = `import { createAtom, cacheMiddleware, IDBCacheStore } from 'atomic-query';

const api = createAtom();

api.use(cacheMiddleware({
  ttl: 1000 * 60 * 30, // 30 minutos
  store: new IDBCacheStore('minha-base-de-dados')
}));`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
        Cache & Persistência <Database className="text-accent w-8 h-8" />
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        O sistema de cache da Atomic Query é assíncrono e extensível, permitindo desde o
        armazenamento simples em memória até a persistência robusta no disco do usuário.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass p-8 rounded-3xl">
          <div className="bg-accent/20 w-12 h-12 flex items-center justify-center rounded-xl mb-4">
            <RefreshCw className="text-accent" />
          </div>
          <h3 className="text-xl font-bold mb-2">SWR (Stale-While-Revalidate)</h3>
          <p className="text-gray-400 text-sm">
            Entregue dados instantaneamente do cache enquanto a biblioteca valida se há uma versão
            mais nova no servidor em segundo plano.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl">
          <div className="bg-primary/20 w-12 h-12 flex items-center justify-center rounded-xl mb-4">
            <Zap className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Invalidação Global</h3>
          <p className="text-gray-400 text-sm">
            Atualize o estado de toda a aplicação de uma só vez. Quando você invalida uma chave,
            todos os componentes que a utilizam recarregam automaticamente.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Persistência com IndexedDB</h2>
      <p className="text-gray-400 mb-6">
        Diferente do LocalStorage, o IndexedDB é assíncrono e não bloqueia a thread principal.
        Perfeito para armazenar grandes volumes de dados no cliente.
      </p>

      <CodeBlock code={code} filename="api.ts" />
    </div>
  );
}
