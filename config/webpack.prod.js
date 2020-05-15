//引入html-webpack-plugin插件，用于生成html，并且资源自动引入
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //清空文件打包目录
const MiniCssExtractPlugin = require("mini-css-extract-plugin");	 //将css提取成单独文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');	 //压缩css
//引入path模块，专门用于解决路径相关的问题
const path = require('path');
/* 
 1.module.exports暴露的是一个对象
 2.该对象是webpack重要的配置对象
 3.webpack的入口，输出位置，工作模式，loader，plugins均要在该对象里指定好
*/
module.exports = {
  entry: ['./src/js/app.js','./src/index.html'], //配置入口
  output:{
    filename:'js/app.js',//输出文件名字
    path:path.resolve(__dirname,'../dist'),
  },
  mode:'production', //工作模式
  //module是一个配置对象，对象里面有一个rules属性
  module:{ //rules专门用于指定一个个loader
    rules:[
    //将less编译成sytle标签 
      {
        test:/\.less$/, //匹配所有less文件
        use:[
          MiniCssExtractPlugin.loader, //将css提取成为单独文件
          'css-loader', //将css翻译成commonjs的模块
          {   //处理css兼容性问题
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
                require('postcss-normalize')(),
              ],
              sourceMap: true,
            },
          },
          'less-loader', //将less翻译成css
        ]
      },
    //使用eslint-loader对js进行语法检查
      {
       test:/\.js$/, //匹配所有js文件
       exclude:/node_modules/, //排除node_modules文件
       loader:'eslint-loader',
      },
    //使用babel-loader配合core-js和polyfill对js进行语法转换及兼容性处理
      {
       test: /\.js$/,
       exclude: /node_modules/, 
       use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                '@babel/preset-env', //开启babel解析环境
                {
                  useBuiltIns: 'usage',  // 按需引入(需要使用polyfill)
                  corejs: { version: 3 }, // 解决warning警告
                  targets: { // 指定兼容性处理哪些浏览器
                    "chrome": "58",
                    "ie": "9",
                  }
                }
              ]
            ],
            cacheDirectory: true, // 开启babel缓存
          }
        }       
      },
    //使用url-loader处理less文件中的图片
      {
      test: /\.(png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          outputPath:'imgs', //输出路径
          name:'[hash:5].[ext]', //文件命名格式
          publicPath:'../imgs', //加载图片时候的路径
          limit:8192, //图片小于8kb就做 base64的转换
          esModule:false //避免img标签中src属性变为[object Module]
        }
      }
      },
    //使用html-loader处理html文件中img标签
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      },
    //使用file-loader处理其他资源
      {
        test: /\.(eot|svg|woff|woff2|ttf|mp3|mp4|avi)$/,  // 处理其他资源
        loader: 'file-loader',
        options: {
          outputPath: 'font',
          name: '[hash:5].[ext]'
        }
      }
    ]
  },
  //plugins里配置所有需要的插件，并且需要new
  plugins:[
    //new一个htmlwebpackplugin的实例
    new HtmlWebpackPlugin({
      template:'./src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),
    //清空打包目录
    new CleanWebpackPlugin (),
    //提取css文件为单独文件
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    //压缩css
    new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      cssProcessorOptions: { // 解决没有source map问题
        map: {
          inline: false,
          annotation: true,
        }
      }
    })
  ],
  devServer: {
    open: true, // 自动打开浏览器
    compress: true, // 启动gzip压缩
    port: 3000, // 端口号
    hot:true //开启热模替换功能
  },
  //资源映射
  devtool:'cheap-module-eval-source-map'
}