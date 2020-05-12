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
    filename:'app.js',//输出文件名字
    path:path.resolve(__dirname,'dist/js')
  },
  mode:'development' //工作模式
}