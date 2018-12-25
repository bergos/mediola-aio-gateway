const Gateway = require('../Gateway')
const HomeMaticHeaterController = require('../HomeMaticHeaterController')

const gateway = new Gateway('http://192.168.1.24')

const heaterController = new HomeMaticHeaterController(gateway, '36D8E201')

heaterController.status().then(result => {
  console.log(result)
}).catch(err => console.error(err))
