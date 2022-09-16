import Gateway from '../Gateway.js'

const gateway = new Gateway('http://192.168.1.123')

gateway.sendCommand({
  XC_FNC: 'GetStates',
  config: '1'
}).then(result => {
  console.log(result)
}).catch(err => console.error(err))
