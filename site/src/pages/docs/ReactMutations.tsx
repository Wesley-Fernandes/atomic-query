import { Zap, RefreshCcw, Save } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function ReactMutations() {
  const code = `import { api } from './api';

function DeleteUser({ id }) {
  const handleDelete = async () => {
    await api.delete(\`/users/\${id}\`);
    
    // Invalida a query globalmente e avisa o hook useAtom
    await api.query.invalidate('/users');
  };

  return <button onClick={handleDelete}>Deletar</button>;
}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
        Mutações & Invalidação <Zap className="text-primary w-8 h-8" />
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        Diferente de outras libs, a Atomic Query não exige um hook específico para mutações. 
        Você usa o motor da instância para enviar dados e o QueryManager para avisar a UI.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="glass p-6 rounded-2xl">
          <RefreshCcw className="text-primary mb-3" />
          <h3 className="font-bold mb-1">Invalidação Global</h3>
          <p className="text-sm text-gray-500">Qualquer componente usando a mesma URL será atualizado instantaneamente.</p>
        </div>
        <div className="glass p-6 rounded-2xl">
          <Save className="text-accent mb-3" />
          <h3 className="font-bold mb-1">setData()</h3>
          <p className="text-sm text-gray-500">Atualize o cache manualmente para uma resposta instantânea na interface.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Exemplo de Invalidação</h2>
      <CodeBlock code={code} filename="DeleteButton.tsx" language="tsx" />
    </div>
  );
}
