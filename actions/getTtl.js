import { cf } from '../index.js'

export default async(zone) => {
    const res = await cf.zones.read(zone)
    const dnsRecords = await cf.dnsRecords.browse(res.result.id)
    const ttl = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].ttl
    return ttl
}