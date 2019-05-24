export class MongooseRunEntryNode { 
    static readonly EMPTY_ADDRESS = "";

    private entryNodeAddress: string;
    private runId: string;
 
    constructor(entryNodeAddress: string, runId: string) { 
        this.entryNodeAddress = entryNodeAddress;
        this.runId = runId;
    }

    public getRunId(): string { 
        return this.runId;
    }

    public getEntryNodeAddress(): string { 
        return this.entryNodeAddress;
    }

    public setEntryNodeAddress(newAddress: string) { 
        this.entryNodeAddress = newAddress;
    }
}