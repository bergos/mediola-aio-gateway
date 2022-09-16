import { deepStrictEqual, rejects, strictEqual } from 'assert'
import { describe, it } from 'mocha'
import mochfetch from 'mockfetch'
import Gateway from '../Gateway.js'

describe('Gateway', () => {
  describe('constructor', () => {
    it('should be a function', () => {
      strictEqual(typeof Gateway, 'function')
    })

    it('should assign the given url', () => {
      const gateway = new Gateway('http://localhost/')

      strictEqual(gateway.url, 'http://localhost/')
    })

    it('should assign the given custom fetch', () => {
      const fetch = {}
      const gateway = new Gateway(null, { fetch })

      strictEqual(gateway.fetch, fetch)
    })

    it('should assign the default fetch if no custom fetch is given', () => {
      const gateway = new Gateway()

      strictEqual(typeof gateway.fetch, 'function')
    })
  })

  describe('parseResponse', () => {
    it('should be a function', () => {
      const gateway = new Gateway()

      strictEqual(typeof gateway.parseResponse, 'function')
    })

    it('should return null if the response is empty', async () => {
      const gateway = new Gateway()

      const result = await gateway.parseResponse('{XC_SUC}')

      strictEqual(result, null)
    })

    it('should return the response object on success', async () => {
      const gateway = new Gateway()

      const result = await gateway.parseResponse('{XC_SUC}{"test":"message"}')

      return deepStrictEqual(result, { test: 'message' })
    })

    it('should throw an error if the response is not parsable', async () => {
      const gateway = new Gateway()

      await rejects(async () => {
        await gateway.parseResponse('{XC_SUC}test message')
      }, {
        message: 'can\'t parse response message: "test message"'
      })
    })

    it('should throw an error on error response', async () => {
      const gateway = new Gateway()

      await rejects(async () => {
        await gateway.parseResponse('{XC_ERR}test message')
      }, {
        message: 'test message'
      })
    })

    it('should throw an error on parse error', async () => {
      const gateway = new Gateway()

      await rejects(async () => {
        await gateway.parseResponse('test message')
      }, {
        message: 'can\'t handle response: "test message"'
      })
    })
  })

  describe('sendCommand', () => {
    it('should be a function', () => {
      const gateway = new Gateway()

      strictEqual(typeof gateway.sendCommand, 'function')
    })

    it('should call the command URL', async () => {
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

      await gateway.sendCommand({ XC_FNC: 'GetStates' })

      strictEqual(touched, true)
    })

    it('should parse the response', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: '{XC_SUC}{"test":"message"}'
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })

      const result = await gateway.sendCommand({ XC_FNC: 'GetStates' })

      deepStrictEqual(result, { test: 'message' })
    })
  })

  describe('getStates', () => {
    it('should be a function', () => {
      const gateway = new Gateway()

      strictEqual(typeof gateway.getStates, 'function')
    })

    it('should call the GetStates command', async () => {
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

      await gateway.getStates()

      strictEqual(touched, true)
    })

    it('should parse the response', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: '{XC_SUC}{"test":"message"}'
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })

      const result = await gateway.getStates()

      deepStrictEqual(result, { test: 'message' })
    })
  })

  describe('getState', () => {
    it('should be a function', () => {
      const gateway = new Gateway()

      strictEqual(typeof gateway.getState, 'function')
    })

    it('should call the GetStates command', async () => {
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

      await gateway.getState('abc')

      strictEqual(touched, true)
    })

    it('should parse and filter the response by the given Id', async () => {
      const fetch = mochfetch({
        'http://localhost/command?XC_FNC=GetStates': {
          body: '{XC_SUC}[{"adr":"abc"}]'
        }
      })
      const gateway = new Gateway('http://localhost/', { fetch })

      const result = await gateway.getState('abc')

      deepStrictEqual(result, { adr: 'abc' })
    })
  })
})
