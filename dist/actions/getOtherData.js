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
const index_js_1 = require("../index.js");
exports.default = (zone) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield index_js_1.cf.zones.read(zone);
    const dnsRecords = yield index_js_1.cf.dnsRecords.browse(res.result.id);
    const proxiable = dnsRecords.result.filter((record) => record.name === process.env.DOMAIN)[0].proxiable;
    const proxied = dnsRecords.result.filter((record) => record.name === process.env.DOMAIN)[0].proxied;
    const zoneName = dnsRecords.result.filter((record) => record.name === process.env.DOMAIN)[0].zone_name;
    const ttl = dnsRecords.result.filter((record) => record.name === process.env.DOMAIN)[0].ttl;
    return {
        proxiable,
        proxied,
        ttl,
        zoneName
    };
});
//# sourceMappingURL=getOtherData.js.map