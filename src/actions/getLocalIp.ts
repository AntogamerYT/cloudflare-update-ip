import { default as axios } from 'axios'

export default async() => (await axios.get('https://api.ipify.org?format=json')).data.ip