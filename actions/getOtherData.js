import { cf } from '../index.js'

export default async(zone) => {
    const res = await cf.zones.read(zone)
    const dnsRecords = await cf.dnsRecords.browse(res.result.id)
    const proxiable = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].proxiable
    const proxied = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].proxied
    const zoneName = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].zone_name
    const ttl = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].ttl
    return {
        proxiable,
        proxied,
        ttl,
        zoneName
    }
}