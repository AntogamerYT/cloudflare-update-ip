import * as logger from '../utils/logger.js'
import { default as getIp } from '../actions/getIp.js'
import { default as getLocalIp } from '../actions/getLocalIp.js'
import { default as changeIp } from '../actions/changeIp.js'

export default async() => {
    logger.debug('Checking for an IP change...', 'detailed')
    const ip = await getLocalIp()
    if (await getIp(process.env.ZONE!) !== ip) {
        logger.debug('IP changed. Updating Cloudflare...', 'default')
        await changeIp(process.env.ZONE!, ip)
    } else {
        logger.debug('IP is up to date with Cloudflare', 'detailed')
    }
}