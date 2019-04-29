import { MongooseRunRecord } from "./run-record.model";
import { MongooseRunStatus } from "./mongoose-run-status";
import { Observable, forkJoin, of } from "rxjs";
import { map } from "rxjs/operators";

export class MongooseRunRecordCounter { 
    constructor() {}

    public countRecordsByStatus(records: MongooseRunRecord[], requiredStatus: string): Number { 
        if (requiredStatus == MongooseRunStatus.All) { 
            return records.length;
        }
        
        let amountOfRecords = 0; 
        records.forEach(record => { 
            console.log(`Кecord.getStatus(): ${record.getStatus()}`)
            if (record.getStatus() == requiredStatus) { 
                amountOfRecords++;
            }
        });
        return amountOfRecords;
    }

    public getAmountOfRecordsWithStatus$(records: MongooseRunRecord[], requiredStatus: string): Observable<Number> { 
        if (requiredStatus == MongooseRunStatus.All) { 
            // NOTE: Returning amopunt of records in general 
            let amountOfRecordsWithRequiredStatus = records.length;
            return of(amountOfRecordsWithRequiredStatus);
        }

        const runRecordsStatues = [];
        records.forEach(record => { 
            runRecordsStatues.push(record.getStatusObs())
        });

        return forkJoin(...runRecordsStatues).pipe(
            map(statuses => { 
                var amountOfRecordsWithRequiredStatus = 0; 
                statuses.forEach(status => {
                    if (status == requiredStatus) { 
                        amountOfRecordsWithRequiredStatus++;
                    }
                });
                return amountOfRecordsWithRequiredStatus;
            })
        )
    }
}