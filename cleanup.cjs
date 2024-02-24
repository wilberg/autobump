const { resolve } = require('path');
const { readFile, writeFile, mkdir } = require('fs/promises');
const { render } = require('mustache');

(async () => {
	// Get the current path and package.json
	const currentPath = process.cwd();
	try {
		const packageJson = require(resolve(currentPath, 'package.json'));

		const publishConfig = packageJson.publishConfig;

		if (publishConfig == null) {
			console.error('publishConfig not defined in package.json');
			return;
		}

		if (publishConfig.directory == null) {
			console.error('publishConfig.directory not defined in package.json');
			return;
		}

		if (publishConfig.template == null) {
			console.error('publishConfig.template not defined in package.json');
			return;
		}

		const templatePath = resolve(__dirname, '.templates', publishConfig.template + '.mustache');
		const template = await readFile(templatePath, 'utf-8');

		if (template == null) {
			console.error('Could not find template file.');
			return;
		}

		const data = publishConfig.data;
		const output = render(template, {
			package: packageJson,
			data
		});
		await mkdir(resolve(currentPath, publishConfig.directory), { recursive: true });
		await writeFile(resolve(currentPath, publishConfig.directory, 'package.json'), output);
	} catch (e) {
		console.error('Could not find files.');
		console.error(e);
	}
})();