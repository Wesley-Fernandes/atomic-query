import { Link } from 'react-router-dom';
import { GitFork, Atom, BookOpen } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full h-20 z-50 bg-bg/80 backdrop-blur-md border-b border-glass-border flex items-center">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <Atom className="text-primary w-8 h-8" />
          <span>Atomic Query</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/docs" className="flex items-center gap-2 hover:text-accent transition-colors">
            <BookOpen className="w-5 h-5" />
            Docs
          </Link>
          <a
            href="https://github.com/Wesley-Fernandes/atomic-query"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <GitFork className="w-5 h-5" />
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
