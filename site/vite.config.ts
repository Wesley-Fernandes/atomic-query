import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Usando caminhos relativos para funcionar em qualquer subdiretório do GitHub Pages
  build: {
    outDir: '../client',
    emptyOutDir: true,
  },
});
