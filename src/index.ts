import * as Cloudflare from 'cloudflare'
import * as dotenv from 'dotenv'
import * as prompt from 'prompt'
import * as fs from 'fs'
dotenv.config({ path: process.cwd() + '/.env' })

import * as logger from './utils/logger.js'
import { default as lookForIpChange } from './actions/lookForIpChange.js'

// @ts-expect-error
export const cf = Cloudflare({
    email: process.env.CFMAIL,
    key: process.env.CFAPI
})

export const verbosityLevels = ['none', 'errors', 'default', 'detailed', 'debug']


async function main() {
    const ascii = fs.readFileSync('./ascii.txt').toString()
    
    process.removeAllListeners('warning')
    console.log(`${ascii}
                                        Cloudflare IP Updater
    `)
    if(!process.env.VERBOSITY || !verbosityLevels.includes(process.env.VERBOSITY)) {
        process.env.VERBOSITY = 'default'
        logger.info('Verbosity level invalid or missing, defaulting to "default"', 'default')
    }
    logger.info('Application Initialized', 'none')
    if(!process.env.CFAPI) throw new TypeError('API Key must be provided')
    logger.debug('API Key loaded successfully', 'none')
    if(!process.env.CFMAIL) throw new TypeError('Cloudfare Mail must be provided')
    logger.debug('Mail loaded successfully', 'none')
    if(!process.env.ZONE) throw new TypeError('Zone Id must be provided')
    logger.debug('Zone Id loaded successfully', 'none')
    if(!process.env.DOMAIN) throw new TypeError('Domain must be provided')
    logger.debug('Domain loaded successfully', 'none')

    let seconds = parseInt(process.env.SECONDS ?? '')
    if(isNaN(seconds)) {
        logger.debug('SECONDS environment variable is invalid or missing, showing prompt', 'debug')
        seconds = await promptSeconds()
    }

    logger.debug(`Checking for IP change every ${seconds} seconds`, 'debug')

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
        logger.error('Invalid seconds provided', 'none')
        await promptSeconds()
    }
    return seconds
}

main()


// Typings
export type VerbosityLevel = 'none' | 'errors' | 'default' | 'detailed' | 'debug'