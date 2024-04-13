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
exports.Win32NetCommand = void 0;
const node_os_1 = require("node:os");
const node_child_process_1 = require("node:child_process");
class Win32NetCommand {
    constructor() {
        this.parseValues = (value) => {
            const values = [];
            let match;
            while ((match = Win32NetCommand.matchExpr.exec(value)) !== null) {
                values.push(match[1]);
            }
            return values;
        };
    }
    getInterfaces() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, node_child_process_1.exec)("wmic nic where NetConnectionStatus=2 get MACAddress, Name", (error, stdout, stderr) => {
                    if (error) {
                        const err = new Error();
                        err.name = "WMICError";
                        err.message = stderr;
                        reject(err);
                    }
                    const lines = stdout.split(node_os_1.EOL);
                    const interfaces = lines.slice(1, -1).map((line) => {
                        const [mac, name] = line.trim().split(/\s{2,}/);
                        return { mac, name };
                    }).filter((item) => item.mac !== undefined);
                    resolve(interfaces);
                });
            });
        });
    }
    getIpsAndGateways(iface) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, node_child_process_1.exec)(`wmic nicconfig where MACAddress="${iface.mac}" get DefaultIPGateway, IPAddress`, (error, stdout, stderr) => {
                    if (error) {
                        const err = new Error();
                        err.name = "WMICError";
                        err.message = stderr;
                        reject(err);
                    }
                    const lines = stdout.split(node_os_1.EOL);
                    const data = lines.slice(1, -1).map((line) => {
                        const [gwString, ipString] = line.trim().split(/\s{2,}/);
                        if (ipString === undefined ||
                            gwString === undefined ||
                            ipString === '' ||
                            gwString === '') {
                            return { ips: [], gateways: [] };
                        }
                        const ips = this.parseValues(ipString);
                        const gateways = this.parseValues(gwString);
                        return { ips, gateways };
                    }).filter((item) => item.gateways.length !== 0 && item.ips.length !== 0);
                    resolve(data[0]);
                });
            });
        });
    }
    getResult() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this
                    .getInterfaces()
                    .then((interfaces) => __awaiter(this, void 0, void 0, function* () {
                    const results = [];
                    Promise.all(interfaces.map((iface) => __awaiter(this, void 0, void 0, function* () {
                        const data = yield this.getIpsAndGateways(iface);
                        if (data) {
                            results.push(Object.assign(Object.assign({}, iface), data));
                        }
                    })))
                        .then(() => resolve(results));
                }))
                    .catch((error) => reject(error));
            });
        });
    }
}
exports.Win32NetCommand = Win32NetCommand;
Win32NetCommand.matchExpr = /\"(.*?)\"/gi;
//# sourceMappingURL=index.js.map