import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables from the correct .env file
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    base: '/',

    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
        env.VITE_BACKEND_URL || 'https://personal-photomap-backend.onrender.com'
      ),
    },

    server: {
      port: env.VITE_PORT || 5173,
      host: true,
      watch: {
        usePolling: true,
      },
    },

    optimizeDeps: {
      include: ['@tanstack/react-query'], // Ensures it's bundled properly
    },

    build: {
      outDir: 'dist',
    },
  };
});
