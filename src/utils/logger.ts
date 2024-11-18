import pkg from 'chalk'
const { yellow, red, green, blue, gray } = pkg;
import { verbosityLevels, type VerbosityLevel } from '../index.js'


export const warning = (text: string, level: VerbosityLevel) => {
    if(!checkVerb(level)) return
    console.log(yellow(`[!] ${text}`))
}

export const error = (text: string, level: VerbosityLevel) => {
    if(!checkVerb(level)) return
    console.log(red(`[!] ${text}`))
}

export const success = (text: string, level: VerbosityLevel) => {
    if(!checkVerb(level)) return
    console.log(green(`[✓] ${text}`))
}

export const info = (text: string, level: VerbosityLevel) => {
    if(!checkVerb(level)) return
    console.log(blue(`[i] ${text}`))
}

export const debug = (text: string, level: VerbosityLevel) => {
    if(!checkVerb(level)) return
    console.log(gray(`[i] ${text}`))
}

const checkVerb = (level: VerbosityLevel) => {
    if(verbosityLevels.indexOf(process.env.VERBOSITY!) >= verbosityLevels.indexOf(level)) { return true }
    else { return false }
}