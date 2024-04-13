import { exec } from "node:child_process"
import { NetCommand } from "../NetCommand"
import { IfaceIpsAndGateways, IfaceMacAndName, IfaceResult, IpLinkResult, IpRouteResult } from "../types"

/**
 * Linux implementation of the NetCommand interface.
 */
export class LinuxNetCommand implements NetCommand {

    /**
     * Runs the `ip` command in a child process to get the
     * interface names and MAC addresses.
     *
     * @returns Array of interfaces.
     */
    public async getInterfaces (): Promise<IfaceMacAndName[]> {

        return new Promise((resolve, reject) => {

            /* Run ip and return result as json */
            exec("ip -j link show", (error, stdout, stderr) => {

                if (error) {
                    const err = new Error()
                    err.name = "IPError"
                    err.message = stderr
                    reject(err)
                }

                let data: IpLinkResult[] = []

                try {
                    data = JSON.parse(stdout)
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        reject(error)
                    }

                    const err = new Error()
                    err.name = "IPError"
                    err.message = "Unknown error"
                    reject(err)
                }

                /* Iterate results */
                const interfaces = data.map((iface) => {

                    /* Skip non-ethernet interfaces and those that are down */
                    if (iface.link_type !== "ether" && iface.operstate !== "UP") {
                        return { mac: "", name: "" }
                    }

                    /* Extract MAC and name */
                    const mac = iface.address
                    const name = iface.ifname

                    return { mac, name }

                /* Filter out empty results */
                }).filter((iface) => iface.mac !== "" && iface.name !== "")

                resolve(interfaces)
            })
        })
    }

    /**
     * Runs the `ip route` command in a child process to get the
     * IP addresses and gateways for a given interface.
     *
     * @see https://manpages.ubuntu.com/manpages/jammy/man8/ip-route.8.html
     * @param iface The interface to get the IP addresses and gateways for.
     * @returns Object with the IP addresses and gateways.
     */
    public async getIpsAndGateways (iface: IfaceMacAndName): Promise<IfaceIpsAndGateways> {

        return new Promise((resolve, reject) => {

            /* Run ip and return result as json */
            exec(`ip -d -j route show`, (error, stdout, stderr) => {

                if (error) {
                    const err = new Error()
                    err.name = "IPError"
                    err.message = stderr
                    reject(err)
                }

                let data: IpRouteResult[] = []

                try {
                    data = JSON.parse(stdout)
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        reject(error)
                    }

                    const err = new Error()
                    err.name = "IPError"
                    err.message = "Could not parse `ip` JSON data"
                    reject(err)
                }

                const ips: string[] = []
                const gateways: string[] = []

                /* Only process routes for the given interface */
                data
                .filter((route) => route.dev === iface.name)
                .forEach((route) => {
                    if (
                        route.dst === undefined ||
                        route.gateway === undefined ||
                        route.flags.indexOf("linkdown") !== -1
                    ) {
                        return // Skip invalid routes
                    }

                    /* Add IP and gateway to the result */
                    ips.push(route.prefsrc)
                    gateways.push(route.gateway)
                })

                resolve({ ips, gateways })
            })
        })
    }

    /**
     * Shortcut method to get all interfaces with their
     * MAC addresses, names, IP addresses, and gateways.
     *
     * @see https://manpages.ubuntu.com/manpages/jammy/man8/ip.8.html
     * @returns Array of interfaces with their MAC addresses, names, IP addresses, and gateways.
     */
    public async getResult (): Promise<IfaceResult[]> {

        return new Promise((resolve, reject) => {

            this
            .getInterfaces()
            .then(async (interfaces): Promise<void> => {

                const results: IfaceResult[] = []

                Promise.all(interfaces.map(async (iface): Promise<void> => {

                    const data = await this.getIpsAndGateways(iface)

                    if (data) {
                        results.push({ ...iface, ...data })
                    }
                }))
                .then(async (): Promise<void> => resolve(results))
            })
            .catch((error) => reject(error))
        })
    }
}
