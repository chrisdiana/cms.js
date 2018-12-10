import resolve from 'rollup-plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';

const { name, version, license, author, homepage } = require('./package.json');
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
    output: {
    file: production ? 'dist/cms.min.js' : 'dist/cms.js',
    name: 'CMS',
    format: 'iife',
    banner: `/*! ${name} v${version} | ${license} (c) ${new Date().getFullYear()} ${author.name} | ${homepage} */`,
  },
  plugins: [
    eslint(),
    !production && livereload(),
    resolve(),
    babel({ exclude: 'node_modules/**' }),
    production && uglify({ output: { comments: /^!/ } })
  ],
};
