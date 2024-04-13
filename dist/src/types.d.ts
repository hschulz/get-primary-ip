export type IfaceMacAndName = {
    mac: string;
    name: string;
};
export type IfaceIpsAndGateways = {
    ips: string[];
    gateways: string[];
};
export type IfaceResult = IfaceMacAndName & IfaceIpsAndGateways;
export type IpLinkResult = {
    ifname: string;
    address: string;
    link_type: string;
    operstate: string;
};
export type IpRouteResult = {
    type: string;
    dst: string;
    gateway: string;
    dev: string;
    protocol: string;
    scope: string;
    prefsrc: string;
    flags: string[];
};
//# sourceMappingURL=types.d.ts.map