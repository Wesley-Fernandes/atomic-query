import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ChevronRight, Book, Shield, Database, Radio, Layout, Zap, Edit3, Trash2, RotateCcw, Settings, HardDrive, Rocket, RefreshCcw, Layers } from 'lucide-react';

// Core Docs
import Introduction from './docs/Introduction';
import Security from './docs/Security';
import Caching from './docs/Caching';
import Streaming from './docs/Streaming';
import Middlewares from './docs/Middlewares';
import Stores from './docs/Stores';
import Advanced from './docs/Advanced';
import BigData from './docs/BigData';

// React Docs
import ReactDoc from './docs/React';
import ReactInvalidate from './docs/ReactInvalidate';
import ReactUpdate from './docs/ReactUpdate';
import ReactDelete from './docs/ReactDelete';
import ReactRevalidate from './docs/ReactRevalidate';
import ReactMiddlewares from './docs/ReactMiddlewares';

export default function Docs() {
  const location = useLocation();

  const coreItems = [
    { name: 'Introdução', path: '/docs', icon: <Book className="w-4 h-4" /> },
    { name: 'Middlewares', path: '/docs/middlewares', icon: <Settings className="w-4 h-4" /> },
    { name: 'Cache & Persistência', path: '/docs/caching', icon: <Database className="w-4 h-4" /> },
    { name: 'Cache Stores', path: '/docs/stores', icon: <HardDrive className="w-4 h-4" /> },
    { name: 'Big Data (GBs)', path: '/docs/big-data', icon: <Database className="w-4 h-4 text-accent" /> },
    { name: 'Streaming & SSE', path: '/docs/sse', icon: <Radio className="w-4 h-4" /> },
    { name: 'Segurança', path: '/docs/security', icon: <Shield className="w-4 h-4" /> },
    { name: 'Uso Avançado', path: '/docs/advanced', icon: <Rocket className="w-4 h-4" /> },
  ];

  const reactItems = [
    { name: 'Hook useAtom', path: '/docs/react', icon: <Zap className="w-4 h-4" /> },
    { name: 'Injetando Middlewares', path: '/docs/react-middlewares', icon: <Layers className="w-4 h-4" /> },
    { name: 'Invalidate', path: '/docs/react-invalidate', icon: <RefreshCcw className="w-4 h-4" /> },
    { name: 'Update (setData)', path: '/docs/react-update', icon: <Edit3 className="w-4 h-4" /> },
    { name: 'Delete (remove)', path: '/docs/react-delete', icon: <Trash2 className="w-4 h-4" /> },
    { name: 'Revalidate (refetch)', path: '/docs/react-revalidate', icon: <RotateCcw className="w-4 h-4" /> },
  ];

  return (
    <div className="pt-20 min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 border-r border-glass-border p-6 space-y-8 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] overflow-y-auto bg-bg">
        
        {/* Core Section */}
        <div>
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 px-3 flex items-center gap-2">
            <Layout className="w-3 h-3" /> Motor Core
          </h4>
          <nav className="space-y-1">
            {coreItems.map((item) => (
              <SidebarItem key={item.path} item={item} active={location.pathname === item.path} />
            ))}
          </nav>
        </div>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-glass-border to-transparent mx-3"></div>

        {/* React Section */}
        <div>
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 px-3 flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary" /> React Integration
          </h4>
          <nav className="space-y-1">
            {reactItems.map((item) => (
              <SidebarItem key={item.path} item={item} active={location.pathname === item.path} />
            ))}
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-4xl mx-auto p-8 lg:p-16">
          <Routes>
            <Route index element={<Introduction />} />
            <Route path="middlewares" element={<Middlewares />} />
            <Route path="caching" element={<Caching />} />
            <Route path="stores" element={<Stores />} />
            <Route path="big-data" element={<BigData />} />
            <Route path="sse" element={<Streaming />} />
            <Route path="security" element={<Security />} />
            <Route path="advanced" element={<Advanced />} />
            
            {/* React Routes */}
            <Route path="react" element={<ReactDoc />} />
            <Route path="react-middlewares" element={<ReactMiddlewares />} />
            <Route path="react-invalidate" element={<ReactInvalidate />} />
            <Route path="react-update" element={<ReactUpdate />} />
            <Route path="react-delete" element={<ReactDelete />} />
            <Route path="react-revalidate" element={<ReactRevalidate />} />

            <Route path="*" element={
              <div className="py-20 text-center">
                <h2 className="text-2xl font-bold mb-2">Página em Construção</h2>
                <Link to="/docs" className="text-primary hover:underline">Voltar para a Introdução</Link>
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ item, active }: { item: any, active: boolean }) {
  return (
    <Link
      to={item.path}
      className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-primary/15 text-primary border border-primary/20' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'}`}>
          {item.icon}
        </span>
        <span className="text-sm font-medium">{item.name}</span>
      </div>
      {active && <ChevronRight className="w-3 h-3" />}
    </Link>
  );
}
