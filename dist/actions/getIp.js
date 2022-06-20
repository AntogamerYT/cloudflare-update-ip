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
const index_js_1 = require("../index.js");
exports.default = (zone) => __awaiter(void 0, void 0, void 0, function* () {
    let res, dnsRecords, ip;
    try {
        res = (yield index_js_1.cf.zones.read(zone));
        dnsRecords = (yield index_js_1.cf.dnsRecords.browse(res.result.id));
        ip = dnsRecords.result.filter((record) => record.name === process.env.DOMAIN)[0].content;
    }
    catch (error) {
        logger.error('Error getting IP from Cloudflare! Make sure you typed the correct zone ID in your env file!');
        throw error;
    }
    return ip;
});
//# sourceMappingURL=getIp.js.map