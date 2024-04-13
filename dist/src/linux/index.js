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
exports.LinuxNetCommand = void 0;
const node_child_process_1 = require("node:child_process");
class LinuxNetCommand {
    getInterfaces() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, node_child_process_1.exec)("ip -j link show", (error, stdout, stderr) => {
                    if (error) {
                        const err = new Error();
                        err.name = "IPError";
                        err.message = stderr;
                        reject(err);
                    }
                    let data = [];
                    try {
                        data = JSON.parse(stdout);
                    }
                    catch (error) {
                        if (error instanceof SyntaxError) {
                            reject(error);
                        }
                        const err = new Error();
                        err.name = "IPError";
                        err.message = "Unknown error";
                        reject(err);
                    }
                    const interfaces = data.map((iface) => {
                        if (iface.link_type !== "ether" && iface.operstate !== "UP") {
                            return { mac: "", name: "" };
                        }
                        const mac = iface.address;
                        const name = iface.ifname;
                        return { mac, name };
                    }).filter((iface) => iface.mac !== "" && iface.name !== "");
                    resolve(interfaces);
                });
            });
        });
    }
    getIpsAndGateways(iface) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, node_child_process_1.exec)(`ip -d -j route show`, (error, stdout, stderr) => {
                    if (error) {
                        const err = new Error();
                        err.name = "IPError";
                        err.message = stderr;
                        reject(err);
                    }
                    let data = [];
                    try {
                        data = JSON.parse(stdout);
                    }
                    catch (error) {
                        if (error instanceof SyntaxError) {
                            reject(error);
                        }
                        const err = new Error();
                        err.name = "IPError";
                        err.message = "Could not parse `ip` JSON data";
                        reject(err);
                    }
                    const ips = [];
                    const gateways = [];
                    data
                        .filter((route) => route.dev === iface.name)
                        .forEach((route) => {
                        if (route.dst === undefined ||
                            route.gateway === undefined ||
                            route.flags.indexOf("linkdown") !== -1) {
                            return;
                        }
                        ips.push(route.prefsrc);
                        gateways.push(route.gateway);
                    });
                    resolve({ ips, gateways });
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
                        .then(() => __awaiter(this, void 0, void 0, function* () { return resolve(results); }));
                }))
                    .catch((error) => reject(error));
            });
        });
    }
}
exports.LinuxNetCommand = LinuxNetCommand;
//# sourceMappingURL=index.js.map