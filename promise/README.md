# Promise 的实现

## 基本概念

### 一个 Promise 有以下几种状态
- pending: 初始状态，不是成功或失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

![Promise 执行流程](./assets/promises.png)

### 实现 API

- Promise(executor)

  executor 同步执行，且在创建Promise 对象之前。传参 resolve / reject 函数在状态转为 fulfilled / rejected 时回调；

- Promise.prototype.then(onfulfilled, onrejected)

  添加肯定和否定回调到当前 promise, 返回一个新的 promise, 将以回调的返回值来 resolve
  Promise 状态变化时的处理函数，分别对应 fulfilled / rejected 状态；需实现链式调用

- Promise.prototype.catch(onrejectd)

  当状态转换为 rejected 是调用，可看着Promise.prototype.then 中 onrejected 快捷用法；

- Promise.all(iterable)
- Promise.race(iterable)
- Promise.resolve(value)
- Promise.reject(reason)

## 参考

- [Promise/A+ speic](https://promisesaplus.com)
- [Promise/A+ 规范 中文版](https://segmentfault.com/a/1190000002452115)
- [MDN Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 
