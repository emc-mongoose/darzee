export class MongooseMetric { 
    private timestamp: number; 
    private value: string; 

    constructor(timestamp: number, value: string) { 
        this.timestamp = timestamp;
        this.value = value; 
    }

    public getTimestamp(): number { 
        return this.timestamp;
    }

    public getValue(): string { 
        return this.value;
    }
}