import { Shield, Box, Zap, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CodeBlock from '../components/CodeBlock';
import InstallBadge from '../components/InstallBadge';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg overflow-hidden text-white">
      {/* 1. Video Background - Dinâmico e Cinematográfico */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-100 brightness-50"
        >
          <source src="bg.mp4" type="video/mp4" />
        </video>
        {/* Overlay para suavizar o vídeo e dar contraste ao texto */}
        <div className="absolute inset-0 bg-linear-to-b from-bg/0 via-bg/50 to-bg"></div>
      </div>

      {/* 2. O Conteúdo (Camada Superior) */}
      <div className="relative z-20">
        <header className="pt-48 pb-24 bg-transparent relative">
          <div className="container mx-auto px-6 flex flex-col items-center text-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 border border-primary text-primary text-xs font-semibold">
                v3.0.1 agora disponível
              </span>
              <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                A Evolução das <br />
                <span className="gradient-text">Requisições HTTP</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Segurança atômica com zero dependências. O motor de busca e cache definitivo para
                aplicações que levam a infraestrutura a sério.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 pt-8 justify-center items-center">
                <InstallBadge />
                <Link
                  to="/docs"
                  className="btn btn-primary h-[58px] px-10 text-lg flex items-center"
                >
                  Ver Documentação <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Features */}
        <section className="py-24 relative bg-transparent">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">Por que Atomic Query?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Shield className="text-primary w-10 h-10" />}
                title="Segurança Blindada"
                description="Sanitização automática de logs e bloqueio de protocolos perigosos."
              />
              <FeatureCard
                icon={<Box className="text-primary w-10 h-10" />}
                title="Zero Dependências"
                description="0% de risco de supply chain attacks. Apenas código nativo."
              />
              <FeatureCard
                icon={<Zap className="text-primary w-10 h-10" />}
                title="Performance Pura"
                description="Cache persistente via IndexedDB e suporte nativo a SSE."
              />
              <FeatureCard
                icon={<Cpu className="text-primary w-10 h-10" />}
                title="React Query Feel"
                description="Hooks poderosos com invalidação global de cache."
              />
            </div>
          </div>
        </section>

        {/* Code Demo */}
        <section id="code-demo" className="pb-24 bg-transparent">
          <div className="container mx-auto px-6 flex justify-center">
            <div className="w-full max-w-3xl">
              <CodeBlock
                filename="useAtom.tsx"
                language="tsx"
                code={`import { useAtom } from 'atomic-query';\n\nfunction Profile() {\n  const { data, loading } = useAtom('/user');\n\n  if (loading) return <Spinner />;\n  return <div>Olá, {data.name}</div>;\n}`}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-all duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
