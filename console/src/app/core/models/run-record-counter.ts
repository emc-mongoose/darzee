import { MongooseRunRecord } from "./run-record.model";
import { MongooseRunStatus } from "./mongoose-run-status";

export class MongooseRunRecordCounter { 
    constructor() {}

    public countRecordsByStatus(records: MongooseRunRecord[], requiredStatus: string): Number { 
        if (requiredStatus == MongooseRunStatus.All) { 
            return records.length;
        }
        
        let amountOfRecords = 0; 
        records.forEach(record => { 
            console.log(`rrecord.getStatus(): ${record.getStatus()}`)
            if (record.getStatus() == requiredStatus) { 
                amountOfRecords++;
            }
        });
        return amountOfRecords;
    }
}