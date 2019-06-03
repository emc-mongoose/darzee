export class MongooseStoredRunNode { 
    public address: string; 
    public isHidden: boolean;

    constructor(address: string, isHidden: boolean) { 
        this.address = address;
        this.isHidden = isHidden;
    }
}