import defaultFetch from 'nodeify-fetch'

const statusRegExp = /({[A-Z,_]*})(.*)/

class Gateway {
  constructor (url, { fetch = defaultFetch } = {}) {
    this.url = url
    this.fetch = fetch
  }

  parseResponse (response) {
    const [, status, message] = response.match(statusRegExp) || []

    if (status === '{XC_SUC}') {
      if (message === '') {
        return null
      }

      try {
        return JSON.parse(message)
      } catch (e) {
        throw new Error(`can't parse response message: "${message}"`)
      }
    }

    if (status === '{XC_ERR}') {
      throw new Error(message)
    }

    throw new Error(`can't handle response: "${response}"`)
  }

  async sendCommand (command) {
    const commandUrl = new URL(`command?${Gateway.buildQuery(command)}`, this.url)

    const res = await this.fetch(commandUrl)
    const body = await res.text()

    return this.parseResponse(body)
  }

  async getStates () {
    return this.sendCommand({ XC_FNC: 'GetStates' })
  }

  async getState (id) {
    const states = await this.getStates()

    return states.find(state => state.adr === id)
  }

  async sendIntertechnoSystemCode (family, device, action) {
    return this.sendCommand({
      XC_FNC: 'SendSC',
      type: 'IT',
      data: family.toString(16) + device.toString(16) + action.toString(16)
    })
  }

  async sendMediolaCode (code, sender) {
    code = code.toString('hex')
    sender = sender || '01'

    return this.sendCommand({
      XC_FNC: 'Send2',
      type: 'CODE',
      ir: sender,
      code: code
    })
  }

  static buildQuery (parameters) {
    return Object.entries(parameters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
  }
}

export default Gateway
