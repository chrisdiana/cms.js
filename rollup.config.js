import resolve from 'rollup-plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';
import commonjs from '@rollup/plugin-commonjs';

const { name, version, license, author, homepage } = require('./package.json');
const production = !process.env.ROLLUP_WATCH;
const banner = `/*! ${name} v${version} | ${license} (c) ${new Date().getFullYear()} ${author.name} | ${homepage} */`;

const outputs = [];

if(production) {
  outputs.push({
    file: 'dist/cms.min.js',
    name: 'CMS',
    format: 'iife',
    banner: banner,
    plugins: [
      uglify({ output: { comments: /^!/ } }),
    ],
  });
  outputs.push({
    file: 'dist/cms.js',
    name: 'CMS',
    format: 'iife',
    banner: banner,
  });
  outputs.push({
    file: 'dist/cms.es.js',
    name: 'CMS',
    format: 'es',
    banner: banner,
  });
} else {
  outputs.push({
    file: 'examples/js/cms.js',
    name: 'CMS',
    format: 'iife',
    banner: banner,
  });
}

export default {
    input: 'src/main.js',
		external: ['CMS'],
    output: outputs,
    plugins: [
      eslint(),
      !production && livereload(),
      resolve(),
			commonjs(),
      babel({ exclude: 'node_modules/**' }),
    ],
};
