const Gateway = require('../Gateway')

let gateway = new Gateway('http://192.168.1.24')

gateway.sendCommand({
  'XC_FNC': 'GetStates',
  'config': '1'
}).then(function (result) {
  console.log(result)
}).catch(function (err) {
  console.error(err.stack || err.message)
})
