/**
 * version: 0.0.2
 * 
 * OK, I give up doing this by myself
 * 
 * content:
 *  - 完整链式调用
 *  - 对 then 返回值的处理：Promise 对象，thenable 对象，普通对象
 *
 * next version todo:
 *  - 实现 Promise.all
 *  - 实现 Promise.race
 * 
 * bug:
 *  - onFulfilled， onRejected 按照规范应该是异步执行
 *  - error 未处理
 * 
 */

const debug = require('debug')('Promise')

function Promise (executor) {
  debug('create Promise @', Date.now())
  this.id = Date.now()

  this.status = 'pending'
  var self = this

  function _resolve(value) {
    debug('turn to fulfilled')
    
    self.status = 'fulfilled'
    self.value = value
    
    if (self.onFulfilled && !self.onFulfilled.executed) {
      self.nextStep = self.onFulfilled(value)
    }
  }
  
  function _reject(reason) {
    debug('turn to rejected')

    self.status = 'rejected'
    self.reason = reason

    if (self.onRejected && !self.onRejected.executed) {
      self.nextStep = self.onRejected(reason)
    }
  }

  executor(_resolve, _reject)

  return this
}

Promise.prototype.then = function _then(onFulfilled, onRejected) {
  debug('setting then')

  if (!this.onFulfilled && typeof onFulfilled === 'function') {
    this.onFulfilled = Promise._wrap(onFulfilled)
  }

  if (!this.onRejected && typeof onRejected === 'function') {
    this.onRejected = Promise._wrap(onRejected)
  }

  if (this.status === 'fulfilled' && this.onFulfilled && !this.onFulfilled.executed) {
    this.nextStep = this.onFulfilled(this.value)
  }

  if (this.status === 'rejected' && this.onRejected && !this.onRejected.executed) {
    this.nextStep = this.onRejected(this.reason)
  }

  return this._ret()
}

Promise.prototype.catch = function _catch(onRejected) {
  debug('setting catch')

  if (!this.onRejected && typeof onRejected === 'function') {
    this.onRejected = Promise._wrap(onRejected)
  }

  if (this.status === 'rejected' && this.onRejected && !this.onRejected.executed) {
    this.nextStep = this.onRejected(this.reason)
  }

  return this._ret()
}

Promise.prototype._ret = function _ret() {
  debug('getting ret', (typeof this.nextStep === 'undefined') ? this : this.nextStep)

  return (typeof this.nextStep === 'undefined') ? this : this.nextStep
}

// create a new promise for next chain
Promise._wrap = function _wrap(func) {
  if (!(typeof func === 'function')) return undefined;

  var wrapFunc = function (data) {
    debug('executing func', data)
    wrapFunc.executed = true

    var ret = func(data)

    return Promise.resolve(ret)
  }

  wrapFunc.executed = false

  return wrapFunc
}


Promise.reject = function _reject(reason) {
  return new Promise(function (resolve, reject) {
    reject(reason)
  })
}

Promise._resolveNew = function _resolveNew(value) {
  return new Promise(function (resolve) {
    resolve(value)
  })
}

Promise.resolve = function _resolve(ret) {
  // Promise Instance
  if (ret instanceof Promise) {
    return ret
  }

  // 非 object 或 function
  if (typeof ret !== 'object' && typeof ret !== 'function') {
    return Promise._resolveNew(ret)
  }

  var then = null
  try {
    then = ret.then
  } catch (e) {
    return Promise.reject(e)
  }

  
  // 非 thenable
  if (typeof then !== 'function') {
    return Promise._resolveNew(ret)
  }
  
  // thenable 情况暂不考虑
  // then.call(ret, )
  return Promise._resolveNew(ret)
}

module.exports = Promise