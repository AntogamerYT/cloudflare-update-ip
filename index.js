import Cloudflare from 'cloudflare'
import axios from 'axios'
import 'dotenv/config'
import { default as logger } from './utils/logger.js'
import prompt from 'prompt'
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

                                    Cloudflare IP Updater
`)
prompt.start()
const options = {
    properties: {
        seconds: {
            description: 'Seconds to wait before checking/changing the IP',
            required: true,
            type: 'number',
            message: 'Please enter a number!',
        }
}
}
const {seconds} = await prompt.get(options)

await logger.info('[i] Starting IP updater...')

const cf = Cloudflare({
    email: process.env.CFMAIl,
    key: process.env.CFAPIKEY
})

async function getIp(zone) {
    let res
    let dnsRecords
    let ip
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
logger.info('[i] Cloudflare\'s IP is ' + (await getIp(process.env.ZONE)))
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
logger.info('[i] Your local IP is: ' + await getLocalIp())
async function changeIp(zoneid, ip) {
    const dnsRecords = await cf.dnsRecords.browse(zoneid)
    const recordid = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0].id
    try {
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
        logger.success(`Record's IP changed to ${ip}!`)
    } catch (error) {
        logger.error('There was an error while changing the IP!')
    }
}

logger.success('[i] IP updater started!')
let ip

ip = await getLocalIp()
if (await getIp(process.env.ZONE) !== ip) {
    logger.warning('[!] IP changed! Updating Cloudflare...')
    await changeIp(process.env.ZONE, ip)
} else logger.success('[i] IP is up to date with cloudflare!')

setInterval(async () => {
    logger.info('[i] Checking for new IP...')
    ip = await getLocalIp()
    if (await getIp(process.env.ZONE) !== ip) {
        logger.warning('[!] IP changed! Updating Cloudflare...')
        await changeIp(process.env.ZONE, ip)
    } else logger.success('[i] IP is up to date with cloudflare!')
},30 * 1000 )