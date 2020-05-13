//引入html-webpack-plugin插件，用于生成html，并且资源自动引入
const HtmlWebpackPlugin = require('html-webpack-plugin')
//引入path模块，专门用于解决路径相关的问题
const path = require('path');
/* 
 1.module.exports暴露的是一个对象
 2.该对象是webpack重要的配置对象
 3.webpack的入口，输出位置，工作模式，loader，plugins均要在该对象里指定好
*/
module.exports = {
  entry:'./src/js/app.js',
  output:{
    filename:'js/app.js',//输出文件名字
    path:path.resolve(__dirname,'dist')
  },
  mode:'development', //工作模式
  //module是一个配置对象，对象里面有一个rules属性
  module:{ //rules专门用于指定一个个loader
    rules:[
      //将less编译成sytle标签 
      {
        test:/\.less$/, //匹配所有less文件
        use:[
          {loader:"style-loader"},//将commonjs的模块翻译成sytle标签
          {loader:"css-loader"}, //将css翻译成commonjs的一个模块(内存)
          {loader:"less-loader"} //将less翻译成css(内存)
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
     //使用file-loader处理less文件中的图片
      {
      test: /\.(png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          outputPath:'/imgs', //输出路径
          name:'[hash:5].[ext]', //文件命名格式
          publicPath:'/dist/imgs', //加载图片时候的路径
          limit:8192 //图片小于8kb就做 base64的转换
        }
      }
      }
    ]
  },
  //plugins里配置所有需要的插件，并且需要new
  plugins:[
    //new一个htmlwebpackplugin的实例
    new HtmlWebpackPlugin({
      template:'./src/index.html'
    })
  ]
}