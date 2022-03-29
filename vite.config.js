import {
    defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require("path");
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'



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
        define: {
            global: 'globalThis'
        },
        esbuildOptions: {
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                }),
            ]
        }
    },
    build: {
        rollupOptions: {
            plugins: [
                // Enable rollup polyfills plugin
                // used during production bundling
                rollupNodePolyFill()
            ]
        }
    },
    publicDir: 'assets'

})