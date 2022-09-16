import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import mochfetch from 'mockfetch'
import Gateway from '../Gateway.js'
import HomeMaticTemperatureSensor from '../HomeMaticTemperatureSensor.js'

describe('HomeMaticTemperatureSensor', () => {
  describe('constructor', () => {
    it('should be a function', () => {
      strictEqual(typeof HomeMaticTemperatureSensor, 'function')
    })

    it('should assign the given gateway', () => {
      const gateway = new Gateway('http://localhost/')
      const sensor = new HomeMaticTemperatureSensor(gateway)

      strictEqual(sensor.gateway, gateway)
    })

    it('should assign the given id', () => {
      const gateway = new Gateway('http://localhost/')
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      strictEqual(sensor.id, '00000000')
    })
  })

  describe('get', () => {
    it('should be a function', () => {
      const gateway = new Gateway('http://localhost/')
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      strictEqual(typeof sensor.get, 'function')
    })

    it('should call the GetStates command', async () => {
      let touched = false
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          callback: () => {
            touched = true

            return {
              body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
            }
          }
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      await sensor.get()

      strictEqual(touched, true)
    })

    it('should respond with a context', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      const result = await sensor.get()

      strictEqual(typeof result['@context'], 'object')
    })

    it('should respond with a @id property', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      const result = await sensor.get()

      strictEqual(typeof result['@id'], 'string')
    })

    it('should respond with temperature sensor properties', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      const result = await sensor.get()

      strictEqual(typeof result.lowBatteryPower, 'boolean')
      strictEqual(typeof result.humidity, 'number')
      strictEqual(typeof result.temperature, 'number')
    })

    it('should parse the response value', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: '00C8:32:FE' })}]`
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      const result = await sensor.get()

      strictEqual(result.lowBatteryPower, true)
      strictEqual(result.humidity, 50)
      strictEqual(result.temperature, 20)
    })
  })
})
