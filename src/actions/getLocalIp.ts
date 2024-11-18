import * as logger from '../utils/logger.js'

export default async() => {
    logger.debug('Getting local IP...', 'debug')
    try {
        const ipReq = await fetch('https://api.ipify.org?format=json')

        if (ipReq.status !== 200) {
            logger.error('Failed getting local IP', 'errors')
            logger.debug(`Received status of ${ipReq.status}: ${ipReq.statusText}`, 'debug')
            return 'fail'
        }

        const ip = (await ipReq.json() as any).ip
        logger.debug('Got local IP: ' + ip, 'debug')
        return ip
    } catch (error) {
        logger.error('Failed getting local IP', 'errors')
        logger.debug(`Encountered error: ${error}`, 'debug')
        return 'fail'
    }
}