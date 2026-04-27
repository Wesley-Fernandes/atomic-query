import { Clipboard } from 'lucide-react';
import { toast } from 'sonner';

interface InstallBadgeProps {
  command?: string;
}

export default function InstallBadge({ command = 'npm install atomic-query' }: InstallBadgeProps) {
  const copyCommand = () => {
    navigator.clipboard.writeText(command);
    toast.success('Comando copiado!', {
      style: {
        background: '#1a005c',
        border: '1px solid #4b00ff',
        color: '#fff',
      }
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-black/40 p-4 rounded-xl border border-glass-border font-mono text-sm w-full max-w-sm group">
      <code className="text-gray-300">{command}</code>
      <button 
        onClick={copyCommand} 
        className="text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
        title="Copiar comando"
      >
        <Clipboard className="w-5 h-5" />
      </button>
    </div>
  );
}
