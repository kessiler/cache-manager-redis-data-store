import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const pkg = require('./package.json')

export default {
    input: pkg.input,
    output: [
        { file: pkg.main, format: 'cjs', sourcemap: true },
        { file: pkg.module, format: 'es', sourcemap: true },
    ],
    external: [],
    watch: {
        include: 'src/**',
    },
    plugins: [
        peerDepsExternal(),
        typescript({ useTsconfigDeclarationDir: true }),
        commonjs(),
        resolve(),
    ],
}
