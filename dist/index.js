"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cf = void 0;
const Cloudflare = require("cloudflare");
const dotenv = require("dotenv");
const prompt = require("prompt");
const fs = require("fs");
dotenv.config();
const logger = require("./utils/logger.js");
const getIp_js_1 = require("./actions/getIp.js");
const getLocalIp_js_1 = require("./actions/getLocalIp.js");
const lookForIpChange_js_1 = require("./actions/lookForIpChange.js");
//@ts-expect-error
exports.cf = Cloudflare({
    email: process.env.CFMAIL,
    key: process.env.CFAPIKEY
});
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const ascii = fs.readFileSync('./ascii.txt').toString();
        process.removeAllListeners('warning');
        console.log(`${ascii}
                                        Cloudflare IP Updater
    `);
        logger.info('Application Initialized');
        if (!process.env.CFAPI)
            throw new TypeError('API Key must be provided');
        logger.debug('API Key loaded successfully');
        if (!process.env.CFMAIL)
            throw new TypeError('Cloudfare Mail must be provided');
        logger.debug('Mail loaded successfully');
        if (!process.env.ZONE)
            throw new TypeError('Zone Id must be provided');
        logger.debug('Zone Id loaded successfully');
        if (!process.env.DOMAIN)
            throw new TypeError('Domain must be provided');
        logger.debug('Domain loaded successfully');
        let seconds = parseInt((_a = process.env.SECONDS) !== null && _a !== void 0 ? _a : '');
        if (isNaN(seconds)) {
            logger.debug('SECONDS environment variable is invalid or missing, showing prompt');
            seconds = yield promptSeconds();
        }
        logger.info(`Checking for IP change every ${seconds} seconds`);
        logger.info('Cloudflare\'s IP: ' + (yield (0, getIp_js_1.default)(process.env.ZONE)));
        logger.info('Your local IP: ' + (yield (0, getLocalIp_js_1.default)()));
        yield (0, lookForIpChange_js_1.default)();
        setInterval(() => __awaiter(this, void 0, void 0, function* () { return yield (0, lookForIpChange_js_1.default)(); }), seconds * 1000);
    });
}
function promptSeconds() {
    return __awaiter(this, void 0, void 0, function* () {
        prompt.start();
        const options = {
            properties: {
                seconds: {
                    description: 'Interval to wait beetwen IP checks',
                    required: true,
                    message: 'Please enter a number!',
                }
            }
        };
        let seconds = parseInt((yield prompt.get(options)).seconds);
        if (isNaN(seconds) || seconds < 1) {
            logger.error('Invalid seconds provided');
            yield promptSeconds();
        }
        return seconds;
    });
}
main();
//# sourceMappingURL=index.js.map