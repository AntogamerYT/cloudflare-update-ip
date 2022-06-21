import * as chalk from 'chalk'
import { verbosityLevels, type VerbosityLevel } from '../index.js'


export const warning = (text: string, level: VerbosityLevel) => {
    if(!checkVerb(level)) return
    console.log(chalk.yellow(`[!] ${text}`))
}

export const error = (text: string, level: VerbosityLevel) => {
    if(!checkVerb(level)) return
    console.log(chalk.red(`[!] ${text}`))
}

export const success = (text: string, level: VerbosityLevel) => {
    if(!checkVerb(level)) return
    console.log(chalk.green(`[✓] ${text}`))
}

export const info = (text: string, level: VerbosityLevel) => {
    if(!checkVerb(level)) return
    console.log(chalk.blue(`[i] ${text}`))
}

export const debug = (text: string, level: VerbosityLevel) => {
    if(!checkVerb(level)) return
    console.log(chalk.gray(`[i] ${text}`))
}

const checkVerb = (level: VerbosityLevel) => {
    if(verbosityLevels.indexOf(process.env.VERBOSITY!) >= verbosityLevels.indexOf(level)) { return true }
    else { return false }
}