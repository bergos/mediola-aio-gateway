/* global describe, expect, test */

const mochfetch = require('mockfetch')
const Gateway = require('../Gateway')
const HomeMaticTemperatureSensor = require('../HomeMaticTemperatureSensor')

describe('HomeMaticTemperatureSensor', () => {
  describe('constructor', () => {
    test('is a function', () => {
      expect(typeof HomeMaticTemperatureSensor).toBe('function')
    })

    test('gateway is assigned', () => {
      const gateway = new Gateway('http://localhost/')
      const sensor = new HomeMaticTemperatureSensor(gateway)

      expect(sensor.gateway).toBe(gateway)
    })

    test('id is assigned', () => {
      const gateway = new Gateway('http://localhost/')
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      expect(sensor.id).toBe('00000000')
    })
  })

  describe('get', () => {
    test('is a function', () => {
      const gateway = new Gateway('http://localhost/')
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      expect(typeof sensor.get).toBe('function')
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
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      return sensor.get().then(() => {
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
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      return sensor.get().then(result => {
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
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      return sensor.get().then(result => {
        expect(typeof result['@id']).toBe('string')
      })
    })

    test('response contains temperature sensor properties', () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: 'I:0:0000:0000:00:00' })}]`
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      return sensor.get().then(result => {
        expect(typeof result.lowBatteryPower).toBe('boolean')
        expect(typeof result.humidity).toBe('number')
        expect(typeof result.temperature).toBe('number')
      })
    })

    test('property values are parsed values of GetStates command response', () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: `{XC_SUC}[${JSON.stringify({ type: 'HMFHT', adr: '00000000', state: '00C8:32:FE' })}]`
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })
      const sensor = new HomeMaticTemperatureSensor(gateway, '00000000')

      return sensor.get().then(result => {
        expect(result.lowBatteryPower).toBe(true)
        expect(result.humidity).toBe(50)
        expect(result.temperature).toBe(20)
      })
    })
  })
})
