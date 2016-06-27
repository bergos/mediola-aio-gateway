'use strict'

let context = {
  desiredTemperature: 'http://ns.bergnet.org/dark-horse#desiredTemperature',
  humidity: 'http://ns.bergnet.org/dark-horse#humidity',
  lowBatteryPower: 'http://ns.bergnet.org/dark-horse#lowBatteryPower',
  on: 'http://ns.bergnet.org/dark-horse#on',
  off: 'http://ns.bergnet.org/dark-horse#off',
  state: {
    '@id': 'http://ns.bergnet.org/dark-horse#state',
    '@type': '@id'
  },
  temperature: 'http://ns.bergnet.org/dark-horse#temperature',
  valve: 'http://ns.bergnet.org/dark-horse#valve'
}

module.exports = context
