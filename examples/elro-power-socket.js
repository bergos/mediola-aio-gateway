const context = require('../context')
const Gateway = require('../Gateway')
const ElroPowerSocket = require('../ElroPowerSocket')

const gateway = new Gateway('http://192.168.1.24')

// address by family and device
// let elro = new ElroPowerSocket(gateway, ElroPowerSocket.family0, ElroPowerSocket.deviceC)

// address by number
const elro = new ElroPowerSocket(gateway, 27)

// turn on ...
elro.put({ state: context.On })

// ... and off
setTimeout(() => {
  elro.put({ state: context.Off })
}, 2000)
