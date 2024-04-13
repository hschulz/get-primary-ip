import { EOL } from "node:os"
import { exec } from "node:child_process"
import { NetCommand } from "../NetCommand"
import { IfaceIpsAndGateways, IfaceMacAndName, IfaceResult } from "../types"

/**
 * Win32 implementation of NetCommand.
 */
export class Win32NetCommand implements NetCommand {

    /**
     * Regular expression to parse wmic return values.
     */
    protected static matchExpr = /\"(.*?)\"/gi

    /**
     * Parse wmic values into an array.
     * The wmic command returns a string like this:
     * `{"0.1.2.3", "::abcd:1234:5678:90ab"}`
     *
     * @param value String to parse.
     * @returns Array of result values.
     */
    private parseValues = (value: string): string[] => {

        const values = []

        let match

        while ((match = Win32NetCommand.matchExpr.exec(value)) !== null) {
            values.push(match[1]);
        }

        return values
    }

    /**
     * Runs a wmic command in a child process to get the interface names and MAC addresses.
     * The `NetConnectionStatus=2` filter is used to get only the interfaces that are connected.
     *
     * @see https://learn.microsoft.com/en-us/dotnet/api/microsoft.powershell.commands.netconnectionstatus?view=powershellsdk-1.1.0
     * @returns Array of interfaces.
     */
    public async getInterfaces (): Promise<IfaceMacAndName[]> {

        return new Promise((resolve, reject) => {

            exec("wmic nic where NetConnectionStatus=2 get MACAddress, Name", (error, stdout, stderr) => {

                /*
                 * If there is an error, we reject the promise with a new Error object.
                 * The error object has a custom name and the message content
                 * is the stderr output.
                 */
                if (error) {
                    const err = new Error()
                    err.name = "WMICError"
                    err.message = stderr
                    reject(err)
                }

                /* Split the lines by using the system EOL */
                const lines = stdout.split(EOL)

                /*
                 * The first and last lines are not needed, so we slice them out.
                 * The remaining lines should be the interfaces.
                 */
                const interfaces = lines.slice(1, -1).map((line) => {

                    /*
                     * Assuming the contents are separated by at least
                     * two spaces is risky, but it's the best we can do
                     * for now.
                     */
                    const [mac, name] = line.trim().split(/\s{2,}/)

                    return { mac, name }

                /*
                 * Filter out interfaces without MAC addresses.
                 * This basically removes data that is errorneous.
                 */
                }).filter((item) => item.mac !== undefined)

                resolve(interfaces)
            })
        })
    }

    /**
     * Runs a wmic command in a child process to get the IP addresses and gateways for a given MAC address.
     *
     * @param iface The interface to get the IP addresses and gateways for.
     * @returns Object with the IP addresses and gateways.
     */
    public async getIpsAndGateways (iface: IfaceMacAndName): Promise<IfaceIpsAndGateways> {

        return new Promise((resolve, reject) => {

            exec(`wmic nicconfig where MACAddress="${iface.mac}" get DefaultIPGateway, IPAddress`, (error, stdout, stderr) => {

                /*
                 * If there is an error, we reject the promise with a new Error object.
                 * The error object has a custom name and the message content
                 * is the stderr output.
                 */
                if (error) {
                    const err = new Error()
                    err.name = "WMICError"
                    err.message = stderr
                    reject(err)
                }

                /* Split the lines by using the system EOL */
                const lines = stdout.split(EOL)

                /*
                 * The first and last lines are not needed, so we slice them out.
                 * The remaining lines should be the IP addresses and gateways.
                 */
                const data = lines.slice(1, -1).map((line) => {
                    const [ gwString, ipString ] = line.trim().split(/\s{2,}/)

                    /* Filter out invalid data */
                    if (
                        ipString === undefined ||
                        gwString === undefined ||
                        ipString === '' ||
                        gwString === ''
                    ) {
                        return { ips: [], gateways: [] }
                    }

                    /* Parse the values */
                    const ips = this.parseValues(ipString)
                    const gateways = this.parseValues(gwString)

                    return { ips, gateways }

                /* Remove entries that do not contain information */
                }).filter((item) => item.gateways.length !== 0 && item.ips.length !== 0)

                /* The array should only contain one line anyways */
                resolve(data[0])
            })
        })
    }

    /**
     * Get the interfaces, IP addresses and gateways.
     * This method is a wrapper around the `getInterfaces`
     * and `getIpsAndGateways` methods.
     *
     * @returns Object with the interfaces, IP addresses and gateways.
     */
    public async getResult (): Promise<IfaceResult[]> {

        return new Promise((resolve, reject) => {

            this
            .getInterfaces()
            .then(async (interfaces) => {

                const results: IfaceResult[] = []

                Promise.all(interfaces.map(async (iface) => {

                    const data = await this.getIpsAndGateways(iface)

                    if (data) {
                        results.push({ ...iface, ...data })
                    }
                }))
                .then(() => resolve(results))
            })
            .catch((error) => reject(error))
        })
    }
}
