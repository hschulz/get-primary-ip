import { NetCommand } from "../NetCommand";
import { IfaceIpsAndGateways, IfaceMacAndName, IfaceResult } from "../types";
export declare class LinuxNetCommand implements NetCommand {
    getInterfaces(): Promise<IfaceMacAndName[]>;
    getIpsAndGateways(iface: IfaceMacAndName): Promise<IfaceIpsAndGateways>;
    getResult(): Promise<IfaceResult[]>;
}
//# sourceMappingURL=index.d.ts.map