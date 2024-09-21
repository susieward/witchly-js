import path from "node:path"
import { defineConfig, transformWithEsbuild } from 'vite'

export default defineConfig({
  server: {
    port: '8080',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [
    {
      name: 'transform-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
          jsxImportSource: 'witchly',
          keepNames: true
        })
      }
    }
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  }
})