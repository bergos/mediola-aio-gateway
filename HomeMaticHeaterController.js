'use strict'

const context = require('./context')

class HomeMaticHeaterController {
  constructor (gateway, id) {
    this.gateway = gateway
    this.id = id
  }

  status () {
    return this.gateway.getState(this.id).then((result) => {
      let state = result.state.split(':')

      if (state[2] === 0xff) {
        return Promise.reject(new Error('timeout'))
      }

      return {
        '@context': context,
        '@id': result.adr,
        lowBatteryPower: state.error === 'B',
        desiredTemperature: parseInt(state[2], 16) / 10.0,
        humidity: parseInt(state[4], 16) / 10.0,
        temperature: parseInt(state[3], 16) / 10.0,
        valve: parseInt(state[5], 16) / 100.0
      }
    })
  }
}

module.exports = HomeMaticHeaterController
