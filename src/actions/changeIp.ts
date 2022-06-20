import * as logger from '../utils/logger.js'
import { default as getTtl } from '../actions/getTtl.js'
import { default as getOtherData } from '../actions/getOtherData.js'
import { default as axios } from 'axios'
import { cf } from '../index.js'

export default async(zone: string, ip: string) => {
    const dnsRecords = await cf.dnsRecords.browse(zone) as any
    const recordid = dnsRecords.result.filter((record: any) => record.name === process.env.DOMAIN)[0].id
    try {
        await axios({
            method: 'PUT',
            url: `https://api.cloudflare.com/client/v4/zones/${zone}/dns_records/${recordid}`,
            data: {
                content: ip,
                ttl: await getTtl(process.env.ZONE!),
                id: recordid,
                type: 'A',
                name: process.env.DOMAIN,
                proxiable: (await getOtherData(process.env.ZONE!)).proxiable,
                proxied: (await getOtherData(process.env.ZONE!)).proxied,
            },
            headers: {
                'X-Auth-Email': process.env.CFMAIl!,
                'X-Auth-Key': process.env.CFAPIKEY!,
                'Content-type': 'application/json',
            },
        })
        logger.success(`Record's IP changed to ${ip}`)
    } catch (error) {
        logger.error('There was an error while changing the IP')
    }
}