import { isIdentifier } from "@angular/compiler";

export class IpAddress {
    id: number;
    ip: string;

    private static identifier = 0;

    static getUniqueIdentifier(): number {        
        return IpAddress.identifier;
    }

    constructor(ip: string) {
        this.ip = ip;
        this.id = IpAddress.getUniqueIdentifier();
        IpAddress.identifier++;
    }
}
