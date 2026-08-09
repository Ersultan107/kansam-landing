import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // ВАЖНО: имя должно точно совпадать с названием репозитория на GitHub.
  // Если репозиторий называется иначе, поменяйте строку ниже на '/имя-репозитория/'.
  base: '/kansam-landing/',
  plugins: [react(), tailwindcss()],
})
