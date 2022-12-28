const path = require('path');
const { node } = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    externals: {
        'fs': 'commonjs fs',
        'path': 'commonjs path'
    }
    // resolve: {
    //     extensions: ['js'],
    //     fallback: { 
    //         // "os": false,
    //         // "util": false,
    //         // "assert": false,
    //         // "https": false,
    //         // "http": false,
    //         // "url": false,
    //         // "querystring": false,
    //         // "fs": false,
    //         // "stream": false,
    //         // "crypto": false,
    //         // "buffer": false,
    //         // "zlib": false,
    //         // "constants": false,
    //         // "path": require.resolve("path-browserify"),
    //         // "tls": false,
    //         // "net": false,
    //         // "http2": false,
    //         // "child_process": false,
    //         // "nock": false,
    //         // "aws-sdk": false,
    //         // "mock-aws-s3": false
    //     }
    // }
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