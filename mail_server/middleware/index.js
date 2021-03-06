/*
 * 自动引入所有middleware
 * 因为考虑到中间件的先后顺序，要手动填写middleware文件名数组
 */

let middlewareArr = [];   // 中间件处理函数数组
// 中间件文件名数组
let middlewareStringArr = [
  'log',
  'errorCatch',
  // 'jwt-parser'
];

// 载入中间件文件，并存放中间件函数
for (let i = 0; i < middlewareStringArr.length; i++) {
  let middleware = require(`./${middlewareStringArr[i]}`);
  middlewareArr.push(middleware);
}

module.exports = function (app) {
  // 载入所有中间件
  middlewareArr.forEach(middleware => {
    app.use(middleware);
  })
}