/**
 * Describes Mongoose log instance.
 */
export class MongooseLogModel { 
    /**
     * @param name log file name
     * @param endpoint Mongoose REST API's endpoint for retrieving the log file content
     */
    private name: string; 
    private endpoint: string; 

    constructor(name: string, endpoint: string) { 
        this.name = name;
        this.endpoint = endpoint;
    }

    /**
     * @returns Log name (which is equal to log file name)
     */
    public getName(): string { 
        return this.name;
    }

    /**
     * @returns Mongoose's REST API endpoint for retrieving the log file contect
     */
    public getEndpoint(): string { 
        return this.endpoint;
    }
}