import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const isWatching = !!process.env.ROLLUP_WATCH;
const sdPlugin = "com.marshallb.xeneon-edge-power.sdPlugin";

function copyFile(source, destination) {
	fs.mkdirSync(path.dirname(destination), {
		recursive: true,
	});

	fs.copyFileSync(source, destination);
}

function copyNativeDependencies() {
	const destinationNodeModules = path.resolve(
		sdPlugin,
		"node_modules"
	);

	fs.rmSync(destinationNodeModules, {
		recursive: true,
		force: true,
	});

	fs.mkdirSync(destinationNodeModules, {
		recursive: true,
	});

	// @hensm/ddcci
	copyFile(
		path.resolve(
			"node_modules",
			"@hensm",
			"ddcci",
			"index.js"
		),
		path.resolve(
			destinationNodeModules,
			"@hensm",
			"ddcci",
			"index.js"
		)
	);

	copyFile(
		path.resolve(
			"node_modules",
			"@hensm",
			"ddcci",
			"package.json"
		),
		path.resolve(
			destinationNodeModules,
			"@hensm",
			"ddcci",
			"package.json"
		)
	);

	copyFile(
		path.resolve(
			"node_modules",
			"@hensm",
			"ddcci",
			"build",
			"Release",
			"ddcci.node"
		),
		path.resolve(
			destinationNodeModules,
			"@hensm",
			"ddcci",
			"build",
			"Release",
			"ddcci.node"
		)
	);

	// bindings
	copyFile(
		path.resolve(
			"node_modules",
			"bindings",
			"bindings.js"
		),
		path.resolve(
			destinationNodeModules,
			"bindings",
			"bindings.js"
		)
	);

	copyFile(
		path.resolve(
			"node_modules",
			"bindings",
			"package.json"
		),
		path.resolve(
			destinationNodeModules,
			"bindings",
			"package.json"
		)
	);

	// file-uri-to-path
	copyFile(
		path.resolve(
			"node_modules",
			"file-uri-to-path",
			"index.js"
		),
		path.resolve(
			destinationNodeModules,
			"file-uri-to-path",
			"index.js"
		)
	);

	copyFile(
		path.resolve(
			"node_modules",
			"file-uri-to-path",
			"package.json"
		),
		path.resolve(
			destinationNodeModules,
			"file-uri-to-path",
			"package.json"
		)
	);
}

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: "src/plugin.ts",

	output: {
		file: `${sdPlugin}/bin/plugin.js`,
		sourcemap: isWatching,

		sourcemapPathTransform: (
			relativeSourcePath,
			sourcemapPath
		) => {
			return url
				.pathToFileURL(
					path.resolve(
						path.dirname(sourcemapPath),
						relativeSourcePath
					)
				)
				.href;
		},
	},

	plugins: [
		{
			name: "watch-externals",

			buildStart() {
				this.addWatchFile(
					`${sdPlugin}/manifest.json`
				);
			},
		},

		typescript({
			mapRoot: isWatching
				? "./"
				: undefined,
		}),

		nodeResolve({
			browser: false,
			exportConditions: ["node"],
			preferBuiltins: true,
		}),

		commonjs(),

		!isWatching && terser(),

		{
			name: "emit-module-package-file",

			generateBundle() {
				this.emitFile({
					fileName: "package.json",
					source: `{ "type": "module" }`,
					type: "asset",
				});
			},
		},

		{
			name: "copy-ddcci-native-dependencies",

			writeBundle() {
				copyNativeDependencies();
			},
		},
	],
};

export default config;