import { Terminal, Package, ShieldCheck } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';
import InstallBadge from '../../components/InstallBadge';

export default function Introduction() {
  const basicUsage = `import { atom } from 'atomic-query';\n\n// Requisição simples e tipada\nconst { data } = await atom.get<User[]>('/users');\nconsole.log(data);`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4">Introdução</h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        A <strong>Atomic Query</strong> é uma solução de camada de rede moderna, focada em segurança, transparência e performance. 
        Diferente de outras bibliotecas que trazem um emaranhado de sub-dependências, nós entregamos tudo o que você precisa usando apenas APIs nativas do navegador.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass p-6 rounded-2xl">
          <Package className="text-primary mb-3" />
          <h3 className="font-bold mb-1">Zero Deps</h3>
          <p className="text-sm text-gray-500">Sem pacotes fantasmas ou riscos de supply chain.</p>
        </div>
        <div className="glass p-6 rounded-2xl">
          <ShieldCheck className="text-accent mb-3" />
          <h3 className="font-bold mb-1">Segura</h3>
          <p className="text-sm text-gray-500">Sanitização automática e proteção de protocolos.</p>
        </div>
        <div className="glass p-6 rounded-2xl">
          <Terminal className="text-[#ffbd2e] mb-3" />
          <h3 className="font-bold mb-1">Tipada</h3>
          <p className="text-sm text-gray-500">TypeScript strict para total segurança no código.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">Instalação Rápida</h2>
      <div className="mb-8">
        <InstallBadge />
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">Uso Básico</h2>
      <CodeBlock code={basicUsage} filename="index.ts" />
    </div>
  );
}
