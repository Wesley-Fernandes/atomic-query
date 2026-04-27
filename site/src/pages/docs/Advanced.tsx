import CodeBlock from '../../components/CodeBlock';
import { Rocket, Sliders } from 'lucide-react';

export default function Advanced() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4">Uso Avançado</h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        Domine o motor da Atomic Query com configurações de nível de produção e customização total.
      </p>

      <div className="space-y-12">
        <section>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Rocket className="text-primary w-6 h-6" /> createProductionAtom
          </h3>
          <p className="text-gray-400 mb-4">Cria uma instância pré-configurada com middlewares de cache, dedup, concurrency e logger.</p>
          <CodeBlock code={`const api = createProductionAtom({\n  baseUrl: 'https://api.acme.com'\n});`} />
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sliders className="text-accent w-6 h-6" /> Request Options
          </h3>
          <p className="text-gray-400 mb-4">Você pode passar opções específicas para cada requisição, sobrescrevendo a instância global.</p>
          <CodeBlock code={`await api.get('/user', {\n  timeout: 2000,\n  headers: { 'X-Custom': 'Value' },\n  cache: false // Ignora o cache para esta chamada\n});`} />
        </section>
      </div>
    </div>
  );
}
