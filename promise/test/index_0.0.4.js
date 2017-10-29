var Promise = require('../src/index_0.0.4')
// global.Promise = Promise

// - Promise.all
// const plist1 = Promise.all()
// plist1.then((ret) => {
//   console.log('promise1 list', ret)
// })

// const plist2 = Promise.all([])
// plist2.then((ret) => {
//   console.log('promise2 list', ret)
// })

// const plist21 = Promise.all(['a', 'b', Promise.resolve('cc')])
// plist21.then(console.log)
// const plist22 = Promise.all(['a', 'b', Promise.reject('cc')])
// plist22.then(console.log).catch((e) => {console.log('error: ', e)})

// - Promise.race
// const plist3 = Promise.race([])
// plist3.then((ret) => {
//   console.log('promise3 list', ret)
// })

// const plist31 = Promise.race([1, 2, 3])
// plist31.then((ret) => {
//   console.log('promise31 list', ret)
// })