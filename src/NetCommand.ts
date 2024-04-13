import { IfaceIpsAndGateways, IfaceMacAndName, IfaceResult } from "./types"

/**
 * A simple interface for a network command that can be implemented
 * for different platforms.
 */
export interface NetCommand {

    /**
     * Get the interfaces and their respective names.
     * Implementations should filter out interfaces that do not have
     * a MAC address.
     */
    getInterfaces (): Promise<IfaceMacAndName[]>

    /**
     * Get the IP addresses and gateways of the interface
     * with the given MAC address.
     * Implementations should filter out results that do not contain
     * valid IP addresses or gateways.
     *
     * @param value Some identifier that can be used to get the desired data.
     */
    getIpsAndGateways (iface: IfaceMacAndName): Promise<IfaceIpsAndGateways>

    /**
     * Get the MAC address, name, IP addresses, and gateways of the interfaces.
     */
    getResult (): Promise<IfaceResult[]>
}
