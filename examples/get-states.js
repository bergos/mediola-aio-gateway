const Gateway = require('../Gateway')

const gateway = new Gateway('http://192.168.1.24')

gateway.getStates().then(result => {
  console.log(JSON.stringify(result, null, ' '))
}).catch(err => console.error(err))
