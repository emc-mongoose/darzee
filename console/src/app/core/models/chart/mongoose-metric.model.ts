export class MongooseMetric { 
    private timestamp: number; 
    private value: string; 
    private name: string; 

    constructor(timestamp: number, value: string, name: string) { 
        this.timestamp = timestamp;
        this.value = value; 
        this.name = name;
    }

    public getTimestamp(): number { 
        return this.timestamp;
    }

    public getValue(): string { 
        return this.value;
    }

    public getName(): string { 
        return this.name; 
    }
}