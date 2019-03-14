import pkg from './package.json';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

export default [
    {
        input: 'src/Pad.js',
        output: [
            {file: pkg.main, format: 'umd', name: 'Pad'}
        ],
        watch: {
            exclude: ['node_modules/**']
        },
        plugins: [
            replace({
                'const': 'var',
                'let': 'var'
            }),
            uglify({
                ecma: 5
            })
        ]
    }
];
