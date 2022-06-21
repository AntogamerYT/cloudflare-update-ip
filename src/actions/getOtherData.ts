import { cf } from '../index.js'


export default async(zone: string) => {
    const res = await cf.zones.read(zone) as any
    const dnsRecords = await cf.dnsRecords.browse(res.result.id) as any
    const proxiable = dnsRecords.result.filter((record: any) => record.name === process.env.DOMAIN)[0].proxiable
    const proxied = dnsRecords.result.filter((record: any) => record.name === process.env.DOMAIN)[0].proxied
    const zoneName = dnsRecords.result.filter((record: any) => record.name === process.env.DOMAIN)[0].zone_name
    const ttl = dnsRecords.result.filter((record: any) => record.name === process.env.DOMAIN)[0].ttl
    const data = {
        proxiable,
        proxied,
        ttl,
        zoneName
    }

    return data
}