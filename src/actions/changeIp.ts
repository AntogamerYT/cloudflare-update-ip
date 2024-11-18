import * as logger from '../utils/logger.js'
import { default as getTtl } from '../actions/getTtl.js'
import { default as getOtherData } from '../actions/getOtherData.js'
import { cf } from '../index.js'

export default async(zone: string, ip: string) => {
    const dnsRecords = await cf.dnsRecords.browse(zone) as any
    const recordid = dnsRecords.result.filter((record: any) => record.name === process.env.DOMAIN)[0].id
    logger.debug('Got Record ID, running request...', 'debug')
    try {
        const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}/dns_records/${recordid}`, {
            method: "PUT",
            headers: {
                'X-Auth-Email': process.env.CFMAIL!,
                'X-Auth-Key': process.env.CFAPI!,
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                content: ip,
                ttl: await getTtl(process.env.ZONE!),
                id: recordid,
                type: 'A',
                name: process.env.DOMAIN,
                proxiable: (await getOtherData(process.env.ZONE!)).proxiable,
                proxied: (await getOtherData(process.env.ZONE!)).proxied,
            })
        })
        logger.debug(`Received status of ${res.status}: ${res.statusText}`, 'debug')
        // Did both because I don't remember if it's 200 or 204
        if (res.status !== 200 && res.status !== 204) {
            logger.error('There was an error while changing the IP', 'errors')
            logger.debug(`Received status of ${res.status}: ${res.statusText}`, 'debug')
            return;
        }

        logger.success(`Record's IP changed to ${ip}`, 'default')
    } catch (error) {
        logger.error('There was an error while changing the IP', 'errors')
        logger.debug(`Encountered error: ${error}`, 'debug')
    }
}
