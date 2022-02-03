import {
    defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require("path");
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "crypto": "crypto-browserify",
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                }),
            ]
        }
    },
    publicDir: 'assets'

})