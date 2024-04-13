import { Win32NetCommand } from "./src/win32";
import { LinuxNetCommand } from "./src/linux";
import { NetCommand } from "./src/NetCommand";
import { IfaceIpsAndGateways, IfaceMacAndName, IfaceResult, IpLinkResult, IpRouteResult } from "./src/types";
declare const getPrimaryIp: () => Promise<IfaceResult[]>;
export { getPrimaryIp, IfaceIpsAndGateways, IfaceMacAndName, IfaceResult, IpLinkResult, IpRouteResult, LinuxNetCommand, NetCommand, Win32NetCommand };
//# sourceMappingURL=index.d.ts.map