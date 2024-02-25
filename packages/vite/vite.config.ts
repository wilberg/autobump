import { defineConfig } from 'vite';
import { resolve } from 'path';
import dtsPlugin from 'vite-plugin-dts';
import {} from '@tagup/compiler';

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
		}),
		{
			name: "My name",
			transform(code, id) {
				if (id.split('/').pop()?.split('.').pop() === "tu") {
					return `export default ${compile(code, JSAdapter)}`;
				}
			}
		}
	]
});