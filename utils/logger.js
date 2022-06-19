import chalk from 'chalk'




const warning = async (text) => {
    console.log(chalk.yellow(text))
}
const error = async (text) => {
    console.log(chalk.red(text))
}
const success = async (text) => {
    console.log(chalk.green(text))
}
const info = async (text) => {
    console.log(chalk.blue(text))
}
const debug = async (text) => {
    console.log(chalk.gray(text))
}

const logger = {
    warning,
    error,
    success,
    info,
    debug
}

export default logger