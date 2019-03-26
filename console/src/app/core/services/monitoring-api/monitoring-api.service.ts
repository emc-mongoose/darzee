import { Injectable } from '@angular/core';
import { MongooseRunRecord } from '../../models/run-record.model';
import { MongooseRunStatus } from '../../mongoose-run-status';
import { PrometheusApiService } from '../prometheus-api/prometheus-api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/common/constants';
import { MongooseMetrics } from './MongooseMetrics';
import { filter, map } from 'rxjs/operators';

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

  constructor(private prometheusApiService: PrometheusApiService,
    private http: HttpClient) {
    this.setUpService();
  }

  // MARK: - Public

  public getExistingRunRecords(): MongooseRunRecord[] {
    return this.mongooseRunRecords;
  }

  public getMongooseRunRecords(): Observable<MongooseRunRecord[]> {
    return this.behaviorSubjectRunRecords.asObservable();
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
  getDuration(targetRecord: MongooseRunRecord): Observable<any> {
    let targetMetrics = MongooseMetrics.PrometheusMetrics.DURATION; 
    let targetMetricLabels = MongooseMetrics.PrometheusMetricLabels.ID; 

    var targetLabels = new Map<String, String>(); 
    targetLabels.set(targetMetricLabels, targetRecord.getIdentifier());
    
    return this.prometheusApiService.getDataForMetricWithLabels(targetMetrics, targetLabels).pipe(
      map(runRecordsResponse => {
        let prometheusQueryResult =  this.extractRunRecordsFromMetricLabels(runRecordsResponse);
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

  public getLog(stepId: String, logName: String): Observable<any> {
    let logsEndpoint = "/logs";
    let delimiter = "/";
    return this.http.get(this.MONGOOSE_HTTP_ADDRESS + logsEndpoint + delimiter + stepId + delimiter + logName, { responseType: 'text' });
  }

  // NOTE: An initial fetch of Mongoose Run Records.
  public fetchMongooseRunRecords() {
    let mongooseMetricMock = MongooseMetrics.PrometheusMetrics.DURATION;
    return this.prometheusApiService.getDataForMetric(mongooseMetricMock).subscribe(metricsArray => {
      var fetchedRunRecords: MongooseRunRecord[] = this.extractRunRecordsFromMetricLabels(metricsArray);
      this.behaviorSubjectRunRecords.next(fetchedRunRecords);
    })
  }

  // MARK: - Private 

  private extractRunRecordsFromMetricLabels(rawMongooseRunData: any): MongooseRunRecord[] {

    var runRecords: MongooseRunRecord[] = [];

    // let actualPrometheusResponse = rawMongooseRunData["data"];
    // console.log("actualPrometheusResponse:", JSON.stringify(actualPrometheusResponse));

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

  // NOTE: Returning a hard-coded list in order to test the UI first. 
  private generateMongooseRunRecords(): MongooseRunRecord[] {
    var resultRunList: MongooseRunRecord[] = [];
    const amountOfTestRecords = 10;
    for (var i: number = 0; i < amountOfTestRecords; i++) {
      const startTimeHexMock = this.generateHexStartTime();
      const loadStepIdMock = "load_step_id_1";
      const endTimeHexMock = this.generateHexStartTime();
      const testNodesListMock = ["Node" + i, "Node" + i, "Node" + i];
      const durationMock = "12921912291";
      const commentMock = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      const runStatusMock = (i % 2) ? MongooseRunStatus.Finished : MongooseRunStatus.Running;
      let runRecord = new MongooseRunRecord(loadStepIdMock, runStatusMock, startTimeHexMock,
        testNodesListMock, durationMock, commentMock);
      if (runRecord.status == MongooseRunStatus.Finished) {
        resultRunList.push(runRecord);
      }
      resultRunList.push(runRecord);
    }

    return resultRunList;
  }

  private generateHexStartTime(): string {
    const currentDateTime = Date.now();
    const hexNumericSystemBase = 16;
    return currentDateTime.toString(hexNumericSystemBase);
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
