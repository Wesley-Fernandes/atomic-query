import { Radio, MessageSquare, ShieldCheck } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function Streaming() {
  const code = `import { sseStream } from 'atomic-query';

async function streamChat() {
  // O sseStream é um AsyncIterable
  for await (const token of sseStream('/api/ai/stream')) {
    updateUI(token);
  }
}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
        Streaming & SSE <Radio className="text-[#ff5f56] w-8 h-8" />
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-8">
        A Atomic Query facilita o consumo de eventos do servidor (SSE), permitindo que você processe dados conforme eles chegam, sem precisar esperar o fechamento da conexão.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="glass p-6 rounded-2xl border-l-4 border-l-[#ff5f56]">
          <MessageSquare className="text-[#ff5f56] mb-3" />
          <h3 className="font-bold mb-1">Ideal para LLMs</h3>
          <p className="text-sm text-gray-500">Perfeito para exibir respostas de chat (como GPT) caractere por caractere.</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-l-accent">
          <ShieldCheck className="text-accent mb-3" />
          <h3 className="font-bold mb-1">Buffer Seguro</h3>
          <p className="text-sm text-gray-500">Proteção contra flood de memória com limite de 1MB por linha de stream.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Exemplo Prático</h2>
      <CodeBlock code={code} filename="stream.ts" />

      <section className="bg-white/5 border border-glass-border p-8 rounded-3xl">
        <h3 className="text-xl font-bold mb-4">Por que SSE e não WebSockets?</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          O SSE (Server-Sent Events) roda sobre HTTP convencional, o que significa que ele funciona nativamente com o cache da Atomic Query, 
          é mais leve para o servidor e atravessa firewalls de forma muito mais simples que WebSockets.
        </p>
      </section>
    </div>
  );
}
