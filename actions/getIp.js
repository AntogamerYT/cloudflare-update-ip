import * as logger from '../utils/logger.js'
import { cf } from '../index.js'

export default async(zone) => {
    let res, dnsRecords, ip
    try {
        res = await cf.zones.read(zone)
        dnsRecords = await cf.dnsRecords.browse(res.result.id)
        ip = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].content
    } catch (error) {
        logger.error('Error getting IP from Cloudflare! Make sure you typed the correct zone ID in your env file!')
        throw error
    }
    return ip
}