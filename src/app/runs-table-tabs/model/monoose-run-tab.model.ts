import { MongooseRunRecord } from "src/app/core/models/run-record.model";
import { MonitoringApiService } from "src/app/core/services/monitoring-api/monitoring-api.service";
import { MongooseRunStatus } from "src/app/core/mongoose-run-status";

export class MongooseRunTab { 

    public tabTitle: string;
    public records: MongooseRunRecord[];

    readonly ALL_MONGOOSE_RUNS_TAG = "";

    constructor(private monitoringApiService: MonitoringApiService, status: string) { 
        this.records = this.filterRunRecordsByStatus(status);
        this.tabTitle = status.toString();
    }

    private filterRunRecordsByStatus(requiredStatus: string): MongooseRunRecord[] { 
        if (status.toString() == this.ALL_MONGOOSE_RUNS_TAG) { 
            return this.monitoringApiService.getMongooseRunRecords();
          }
          // NOTE: Erasing the displaying records, filling it up with filtred records afterwards.
          var requiredRecords: MongooseRunRecord[] = [];
          for (var runRecord of this.monitoringApiService.getMongooseRunRecords()) { 
            if (runRecord.status == status) { 
                requiredRecords.push(runRecord);
            }
        }
        return requiredRecords;
    }

}