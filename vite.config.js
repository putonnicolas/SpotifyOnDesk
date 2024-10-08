import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig({
  server: {port: 4000, host:  true},
  plugins: [
    react(),
    glsl({
      include: /\.(glsl|vs|fs|vert|frag)$/,
    })  
  ],
})
