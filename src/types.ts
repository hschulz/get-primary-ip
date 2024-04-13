/**
 * A simple result type for the getInterfaces method.
 */
export type IfaceMacAndName = {

    /** The MAC address of the interface. */
    mac: string,

    /** The name of the interface. */
    name: string
}

/**
 * A simple result type for the getIpsAndGateways method.
 */
export type IfaceIpsAndGateways = {

    /** The IP addresses of the interface. */
    ips: string[],

    /** The gateways of the interface. */
    gateways: string[]
}

/**
 * A combined result type for the getResult method that includes
 * the MAC address, name, IP addresses, and gateways of the interface.
 */
export type IfaceResult = IfaceMacAndName & IfaceIpsAndGateways

/**
 * Minimum data structure returned by the `ip link` command.
 *
 * @see https://manpages.ubuntu.com/manpages/jammy/man8/ip.8.html
 * @see https://manpages.ubuntu.com/manpages/jammy/man8/ip-link.8.html
 */
export type IpLinkResult = {

    /** Interface name */
    ifname: string

    /** MAC address */
    address: string

    /** Interface type */
    link_type: string

    /** Interface state */
    operstate: string
}

/**
 * Result type for the `ip route` command.
 *
 * @see https://manpages.ubuntu.com/manpages/jammy/man8/ip.8.html
 * @see https://manpages.ubuntu.com/manpages/jammy/man8/ip-route.8.html
 */
export type IpRouteResult = {

    /** Route type */
    type: string

    /** Destination IP address */
    dst: string

    /** Gateway IP address */
    gateway: string

    /** Device name */
    dev: string

    /** Protocol name */
    protocol: string

    /** Scope descriptor */
    scope: string

    /** Source IP address */
    prefsrc: string

    /** Flags */
    flags: string[]
}
