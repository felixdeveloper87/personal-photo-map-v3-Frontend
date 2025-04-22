import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    base: '/',
    server: {
      port: env.VITE_PORT || 5173, 
      host: true,
      watch: {
        usePolling: true, 
      },
    },
    build: {
      outDir: 'dist', 
    },
  };
  
});

