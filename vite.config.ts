import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/-/',
  plugins: [react(), tailwindcss()],
  // Lanyard 组件需要导入 .glb 3D 模型，默认不处理该扩展名，需显式声明为静态资源
  assetsInclude: ['**/*.glb'],
})
