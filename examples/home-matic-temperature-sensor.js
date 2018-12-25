const Gateway = require('../Gateway')
const HomeMaticTemperatureSensor = require('../HomeMaticTemperatureSensor')

const gateway = new Gateway('http://192.168.1.24')

const temperatureSensor = new HomeMaticTemperatureSensor(gateway, '30E0A401')

temperatureSensor.get().then(result => {
  console.log(result)
}).catch(err => console.error(err))
