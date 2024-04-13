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
exports.Win32NetCommand = exports.LinuxNetCommand = exports.getPrimaryIp = void 0;
const node_os_1 = require("node:os");
const win32_1 = require("./src/win32");
Object.defineProperty(exports, "Win32NetCommand", { enumerable: true, get: function () { return win32_1.Win32NetCommand; } });
const linux_1 = require("./src/linux");
Object.defineProperty(exports, "LinuxNetCommand", { enumerable: true, get: function () { return linux_1.LinuxNetCommand; } });
const getPrimaryIp = () => __awaiter(void 0, void 0, void 0, function* () {
    let cmd;
    switch ((0, node_os_1.platform)()) {
        case "win32":
            cmd = new win32_1.Win32NetCommand();
            break;
        case "linux":
            cmd = new linux_1.LinuxNetCommand();
            break;
        default:
            throw new Error("Unsupported platform");
    }
    return cmd.getResult();
});
exports.getPrimaryIp = getPrimaryIp;
//# sourceMappingURL=index.js.map