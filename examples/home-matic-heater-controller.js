import Gateway from '../Gateway.js'
import HomeMaticHeaterController from '../HomeMaticHeaterController.js'

const gateway = new Gateway('http://192.168.1.123')

const heaterController = new HomeMaticHeaterController(gateway, '36D8E201')

heaterController.get().then(result => {
  console.log(result)
}).catch(err => console.error(err))
