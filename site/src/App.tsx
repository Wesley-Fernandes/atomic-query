import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Docs from './pages/Docs';
import Navbar from './components/Navbar';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" theme="dark" richColors />
      <div className="min-h-screen bg-bg text-white font-body">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs/*" element={<Docs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
