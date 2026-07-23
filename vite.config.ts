import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      // Due pagine indipendenti e non collegate:
      //   dist/index.html    → / (hub tematico: Il Reale / Il Sapere / L'Agire)
      //   dist/v1/index.html → /v1/ (versione Light storica)
      input: {
        main: path.resolve(__dirname, 'index.html'),
        v1: path.resolve(__dirname, 'v1/index.html'),
      },
    },
  },
});
