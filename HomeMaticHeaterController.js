const context = require('./context')

class HomeMaticHeaterController {
  constructor (gateway, id) {
    this.gateway = gateway
    this.id = id
  }

  get () {
    return this.gateway.getState(this.id).then(result => {
      if (!result) {
        return null
      }

      const [lowBatteryPowerStr,, desiredTemperatureStr, temperatureStr,, valveStr] = result.state.split(':')

      return {
        '@context': context,
        '@id': result.adr,
        lowBatteryPower: lowBatteryPowerStr === 'B',
        desiredTemperature: parseInt(desiredTemperatureStr, 16) / 10.0,
        temperature: parseInt(temperatureStr, 16) / 10.0,
        valve: parseInt(valveStr, 16)
      }
    })
  }

  put (input) {
    return Promise.resolve().then(() => {
      if (typeof input.desiredTemperature !== 'number') {
        return Promise.resolve()
      }

      return this.gateway.sendCommand({
        'XC_FNC': 'SendSC',
        'type': 'HM',
        'data': `${this.id}11${(input.desiredTemperature * 2).toString(16).toUpperCase()}`
      })
    }).then(() => {
      return this.get()
    })
  }

  delete () {
    return this.gateway.sendCommand({
      'XC_FNC': 'DelSensor',
      'type': 'HMFHT',
      'adr': this.id
    })
  }
}

module.exports = HomeMaticHeaterController
