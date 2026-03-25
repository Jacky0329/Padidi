import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@padidi/shared': fileURLToPath(new URL('../../packages/shared/src', import.meta.url)),
        },
    },
    server: {
        host: '127.0.0.1',
        port: 5174,
        proxy: {
            '/api': {
                target: 'http://localhost:5029',
                changeOrigin: true,
            },
            '/uploads': {
                target: 'http://localhost:5029',
                changeOrigin: true,
            },
        },
    },
});
