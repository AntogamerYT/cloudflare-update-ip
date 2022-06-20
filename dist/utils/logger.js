"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.info = exports.success = exports.error = exports.warning = void 0;
const chalk = require("chalk");
const warning = (text) => {
    console.log(chalk.yellow(`[!] ${text}`));
};
exports.warning = warning;
const error = (text) => {
    console.log(chalk.red(`[!] ${text}`));
};
exports.error = error;
const success = (text) => {
    console.log(chalk.green(`[✓] ${text}`));
};
exports.success = success;
const info = (text) => {
    console.log(chalk.blue(`[i] ${text}`));
};
exports.info = info;
const debug = (text) => {
    console.log(chalk.gray(`[i] ${text}`));
};
exports.debug = debug;
//# sourceMappingURL=logger.js.map