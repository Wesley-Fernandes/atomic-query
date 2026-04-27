import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Clipboard } from 'lucide-react';
import { toast } from 'sonner';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language = 'typescript', filename }: CodeBlockProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado!', {
      style: {
        background: '#1a005c',
        border: '1px solid #4b00ff',
        color: '#fff',
      },
    });
  };

  return (
    <div className="group relative my-6 rounded-2xl overflow-hidden border border-glass-border glass">
      {/* Header com Nome do Arquivo */}
      <div className="bg-white/5 px-4 py-3 flex justify-between items-center border-b border-glass-border">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
          </div>
          {filename && <span className="text-xs text-gray-400 font-mono">{filename}</span>}
        </div>

        {/* Botão de Copiar no Topo Direito */}
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs"
          title="Copiar código"
        >
          <Clipboard className="w-3.5 h-3.5" />
          <span>Copy</span>
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          background: 'transparent',
          fontSize: '0.85rem',
          lineHeight: '1.6',
        }}
        codeTagProps={{
          style: { fontFamily: '"JetBrains Mono", monospace' },
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
