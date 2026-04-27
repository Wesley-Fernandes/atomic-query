import CodeBlock from '../../components/CodeBlock';
import { Settings, Shield, RefreshCcw, Lock, ListFilter } from 'lucide-react';

export default function Middlewares() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4">Middlewares</h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        Os middlewares são a espinha dorsal da Atomic Query. Eles permitem que você estenda as
        funcionalidades do motor de forma modular e segura.
      </p>

      <div className="space-y-12">
        {/* Auth */}
        <section>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock className="text-primary w-6 h-6" /> Autenticação (Auth)
          </h3>
          <p className="text-gray-400 mb-4">
            Injeta tokens de autenticação em todas as requisições automaticamente.
          </p>
          <CodeBlock code={`api.use(authMiddleware(() => localStorage.getItem('token')));`} />
        </section>

        {/* Retry */}
        <section>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <RefreshCcw className="text-accent w-6 h-6" /> Resiliência (Retry)
          </h3>
          <p className="text-gray-400 mb-4">
            Tenta novamente em caso de falha, com suporte a backoff exponencial.
          </p>
          <CodeBlock code={`api.use(retryMiddleware({ retries: 3, delay: 1000 }));`} />
        </section>

        {/* CSRF */}
        <section>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="text-red-500 w-6 h-6" /> Proteção CSRF
          </h3>
          <p className="text-gray-400 mb-4">
            Garante que requisições de mutação venham de origens seguras.
          </p>
          <CodeBlock code={`api.use(csrfMiddleware({ cookieName: 'XSRF-TOKEN' }));`} />
        </section>

        {/* Custom */}
        <section className="bg-white/5 p-8 rounded-3xl border border-glass-border">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6" /> Criando seu próprio Middleware
          </h3>
          <CodeBlock
            code={`api.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(\`Requisição demorou: \${Date.now() - start}ms\`);
});`}
          />
        </section>
      </div>
    </div>
  );
}
