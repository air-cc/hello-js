/**
 * version: 0.0.1
 * 
 * content:
 *  - Promise 构造函数
 *  - Promise.prototype.then 基本调用
 *  - Promise.prototype.catch 基本调用
 *
 * next version todo:
 *  - 完整链式调用
 *  
 */

function Promise (executor) {
  this.status = 'pending'
  var self = this

  function _resolve(value) {
    self.status = 'fulfilled'
    self.value = value

    if (self.onFulfilled && !self.onFulfilled.executed) {
      self.result = self.onFulfilled(value)
    }
  }

  function _reject(reason) {
    self.status = 'rejected'
    self.reason = reason

    if (self.onRejected && !self.onRejected.executed) {
      self.result = self.onRejected(reason)
    }
  }

  executor(_resolve, _reject)

  return this
}

Promise.prototype.then = function _then(onFulfilled, onRejected) {
  this.onFulfilled = Promise.wrap(onFulfilled, this)
  this.onRejected = Promise.wrap(onRejected, this)

  if (this.status === 'fulfilled' && this.onFulfilled) {
    this.result = this.onFulfilled(this.value)
  }

  if (this.status === 'rejected' && this.onRejected) {
    this.result = this.onRejected(this.reason)
  }

  return this._ret()
}

Promise.prototype.catch = function _catch(onRejected) {
  if (!this.onRejected) {
    this.onRejected = Promise.wrap(onRejected, this)
  }

  if (this.status === 'rejected' && this.onRejected) {
    this.result = this.onRejected(this.reason)
  }

  return this._ret()
}

Promise.prototype._ret = function _ret() {
  return (typeof this.result === 'undefined') ? this : this.result
}

// create a new promise for next chain
Promise.wrap = function _wrap(func, self) {
  if (!(typeof func === 'function')) return undefined;

  var wrapFunc = function (data) {
    const ret = func(data)
    wrapFunc.executed = true
    // 这里需要 promise 化
    return ret
  }
  
  wrapFunc.executed = false

  return wrapFunc
}

module.exports = Promise