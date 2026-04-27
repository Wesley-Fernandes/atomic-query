import { Database, Zap, ShieldAlert, Cpu, Layers, HardDrive } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function BigData() {
  const code = `import { jsonStream } from 'atomic-query';\n\nasync function processLargeData() {\n  // Lê um arquivo de 5GB objeto por objeto (Array ou NDJSON)\n  const iterator = jsonStream('/massive-dataset.json');\n\n  for await (const item of iterator) {\n    // RAM usada: Constante (apenas o tamanho de um objeto)\n    console.log('Item:', item.id);\n    \n    // DICA: Salve no IndexedDB para persistência\n    // await atom.query.setData(\`cache:\${item.id}\`, item);\n  }\n}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3 italic">
        Big Data Engine <Database className="text-accent w-8 h-8" />
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        Domine datasets de Gigabytes diretamente no navegador. A Atomic Query utiliza <strong>Binary Chunk Identification</strong> para fatiar JSONs massivos sem nunca carregar o arquivo completo na RAM.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="glass p-6 rounded-2xl border-t-2 border-accent">
          <Zap className="text-accent mb-3 w-5 h-5" />
          <h3 className="font-bold mb-1 text-sm">Constant RAM</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Memória Estável</p>
        </div>
        <div className="glass p-6 rounded-2xl border-t-2 border-primary">
          <Cpu className="text-primary mb-3 w-5 h-5" />
          <h3 className="font-bold mb-1 text-sm">Non-Blocking</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Main Thread Livre</p>
        </div>
        <div className="glass p-6 rounded-2xl border-t-2 border-white/20">
          <HardDrive className="text-white/50 mb-3 w-5 h-5" />
          <h3 className="font-bold mb-1 text-sm">IDB Ready</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Pronto para Cache</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        A Arquitetura de Streaming
      </h2>
      <CodeBlock code={code} />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2rem]">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Layers className="text-primary" /> Como funciona?
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Diferente do <code>JSON.parse()</code> tradicional que exige o conteúdo completo em uma string, nosso motor de streaming analisa os bytes brutos da rede. Ele identifica os caracteres delimitadores <code>{'{'}</code> e <code>{'}'}</code> para isolar cada objeto do array, emitindo-os para o seu loop assim que o último byte do objeto chega.
          </p>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[2rem]">
          <h4 className="font-bold mb-4 flex items-center gap-2 text-red-400">
            <ShieldAlert /> Alerta de Performance
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Mesmo que o <code>jsonStream</code> evite o crash de memória na leitura, renderizar 1 milhão de elementos no React ainda vai travar a aba. Combine esta técnica com <strong>Virtual Lists</strong> ou salve os dados no IndexedDB para acesso sob demanda.
          </p>
        </div>
      </div>
    </div>
  );
}
