import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom'],
    injectStyle: true,
    esbuildOptions(options) {
        options.loader = {
            ...options.loader,
            '.css': 'css',
        };
    },
    async onSuccess() {
        console.log('Build completed successfully!');
    },
}); 