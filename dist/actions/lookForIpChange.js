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
const logger = require("../utils/logger.js");
const getIp_js_1 = require("../actions/getIp.js");
const getLocalIp_js_1 = require("../actions/getLocalIp.js");
const changeIp_js_1 = require("../actions/changeIp.js");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('Checking for an IP change...');
    const ip = yield (0, getLocalIp_js_1.default)();
    if ((yield (0, getIp_js_1.default)(process.env.ZONE)) !== ip) {
        logger.info('IP changed. Updating Cloudflare...');
        yield (0, changeIp_js_1.default)(process.env.ZONE, ip);
    }
    else {
        logger.info('IP is up to date with Cloudflare');
    }
});
//# sourceMappingURL=lookForIpChange.js.map