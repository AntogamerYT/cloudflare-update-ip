import Cloudflare from 'cloudflare'
import 'dotenv/config'
import prompt from 'prompt'
import fs from 'node:fs'

import * as logger from './utils/logger.js'
import { default as getIp } from './actions/getIp.js'
import { default as getLocalIp } from './actions/getLocalIp.js'
import { default as lookForIpChange } from './actions/lookForIpChange.js'

export const cf = Cloudflare({
    email: process.env.CFMAIL,
    key: process.env.CFAPIKEY
})

async function main() {
    const ascii = fs.readFileSync('./ascii.txt').toString()
    
    process.removeAllListeners('warning')
    console.log(`${ascii}
                                        Cloudflare IP Updater
    `)
    logger.info('Application Initialized')
    /*if(typeof process.env.CFAPIKEY !== 'string') throw new TypeError('API Key must be a string')
    logger.debug('API Key loaded successfully')
    if(typeof process.env.CFMAIL !== 'string') throw new TypeError('Cloudfare Mail must be a string')
    logger.debug('Mail loaded successfully')
    if(typeof process.env.ZONE !== 'string') throw new TypeError('Zone Id must be a string')
    logger.debug('Zone Id loaded successfully')
    if(typeof process.env.DOMAIN !== 'string') throw new TypeError('Domain must be a string')
    logger.debug('Domain loaded successfully')*/

    let seconds = parseInt(process.env.SECONDS)
    if(isNaN(seconds)) {
        logger.debug('SECONDS environment variable is invalid or missing, showing prompt')
        seconds = await promptSeconds()
    }

    logger.info(`Checking for IP change every ${seconds} seconds`)
    logger.info('Cloudflare\'s IP: ' + (await getIp(process.env.ZONE)))
    logger.info('Your local IP: ' + await getLocalIp())

    await lookForIpChange()
    setInterval(async() => await lookForIpChange(),  seconds * 1000)
}

async function promptSeconds() {

    prompt.start()

    const options = {
        properties: {
            seconds: {
                description: 'Interval to wait beetwen IP checks',
                required: true,
                type: 'number',
                message: 'Please enter a number!',
            }
        }
    }

    const seconds = (await prompt.get(options)).seconds
    if(isNaN(seconds) || seconds < 1) {
        logger.error('Invalid seconds provided')
        await promptSeconds()
    }
    return seconds
}

main()