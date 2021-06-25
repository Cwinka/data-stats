const path = require( 'path' );
const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const DotEnvPlugin = require('dotenv-webpack');

const mode = process.env.MODE || 'production'

module.exports = {
    mode: mode,
    entry: ['./src/index.prod.js'],

    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'build/[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.style\.css$/,
                use: [ MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[sha1:hash:hex:7]'
                            }
                        }
                    },
                ]
            },
            {
                test: /^((?!\.style).)*css$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },

    plugins: [

        // extract css to external stylesheet file
        new MiniCssExtractPlugin( {
            filename: 'build/[name].css'
        } ),

        // prepare HTML file with assets
        new HTMLWebpackPlugin( {
            filename: 'index.html',
            template: path.resolve( __dirname, 'src/index.html' ),
            minify: false,
        } ),

        // copy static files from `src` to `dist`
        new CopyWebpackPlugin( {
            patterns: [
                {
                    from: path.resolve( __dirname, 'src/assets' ),
                    to: path.resolve( __dirname, 'dist/assets' )
                }
            ]
        } ),
        
        new DotEnvPlugin({path: './.env'})
    
    ],

    // resolve files configuration
    resolve: {
        extensions: ['.js', '.jsx'],
    },

    // webpack optimizations
    optimization: {
        splitChunks: {
            minSize: 100000,
            maxSize: 500000,
            cacheGroups: {
                vendors: {
                    name: 'chunk-vendors', // name of chunk file
                    chunks: 'initial', // both : consider sync + async chunks for evaluation
                    test: /node_modules/, // test regular expression
                    priority: -10
                },
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    chunks: 'initial',
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
    },

    performance: {
        hints: false,
    },
    stats: {
        children: true
    },
    
    // generate source map
    devtool: mode === "production" ? false : 'source-map'

};