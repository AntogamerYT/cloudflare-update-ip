import * as logger from '../utils/logger.js'
import { default as getIp } from '../actions/getIp.js'
import { default as getLocalIp } from '../actions/getLocalIp.js'
import { default as changeIp } from '../actions/changeIp.js'

export default async() => {
    logger.debug('Checking for an IP change...', 'detailed')
    const ip = await getLocalIp()
    const zoneIp = await getIp(process.env.ZONE!)
    if (zoneIp === 'fail') {
        logger.error("Failed getting CloudGlare IP. Make sure you have internet connection and the zone ID is correct", 'errors')
    } else if (zoneIp !== ip) {
        logger.debug('IP changed. Updating Cloudflare...', 'default')
        await changeIp(process.env.ZONE!, ip)
    } else {
        logger.debug('IP is up to date with Cloudflare', 'detailed')
    }
}