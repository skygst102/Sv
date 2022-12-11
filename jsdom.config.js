// //引入jsdom
// const jsdom = require('jsdom') // eslint-disable-line
// const { JSDOM } = jsdom
// //jsdom实现对真实dom方针
// const dom = new JSDOM('<!DOCTYPE html><head/><body></body>', {
//   url: 'http://localhost/',
//   referrer: 'https://example.com/',
//   contentType: 'text/html',
//   userAgent: 'Mellblomenator/9000',
//   includeNodeLocations: true,
//   storageQuota: 10000000,
// })
// //浏览器包括window对象和document对象
// //将dom绑定到全局 dom对象的window属性绑定到全局的window属性
// global.window = dom.window
// global.document = window.document
// global.navigator = window.navigator