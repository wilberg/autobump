import { defineConfig } from 'vite';
import { resolve } from 'path';
import dtsPlugin from 'vite-plugin-dts';

export default defineConfig({
	build: {
		outDir: 'release',
		lib: {
			fileName: 'index',
			entry: resolve(__dirname, './src/index.ts'),
			formats: ['es']
		}
	},
	plugins: [
		dtsPlugin({
			outDir: 'release',
			rollupTypes: true
		})
	]
});