'use strict'

const context = require('./context')

class HomeMaticTemperatureSensor {
  constructor (gateway, id) {
    this.gateway = gateway
    this.id = id
  }

  get () {
    return this.gateway.getState(this.id).then((result) => {
      let state = result.state.split(':')

      if (state[2] === 0xff) {
        return Promise.reject(new Error('timeout'))
      }

      return {
        '@context': context,
        '@id': this.id,
        lowBatteryPower: state[2] === 0xfe,
        humidity: parseInt(state[1], 16),
        temperature: parseInt(state[0], 16) / 10.0
      }
    })
  }
}

module.exports = HomeMaticTemperatureSensor
