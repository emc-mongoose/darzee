import { Injectable } from '@angular/core';
import { MongooseRunRecord } from '../../models/run-record.model';
import { MongooseRunStatus } from '../../mongoose-run-status';
import { RunDuration } from '../../run-duration';
import { PrometheusApiService } from '../prometheus-api/prometheus-api.service';

@Injectable({
  providedIn: 'root'
})
export class MonitoringApiService {

  readonly LOGS_LINK_NAME = "link";

  private mongooseRunRecords: MongooseRunRecord[] = [];

  constructor(private prometheusApiService: PrometheusApiService) {
    this.mongooseRunRecords = this.generateMongooseRunRecords();

    this.fetchRunsList();

  }

  // MARK: - Public

  public getMongooseRunRecords(): MongooseRunRecord[] {
    return this.mongooseRunRecords;
  }

  public getMongooseRunRecordById(id: number): MongooseRunRecord {
    let targerRecord: MongooseRunRecord;
    this.getMongooseRunRecords().filter(record => {
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

  // MARK: - Private 

  // NOTE: Returning a hard-coded list in order to test the UI first. 
  private generateMongooseRunRecords(): MongooseRunRecord[] {
    var resultRunList: MongooseRunRecord[] = [];
    const amountOfTestRecords = 10;
    for (var i: number = 0; i < amountOfTestRecords; i++) {
      const startTimeHexMock = this.generateHexStartTime();
      const endTimeHexMock = this.generateHexStartTime();
      const testNodesListMock = ["Node" + i, "Node" + i, "Node" + i];
      const durationMock = new RunDuration(startTimeHexMock, endTimeHexMock);
      const commentMock = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      const runStatusMock = (i % 2) ? MongooseRunStatus.Finished : MongooseRunStatus.Running;
      let runRecord = new MongooseRunRecord(runStatusMock, startTimeHexMock,
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
