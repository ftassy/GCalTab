const path = require('path');

module.exports = {
    mode: "production",
    target: "web",
    entry: './src/js/gcaltab.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'src/js'),
    },
}; 