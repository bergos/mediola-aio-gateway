const defaultFetch = require('isomorphic-fetch')
const url = require('url')

class Gateway {
  constructor (url, { fetch = defaultFetch } = {}) {
    this.url = url
    this.fetch = fetch
  }

  parseResponse (response) {
    const [, status, message] = response.match(Gateway.statusRegExp) || []

    if (status === '{XC_SUC}') {
      if (message === '') {
        return Promise.resolve(null)
      }

      try {
        return Promise.resolve(JSON.parse(message))
      } catch (e) {
        return Promise.reject(new Error(`can't parse response message: "${message}"`))
      }
    }

    if (status === '{XC_ERR}') {
      return Promise.reject(new Error(message))
    }

    return Promise.reject(new Error(`can't handle response: "${response}"`))
  }

  sendCommand (command) {
    const commandUrl = url.resolve(this.url, `command?${Gateway.buildQuery(command)}`)

    return this.fetch(commandUrl).then(res => res.text()).then(body => this.parseResponse(body))
  }

  getStates () {
    return this.sendCommand({ 'XC_FNC': 'GetStates' })
  }

  getState (id) {
    return this.getStates().then(result => result.filter(status => status.adr === id)[0])
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
    return Object.entries(parameters).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')
  }
}

Gateway.statusRegExp = new RegExp('({[A-Z,_]*})(.*)')

module.exports = Gateway
