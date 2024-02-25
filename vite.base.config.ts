import { defineConfig } from 'vite';
import { resolve } from 'path';
import dtsPlugin from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

const PWD = process.env.PWD as string;
const entry = resolve(PWD, 'src/index.ts')

export default defineConfig({
	build: {
		outDir: 'build',
		lib: {
			fileName: 'index',
			entry,
			formats: ['es']
		},
        rollupOptions: {
            plugins: [
            ]
        }
	},
	plugins: [
        tsconfigPaths(),
		dtsPlugin({
			outDir: 'build',
			rollupTypes: true
		})
	],
});