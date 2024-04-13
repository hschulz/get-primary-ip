import { NetCommand } from "../NetCommand";
import { IfaceIpsAndGateways, IfaceMacAndName, IfaceResult } from "../types";
export declare class Win32NetCommand implements NetCommand {
    protected static matchExpr: RegExp;
    private parseValues;
    getInterfaces(): Promise<IfaceMacAndName[]>;
    getIpsAndGateways(iface: IfaceMacAndName): Promise<IfaceIpsAndGateways>;
    getResult(): Promise<IfaceResult[]>;
}
//# sourceMappingURL=index.d.ts.map