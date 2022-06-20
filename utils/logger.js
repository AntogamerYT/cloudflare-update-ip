import chalk from 'chalk'


export const warning = (text) => {
    console.log(chalk.yellow(`[!] ${text}`))
}

export const error = (text) => {
    console.log(chalk.red(`[!] ${text}`))
}

export const success = (text) => {
    console.log(chalk.green(`[✓] ${text}`))
}

export const info = (text) => {
    console.log(chalk.blue(`[i] ${text}`))
}

export const debug = (text) => {
    console.log(chalk.gray(`[i] ${text}`))
}