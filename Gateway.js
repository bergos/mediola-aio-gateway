'use strict'

let fetch = require('isomorphic-fetch')
let url = require('url')

class Gateway {
  constructor (url, options) {
    options = options || {}

    this.url = url
    this.fetch = options.fetch || fetch
  }

  parseResponse (response) {
    let statusMatch = response.match(Gateway.statusRegExp)

    let status = statusMatch[0]
    let result = response.substr(status.length)

    if (status === '{XC_SUC}') {
      try {
        result = JSON.parse(result)
      } catch (e) {}

      return result
    } else {
      return Promise.reject(new Error(result))
    }
  }

  sendCommand (command) {
    let commandUrl = url.resolve(this.url, 'command?' + Gateway.buildQuery(command))

    return this.fetch(commandUrl).then((res) => {
      return res.text()
    }).then((body) => {
      return this.parseResponse(body)
    })
  }

  getStates () {
    return this.sendCommand({
      'XC_FNC': 'GetStates'
    })
  }

  getState (id) {
    return this.getStates().then((result) => {
      return result.filter((status) => {
        return status.adr === id
      }).shift()
    })
  }

  sendIntertechnoSystemCode (family, device, action) {
    return this.sendCommand({
      'XC_FNC': 'SendSC',
      'type': 'IT',
      'data': family.toString(16) + device.toString(16) + action.toString(16)
    })
  }

  sendMediolaCode (code, sender) {
    code = code.toString('hex')
    sender = sender || '01'

    return this.sendCommand({
      'XC_FNC': 'Send2',
      'type': 'CODE',
      'ir': sender,
      'code': code
    })
  }

  static buildQuery (parameters) {
    return Object.keys(parameters).map((key) => {
      return key + '=' + encodeURIComponent(parameters[key])
    }).join('&')
  }
}

Gateway.statusRegExp = new RegExp('{[A-Z,_]*}')

module.exports = Gateway
