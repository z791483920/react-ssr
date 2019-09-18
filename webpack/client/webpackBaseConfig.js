/* eslint-disable global-require */
import path from 'path';
import process from 'process';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import postcssPresetEnv from 'postcss-preset-env';

const __IS_DEV__ = process.env.NODE_ENV === 'development';

const GLOBALS = {
    __IS_DEV__,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    __RELEASE__: JSON.stringify(process.env.RELEASE),
    __IS_NODE__: false
};

const SUPPORT_BROWSERS = [
    '>1%',
    'last 4 versions',
    'Firefox ESR',
    'Android 4.4',
    'ios 8',
    'not ie < 9' // React doesn't support IE8 anyway
];

const env = process.env.NODE_ENV;
const root = process.cwd();
const baseDir = process.cwd();

const vendors = ['lodash'];

const entryFormat = (url) => {
    if (__IS_DEV__) {
        return [url, 'webpack-hot-middleware/client'];
    }
    return url;
};
export default {
    target: 'web',
    context: baseDir,
    entry: {
        index: entryFormat(path.resolve(baseDir, 'client/index.js'))
    },
    output: {
        path: path.join(baseDir, 'build'),
        publicPath: '/',
        filename: 'scripts/[name].js',
        chunkFilename: 'scripts/[name].js'
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            // chunks: 'all',
            cacheGroups: {
                vendors: {
                    chunks: 'initial',
                    test: new RegExp(vendors.join('|')),
                    name: 'vendors',
                    priority: 10,
                    enforce: true
                },
                default: {
                    minChunks: 2,
                    priority: -10,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin(GLOBALS),
        new ManifestPlugin({
            writeToFileEmit: true,
            fileName: __IS_DEV__
                ? path.join(baseDir, 'server/views/manifest.json')
                : path.join(baseDir, 'build/manifest.json')
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
            chunkFilename: 'styles/[name].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(es6|js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: '.tmp/babel-loader',
                    babelrc: false,
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: false,
                                useBuiltIns: 'usage',
                                corejs: '3',
                                targets: { browsers: SUPPORT_BROWSERS }
                            }
                        ],
                        '@babel/preset-react'
                    ],
                    env: {
                        debug: {
                            sourceMap: 'inline',
                            retainLines: true
                        }
                    },
                    plugins: [
                        ['import', { libraryName: 'antd', style: 'css' }, 'ant'],
                        ['@babel/plugin-syntax-dynamic-import'],
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        ['@babel/plugin-proposal-object-rest-spread'],
                        ['@babel/plugin-transform-modules-commonjs'],
                        ['add-module-exports']
                    ]
                }
            },
            {
                test: /\.css?$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: __IS_DEV__,
                            reloadAll: __IS_DEV__
                        }
                    },
                    // {
                    //     loader: 'isomorphic-style-loader'
                    //     // options: {
                    //     //     hmr: __IS_DEV__
                    //     // }
                    // },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: !__IS_DEV__, modules: false }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !__IS_DEV__,
                            plugins: () => [
                                postcssPresetEnv({ stage: 0 }),
                                require('postcss-flexbugs-fixes')
                            ],
                            flexbox: 'no-2009'
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?(#\S*)?$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: { name: 'styles/fonts/[name].[ext]' }
            },
            {
                test: /\.(png|jp(e)?g|gif)$/,
                loader: 'file-loader',
                options: { name: 'images/[name].[ext]' }
            }
        ]
    },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
    }
};
