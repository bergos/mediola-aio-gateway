import context from './context.js'

class HomeMaticHeaterController {
  constructor (gateway, id) {
    this.gateway = gateway
    this.id = id
  }

  async get () {
    const result = await this.gateway.getState(this.id)

    if (!result) {
      return null
    }

    const [lowBatteryPowerStr,, targetTemperatureStr, temperatureStr,, valveStr] = result.state.split(':')

    return {
      '@context': context,
      '@id': result.adr,
      lowBatteryPower: lowBatteryPowerStr === 'B',
      targetTemperature: parseInt(targetTemperatureStr, 16) / 10.0,
      temperature: parseInt(temperatureStr, 16) / 10.0,
      valve: parseInt(valveStr, 16)
    }
  }

  async put (input) {
    if (typeof input.targetTemperature !== 'number') {
      throw new Error(`invalid argument: ${input && input.targetTemperature}`)
    }

    await this.gateway.sendCommand({
      XC_FNC: 'SendSC',
      type: 'HM',
      data: `${this.id}11${(input.targetTemperature * 2).toString(16).toUpperCase()}`
    })

    return this.get()
  }

  async delete () {
    return this.gateway.sendCommand({
      XC_FNC: 'DelSensor',
      type: 'HMFHT',
      adr: this.id
    })
  }
}

export default HomeMaticHeaterController
