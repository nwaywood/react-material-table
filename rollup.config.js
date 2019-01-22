// rollup.config.js

import typescript from 'typescript'
import typescriptPlugin from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import resolve from 'rollup-plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import babel from 'rollup-plugin-babel'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import svg from 'rollup-plugin-svg'
import replace from 'rollup-plugin-replace'
import html from 'rollup-plugin-fill-html'
import pkg from './package.json'
const dev = 'development'
const prod = 'production'
const input = './src/index.tsx'
const replacements = [{ original: 'lodash', replacement: 'lodash-es' }]
const nodeEnv = parseNodeEnv(process.env.NODE_ENV)

const babelOptions = {
    exclude: 'node_modules/**',
    presets: ['@babel/env', '@babel/react', '@babel/typescript'],
    plugins: [
        'annotate-pure-calls',
        'dev-expression',
        ['transform-rename-import', { replacements }],
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
}

function parseNodeEnv(nodeEnv) {
    if (nodeEnv === prod || nodeEnv === dev) {
        return nodeEnv
    }
    return dev
}

const plugins = [
    replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        include: ['node_modules/**'],
        exclude: ['node_modules/process-es6/**'],
        namedExports: {
            'node_modules/react/index.js': [
                'Component',
                'PureComponent',
                'Fragment',
                'Children',
                'createElement',
                'useState',
                'createContext',
                'forwardRef',
            ],
            'node_modules/react-dom/index.js': ['render'],
        },
    }),
    typescriptPlugin({
        // The current rollup-plugin-typescript includes an old version of typescript, so we import and pass our own version
        typescript,
        // rollup-plugin-typescript will inject some typescript helpers to your files (normally tsc will
        // do this). They however have some ES6 keywords like const so they break older browsers.
        // This instructs rollup-plugin-typescript to import tslib instead, which includes the same helpers
        // in proper format.
        importHelpers: true,
        tsconfig: 'tsconfig.json',
    }),
    html({
        template: 'src/index.html',
        filename: 'index.html',
    }),
    babel(babelOptions),
    svg(),

    sourceMaps(),
]


if (nodeEnv === dev) {
    // For playing around with just frontend code the serve plugin is pretty nice.
    // We removed it when we started doing actual backend work.
    plugins.push(
        serve('dist', {
            port: 3000,
            historyApiFallback: true,
        })
    )
    plugins.push(livereload())
}
const buildUmd = ({ env }) => ({
    input,
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
        },
    ],
    plugins,
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
})

export default [
    // buildUmd({ env: 'production' }),
    // buildUmd({ env: 'development' }),
    {
        input,
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: pkg.module,
                format: 'es',
                sourcemap: true,
            },
        ],
        plugins,
    },
]
