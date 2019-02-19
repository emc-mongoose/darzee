export class IdFabric { 
    static identifier: number = 0;
    static getUniqueIdentifier(): number { 
        return IdFabric.identifier++; 
    }
}