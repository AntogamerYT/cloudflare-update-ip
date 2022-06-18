import Cloudflare from 'cloudflare'
import axios from 'axios'
import 'dotenv/config'

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

async function getLocalIp() {
    const res = await axios.get('https://api.ipify.org?format=json')
    return res.data.ip
}

async function changeIp(zone, ip) {
    const res = await cf.zones.read(zone)
    const dnsRecords = await cf.dnsRecords.browse(res.result.id)

    const record = dnsRecords.result.filter(record => record.name === process.env.DOMAIN)[0]
    console.log(record.id)
    await cf.dnsRecords.edit(zone, record.id, { content: ip })
}

console.log(await getIp(process.env.ZONE))
console.log(await changeIp(process.env.ZONE, getLocalIp()))