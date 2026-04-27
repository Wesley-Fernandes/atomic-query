import { RefreshCcw } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function ReactInvalidate() {
  const code = `import { api } from './api';\n\n// Em qualquer parte do app\nawait api.query.invalidate('/users');`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
        Invalidação <RefreshCcw className="text-primary w-8 h-8" />
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        A invalidação é a forma mais poderosa de manter sua UI sincronizada. Ao invalidar uma chave,
        todos os componentes ativos que usam essa URL serão notificados para recarregar.
      </p>

      <h2 className="text-2xl font-bold mb-4">Uso Global</h2>
      <CodeBlock code={code} />

      <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl mt-8">
        <h4 className="font-bold mb-2">Quando usar?</h4>
        <p className="text-sm text-gray-400">
          Sempre que você realizar uma operação que altere dados no servidor (POST, PUT, DELETE,
          PATCH) e quiser que a lista de dados na interface seja atualizada automaticamente.
        </p>
      </div>
    </div>
  );
}
