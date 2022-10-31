import {
    defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        alias: {
            "@": path.resolve(__dirname, "/src"),
            process: "process/browser",
            stream: "stream-browserify",
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis',
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin()
            ]
        }
    },
    publicDir: 'assets'

})