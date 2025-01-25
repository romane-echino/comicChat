const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

module.exports = function override(config, env) {
    // Existing fallbacks
    config.resolve.fallback = {
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "process": require.resolve("process/browser"),
    };
    
    // SSL Configuration
    const sslConfig = {
        https: {
            key: fs.readFileSync(path.join(__dirname, 'certificates/localhost+3-key.pem')),
            cert: fs.readFileSync(path.join(__dirname, 'certificates/localhost+3.pem')),
        }
    };

    config.devServer = { ...config.devServer, ...sslConfig };
    
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ]);

    config.module.rules.push({
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules\/html5-qrcode/,
        use: ['source-map-loader']
    });

    config.module.rules = config.module.rules.map(rule => {
        if (rule.enforce === 'pre' && rule.use && rule.use.some(use => use.loader === 'source-map-loader')) {
            rule.exclude = [
                /node_modules\/html5-qrcode/,
                ...rule.exclude || []
            ];
        }
        return rule;
    });
    
    return config;
};