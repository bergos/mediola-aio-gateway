import context from './context.js'

class HomeMaticTemperatureSensor {
  constructor (gateway, id) {
    this.gateway = gateway
    this.id = id
  }

  async get () {
    const result = await this.gateway.getState(this.id)

    if (!result) {
      return null
    }

    const [temperatureStr, humidityStr, statusStr] = result.state.split(':')

    let temperature = parseInt(temperatureStr, 16)

    if (temperature & 0x4000) {
      temperature -= 0x8000
    }

    return {
      '@context': context,
      '@id': this.id,
      lowBatteryPower: parseInt(statusStr, 16) === 0xfe,
      temperature: temperature / 10.0,
      humidity: parseInt(humidityStr, 16)
    }
  }
}

export default HomeMaticTemperatureSensor
