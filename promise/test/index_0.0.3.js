var Promise = require('../src/index_0.0.3')
// global.Promise = Promise

// - base
// const p = new Promise((resolve) => {
//   setTimeout(resolve, 100, 'hi')
// })

// p.then((x) => {
//   console.log('base - resolve - 1', x);
//   return 'this-1'
// })


// - 链式调用
// const p = new Promise((resolve) => {
//   setTimeout(resolve, 100, 'hi')
// })
// setTimeout(() => {
//   const pp = p.then((x) => {
//     console.log('chain - resolve - 2', x);
//     return 'hi-hi'
//   })
//   .then((x) => {
//     console.log('chain - resolve - 2-1', x);
//     return 'hi-hi-hi'
//   })
// }, 1000)
      
// - promise 处于完成态是调用
// const p = new Promise((resolve) => {
//   setTimeout(resolve, 100, 'hi')
// })
// const pp = p.then((x) => {
//   console.log('base - resolve - 1', x);
//   return 'this-1'
// })
// setTimeout(() => {
//   pp.then((x) => {
//     console.log('chain - pp - 3', x)
//   })
// }, 1000)

// - catch error from executor
// const p = new Promise((resolve, reject) => {
//   throw new Error('executor-error')
// })
// p.then(null, (e) => {
//   console.log('then got an error', e);
// })
// p.then().catch((e) => {
//   console.log('catch an error', e)
// })

// - catch error from then / error
// const p = new Promise((resolve, reject) => {
//   resolve('cc')
// })
// p.then(() => {
//   throw new Error('then-error')
// }).catch((e) => {
//   console.log('catch an error', e)
// })

// - then promise
// Promise.resolve('cc').then(()=> {
//   return Promise.resolve('hi-cc')
// }).then((ret) => {
//   console.log('then', ret);
// })

// Promise.resolve('cc').then(()=> {
//   return Promise.reject('hi-cc')
// }).catch((ret) => {
//   console.log('catch', ret);
// })

// - then async function
// async func 返回 native promise，所以 promise 的实现要特殊处理
// Promise.resolve('cc').then(async (x)=> {
//   return x
// }).then((x) => {
//   console.log('then', x)
// })

// - thenable 支持
// Promise.resolve('cc').then((x) => {
//   return {
//     then(resolve, reject) {
//       return resolve(x)
//     }
//   }
// }).then(console.log)

// Promise.resolve().then(() => {
//   return {
//     a: 'aa',
//     then(resolve) {
//       resolve(this.a)
//     }
//   }
// }).then(console.log)