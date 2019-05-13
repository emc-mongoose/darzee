import { MongooseRunRecord } from "./run-record.model";
import { BehaviorSubject, Observable, of } from "rxjs";
import { ControlApiService } from "../../services/control-api/control-api.service";
import { MonitoringApiService } from "../../services/monitoring-api/monitoring-api.service";
import { PrometheusApiService } from "../../services/prometheus-api/prometheus-api.service";
import { map, share } from "rxjs/operators";
import { MongooseRunStatus } from "./mongoose-run-status";

export class MongooseRunRecordsRepository { 
    private runRecords$: BehaviorSubject<Observable<MongooseRunRecord>[]> = new BehaviorSubject<Observable<MongooseRunRecord>[]>([]);
 
    constructor(private monitoringApiService: MonitoringApiService,
        private prometheusApiService: PrometheusApiService) {}

    
    // MARK: - Public


    public getMongooseRunRecords$(): Observable<Observable<MongooseRunRecord>[]> { 
        return this.runRecords$.asObservable(); 
    }
    
    public updateRecords() { 
        this.getConstructedMongooseRunRecords$().pipe(
            map(updatedRecords => { 
                var records: Observable<MongooseRunRecord>[] = []; 
                for (let record of updatedRecords) { 
                    records.push(of(record));
                }
                this.runRecords$.next(records);
            })
        )
    }

    private getConstructedMongooseRunRecords$(): Observable<MongooseRunRecord[]> { 
        return this.prometheusApiService.getExistingRecordsInfo().pipe(
          map(
            metricsArray => {
              var runRecords: MongooseRunRecord[] = this.extractRunRecordsFromMetricLabels(metricsArray);
              runRecords = this.sortMongooseRecordsByStartTime(runRecords);
              return runRecords;
            },
            error => {
              let misleadingMsg = `An error has occured while loading Mongoose run records: ${error}`;
              console.error(misleadingMsg);
              alert(misleadingMsg)
              let emptyRecordsArray: MongooseRunRecord[] = [];
              return emptyRecordsArray;
            }
          )
        )
    }

    private sortMongooseRecordsByStartTime(records: MongooseRunRecord[]): MongooseRunRecord[] {
        return records.sort((lhs, rhs) => {
          let hasLhsStartedEarlier = (Number(lhs.getStartTime()) < Number(rhs.getStartTime()));
          let valueTrue = 1;
          let valueFalse = -1;
          return hasLhsStartedEarlier ? valueTrue : valueFalse;
        });
      }


    private extractRunRecordsFromMetricLabels(rawMongooseRunData: any): MongooseRunRecord[] {

        var runRecords: MongooseRunRecord[] = [];
    
        // NOTE: Looping throught found Mongoose Run Records 
        for (var processingRunIndex in rawMongooseRunData) {
          // NOTE: Static run data contains non-computed values of Mongoose Run. 
          let metricsTag = "metric";
          let staticRunData = rawMongooseRunData[processingRunIndex][metricsTag];
    
          // MARK: - Retrieving static data 
          let runIdTag = "run_id";
          let runId = this.fetchLabelValue(staticRunData, runIdTag);
    
          let loadStepIdTag = "load_step_id";
          let loadStepId = this.fetchLabelValue(staticRunData, loadStepIdTag);
    
          let startTimeTag = "start_time";
          let startTime = this.fetchLabelValue(staticRunData, startTimeTag);
    
          let nodesListTag = "nodes_list";
          let nodesList = this.fetchLabelValue(staticRunData, nodesListTag);
    
          let userCommentTag = "user_comment";
          let userComment = this.fetchLabelValue(staticRunData, userCommentTag);
    
          // NOTE: Any computed info is stored within "value" field of JSON. ...
          // ... As for 21.03.2019, it's duration (position 1) and Prometheus DB index (position 0)
          let valuesTag = "value"; // NOTE: "Value" fetches Duration. 
          let computedRunData = rawMongooseRunData[processingRunIndex][valuesTag];
    
          // MARK: - Retrieving computed data.
          let durationIndex = 1;
          let duration = computedRunData[durationIndex];
    
          const mongooseRunStatus$ = this.getStatusForMongooseRecord(runId);
    
          let currentRunRecord = new MongooseRunRecord(runId, loadStepId, mongooseRunStatus$, startTime, nodesList, duration, userComment);
          runRecords.push(currentRunRecord);
        }
    
        return runRecords;
      }



      public getStatusForMongooseRecord(targetRecordRunId: string): Observable<MongooseRunStatus> {
        // NOTE: As for now, we're checking status for Mongoose run overtall, not just Run ID. 
        return this.controlApiService.isMongooseRunActive(targetRecordRunId).pipe(
          map(isMongooseRunActive => { 
            if (isMongooseRunActive) { 
              return MongooseRunStatus.Running;
            }
            return MongooseRunStatus.Finished;
          })
        ).pipe(
          share()
        )
      }


      private fetchLabelValue(metricJson: any, label: string): any {
        let targetValue = metricJson[label];
        var isValueEmpty: Boolean = (targetValue == undefined);
        let emptyValue = "";
        return isValueEmpty ? emptyValue : targetValue;
      }
    // MARK: - Private 

    // public getMongooseRunRecords(): Observable<MongooseRunRecord[]> {
    //     return this.prometheusApiService.getExistingRecordsInfo().pipe(
    //       map(
    //         metricsArray => {
    //           let runRecords: MongooseRunRecord[] = this.extractRunRecordsFromMetricLabels(metricsArray);
    //           // NOTE: Records are being sorted for order retaining. This ...
    //           // ... is useful while updating Run Records table. 
    //           runRecords = this.sortMongooseRecordsByStartTime(runRecords);
    //           // NOTE: Using behavior subject object in order to reduce amount of HTTP requests.
    //           this.currentMongooseRunRecords$.next(runRecords);
    //           return runRecords;
    //         },
    //         error => {
    //           let misleadingMsg = `An error has occured while loading Mongoose run records: ${error}`;
    //           console.error(misleadingMsg);
    //           alert(misleadingMsg)
    //           let emptyRecordsArray: MongooseRunRecord[] = [];
    //           return emptyRecordsArray;
    //         }
    //       )
    //     )
    //   }

}