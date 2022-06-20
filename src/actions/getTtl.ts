import { cf } from '../index.js'

export default async(zone: string) => {
    /* generic object, yikes */
    const res = await cf.zones.read(zone) as any
    const dnsRecords = await cf.dnsRecords.browse(res.result.id) as any
    const ttl = dnsRecords.result.filter((record: any) => record.name === process.env.DOMAIN)[0].ttl
    return ttl
}