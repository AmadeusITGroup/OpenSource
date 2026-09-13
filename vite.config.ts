import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        presentation: 'presentation.html',
        'presentation-short': 'presentation-short.html',
      },
    },
  },
})
