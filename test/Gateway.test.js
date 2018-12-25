/* global describe, expect, test */

const mochfetch = require('mockfetch')
const Gateway = require('../Gateway')

describe('Gateway', () => {
  describe('constructor', () => {
    test('is a function', () => {
      expect(typeof Gateway).toBe('function')
    })

    test('url is assigned', () => {
      const gateway = new Gateway('http://localhost/')

      expect(gateway.url).toBe('http://localhost/')
    })

    test('custom fetch is assigned', () => {
      const fetch = {}
      const gateway = new Gateway(null, { fetch })

      expect(gateway.fetch).toBe(fetch)
    })

    test('default fetch is assigned if no custom fetch is given', () => {
      const gateway = new Gateway()

      expect(typeof gateway.fetch).toBe('function')
    })
  })

  describe('parseResponse', () => {
    test('is a function', () => {
      const gateway = new Gateway()

      expect(typeof gateway.parseResponse).toBe('function')
    })

    test('returns the response object on success', () => {
      const gateway = new Gateway()

      return expect(gateway.parseResponse('{XC_SUC}{"test":"message"}')).resolves.toEqual({ test: 'message' })
    })

    test('returns an error if the response is not parsable', () => {
      const gateway = new Gateway()

      return expect(gateway.parseResponse('{XC_SUC}test message')).rejects.toThrow('can\'t parse response message: "test message"')
    })

    test('returns an error on error response', () => {
      const gateway = new Gateway()

      return expect(gateway.parseResponse('{XC_ERR}test message')).rejects.toThrow('test message')
    })

    test('returns an error response parse error', () => {
      const gateway = new Gateway()

      return expect(gateway.parseResponse('test message')).rejects.toThrow('can\'t handle response: "test message"')
    })
  })

  describe('sendCommand', () => {
    test('is a function', () => {
      const gateway = new Gateway()

      expect(typeof gateway.sendCommand).toBe('function')
    })

    test('the command URL is called', () => {
      let touched = false

      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          callback: () => {
            touched = true

            return {
              body: '{XC_SUC}{"test":"message"}'
            }
          }
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })

      return gateway.sendCommand({
        'XC_FNC': 'GetStates'
      }).then(() => {
        return expect(touched).toBe(true)
      })
    })

    test('the response is parsed', () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          callback: () => {
            return {
              body: '{XC_SUC}{"test":"message"}'
            }
          }
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })

      return gateway.sendCommand({
        'XC_FNC': 'GetStates'
      }).then(result => {
        return expect(result).toEqual({ test: 'message' })
      })
    })
  })

  describe('getStates', () => {
    test('is a function', () => {
      const gateway = new Gateway()

      expect(typeof gateway.getStates).toBe('function')
    })

    test('the GetStates command is called', () => {
      let touched = false

      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          callback: () => {
            touched = true

            return {
              body: '{XC_SUC}{"test":"message"}'
            }
          }
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })

      return gateway.getStates().then(() => {
        return expect(touched).toBe(true)
      })
    })

    test('the response is parsed', () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          callback: () => {
            return {
              body: '{XC_SUC}{"test":"message"}'
            }
          }
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })

      return gateway.getStates().then(result => {
        return expect(result).toEqual({ test: 'message' })
      })
    })
  })

  describe('getState', () => {
    test('is a function', () => {
      const gateway = new Gateway()

      expect(typeof gateway.getState).toBe('function')
    })

    test('the GetStates command is called', () => {
      let touched = false

      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          callback: () => {
            touched = true

            return {
              body: '{XC_SUC}[]'
            }
          }
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })

      return gateway.getState('abc').then(() => {
        return expect(touched).toBe(true)
      })
    })

    test('the response is parsed filtered by the given Id', () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          callback: () => {
            return {
              body: '{XC_SUC}[{"adr":"abc"}]'
            }
          }
        }
      })

      const gateway = new Gateway('http://localhost/', { fetch })

      return gateway.getState('abc').then(result => {
        return expect(result).toEqual({ adr: 'abc' })
      })
    })
  })
})
