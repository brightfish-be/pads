import pkg from './package.json';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

export default [
    {
        input: 'src/pads.js',
        output: [
            {file: 'dist/' + pkg.main, format: 'umd', name: pkg.name}
        ],
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