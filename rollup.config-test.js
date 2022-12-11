import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
export default [
  {
    input: 'src/test/index.test.js',
    output: {
      file: 'src/test/dist/Sv-test.js',
      format: 'es',          //五种输出格式：amd /  es6 / iife / umd / cjs
      sourcemap:true          //生成bundle.map.js文件，方便调试
    },
    plugins: [
        resolve(),
        babel({ babelHelpers: 'bundled' })
      ]
  }
];