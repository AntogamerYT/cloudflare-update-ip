import * as chalk from 'chalk'


export const warning = (text: string) => {
    console.log(chalk.yellow(`[!] ${text}`))
}

export const error = (text: string) => {
    console.log(chalk.red(`[!] ${text}`))
}

export const success = (text: string) => {
    console.log(chalk.green(`[✓] ${text}`))
}

export const info = (text: string) => {
    console.log(chalk.blue(`[i] ${text}`))
}

export const debug = (text: string) => {
    console.log(chalk.gray(`[i] ${text}`))
}