import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'logo.png', 'robots.txt'],
        manifest: {
          name: 'Photomap',
          short_name: 'Photomap',
          description: 'Track your travel memories around the world!',
          theme_color: '#006d77',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
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
    build: {
      outDir: 'dist',
    },
  };
});
