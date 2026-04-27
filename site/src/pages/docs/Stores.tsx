import CodeBlock from '../../components/CodeBlock';
import { Database, Cpu, HardDrive } from 'lucide-react';

export default function Stores() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4">Cache Stores</h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        A Atomic Query suporta diferentes estratégias de armazenamento. Você pode escolher a que melhor se adapta ao seu ambiente (Browser ou Node.js).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <Cpu className="text-primary w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">MemoryCacheStore</h3>
          <p className="text-gray-400 text-sm mb-4">
            Padrão para Node.js e SPA. Rápido, mas os dados são perdidos ao atualizar a página.
          </p>
          <CodeBlock code={`import { MemoryCacheStore } from 'atomic-query';\nconst store = new MemoryCacheStore({ maxSize: 100 });`} />
        </div>

        <div className="glass p-8 rounded-3xl">
          <HardDrive className="text-accent w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">IDBCacheStore</h3>
          <p className="text-gray-400 text-sm mb-4">
            Recomendado para Browser. Persistente e assíncrono usando IndexedDB nativo.
          </p>
          <CodeBlock code={`import { IDBCacheStore } from 'atomic-query';\nconst store = new IDBCacheStore('minha-app-cache');`} />
        </div>
      </div>
    </div>
  );
}
