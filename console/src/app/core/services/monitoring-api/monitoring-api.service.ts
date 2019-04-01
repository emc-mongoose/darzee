import { Injectable } from '@angular/core';
import { MongooseRunRecord } from '../../models/run-record.model';
import { MongooseRunStatus } from '../../mongoose-run-status';
import { PrometheusApiService } from '../prometheus-api/prometheus-api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/common/constants';
import { MongooseMetrics } from '../mongoose-api-models/MongooseMetrics';
import { filter, map } from 'rxjs/operators';
import { MongooseApi } from '../mongoose-api-models/MongooseApi.model';


@Injectable({
  providedIn: 'root'
})
export class MonitoringApiService {

  private readonly MONGOOSE_HTTP_ADDRESS = Constants.Http.HTTP_PREFIX + Constants.Configuration.MONGOOSE_HOST_IP;

  private mongooseRunRecords: MongooseRunRecord[] = [];
  private behaviorSubjectRunRecords: BehaviorSubject<MongooseRunRecord[]> = new BehaviorSubject<MongooseRunRecord[]>([]);

  // NOTE: availableLogs is a list of logs provided by Mongoose. Key is REST API's endpoint for fetching the log, ...
  // ... value is a displaying name. 
  private availableLogs: Map<String, String> = new Map<String, String>();

  // MARK: - Lifecycle 

  constructor(private prometheusApiService: PrometheusApiService,
    private http: HttpClient) {
    this.setUpService();
  }

  // MARK: - Public

  public getExistingRunRecords(): MongooseRunRecord[] {
    return this.mongooseRunRecords;
  }

  public getMongooseRunRecords(): Observable<MongooseRunRecord[]> {
    return this.behaviorSubjectRunRecords.asObservable().pipe(
      map(records => { 
        records = this.sortMongooseRecordsByStartTime(records);
        return records; 
      })
    );
  }

  public getMongooseRunRecordById(id: String): MongooseRunRecord {
    let targerRecord: MongooseRunRecord;
    this.mongooseRunRecords.filter(record => {
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
        // this.getStatusForRecord(fetchedRecord).subscribe(status => { 
        //   fetchedRecord.status = status;
        // });
        return fetchedRecord;
      })
    )
  }

  public getStatusForRecord(fetchedRecord: MongooseRunRecord): Observable<MongooseRunStatus> {
    // TODO: Impliment method correctly. 
    let headersForRunStatus = new Headers();
    return this.http.get(this.MONGOOSE_HTTP_ADDRESS + MongooseApi.RunApi.RUN, { observe: 'response' }).pipe(
      map(response => {
        console.log("Response is: ", response);
        return MongooseRunStatus.Finished;
      })
    );
  }

  public getLog(stepId: String, logName: String): Observable<any> {
    let logsEndpoint = MongooseApi.LogsApi.LOGS;
    let delimiter = "/";
    return this.http.get(this.MONGOOSE_HTTP_ADDRESS + logsEndpoint + delimiter + stepId + delimiter + logName, { responseType: 'text' });
  }

  // NOTE: An initial fetch of Mongoose Run Records.
  public fetchMongooseRunRecords() {
    // let mongooseMetricMock = MongooseMetrics.PrometheusM/etrics.DURATION;
    return this.prometheusApiService.getExistingRecordsInfo().subscribe(metricsArray => {
      // console.log("Every fetched record: ", JSON.stringify(metricsArray));
      var fetchedRunRecords: MongooseRunRecord[] = this.extractRunRecordsFromMetricLabels(metricsArray);
      this.behaviorSubjectRunRecords.next(fetchedRunRecords);
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

      // TODO: get actual status 
      let statusMock = MongooseRunStatus.Running;

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

      let currentRunRecord = new MongooseRunRecord(loadStepId, statusMock, startTime, nodesList, duration, userComment);
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
    this.fetchMongooseRunRecords();
    this.configurateAvailableLogs();

    // NOTE: Adding behavior subject on Mongoose Run Records in order to detect changes within the list. 
    this.behaviorSubjectRunRecords.subscribe(updatedRecordsList => {
      this.mongooseRunRecords = updatedRecordsList;
    })
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

}
