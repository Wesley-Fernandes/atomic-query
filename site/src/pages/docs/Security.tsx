import { ShieldAlert, Lock, EyeOff } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function Security() {
  const logCode = `// O loggerMiddleware mascara automaticamente dados sensíveis
headers: {
  Authorization: "********",
  "X-API-Key": "********",
  "Cookie": "********"
}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
        Segurança Blindada <ShieldAlert className="text-red-500 w-8 h-8" />
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        A Atomic Query foi desenhada para ambientes onde a segurança da informação não é negociável. 
        Implementamos proteções nativas que normalmente seriam ignoradas ou exigiriam middlewares complexos.
      </p>

      <div className="space-y-8">
        <section className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl">
          <div className="flex items-start gap-4">
            <div className="bg-red-500/20 p-3 rounded-xl">
              <Lock className="text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Zero Dependências Externas</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ao utilizar zero dependências de terceiros, a Atomic Query elimina 100% dos riscos de 
                <em> Supply Chain Attacks</em>. Não há scripts ocultos ou vulnerabilidades introduzidas 
                por pacotes de terceiros maliciosos.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary/5 border border-primary/20 p-8 rounded-3xl">
          <div className="flex items-start gap-4">
            <div className="bg-primary/20 p-3 rounded-xl h-fit">
              <EyeOff className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Sanitização de Logs</h3>
              <p className="text-gray-400 text-sm mb-4">
                Nosso <code>loggerMiddleware</code> é inteligente por padrão. Ele identifica e oculta automaticamente 
                campos sensíveis em seus logs de console, protegendo seus tokens de vazamentos acidentais.
              </p>
              <CodeBlock 
                code={logCode} 
                language="javascript" 
                filename="Console Output"
              />
            </div>
          </div>
        </section>

        <section className="bg-white/5 border border-glass-border p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-4">Proteção de Protocolos</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Bloqueamos automaticamente URLs que usem protocolos perigosos como <code>javascript:</code> ou <code>data:</code>, 
            evitando ataques de injeção de scripts (XSS) via configurações de base URL dinâmicas ou inputs de usuário maliciosos.
          </p>
        </section>
      </div>
    </div>
  );
}
