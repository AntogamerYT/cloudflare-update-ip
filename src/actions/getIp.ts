import { cf } from '../index.js'
import * as logger from '../utils/logger.js'

export default async(zone: string) => {
    let res, dnsRecords, ip
    logger.debug('Getting Cloudflare IP...', 'debug')
    try {
        res = await cf.zones.read(zone) as any
        dnsRecords = await cf.dnsRecords.browse(res.result.id) as any
        ip = dnsRecords.result.filter((record: any) => record.name === process.env.DOMAIN)[0].content
    } catch (error) {
        logger.debug(`Failed getting Cloudfare IP.`, 'debug')
        // We are doing this because if there is no internet connection it will just throw an error and crash the program
        return "fail"
        //throw new Error('Error while getting IP from Cloudflare! Make sure you typed the correct zone ID in your env file!')
    }
    logger.debug(`Got Cloudflare IP: ${ip}`, 'debug')
    return ip
}