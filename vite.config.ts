import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }) => ({
  // Для GitHub Pages сайт расположен по адресу /discard/.
  // В режиме разработки Vite продолжает открываться с корня localhost.
  base: command === 'build' ? '/discard/' : '/',
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
}))
