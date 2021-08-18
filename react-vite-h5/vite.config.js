import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import styleImport from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), styleImport(
    {
      libs: [
        {
          libraryName: 'zarm',
          esModule: true,
          resolveStyle: name => {
            return `zarm/es/${name}/style/css`
          }
        }
      ]
    }
  )],
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      }
    }
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       // 当遇到 /api 路径时，将其转换成 target 的值
  //       target: 'http://api.chennick.wang/api/',
  //       changeOrigin: true,
  //       rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
  //     }
  //   }
  // }
})
