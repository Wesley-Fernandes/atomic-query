import { Layout, MousePointer2, RefreshCcw } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function ReactDoc() {
  const code = `import { useAtom } from 'atomic-query';

function UserProfile() {
  const { data, loading, error, refetch } = useAtom('/api/user/profile', {
    refetchOnFocus: true // Ativado por padrão
  });

  if (loading) return <span>...</span>;
  
  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => refetch()}>Atualizar</button>
    </div>
  );
}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
        Integração React <Layout className="text-primary w-8 h-8" />
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        Embora a Atomic Query seja agnóstica a frameworks, oferecemos um hook de primeira classe
        para React que simplifica drasticamente o gerenciamento de estados assíncronos.
      </p>

      <div className="space-y-6 mb-12">
        <div className="flex gap-4 p-6 glass rounded-2xl">
          <div className="bg-primary/20 p-3 rounded-xl h-fit">
            <MousePointer2 className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold mb-1">Refetch on Window Focus</h3>
            <p className="text-sm text-gray-500">
              Sincronize os dados automaticamente quando o usuário volta para a aba do navegador.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-6 glass rounded-2xl">
          <div className="bg-accent/20 p-3 rounded-xl h-fit">
            <RefreshCcw className="text-accent" />
          </div>
          <div>
            <h3 className="font-bold mb-1">Reatividade Global</h3>
            <p className="text-sm text-gray-500">
              Se o cache for invalidado em qualquer lugar da app, o componente React reflete a
              mudança na hora.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">O Hook useAtom</h2>
      <CodeBlock code={code} filename="UserProfile.tsx" language="tsx" />
    </div>
  );
}
