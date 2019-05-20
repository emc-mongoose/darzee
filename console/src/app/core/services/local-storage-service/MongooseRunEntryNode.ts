export class MongooseRunEntryNode { 

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
}