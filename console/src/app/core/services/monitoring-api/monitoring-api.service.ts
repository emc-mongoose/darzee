import { Injectable } from "@angular/core";
import { Constants } from "src/app/common/constants";
import { BehaviorSubject, Observable, of } from "rxjs";
import { MongooseRunRecord } from "../../models/run-record.model";
import { PrometheusApiService } from "../prometheus-api/prometheus-api.service";
import { MongooseRunStatus } from "../../models/mongoose-run-status";
import { mergeMap, map, catchError } from "rxjs/operators";
import { MongooseMetrics } from "../mongoose-api-models/MongooseMetrics";
import { MongooseApi } from "../mongoose-api-models/MongooseApi.model";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class MonitoringApiService {

  private readonly MONGOOSE_HTTP_ADDRESS = Constants.Http.HTTP_PREFIX + Constants.Configuration.MONGOOSE_HOST_IP;

  // NOTE: Names of logs-files (according to REST API on 04.04) that are being used to check Mongoose ...
  // ... run status/ 
  private readonly INITIAL_CREATED_LOG_FILE_NAME = "Config";
  private readonly FINAL_CREATED_LOG_FILE_NAME = "metrics.FileTotal";

  private currentMongooseRunRecords$: BehaviorSubject<MongooseRunRecord[]> = new BehaviorSubject<MongooseRunRecord[]>([]);

  // NOTE: availableLogs is a list of logs provided by Mongoose. Key is REST API's endpoint for fetching the log, ...
  // ... value is a displaying name. 
  private availableLogs: Map<String, String> = new Map<String, String>();

  // MARK: - Lifecycle 

  constructor(private prometheusApiService: PrometheusApiService,
    private http: HttpClient) {
    this.setUpService();
    this.fetchCurrentMongooseRunRecords();
  }

  // MARK: - Public

  public getStatusForMongooseRecord(targetRecordLoadStepId: String): Observable<MongooseRunStatus> {
    let configLogName = this.INITIAL_CREATED_LOG_FILE_NAME;
    const configurationFileStatus$ = this.isLogFileExist(targetRecordLoadStepId, configLogName);

    let resultsMetricsFileName = this.FINAL_CREATED_LOG_FILE_NAME;
    const resultNetricsStatus$ = this.isLogFileExist(targetRecordLoadStepId, resultsMetricsFileName);

    return configurationFileStatus$.pipe(
      mergeMap(hasConfiguration => resultNetricsStatus$.pipe(
        map(hasResults => {
          if (hasConfiguration && !hasResults) {
            return MongooseRunStatus.Running;
          }
          if (hasConfiguration && hasResults) {
            return MongooseRunStatus.Finished;
          }
          if (!hasConfiguration && !hasResults) {
            return MongooseRunStatus.Unavailable;
          }
          return MongooseRunStatus.Undefined;
        })))
    )
  }

  public getCurrentMongooseRunRecords(): Observable<MongooseRunRecord[]> {
    return this.currentMongooseRunRecords$.asObservable().pipe(
      map(records => {
        console.log(`[Monitoring API service] records: ${JSON.stringify(records)}`);
        // NOTE: Records are being sorted for order retaining. This ...
        // ... is useful while updating Run Records table. 
        records = this.sortMongooseRecordsByStartTime(records);
        return records;
      })
    );
  }

  public getMongooseRunRecordsFiltredByStatus(status: string): Observable<MongooseRunRecord[]> {
    return this.getCurrentMongooseRunRecords().pipe(
      map(records => {
        return this.filterRunfiltredRecordsByStatus(records, status);
      })
    )
  }

  public getMongooseRunRecordByLoadStepId(loadStepId: String): Observable<MongooseRunRecord> {
    return this.getCurrentMongooseRunRecords().pipe(
      map(records => {
        let record = this.findMongooseRecordByLoadStepId(records, loadStepId);
        return record;
      },
        error => {
          console.error(`Something went wront during filtring records by status: ${error.message}`);
        })
    );
  }

  // NOTE: Returning hard-coded metrics name in order to test the UI first.
  public getAvailableLogNames(): String[] {
    let availableLogsName = Array.from(this.availableLogs.values());
    return availableLogsName;
  }

  // NOTE: Fetching duration for the target run record 
  public getDuration(targetRecord: MongooseRunRecord): Observable<any> {

    // NOTE: Duration won't change if Mongoose run has finished. 
    if (targetRecord.getStatus() == MongooseRunStatus.Finished) {
      return;
    }

    let targetMetrics = MongooseMetrics.PrometheusMetrics.DURATION;
    let targetMetricLabels = MongooseMetrics.PrometheusMetricLabels.ID;

    var targetLabels = new Map<String, String>();
    targetLabels.set(targetMetricLabels, targetRecord.getIdentifier());

    return this.prometheusApiService.getDataForMetricWithLabels(targetMetrics, targetLabels).pipe(
      map(runRecordsResponse => {
        let prometheusQueryResult = this.extractRunRecordsFromMetricLabels(runRecordsResponse);
        let firstElementIndex = 0;
        return prometheusQueryResult[firstElementIndex].getDuration();
      })
    )
  }

  public getLogApiEndpoint(displayingLogName: String): String {
    // NOTE: Finding first matching key. Key is an API's endpoint.
    var targetEndpoint: String = "";
    Array.from(this.availableLogs.keys()).forEach(key => {
      if (this.availableLogs.get(key) == displayingLogName) {
        targetEndpoint = key;
      }
    });
    return targetEndpoint;
  }

  public updateRecord(targetRecord: MongooseRunRecord): Observable<MongooseRunRecord> {
    // NOTE: Duration won't change if Mongoose run has finished. 
    if (targetRecord.getStatus() == MongooseRunStatus.Finished) {
      return;
    }

    let targetMetrics = MongooseMetrics.PrometheusMetrics.DURATION;
    let targetMetricLabels = MongooseMetrics.PrometheusMetricLabels.ID;

    var targetLabels = new Map<String, String>();
    targetLabels.set(targetMetricLabels, targetRecord.getIdentifier());

    return this.prometheusApiService.getDataForMetricWithLabels(targetMetrics, targetLabels).pipe(
      map(runRecordsResponse => {
        let prometheusQueryResult = this.extractRunRecordsFromMetricLabels(runRecordsResponse);
        let firstElementIndex = 0;
        let fetchedRecord = prometheusQueryResult[firstElementIndex];
        return fetchedRecord;
      })
    )
  }


  public getLog(stepId: String, logName: String): Observable<any> {
    let logsEndpoint = MongooseApi.LogsApi.LOGS;
    let delimiter = "/";
    return this.http.get(this.MONGOOSE_HTTP_ADDRESS + logsEndpoint + delimiter + stepId + delimiter + logName, { responseType: 'text' });
  }

  // NOTE: An initial fetch of Mongoose Run Records.
  public fetchCurrentMongooseRunRecords() {
    return this.prometheusApiService.getExistingRecordsInfo().subscribe(
      metricsArray => {
        console.log(`[monitoring API] metricsArray: ${JSON.stringify(metricsArray)}`)
        var fetchedRunRecords: MongooseRunRecord[] = this.extractRunRecordsFromMetricLabels(metricsArray);
        this.currentMongooseRunRecords$.next(fetchedRunRecords);
      },
      error => {
        let misleadingMsg = `Unable to load Mongoose run records. Details: `;
        
        let errorDetails = JSON.stringify(error);
        console.error(misleadingMsg + errorDetails);

        let errorCause = error; 
        alert(misleadingMsg + errorCause);
      })
  }

  // MARK: - Private 

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
      let idTag = "load_step_id";
      let loadStepId = this.fetchLabelValue(staticRunData, idTag);

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

      const runStatus = this.getStatusForMongooseRecord(loadStepId);

      let currentRunRecord = new MongooseRunRecord(loadStepId, runStatus, startTime, nodesList, duration, userComment);
      runRecords.push(currentRunRecord);
    }

    return runRecords;
  }

  private fetchLabelValue(metricJson: any, label: string): any {
    let targetValue = metricJson[label];
    var isValueEmpty: Boolean = (targetValue == undefined);
    let emptyValue = "";
    return isValueEmpty ? emptyValue : targetValue;
  }

  // NOTE: Setting up service's observables 
  private setUpService() {
    this.fetchCurrentMongooseRunRecords();
    this.configurateAvailableLogs();
  }

  private configurateAvailableLogs() {
    // NOTE: Key is a REST API endpoint's name, value is displaying name. 
    // NOTE: Endpoints can be found at https://github.com/emc-mongoose/mongoose/tree/master/doc/interfaces/api/remote#logs
    this.availableLogs.set("Config", "Configuration");
    this.availableLogs.set("Cli", "Command line arguments dump");
    this.availableLogs.set("Error", "Error messages");
    this.availableLogs.set("OpTraces", "Load operation traces");

    this.availableLogs.set("metrics.File", "Load step periodic metrics");
    this.availableLogs.set("metrics.FileTotal", "Load step total metrics log");
    this.availableLogs.set("metrics.threshold.File", "Load step periodic threshold metrics");
    this.availableLogs.set("metrics.threshold.FileTotal", "Load step total threshold metrics log");

    this.availableLogs.set("Messages", "Generic messages");
    this.availableLogs.set("Scenario", "Scenario dump");
  }

  private findMongooseRecordByLoadStepId(records: MongooseRunRecord[], id: String): MongooseRunRecord {
    if (records.length == 0) {
      let misleadingMsg = "Records list is empty, thus no record can be found.";
      throw new Error(misleadingMsg);
    }

    let targerRecord: MongooseRunRecord;
    records.filter(record => {
      if (record.getIdentifier() == id) {
        targerRecord = record;
      }
    });

    if (!targerRecord) {
      // NOTE: Returning 'False' if record hasn't been found.
      let misleadingMsg = "Mongoose Run record with ID " + id + " hasn't been found.";
      throw new Error(misleadingMsg);
    }
    return targerRecord;
  }

  public filterRunfiltredRecordsByStatus(records: MongooseRunRecord[], requiredStatus: string): MongooseRunRecord[] {
    if (requiredStatus.toString() == MongooseRunStatus.All) {
      return records;
    }
    // NOTE: Iterating over existing tabs, filtring them by 'status' property.
    var requiredfiltredRecords: MongooseRunRecord[] = [];
    for (var runRecord of records) {
      if (runRecord.getStatus() == requiredStatus) {
        requiredfiltredRecords.push(runRecord);
      }
    }
    return requiredfiltredRecords;
  }

  private isLogFileExist(loadStepId: String, logName: String): Observable<any> {
    return this.getLog(loadStepId, logName).pipe(
      map(hasConfig => hasConfig = of(true)),
      catchError(hasConfig => hasConfig = of(false))
    );
  }
}
