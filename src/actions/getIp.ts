import * as logger from '../utils/logger.js'
import { cf } from '../index.js'

export default async(zone: string) => {
    let res, dnsRecords, ip
    try {
        res = await cf.zones.read(zone) as any
        dnsRecords = await cf.dnsRecords.browse(res.result.id) as any
        ip = dnsRecords.result.filter((record: any) => record.name === process.env.DOMAIN)[0].content
    } catch (error) {
        logger.error('Error getting IP from Cloudflare! Make sure you typed the correct zone ID in your env file!')
        throw error
    }
    return ip
}