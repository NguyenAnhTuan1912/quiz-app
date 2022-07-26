const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/client/index.js',
    output: {
        path: path.resolve(__dirname, 'dist', 'static', 'client'),
        filename: 'bundle.js'
    }
}

// module.exports = [
//     {
//         mode: 'development',
//         devtool: 'eval-source-map',
//         name: 'server',
//         entry: './basic-server.js',
//         target: 'node',
//         output: {
//             path: path.resolve(__dirname, 'dist', 'static', 'server'),
//             filename: 'bundle.js',
//         },
//     },
//     {
//         mode: 'development',
//         devtool: 'eval-source-map',
//         name: 'client',
//         entry: './src/client/index.js',
//         // target: 'web', // by default
//         output: {
//             path: path.resolve(__dirname, 'dist', 'static', 'client'),
//             filename: 'bundle.js',
//         },
//     }
// ];