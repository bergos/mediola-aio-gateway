const context = {
  On: 'http://ns.bergnet.org/dark-horse#On',
  Off: 'http://ns.bergnet.org/dark-horse#Off',
  desiredTemperature: 'http://ns.bergnet.org/dark-horse#desiredTemperature',
  humidity: 'http://ns.bergnet.org/dark-horse#humidity',
  lowBatteryPower: 'http://ns.bergnet.org/dark-horse#lowBatteryPower',
  state: {
    '@id': 'http://ns.bergnet.org/dark-horse#state',
    '@type': '@id'
  },
  temperature: 'http://ns.bergnet.org/dark-horse#temperature',
  valve: 'http://ns.bergnet.org/dark-horse#valve'
}

module.exports = context
