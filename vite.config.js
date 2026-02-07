import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // 确保 Element Plus 图标组件被正确识别
                    isCustomElement: (tag) => false
                }
            }
        })
    ],
    base: './',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    optimizeDeps: {
        include: ['element-plus', '@element-plus/icons-vue']
    },
    server: {
        host: 'localhost',
        port: 5175,
        strictPort: false
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                manualChunks: {
                    'vue-vendor': ['vue', 'vue-router', 'pinia'],
                    'element-plus': ['element-plus'],
                    'editor': ['@toast-ui/editor', 'marked']
                }
            }
        }
    }
})
