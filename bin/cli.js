const Gateway = require('../Gateway')
const HomeMaticHeaterController = require('../HomeMaticHeaterController')

const program = require('commander')

program
  .command('status <url>')
  .option('-d, --device <device>', 'device')
  .action((url, { device } = {}) => {
    const gateway = new Gateway(url)

    Promise.resolve().then(() => {
      if (device) {
        return gateway.getState(device)
      }

      return gateway.getStates()
    }).then(states => {
      console.log(JSON.stringify(states, null, ' '))
    }).catch(err => console.error(err))
  })

program
  .command('learn <url>')
  .action(url => {
    const gateway = new Gateway(url)

    return gateway.sendCommand({
      'XC_FNC': 'LearnSC',
      'type': 'HM'
    }).then(result => {
      console.log(JSON.stringify(result, null, ' '))
    }).catch(err => console.error(err))
  })

program
  .command('home-matic-heater-controller <url> <device>')
  .option('-t, --temperature <temperature>', 'temperature', parseFloat)
  .option('-r, --remove', 'remove')
  .action((url, device, { temperature, remove } = {}) => {
    const gateway = new Gateway(url)
    const heaterController = new HomeMaticHeaterController(gateway, device)

    Promise.resolve().then(() => {
      if (typeof temperature !== 'undefined') {
        return heaterController.put({ desiredTemperature: temperature })
      }

      if (remove) {
        return heaterController.delete()
      }

      return heaterController.get()
    }).then(states => {
      console.log(JSON.stringify(states, null, ' '))
    }).catch(err => console.error(err))
  })

program.parse(process.argv)
