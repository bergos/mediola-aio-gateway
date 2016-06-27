const Gateway = require('../Gateway')
const HomeMaticTemperatureSensor = require('../HomeMaticTemperatureSensor')

let gateway = new Gateway('http://192.168.1.24')

let temperatureSensor = new HomeMaticTemperatureSensor(gateway, '30E0A401')

temperatureSensor.get().then((result) => {
  console.log(result)
}).catch((err) => {
  console.error(err.stack || err.message)
})
