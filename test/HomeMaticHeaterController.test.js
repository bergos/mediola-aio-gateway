import { rejects, strictEqual } from 'assert'
import { describe, it } from 'mocha'
import mochfetch from 'mockfetch'
import Gateway from '../Gateway.js'
import HomeMaticHeaterController from '../HomeMaticHeaterController.js'

describe('HomeMaticHeaterController', () => {
  describe('constructor', () => {
    it('should be a function', () => {
      strictEqual(typeof HomeMaticHeaterController, 'function')
    })

    it('should assign the given gateway', () => {
      const gateway = new Gateway('http://localhost/')
      const heaterController = new HomeMaticHeaterController(gateway)

      strictEqual(heaterController.gateway, gateway)
    })

    it('should assign the given id', () => {
      const gateway = new Gateway('http://localhost/')
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      strictEqual(heaterController.id, '00000000')
    })
  })

  describe('get', () => {
    it('should be a function', () => {
      const gateway = new Gateway('http://localhost/')
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      strictEqual(typeof heaterController.get, 'function')
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
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      await heaterController.get()

      strictEqual(touched, true)
    })

    it('should respond with a context', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      const result = await heaterController.get()

      strictEqual(typeof result['@context'], 'object')
    })

    it('should respond with a @id property', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      const result = await heaterController.get()

      strictEqual(typeof result['@id'], 'string')
    })

    it('should respond with heater controller properties', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      const result = await heaterController.get()

      strictEqual(typeof result.lowBatteryPower, 'boolean')
      strictEqual(typeof result.targetTemperature, 'number')
      strictEqual(typeof result.temperature, 'number')
      strictEqual(typeof result.valve, 'number')
    })

    it('should parse the response value', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'B:0:00C8:00BE:00:50' })}]`
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      const result = await heaterController.get()

      strictEqual(result.lowBatteryPower, true)
      strictEqual(result.targetTemperature, 20)
      strictEqual(result.temperature, 19)
      strictEqual(result.valve, 80)
    })
  })

  describe('put', () => {
    it('should be a function', () => {
      const gateway = new Gateway('http://localhost/')
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      strictEqual(typeof heaterController.put, 'function')
    })

    it('should throw an error if an invalid argument is given', async () => {
      const gateway = new Gateway('http://localhost/')
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      await rejects(async () => {
        await heaterController.put({ targetTemperature: 'test' })
      }, {
        message: 'invalid argument: test'
      })
    })

    it('should call the SendSC command', async () => {
      let touched = false
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=SendSC&type=HM&data=000000001128': {
          callback: () => {
            touched = true

            return {
              body: '{XC_SUC}'
            }
          }
        },
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      await heaterController.put({ targetTemperature: 20 })

      strictEqual(touched, true)
    })

    it('should return the response of the GetStates command', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=SendSC&type=HM&data=000000001128': {
          body: '{XC_SUC}'
        },
        'http://localhost/command?XC_FNC=GetStates': {
          callback: () => {
            return {
              body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'B:0:00C8:00BE:00:50' })}]`
            }
          }
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      const result = await heaterController.put({ targetTemperature: 20 })

      strictEqual(result.lowBatteryPower, true)
      strictEqual(result.targetTemperature, 20)
      strictEqual(result.temperature, 19)
      strictEqual(result.valve, 80)
    })
  })

  describe('delete', () => {
    it('should be a function', () => {
      const gateway = new Gateway('http://localhost/')
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      strictEqual(typeof heaterController.delete, 'function')
    })

    it('should call the DelSensor command', async () => {
      let touched = false
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=DelSensor&type=HMFHT&adr=00000000': {
          callback: () => {
            touched = true

            return {
              body: '{XC_SUC}'
            }
          }
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      await heaterController.delete()

      strictEqual(touched, true)
    })
  })
})
