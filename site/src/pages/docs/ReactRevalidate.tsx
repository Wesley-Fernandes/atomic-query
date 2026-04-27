import { RotateCcw } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function ReactRevalidate() {
  const code = `function UserList() {\n  const { refetch } = useAtom('/users');\n\n  return (\n    <button onClick={() => refetch()}>\n      Forçar Atualização\n    </button>\n  );\n}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
        Revalidação <RotateCcw className="text-[#ffbd2e] w-8 h-8" />
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        Revalidar significa forçar o Atomic Query a buscar os dados novamente no servidor, ignorando
        o cache atual se necessário.
      </p>

      <h2 className="text-2xl font-bold mb-4">Uso do refetch</h2>
      <CodeBlock code={code} language="tsx" />

      <div className="space-y-4 mt-8">
        <h3 className="text-xl font-bold">Modos de Revalidação Automática</h3>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>
            <strong>Window Focus:</strong> Revalida quando você volta para a aba.
          </li>
          <li>
            <strong>Mount:</strong> Revalida sempre que o componente é montado.
          </li>
          <li>
            <strong>Manual:</strong> Através da função <code>refetch()</code>.
          </li>
        </ul>
      </div>
    </div>
  );
}
