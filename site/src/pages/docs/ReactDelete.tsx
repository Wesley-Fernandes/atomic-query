import { Trash2, Eraser } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function ReactDelete() {
  const removeCode = `import { api } from './api';\n\n// Remove os dados de uma URL específica\napi.query.remove('/profile');`;
  const clearCode = `import { api } from './api';\n\n// Apaga ABSOLUTAMENTE TUDO (Memória e IndexedDB)\nawait api.query.clear();`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
        Delete & Reset <Trash2 className="text-red-500 w-8 h-8" />
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        Existem duas formas de remover dados do cache: apagar uma entrada específica ou realizar um reset total do sistema de armazenamento.
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" /> Remover Chave Única
          </h2>
          <p className="text-gray-400 mb-4">
            O método <code>remove</code> limpa os dados de uma query específica. Ideal para quando um recurso é deletado individualmente.
          </p>
          <CodeBlock code={removeCode} />
        </section>

        <section className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Eraser className="w-5 h-5 text-red-500" /> Limpar Todo o Cache (Clear)
          </h2>
          <p className="text-gray-400 mb-4">
            O método <code>clear</code> é a "opção nuclear". Ele esvazia completamente a Store ativa (seja ela em memória ou IndexedDB) e notifica todos os componentes React para resetarem seu estado.
          </p>
          <CodeBlock code={clearCode} />
          <p className="text-xs text-red-400/60 mt-4">
            * Use com cautela. Recomendado para processos de Logout ou "Limpar Dados da App".
          </p>
        </section>
      </div>
    </div>
  );
}
