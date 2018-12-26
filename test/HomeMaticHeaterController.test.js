/* global describe, expect, test */

const mochfetch = require('mockfetch')
const Gateway = require('../Gateway')
const HomeMaticHeaterController = require('../HomeMaticHeaterController')

describe('HomeMaticHeaterController', () => {
  describe('constructor', () => {
    test('is a function', () => {
      expect(typeof HomeMaticHeaterController).toBe('function')
    })

    test('gateway is assigned', () => {
      const gateway = new Gateway('http://localhost/')
      const heaterController = new HomeMaticHeaterController(gateway)

      expect(heaterController.gateway).toBe(gateway)
    })

    test('id is assigned', () => {
      const gateway = new Gateway('http://localhost/')
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      expect(heaterController.id).toBe('00000000')
    })
  })

  describe('get', () => {
    test('is a function', () => {
      const gateway = new Gateway('http://localhost/')
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      expect(typeof heaterController.get).toBe('function')
    })

    test('GetStates command is called', () => {
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

      return heaterController.get().then(() => {
        expect(touched).toBe(true)
      })
    })

    test('response has a context', () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      return heaterController.get().then(result => {
        expect(typeof result['@context']).toBe('object')
      })
    })

    test('response has a @id property', () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      return heaterController.get().then(result => {
        expect(typeof result['@id']).toBe('string')
      })
    })

    test('response heater controller properties', () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      return heaterController.get().then(result => {
        expect(typeof result.lowBatteryPower).toBe('boolean')
        expect(typeof result.desiredTemperature).toBe('number')
        expect(typeof result.temperature).toBe('number')
        expect(typeof result.valve).toBe('number')
      })
    })

    test('property values are parsed values of GetStates command response', () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'B:0:00C8:00BE:00:50' })}]`
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      return heaterController.get().then(result => {
        expect(result.lowBatteryPower).toBe(true)
        expect(result.desiredTemperature).toBe(20)
        expect(result.temperature).toBe(19)
        expect(result.valve).toBe(80)
      })
    })
  })

  describe('put', () => {
    test('is a function', () => {
      const gateway = new Gateway('http://localhost/')
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      expect(typeof heaterController.put).toBe('function')
    })

    test('SendSC command is called', () => {
      let touched = false

      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=SendSC&type=HM&data=000000001128': {
          callback: () => {
            touched = true

            return {
              body: `{XC_SUC}`
            }
          }
        },
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      return heaterController.put({ desiredTemperature: 20 }).then(() => {
        expect(touched).toBe(true)
      })
    })

    test('GetStates command is called for response', () => {
      let touched = false

      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=SendSC&type=HM&data=000000001128': {
          body: `{XC_SUC}`
        },
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

      return heaterController.put({ desiredTemperature: 20 }).then(() => {
        expect(touched).toBe(true)
      })
    })
  })

  describe('delete', () => {
    test('is a function', () => {
      const gateway = new Gateway('http://localhost/')
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      expect(typeof heaterController.delete).toBe('function')
    })

    test('DelSensor command is called', () => {
      let touched = false

      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=DelSensor&type=HMFHT&adr=00000000': {
          callback: () => {
            touched = true

            return {
              body: `{XC_SUC}`
            }
          }
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })
      const heaterController = new HomeMaticHeaterController(gateway, '00000000')

      return heaterController.delete().then(() => {
        expect(touched).toBe(true)
      })
    })
  })
})
