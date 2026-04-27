import { Edit3 } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function ReactUpdate() {
  const code = `import { api } from './api';\n\n// Atualização manual instantânea\napi.query.setData('/users', (oldData) => {\n  return [...oldData, newUser];\n});`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
        Update (setData) <Edit3 className="text-accent w-8 h-8" />
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        O método <code>setData</code> permite injetar dados diretamente no cache. Isso é ideal para <strong>Optimistic Updates</strong>, onde a UI reage instantaneamente antes mesmo do servidor responder.
      </p>

      <h2 className="text-2xl font-bold mb-4">Atualização Manual</h2>
      <CodeBlock code={code} />
      
      <p className="text-gray-400 mt-6">
        Se você passar uma função, ela receberá o valor atual do cache, permitindo transformações complexas sem perder o estado anterior.
      </p>
    </div>
  );
}
