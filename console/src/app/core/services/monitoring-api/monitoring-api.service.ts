import { Injectable } from '@angular/core';
import { MongooseRunRecord } from '../../models/run-record.model';
import { MongooseRunStatus } from '../../mongoose-run-status';
import { RunDuration } from '../../run-duration';
import { PrometheusApiService } from '../prometheus-api/prometheus-api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MonitoringApiService {

  readonly LOGS_LINK_NAME = "link";

  public mongooseRunRecords: MongooseRunRecord[] = [];
  private behaviorSubjectRunRecords: BehaviorSubject<MongooseRunRecord[]> = new BehaviorSubject<MongooseRunRecord[]>([]);

  constructor(private prometheusApiService: PrometheusApiService) {
    this.getObservableMongooseRunRecords();
    this.behaviorSubjectRunRecords.subscribe(updatedRecordsList => {
      this.mongooseRunRecords = updatedRecordsList;
    })

  }

  // MARK: - Public

  public getMongooseRunRecords(): Observable<MongooseRunRecord[]> {
    return this.behaviorSubjectRunRecords.asObservable();
  }

  public getMongooseRunRecordById(id: number): MongooseRunRecord {
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
  public getMetricName(): String[] {
    return ["Configuration", "Messages", "Errors",
      "Average Metrics", "Summary metrics", "Op traces"];
  }

  public getObservableMongooseRunRecords() {
    let mongooseMetricMock = "mongoose_duration_count";
    return this.prometheusApiService.getDataForMetric(mongooseMetricMock).subscribe(metricsArray => {
      console.log("[getObservableMongooseRunRecords] metricsArray: ", metricsArray);
      var fetchedRunRecords: MongooseRunRecord[] = this.extractRunRecordsFromMetricLabels(metricsArray);

      this.behaviorSubjectRunRecords.next(fetchedRunRecords);

    })


  }

  // MARK: - Private 

  private extractRunRecordsFromMetricLabels(rawMongooseRunData: any): MongooseRunRecord[] {

    console.log("rawMongooseRunData:", JSON.stringify(rawMongooseRunData));
    // console.log("[extracting] rawRunData: ", rawRunData);

    // NOTE: Any computed info is stored within "value" field of JSON. ...
    // ... As for 21.03.2019, it's duration (position 0) and san index (position 1)
    let valuesTag = "value";
    let rawRunResult = rawMongooseRunData[valuesTag];

    var runRecords: MongooseRunRecord[] = [];
    for (var rawRunInfo in rawMongooseRunData) {
      let metricsTag = "metric";
      // NOTE: Raw run data contains non-computed data about Mongoose run.
      let rawRunData = rawMongooseRunData[rawRunInfo][metricsTag];
      let idTag = "load_step_id";
      let loadStepId = this.fetchLabelValue(rawRunData, idTag);

      let startTimeTag = "start_time";
      let startTime = this.fetchLabelValue(rawRunData, startTimeTag);
      console.log("rawRunData: ", rawRunData);

      // TODO: get actual status & duration
      let statusMock = MongooseRunStatus.Running;
      let durationMock = new RunDuration(startTime, "endTime");

      let nodesListTag = "nodes_list";
      let nodesList = this.fetchLabelValue(rawRunData, nodesListTag);

      let userCommentTag = "user_comment";
      let userComment = this.fetchLabelValue(rawRunData, userCommentTag);


      // TODO: Add load step ID 
      let currentRunRecord = new MongooseRunRecord(loadStepId, statusMock, startTime, nodesList, durationMock, userComment);
      console.log("currentRunRecord: ", currentRunRecord);
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
      const durationMock = new RunDuration(startTimeHexMock, endTimeHexMock);
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

  private fetchRunsList() {
    let mongooseMetricMock = "mongoose_duration_count";
    this.prometheusApiService.getDataForMetric(mongooseMetricMock).subscribe(labels => {
      console.log("labels: ", labels);
    })
  }

}
