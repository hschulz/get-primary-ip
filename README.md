# Get primary IP

This package proivdes a way to get the primary IP address of the machine
based on some platform specific commands.

This will work on most setups, but there are some edge cases where the
primary IP address may not be detected correctly; especially on machines
with multiple network interfaces that are all connected to separate gateways.

Currently only `Windows` and `Linux` are supported.

## Installation

```bash
npm i @hschulz/get-primary-ip
```

## Requirements

### Windows

The package requires the `wmic` command to be available.

Further information can be found [here](https://learn.microsoft.com/en-us/windows/win32/wmisdk/wmic)
and [here](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/wmic).

### Linux

The package requires the `ip` command to be available.

Further information can be found [here](https://manpages.ubuntu.com/manpages/jammy/man8/ip.8.html).

## Usage

The `getPrimaryIp` returns a promise that resolves to an array of at least one
object that should contain the primary IP address of the machine.

Running the following code may return an object containing the
primary IP address of the machine.

```typescript
import { getPrimaryIp } from "@hschulz/get-primary-ip"

getPrimaryIp()
.then((result) => {
    // do something with the result
    console.log(result)
})
.catch((error) => console.error(error))
```

The result should contain at least one object with the following properties:

```javascript
{
    mac: "00:00:00:00:00:00",
    name: "eth0",
    ips: [ "192.168.0.123" ],
    gateways: [ "192.168.0.1", "fe80::abcd:ef01:2345:f2bb" ]
}
```

## License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
