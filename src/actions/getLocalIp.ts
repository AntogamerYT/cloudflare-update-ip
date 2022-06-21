import { default as axios } from 'axios'
import * as logger from '../utils/logger.js'

export default async() => {
    logger.debug('Getting local IP...', 'debug')
    const ip = (await axios.get('https://api.ipify.org?format=json')).data.ip
    logger.debug('Got local IP: ' + ip, 'debug')
    return ip
}