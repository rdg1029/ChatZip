const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {test: /\.ts|\.tsx$/, use: 'ts-loader'},
        ],
    },
    resolve: {
        extensions: [
            '.tsx', '.ts', '.js',
        ],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
