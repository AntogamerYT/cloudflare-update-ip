import { cf } from '../index.js'
import * as logger from '../utils/logger.js'

export default async(zone: string) => {
    logger.debug('Getting time-to-live (TTL)...', 'debug')
    const res = await cf.zones.read(zone) as any
    const dnsRecords = await cf.dnsRecords.browse(res.result.id) as any
    const ttl = dnsRecords.result.filter((record: any) => record.name === process.env.DOMAIN)[0].ttl
    logger.debug('Got time-to-live (TTL): ' + ttl, 'debug')
    return ttl
}