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
const getTtl_js_1 = require("../actions/getTtl.js");
const getOtherData_js_1 = require("../actions/getOtherData.js");
const axios_1 = require("axios");
const index_js_1 = require("../index.js");
exports.default = (zone, ip) => __awaiter(void 0, void 0, void 0, function* () {
    const dnsRecords = yield index_js_1.cf.dnsRecords.browse(zone);
    const recordid = dnsRecords.result.filter((record) => record.name === process.env.DOMAIN)[0].id;
    try {
        yield (0, axios_1.default)({
            method: 'PUT',
            url: `https://api.cloudflare.com/client/v4/zones/${zone}/dns_records/${recordid}`,
            data: {
                content: ip,
                ttl: yield (0, getTtl_js_1.default)(process.env.ZONE),
                id: recordid,
                type: 'A',
                name: process.env.DOMAIN,
                proxiable: (yield (0, getOtherData_js_1.default)(process.env.ZONE)).proxiable,
                proxied: (yield (0, getOtherData_js_1.default)(process.env.ZONE)).proxied,
            },
            headers: {
                'X-Auth-Email': process.env.CFMAIl,
                'X-Auth-Key': process.env.CFAPIKEY,
                'Content-type': 'application/json',
            },
        });
        logger.success(`Record's IP changed to ${ip}`);
    }
    catch (error) {
        logger.error('There was an error while changing the IP');
    }
});
//# sourceMappingURL=changeIp.js.map