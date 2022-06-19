import Cloudflare from 'cloudflare'
import axios from 'axios'
import 'dotenv/config'
import { default as logger } from './utils/logger.js'
process.removeAllListeners('warning')
console.log(`
                                          @@@@@@@@@@@@@@@@@@@@@                                  
                                       @@@@///////////////////@@@@                               
                                    @@@///////////////////////////@@@                            
                                  @@/////////////////////////////////@@                          
                                @@/////////////////////////////////////@                         
                    @@@@@@@@@@@@////////////////////////////////////////@                        
                 @@@//////////@//////////////////////////////////////////@                       
               @@/////////////////////////////////////////////////////////@@@@@@@@@@             
              @(////////////////////////////////////////////////////////// .,,,,,,,,@@@@@        
              @//////////////////////////////////////////////////////////  ,,,,,,,,,,,,,,@@      
          @@@@@/////////////////////////////////////////////////////////  ,,,,,,,,,,,,,,,,,@@    
      @@@@////////////////////////////////////////////////////////////    ,,,,,,,,,,,,,,,,,,,@@  
   @@@////////////////////////////////////////////////////////////,         ,,,,,,,,,,,,,,,,,,,@ 
  @(///////////////////////                                                            ,,,,,,,,@ 
 @///////////////////////////////////////////////////////////////         ,,,,,,,,,,,,,,,,,,,,,,@
@//////////////////////////////////////////////////////////////////    ,,,,,,,,,,,,,,,,,,,,,,,,,@
@//////////////////////////////////////////////////////////////////  ,,,,,,,,,,,,,,,,,,,,,,,,,,,@
@/////////////////////////////////////////////////////////////////  ,,,,,,,,,,,,,,,,,,,,,,,,,,,@ 
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
`)

const cf = Cloudflare({
    email: process.env.CFMAIl,
    key: process.env.CFAPIKEY
})

async function getIp(zone) {
    const res = await cf.zones.read(zone)
    const dnsRecords = await cf.dnsRecords.browse(res.result.id)
    const ip = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].content
    return ip
}
async function getTtl(zone) {
    const res = await cf.zones.read(zone)
    const dnsRecords = await cf.dnsRecords.browse(res.result.id)
    const ttl = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].ttl
    return ttl
}

async function otherData(zone) {
    const res = await cf.zones.read(zone)
    const dnsRecords = await cf.dnsRecords.browse(res.result.id)
    const proxiable = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].proxiable
    const proxied = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].proxied
    const zoneName = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].zone_name
    const ttl = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].ttl
    const data = {
        proxiable,
        proxied,
        ttl,
        zoneName
    }
    return data
}

async function getLocalIp() {
    const res = await axios.get('https://api.ipify.org?format=json')
    return res.data.ip
}

async function changeIp(zoneid, ip) {
    const dnsRecords = await cf.dnsRecords.browse(zoneid)
    const recordid = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].id
    await axios({
        method: 'PUT',
        url: `https://api.cloudflare.com/client/v4/zones/${zoneid}/dns_records/${recordid}`,
        data: {
            content: ip,
            ttl: await getTtl(process.env.ZONE),
            id: recordid,
            type: 'A',
            name: process.env.DOMAIN,
            proxiable: (await otherData(process.env.ZONE)).proxiable,
            proxied: (await otherData(process.env.ZONE)).proxied,
        },
        headers: {
            'X-Auth-Email': process.env.CFMAIl,
            'X-Auth-Key': process.env.CFAPIKEY,
            'Content-type': 'application/json',
        },
    })
}

console.log(await getIp(process.env.ZONE))
await changeIp(process.env.ZONE, await getLocalIp())