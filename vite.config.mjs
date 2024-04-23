import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'
import { fileURLToPath, URL } from 'url'
import path from 'path'

const apiUrl = process.env.RI_SERVER_TLS_CERT && process.env.RI_SERVER_TLS_KEY
  ? 'https://localhost'
  : 'http://localhost'

const alias = {
  lodash: 'lodash-es',
  '@elastic/eui$': '@elastic/eui/optimize/lib',
  uiSrc: fileURLToPath(new URL('./redisinsight/ui/src', import.meta.url)),
  apiSrc: fileURLToPath(new URL('./redisinsight/api/src', import.meta.url)),
  src: fileURLToPath(new URL('./redisinsight/api/src', import.meta.url)),
  desktopSrc: fileURLToPath(new URL('./redisinsight/desktop/src', import.meta.url)),
}

export default defineConfig({
  plugins: [
    react(),
    svgr({ include: ['**/*.svg?react'] }),
    electron({
      main: {
        // entry: path.join(webpackPaths.desktopPath, 'index.ts'),
        entry: './redisinsight/desktop/index.ts',
        vite: {
          resolve: {
            alias,
          },
          build: {
            rollupOptions: {
              external: ['sqlite3', 'tunnel-ssh', 'keytar'],
            },
          },
        },
      },
      preload: {
        entry: './redisinsight/desktop/preload.ts',
        vite: {
          resolve: {
            alias,
          },
        },
      },
    }),
  ],
  resolve: {
    alias,
  },
  optimizeDeps: {
    esbuildOptions: {
      // fix for https://github.com/bvaughn/react-virtualized/issues/1722
      plugins: [fixReactVirtualized],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // add @layer app for css ordering. Styles without layer have the highest priority
        // https://github.com/vitejs/vite/issues/3924
        additionalData: (source, filename) => {
          if (path.extname(filename) === '.scss') {
            const skipFiles = ['/main.scss', '/App.scss']
            if (skipFiles.every((file) => !filename.endsWith(file))) {
              return `
                @use "uiSrc/styles/mixins/_eui.scss";
                @use "uiSrc/styles/mixins/_global.scss";
                @layer app { ${source} }
              `
            }
          }
          return source
        },
      },
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {
      RI_API_PREFIX: 'api',
      RI_APP_PORT: '5540',
      RI_BASE_API_URL: apiUrl,
      RI_RESOURCES_BASE_URL: apiUrl,
      RI_PIPELINE_COUNT_DEFAULT: '5',
      RI_SCAN_COUNT_DEFAULT: '500',
      RI_SCAN_TREE_COUNT_DEFAULT: '10000',
      RI_APP_TYPE: process.env.RI_APP_TYPE,
      RI_CONNECTIONS_TIMEOUT_DEFAULT: 30 * 1000,
    },
  },
})
