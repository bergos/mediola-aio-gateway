import Gateway from '../Gateway.js'

const gateway = new Gateway('http://192.168.1.123')

gateway.getState('30E0A401').then(result => {
  console.log(JSON.stringify(result, null, ' '))
}).catch(err => console.error(err))
