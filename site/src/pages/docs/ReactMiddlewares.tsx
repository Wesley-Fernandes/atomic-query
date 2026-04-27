import { Settings, Shield, Lock, Activity, AlertCircle } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function ReactMiddlewares() {
  const providerCode = `import { createProductionAtom, AtomProvider } from 'atomic-query';\n\nconst api = createProductionAtom({\n  baseUrl: 'https://api.myapp.com',\n  // Middlewares aplicados a TODOS os useAtom da app\n  middlewares: [\n    authMiddleware,\n    loggerMiddleware\n  ]\n});\n\nexport function App() {\n  return (\n    <AtomProvider instance={api}>\n      <Routes />\n    </AtomProvider>\n  );\n}`;

  const authCode = `const authMiddleware = async (context, next) => {\n  const token = localStorage.getItem('token');\n  \n  if (token) {\n    context.options.headers = {\n      ...context.options.headers,\n      Authorization: \`Bearer \${token}\`\n    };\n  }\n\n  return next();\n};`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
        Middlewares no React <Settings className="text-primary w-8 h-8" />
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        No ecossistema React, os middlewares agem como uma camada de segurança invisível. Ao
        configurar sua instância no <code>AtomProvider</code>, cada hook <code>useAtom</code> passa
        a respeitar automaticamente suas regras de negócio.
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock className="text-primary w-6 h-6" /> 1. Autenticação Dinâmica
          </h2>
          <p className="text-gray-400 mb-4">
            O middleware de autenticação é o caso de uso mais comum. Ele intercepta a requisição
            antes dela sair e injeta o token atualizado.
          </p>
          <CodeBlock code={authCode} filename="middlewares/auth.ts" />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="text-accent w-6 h-6" /> 2. O Coração da App
          </h2>
          <p className="text-gray-400 mb-4">
            Conecte sua instância configurada ao Provider para que todo o seu grafo de componentes
            seja protegido.
          </p>
          <CodeBlock code={providerCode} filename="App.tsx" language="tsx" />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="glass p-8 rounded-3xl border-t-2 border-primary">
            <Activity className="text-primary mb-4 w-6 h-6" />
            <h3 className="text-xl font-bold mb-2">Monitoramento</h3>
            <p className="text-sm text-gray-400">
              Use middlewares para enviar métricas de performance para ferramentas como Sentry ou
              Datadog sempre que um componente React disparar uma query.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border-t-2 border-red-500">
            <AlertCircle className="text-red-500 mb-4 w-6 h-6" />
            <h3 className="text-xl font-bold mb-2">Intercepção de Erros</h3>
            <p className="text-sm text-gray-400">
              Capture erros 401 globalmente e dispare um{' '}
              <code>window.location.href = '/login'</code> de dentro do middleware, centralizando o
              controle de acesso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
