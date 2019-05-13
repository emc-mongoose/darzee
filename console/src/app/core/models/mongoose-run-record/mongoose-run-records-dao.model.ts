import { ControlApiService } from "../../services/control-api/control-api.service";
import { Observable } from "rxjs";
import { map, share } from "rxjs/operators";
import { MongooseRunStatus } from "./mongoose-run-status";
import { MonitoringApiService } from "../../services/monitoring-api/monitoring-api.service";
import { MongooseRunRecordsRepository } from "./mongoose-run-records.repository";
import { MongooseRunRecord } from "./run-record.model";
import { PrometheusApiService } from "../../services/prometheus-api/prometheus-api.service";


export class MongooseRunRecordsDao {

    dataProvider: ControlApiService;
    mongooseRunRecordsRepository: MongooseRunRecordsRepository;

    constructor(private controlApiService: ControlApiService,
        private monitoringApiService: MonitoringApiService,
        private prometheusApiService: PrometheusApiService) {
        this.dataProvider = controlApiService;
        this.mongooseRunRecordsRepository = new MongooseRunRecordsRepository(monitoringApiService, prometheusApiService);
    }

    public getStatusForRecord(loadStepId: string): Observable<MongooseRunStatus> {
        return this.controlApiService.isMongooseRunActive(loadStepId).pipe(
            map(isMongooseRunActive => {
                if (isMongooseRunActive) {
                    return MongooseRunStatus.Running;
                }
                return MongooseRunStatus.Finished;
            }),
            share()
        )
    }

    // public getRecord(loadStepId: string): Observable<MongooseRunRecord> { 
        
    // }

    // public getMongooseRecords(): Observable<MongooseRunRecord>[] { 

    // }
}