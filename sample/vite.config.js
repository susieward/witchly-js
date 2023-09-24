const path = require("path");
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
        })
      },
    },
  ],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  }
})