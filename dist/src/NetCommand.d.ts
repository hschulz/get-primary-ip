import { IfaceIpsAndGateways, IfaceMacAndName, IfaceResult } from "./types";
export interface NetCommand {
    getInterfaces(): Promise<IfaceMacAndName[]>;
    getIpsAndGateways(iface: IfaceMacAndName): Promise<IfaceIpsAndGateways>;
    getResult(): Promise<IfaceResult[]>;
}
//# sourceMappingURL=NetCommand.d.ts.map