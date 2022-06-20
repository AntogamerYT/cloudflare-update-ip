import * as logger from '../utils/logger.js'
import { default as getIp } from '../actions/getIp.js'
import { default as getLocalIp } from '../actions/getLocalIp.js'
import { default as changeIp } from '../actions/changeIp.js'

export default async() => {
    logger.info('Checking for an IP change...')
    const ip = await getLocalIp()
    if (await getIp(process.env.ZONE!) !== ip) {
        logger.info('IP changed. Updating Cloudflare...')
        await changeIp(process.env.ZONE!, ip)
    } else {
        logger.info('IP is up to date with Cloudflare')
    }
}