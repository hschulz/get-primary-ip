import { platform } from "node:os"
import { Win32NetCommand } from "./src/win32"
import { LinuxNetCommand } from "./src/linux"
import { NetCommand } from "./src/NetCommand"
import {
    IfaceIpsAndGateways,
    IfaceMacAndName,
    IfaceResult,
    IpLinkResult,
    IpRouteResult
} from "./src/types"

/**
 * Try to get the primary IP address of the computer.
 *
 * @returns A command object that can be used to get the desired data.
 */
const getPrimaryIp = async (): Promise<IfaceResult[]> => {

    /* Prepare command */
    let cmd: NetCommand

    /* Use different implementations depending on the current platform */
    switch (platform()) {

        case "win32":
            cmd = new Win32NetCommand()
            break
        case "linux":
            cmd = new LinuxNetCommand()
            break
        default:
            throw new Error("Unsupported platform")
    }

    /* Return command result promise */
    return cmd.getResult()
}

export {
    getPrimaryIp,
    IfaceIpsAndGateways,
    IfaceMacAndName,
    IfaceResult,
    IpLinkResult,
    IpRouteResult,
    LinuxNetCommand,
    NetCommand,
    Win32NetCommand
}
