/* eslint-disable sort-imports */
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import cloneDeep from 'lodash/cloneDeep';
import commandLineArgs from 'command-line-args';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import StatsPlugin from 'stats-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import _ from 'lodash';
import path from 'path';
import webpackBaseConfig from './webpackBaseConfig';

const baseDir = process.cwd();

const optionDefinitions = [
    { name: 'analyze', type: Boolean, defaultValue: false },
    { name: 'stats', type: Boolean, defaultValue: false }
];
const options = commandLineArgs(optionDefinitions);
const baseConfig = cloneDeep(webpackBaseConfig);
const plugins = [
    new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash:6].css',
        chunkFilename: 'styles/[name].[contenthash:6].css'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [path.join(baseDir, 'build')]
    })
];

if (options.analyze) {
    plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: '8888',
            openAnalyzer: false
        })
    );
}

if (options.stats) {
    plugins.push(new StatsPlugin('stats.json', { chunkModules: true }));
}

let finalConfig = baseConfig;

// Merge common configuration
finalConfig = webpackMerge(finalConfig, {
    output: {
        filename: 'scripts/[name].[chunkhash:6].js',
        chunkFilename: 'scripts/[name].[chunkhash:6].js'
    },
    parallelism: 1,
    profile: options.stats,
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
});

// Merge plugins
finalConfig = webpackMerge({
    customizeArray(a, b, key) {
        if (key === 'plugins') {
            return _.uniqBy(
                [...b, ...a],
                plugin => plugin.constructor || plugin.constructor.name
            );
        }

        return undefined;
    }
})(finalConfig, { plugins });

// Merge loaders
finalConfig = webpackMerge.smart(finalConfig, {
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?(#\S*)?$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: 'styles/fonts/[name].[hash:6].[ext]'
                }
            },
            {
                test: /\.(png|jp(e)?g|gif)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[hash:6].[ext]'
                }
            }
        ]
    }
});

export default finalConfig;
