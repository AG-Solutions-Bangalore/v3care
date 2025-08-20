import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    viteCompression({
      verbose: true,      
      disable: false,     
      threshold: 10240,   
      algorithm: 'gzip',  
      ext: '.gz',         
    }),
  ],
  build: {
    minify: 'terser', 
    terserOptions: {
      compress: {
        drop_console: true,   
        drop_debugger: true   
      }
    }
  }
})
