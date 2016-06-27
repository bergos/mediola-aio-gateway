const context = require('../context')
const Gateway = require('../Gateway')
const ElroPowerSocket = require('../ElroPowerSocket')

let gateway = new Gateway('http://192.168.1.24')

// address by family and device
// let elro = new ElroPowerSocket(gateway, ElroPowerSocket.family0, ElroPowerSocket.deviceC)

// address by number
let elro = new ElroPowerSocket(gateway, 27)

// turn on ...
elro.put({state: context.on})

// ... and off
setTimeout(() => {
  elro.put({state: context.off})
}, 2000)
