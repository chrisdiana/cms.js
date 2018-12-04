import resolve from 'rollup-plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';


const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
    file: 'dist/cms.js',
    name: 'CMS',
    format: 'iife',
	},
	plugins: [
		resolve(),
    eslint(),
    babel({ exclude: 'node_modules/**' }),
    livereload(),
		production && uglify()
	]
};
