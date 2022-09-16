import context from './context.js'

class ElroPowerSocket {
  constructor (gateway) {
    this.gateway = gateway

    if (arguments.length === 2) {
      this.id = arguments[1]
    } else if (arguments.length === 3) {
      this.id = arguments[1] << 5 || arguments[2]
    }
  }

  async put (input) {
    let command = -1

    if (input.state === context.On) {
      command = 1
    } else if (input.state === context.Off) {
      command = 0
    }

    if (command === -1) {
      return
    }

    let code = '190800810005001903004500F800E60059004509B6'

    code += ElroPowerSocket.encodeBits(this.id, 10)
    code += ElroPowerSocket.encodeBits(command, 2)
    code += '02'

    return this.gateway.sendMediolaCode(code)
  }

  static encodeBits (value, length) {
    let code = ''

    for (let i = length - 1; i >= 0; i--) {
      if (value & (1 << i)) {
        code += '0001'
      } else {
        code += '0000'
      }
    }

    return code
  }
}

ElroPowerSocket.family0 = parseInt('00000', 2)
ElroPowerSocket.family1 = parseInt('10000', 2)
ElroPowerSocket.family2 = parseInt('01000', 2)
ElroPowerSocket.family3 = parseInt('00100', 2)
ElroPowerSocket.family4 = parseInt('00010', 2)
ElroPowerSocket.family5 = parseInt('00001', 2)
ElroPowerSocket.deviceA = parseInt('01111', 2)
ElroPowerSocket.deviceB = parseInt('10111', 2)
ElroPowerSocket.deviceC = parseInt('11011', 2)
ElroPowerSocket.deviceD = parseInt('11101', 2)
ElroPowerSocket.deviceE = parseInt('11110', 2)

export default ElroPowerSocket
