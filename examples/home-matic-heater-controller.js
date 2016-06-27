const Gateway = require('../Gateway')
const HomeMaticHeaterController = require('../HomeMaticHeaterController')

let gateway = new Gateway('http://192.168.1.24')

let heaterController = new HomeMaticHeaterController(gateway, '36D8E201')

heaterController.status().then((result) => {
  console.log(result)
}).catch((err) => {
  console.error(err.stack || err.message)
})
