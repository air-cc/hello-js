/**
 * version: 0.0.4
 * 
 * By air_cc @2017-10-29
 * 
 */

const debug = require('debug')('Promise')

module.exports = Promise

STATUS_PENDING = 'pending'
STATUS_FULFILLED = 'fulfilled'
STATUS_REJECTED = 'rejected'

function noop () {}

function Promise (executor) {
  this._id = Date.now()
  debug('create Promise:', this._id)

  if (typeof executor !== 'function') {
    throw new TypeError('Promise executor must be a function')
    return
  }

  this._status = STATUS_PENDING
  this._deferreds = []

  // then 时返回的新 promise
  if (executor === noop) return

  doResolve(this, executor);
}

Promise.globalPromise = global.Promise || false

Promise.asyncRun = setTimeout

Promise.resolve = function resolve(value) {
  if (value instanceof Promise) {
    return value
  }

  return new Promise(function (resolve) {
    resolve(value)
  })
}

Promise.reject = function reject(reason) {
  return new Promise(function (resolve, reject) {
    return reject(reason)
  })
}

Promise.all = function all(promises) {
  var promiseList = Array.prototype.slice.call(promises || [])
  var len = promiseList.length
  if (len === 0) {
    return Promise.resolve([])
  }

  var count = 0
  var results = []

  return new Promise(function (resolve, reject) {
    promiseList.forEach(function (promise, index) {
      Promise.resolve(promise).then(function (value) {
        count += 1
        results[index] = value

        if (count === len) {
          resolve(results)
        }
      }, function (reason) {
        reject(reason)
      })
    })
  })
}

Promise.race = function race(promises) {
  var promiseList = Array.prototype.slice.call(promises || [])
  var len = promiseList.length
  if (len === 0) {
    return new Promise(noop) // 永不返回
  }

  return new Promise(function (resolve, reject) {
    promiseList.forEach(function (promise) {
      Promise.resolve(promise).then(resolve, reject)
    })
  })
}

Promise.prototype._resolvePromise = function _resolvePromise (value) {
  var self = this
  Promise.asyncRun(function () {
    resolvePromise(self, value)
  })
}

Promise.prototype._rejectPromise = function _rejectPromise (reason) {
  var self = this
  Promise.asyncRun(function () {
    rejectPromise(self, reason)
  })
}

// onFulfilled 默认值，这里没有选择在 constructor 中动态设置(this.onFulfilled = this._resolvePromise)
Promise.prototype.onFulfilled = Promise.prototype._resolvePromise

// onRejected 默认值，这里没有选择在 constructor 中动态设置(this.onRejected = this._rejectPromise)
Promise.prototype.onRejected = Promise.prototype._rejectPromise

Promise.prototype.then = function then(onFulfilled, onRejected) {
  debug(this._id, 'setting then', this._status, onFulfilled, onRejected)
  
  // 创建一个新的 promise 用于链式调用
  var newPromise = new Promise(noop)
  settingHandlers(newPromise, onFulfilled, onRejected)

  // 当前 promise 处于 pending 状态，将新 promise 对象 push 进待处理列表
  if (this._status === STATUS_PENDING) {
    this._deferreds.push(newPromise);
  }

  // 当前 promise 已处于完成态，立即执行 新 promise 的相应操作
  if (this._status === STATUS_FULFILLED) {
    newPromise.onFulfilled(this._value)
  } else if (this._status === STATUS_REJECTED) {
    newPromise.onRejected(this._value)
  }

  return newPromise;
}

Promise.prototype.catch = function _catch(onRejected) {
  this.then(null, onRejected)
}

function resolvePromise(promise, value) {
  // promise 不可与 value 相同 (自己承诺自己)
  if (promise === value) {
    var error = new TypeError('promise cannot resolve itself')
    return rejectPromise(promise, error)
  }

  // value 为 Promise 实例
  if (value instanceof Promise) {
    // 当前 promise 对象与 value 状态同步
    var status = promise._status = value._status

    if (status === STATUS_PENDING) {
      return value.then(function (ret) {
        resolvePromise(promise, ret)
      }, function (ret) {
        rejectPromise(promise, ret)
      })
    }

    if (status === STATUS_REJECTED) {
      return rejectPromise(promise, value._value);
    }

    if (status === STATUS_FULFILLED) {
      promise._value = value._value
      return notifyDeferreds(promise)
    }

    return 
  }

  // 处理本地环境 async function 的问题
  // 这里只是简单示例处理 - 不知道 bluebird 是怎么处理的
  if (Promise.globalPromise && value instanceof Promise.globalPromise) {
    return value.then(function (ret) {
      resolvePromise(promise, ret)
    }, function (ret) {
      rejectPromise(promise, ret)
    })
  }

  // value 为 object 或 function
  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then
      if (typeof then === 'function') {
        doResolve(promise, then.bind(value))
        return
      }
    } catch (error) {
      rejectPromise(promise, error)
    }
  }

  // value 为普通数据
  promise._status = STATUS_FULFILLED
  promise._value = value
  return notifyDeferreds(promise)
}

function rejectPromise(promise, reason) {
  promise._status = STATUS_REJECTED
  promise._value = reason

  if (promise._deferreds.length === 0) {
    if (reason instanceof Error) {
      throw reason
    } else {
      console.error('unhandled Promise Reject: ' + reason)
    }
  }

  return notifyDeferreds(promise)
}

function doResolve(promise, executor) {
  // resolve & reject & throw Error 只被执行一次
  var done = false
  try {
    executor(function _resolve(value) {
      if (done) return
      done = true

      promise._resolvePromise(value)
    }, function _reject(reason) {
      if (done) return
      done = true

      promise._rejectPromise(reason)
    })
  } catch (error) {
    if (done) return
    done = true

    promise._rejectPromise(error)
  }
}

function settingHandlers(promise, onFulfilled, onRejected) {
  debug(promise._id, 'settingHandlers', onFulfilled, onRejected)

  if (typeof onFulfilled === 'function') {
    promise.onFulfilled = function _onFulfilled (data) {
      debug(promise._id, 'onFulfilled ready')
  
      Promise.asyncRun(function () {
        debug(promise._id, 'executing onFulfilled', onFulfilled)
  
        try {
          var value = onFulfilled(data)
          resolvePromise(promise, value)
        } catch (error) {
          rejectPromise(promise, error)
        }
      })
    }
  }
  
  if (typeof onRejected === 'function') {
    promise.onRejected = function _onRejected(data) {
      debug(promise._id, 'onRejected ready')
  
      Promise.asyncRun(function () {
        debug(promise._id, 'executing onRejected', onRejected)
        
        try {
          var value = onRejected(data)
          resolvePromise(promise, value)
        } catch (error) {
          rejectPromise(promise, error) 
        }
      })
    }
  }
}

function notifyDeferreds(promise) {
  debug(promise._id, 'notifyDeferreds', promise._deferreds)

  var status = promise._status
  var value = promise._value
  var deferreds = promise._deferreds

  deferreds.forEach(function (deferred) {
    if (status === STATUS_FULFILLED) {
      deferred.onFulfilled(value)
    }
  
    if (status === STATUS_REJECTED) {
      deferred.onRejected(value)
    }
  })
  promise._deferreds = []
}