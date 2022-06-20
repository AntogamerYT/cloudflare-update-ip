import * as Cloudflare from 'cloudflare'
import * as dotenv from 'dotenv'
import * as prompt from 'prompt'
import * as fs from 'fs'
dotenv.config({ path: process.cwd() + '/.env' })

import * as logger from './utils/logger.js'
import { default as getIp } from './actions/getIp.js'
import { default as getLocalIp } from './actions/getLocalIp.js'
import { default as lookForIpChange } from './actions/lookForIpChange.js'

// @ts-expect-error
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
    if(!process.env.CFAPIKEY) throw new TypeError('API Key must be provided')
    logger.debug('API Key loaded successfully')
    if(!process.env.CFMAIL) throw new TypeError('Cloudfare Mail must be provided')
    logger.debug('Mail loaded successfully')
    if(!process.env.ZONE) throw new TypeError('Zone Id must be provided')
    logger.debug('Zone Id loaded successfully')
    if(!process.env.DOMAIN) throw new TypeError('Domain must be provided')
    logger.debug('Domain loaded successfully')

    let seconds = parseInt(process.env.SECONDS ?? '')
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
                message: 'Please enter a number!',
            }
        }
    }

    let seconds = parseInt((await prompt.get(options)).seconds as any)
    if(isNaN(seconds) || seconds < 1) {
        logger.error('Invalid seconds provided')
        await promptSeconds()
    }
    return seconds
}

main()