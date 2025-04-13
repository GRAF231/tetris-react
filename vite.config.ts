import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    build: {
        outDir: 'dist',
        minify: 'terser',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'styled-components']
                }
            }
        }
    },
    server: {
        port: 3000,
        strictPort: true,
        open: true
    },
    preview: {
        port: 8080
    }
})
