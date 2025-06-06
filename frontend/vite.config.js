import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  css: {
    devSourcemap: true
  },
  build: {
    sourcemap: true  
  },
  plugins: [
    react(),
  ], 
  server: {
    port: process.env.PORT || 5173  
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  }
});
