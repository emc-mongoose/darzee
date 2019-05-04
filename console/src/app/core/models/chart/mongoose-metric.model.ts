export class MongooseMetric { 
    private timestamp: string; 
    private value: string; 

    constructor(timestamp: string, value: string) { 
        this.timestamp = timestamp;
        this.value = value; 
    }

    public getTimestamp(): string { 
        return this.timestamp;
    }

    public getValue(): string { 
        return this.value;
    }
}