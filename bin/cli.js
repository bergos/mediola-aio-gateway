#!/usr/bin/env node

import { Command } from 'commander'
import Gateway from '../Gateway.js'
import HomeMaticHeaterController from '../HomeMaticHeaterController.js'
import HomeMaticTemperatureSensor from '../HomeMaticTemperatureSensor.js'

const program = new Command()

program
  .command('status <url>')
  .option('-d, --device <device>', 'device')
  .action(async (url, { device } = {}) => {
    try {
      const gateway = new Gateway(url)

      let states

      if (device) {
        states = await gateway.getState(device)
      } else {
        states = await gateway.getStates()
      }

      console.log(JSON.stringify(states, null, ' '))
    } catch (err) {
      console.error(err)
    }
  })

program
  .command('learn <url>')
  .action(async url => {
    try {
      const gateway = new Gateway(url)

      const result = await gateway.sendCommand({
        XC_FNC: 'LearnSC',
        type: 'HM'
      })

      console.log(JSON.stringify(result, null, ' '))
    } catch (err) {
      console.error(err)
    }
  })

program
  .command('home-matic-heater-controller <url> <device>')
  .option('-t, --temperature <temperature>', 'temperature', parseFloat)
  .option('-r, --remove', 'remove')
  .action(async (url, device, { temperature, remove } = {}) => {
    try {
      const gateway = new Gateway(url)
      const heaterController = new HomeMaticHeaterController(gateway, device)

      if (typeof temperature !== 'undefined') {
        return heaterController.put({ targetTemperature: temperature })
      }

      if (remove) {
        return heaterController.delete()
      }

      const state = await heaterController.get()

      console.log(JSON.stringify(state, null, ' '))
    } catch (err) {
      console.error(err)
    }
  })

program
  .command('home-matic-temperature-sensor <url> <device>')
  .action(async (url, device) => {
    try {
      const gateway = new Gateway(url)
      const sensor = new HomeMaticTemperatureSensor(gateway, device)

      const state = await sensor.get()

      console.log(JSON.stringify(state, null, ' '))
    } catch (err) {
      console.error(err)
    }
  })

program.parse(process.argv)
