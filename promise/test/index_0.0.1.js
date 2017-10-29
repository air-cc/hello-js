// var Promise = require('../src/index_0.0.1')
// var assert = require('assert')

// // - resolve 基本使用
// new Promise(function (resolve, reject) {
//   setTimeout(resolve, 10, 'hello-world')
// }).then(function (result) {
//   console.log('get a result', result)
// }, function (error) {
//   console.log('catch an error', error)
// });

// // - reject 基本使用
// new Promise(function (resolve, reject) {
//   setTimeout(reject, 10, 'hello-world')
// }).then(function (result) {
//   console.log('get a result', result)
// }, function (error) {
//   console.log('get an error', error)
// });

// // - catch 基本使用
// new Promise(function (resolve, reject) {
//   setTimeout(reject, 10, 'hello-world')
// }).then(function (result) {
//   console.log('get a result', result)
// }).catch((error) => {
//   console.log('catch an error', error)
// });

// // - 确保每次 then 的结果是相同的
// const p = new Promise((resolve) => {
//   setTimeout(() => resolve(Date.now()), 1)
// })

// const handler = (ret) => {
//   const now = Date.now()
//   console.log(now, ret)
//   return now
// }
// setTimeout(() => {
//   p.then(handler)
// }, 1000)

// p.then(handler)

// // promise then 只能被调用一次
// const p1 = new Promise((resolve) => {
//   const now = Date.now()
//   console.log('promise then once 1.', now)
//   resolve(now)

//   setTimeout(() => {
//     const now = Date.now()
//     console.log('promise then once .', now)
//     resolve(now)
//   }, 1000)
// })

// p1.then(x => console.log('promise then once  hi~', x))

// // then 处理函数的执行环境
// const pEnv = new Promise((resolve) => resolve('this is global'))
// pEnv.then(function (x) {
//   console.log(x, this === global)   // this is global true
// })

// // BUG: onFulfilled onRejected 需异步执行
// const pAsync1 = new Promise((resolve) => resolve('async execute'))
// pAsync1.then(console.log)
// console.log('sync execute')