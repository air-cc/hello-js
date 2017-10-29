// # 特性检测 start
let assert = require('assert')
var Promise = require('../src/index')

describe('base', () => {
  // - promise then 只能被调用一次
  it('promise then 只能被调用一次', (done) => {
    let timestamp1 = 0
    const p1 = new Promise((resolve) => {
      const now = Date.now()
      timestamp1 = now
      resolve(now)
    
      setTimeout(() => {
        const now = Date.now()
        resolve(now)
      }, 1000)
    })
    
    p1.then((x) => {
      assert(x === timestamp1)
      done()
    })
  })
  
  // - then 中定义了 onRejected，是否还会调用 catch 中的 func？
  // 答案：不会，error 已经被上一级的 onRejected 处理掉了
  it('then 中定义了 onRejected', (done) => {
    Promise.reject('cc')
      .then(null, (e) => {
        assert(e === 'cc')
        done()
      })
  })

  // - then 处理函数的执行环境
  it('then 处理函数的执行环境', (done) => {
    const p = new Promise((resolve) => resolve('this is global'))
    p.then(function (x) {
      assert(this === global) // this is global true
      done()
    })
  })

  // - 检测Promise实例 then 返回的对象是否为新的 Promise 实例
  it('检测Promise实例 then 返回的对象是否为新的 Promise 实例', () => {
    const p1 = new Promise((resolve) => resolve(0))
    const p2 = p1.then(console.log)
    assert(p1 !== p2)
  })
  
  // - promise 对象 分别 then 两次
  // 得到的结果是一样的，说明他内部是个闭包
  // it('promise 对象 分别 then 两次结果相同', () => {
  //   const p = new Promise((resolve) => {
  //     setTimeout(() => resolve(Date.now()), 1)
  //   })
    
  //   const handler = (ret) => {
  //     const now = Date.now()
  //     console.log(now, ret)
  //     return now
  //   }
  //   setTimeout(() => {
  //     p.then(handler).then(handler)
  //   }, 1000)

  //   p.then(handler)
  // })

  // - onReject 是否可以为 async function
  // 答案：支持
  it('onReject 支持 async func', (done)=> {
    Promise.resolve('cc').then(async (str) => {
      const a = await new Promise((resolve) => {
        setTimeout(() => resolve(str), 1000)
      })
      return a
    }).then((final) => {
      assert(final === 'cc')
      done()
    })
  })

  // - resolve 之后 throw error ?
  // 答案: 不起作用
  it('resolve 之后 throw error 不起作用', (done)=> {
    const p = new Promise((resolve) => {
      resolve('ok')
      throw new Error('err')
    })
    p.then((x) => {
      assert(x === 'ok')
      done()
    }).catch((e) => {
      assert(!e)
    }) // ok
  })

  // - onFilfulled 不是函数是否报错 ？
  // 答案: 不报错
  it('onFilfulled 不是函数', (done)=> {
    Promise.resolve('cc').then('xx').then((x) => {
      assert(x === 'cc')
      done()
    })
  })
  
  // - 异步catch错误时的处理
  // 错误先输出，但不影响接下来代码执行
  it('异步catch错误时的处理 错误先输出，但不影响接下来代码执行', ()=> {
    const p = Promise.reject('cc')
    setTimeout(() => {
      p.catch((e) => {
        console.log('catch an error', e)
      })
    })
    console.log('hi~')
  })

  // - thenable
  it('thenable', (done) => {
    Promise.resolve('cc').then((x) => {
      return {
        then(resolve, reject) {
          return resolve(x)
        }
      }
    }).then((x) => {
      assert(x === 'cc')
      done()
    })
  })

  // thenable 执行环境
  it('thenable 执行环境', (done) => {
    Promise.resolve().then(() => {
      return {
        a: 'aa',
        then(resolve) {
          resolve(this.a)
        }
      }
    }).then((x) => {
      assert(x === 'aa')
      done()
    })
  })


  it('Promise.all', (done) => {
    const plist2 = Promise.all([])
    assert(plist2 instanceof Promise)
    plist2.then((ret) => {
      done()
    })
  })

  it('Promise.race', () => {
    const plist3 = Promise.race([])
    console.log(plist3 instanceof Promise)
    plist3.then((ret) => {
      assert(false)
    })
  })

})
