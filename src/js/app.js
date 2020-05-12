//webpack的入口文件，汇总js文件，可以引入less，json等文件
/*
  es6模块化：分别，统一，默认；如何引入，取决该模块如何暴露
 */
//引入模块
import {sum} from './module1'
import {sub} from './module2'
import object from './module3'
import data from './data.json'

console.log(sum(1,2))
console.log(sub(4,2))
console.log(object.mul(1,2))
console.log(object.div(4,2))
console.log(data)